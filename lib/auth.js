import { SignJWT, jwtVerify } from 'jose';

function parseCookies(req) {
  const header = req.headers && req.headers.cookie;
  if (!header) return {};
  return header.split(';').map(c => c.trim()).reduce((acc, cur) => {
    const [k, ...v] = cur.split('='); acc[k] = decodeURIComponent(v.join('=')); return acc;
  }, {});
}

function getSecretKey() {
  const secret = process.env.AUTH_COOKIE_SECRET || 'dev-secret-change-me';
  return new TextEncoder().encode(secret);
}

export async function signSession(payload) {
  const secret = getSecretKey();
  const jwt = await new SignJWT({ user: payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secret);
  return jwt;
}

export async function verifySession(token) {
  try {
    const secret = getSecretKey();
    const verified = await jwtVerify(token, secret);
    return verified.payload;
  } catch (e) {
    return null;
  }
}

export async function getUserFromRequest(req) {
  const cookies = parseCookies(req);
  const token = cookies.auth_token;
  if (!token) return null;
  const verified = await verifySession(token);
  return verified ? verified.user : null;
}
