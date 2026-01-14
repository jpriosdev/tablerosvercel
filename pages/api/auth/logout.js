export default function handler(req, res) {
  // clear session cookie
  res.setHeader('Set-Cookie', `auth_token=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Lax`);
  res.writeHead(302, { Location: '/' });
  res.end();
}
