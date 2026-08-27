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
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ authenticated: false, error: 'Missing token' });
  }

  const tokenStr = authHeader.split(' ')[1];
  const parts = tokenStr.split('.');
  if (parts.length !== 2) {
    return res.status(401).json({ authenticated: false, error: 'Malformed token' });
  }

  const [encodedPayload, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(encodedPayload).digest('base64url');
  if (!safeCompare(signature, expectedSignature)) {
    return res.status(401).json({ authenticated: false, error: 'Invalid signature' });
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (!payload || payload.role !== 'admin' || Date.now() > payload.exp) {
      return res.status(401).json({ authenticated: false, error: 'Session expired' });
    }
    return res.json({ authenticated: true, role: 'admin' });
  } catch {
    return res.status(401).json({ authenticated: false, error: 'Invalid payload' });
  }
}
