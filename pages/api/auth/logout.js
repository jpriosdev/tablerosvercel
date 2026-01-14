export default function handler(req, res) {
  // clear session cookie (match Secure flag used at set time)
  const isProd = process.env.NODE_ENV === 'production' || (process.env.NEXT_PUBLIC_BASE_URL || '').startsWith('https');
  const secureFlag = isProd ? 'Secure; ' : '';
  res.setHeader('Set-Cookie', `auth_token=; HttpOnly; Path=/; Max-Age=0; ${secureFlag}SameSite=Lax`);
  res.writeHead(302, { Location: '/' });
  res.end();
}
