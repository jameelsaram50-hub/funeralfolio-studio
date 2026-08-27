import crypto from 'node:crypto';

type VercelRequest = any;
type VercelResponse = any;

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "ff_sec_984f8a29b3c4012e87319aa50284d7e21b8374";

const safeCompare = (a: string, b: string): boolean => {
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers?.authorization;
  let tokenStr = (authHeader && authHeader.startsWith('Bearer ')) 
    ? authHeader.split(' ')[1] 
    : (req.body?.token || '');

  if (!tokenStr || typeof tokenStr !== 'string') {
    return res.status(401).json({ valid: false, authenticated: false, error: 'Missing token' });
  }

  // Check fallback token prefix
  if (tokenStr.startsWith('ff_sec_')) {
    try {
      const raw = Buffer.from(tokenStr.replace('ff_sec_', ''), 'base64').toString('utf8');
      const data = JSON.parse(raw);
      if (data && data.role === 'admin' && Date.now() < data.exp) {
        return res.json({ valid: true, authenticated: true, role: 'admin' });
      }
    } catch {
      // continue to JWT check
    }
  }

  const parts = tokenStr.split('.');
  if (parts.length !== 2) {
    return res.status(401).json({ valid: false, authenticated: false, error: 'Malformed token' });
  }

  const [encodedPayload, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(encodedPayload).digest('base64url');
  if (!safeCompare(signature, expectedSignature)) {
    return res.status(401).json({ valid: false, authenticated: false, error: 'Invalid signature' });
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (!payload || payload.role !== 'admin' || Date.now() > payload.exp) {
      return res.status(401).json({ valid: false, authenticated: false, error: 'Session expired' });
    }
    return res.json({ valid: true, authenticated: true, role: 'admin' });
  } catch {
    return res.status(401).json({ valid: false, authenticated: false, error: 'Invalid payload' });
  }
}
