import crypto from 'node:crypto';

type VercelRequest = any;
type VercelResponse = any;

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "saram.jameel@gmail.com").trim().toLowerCase();
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || "Abcd@367654").trim();
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "ff_sec_984f8a29b3c4012e87319aa50284d7e21b8374";

const safeCompare = (a: string, b: string): boolean => {
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password } = req.body || {};
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const isEmailValid = safeCompare(email.trim().toLowerCase(), ADMIN_EMAIL);
  const isPasswordValid = safeCompare(password.trim(), ADMIN_PASSWORD);

  if (isEmailValid && isPasswordValid) {
    const expiresAt = Date.now() + 8 * 60 * 60 * 1000;
    const payload = JSON.stringify({ 
      role: 'admin', 
      exp: expiresAt, 
      nonce: crypto.randomBytes(12).toString('hex') 
    });
    const encodedPayload = Buffer.from(payload).toString('base64url');
    const signature = crypto.createHmac('sha256', SESSION_SECRET).update(encodedPayload).digest('base64url');
    const token = `${encodedPayload}.${signature}`;

    return res.json({
      success: true,
      token,
      expiresAt
    });
  }

  return res.status(401).json({
    error: 'Invalid administrator credentials. Access denied.'
  });
}
