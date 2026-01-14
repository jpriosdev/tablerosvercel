import { findUserByEmail, verifyPassword } from '../../../../lib/users';
import { signSession } from '../../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

  const user = findUserByEmail(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = verifyPassword(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = await signSession({ email: user.email, name: user.name, roles: user.roles });
  const maxAge = 8 * 60 * 60; // 8 hours
  res.setHeader('Set-Cookie', `auth_token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; Secure; SameSite=Lax`);
  res.status(200).json({ ok: true });
}
