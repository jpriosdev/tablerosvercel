import { signSession } from '../../../lib/auth';

export default async function handler(req, res) {
  const { code, state } = req.query;
  const issuer = process.env.ABSTRA_ISSUER;
  const clientId = process.env.ABSTRA_CLIENT_ID;
  const clientSecret = process.env.ABSTRA_CLIENT_SECRET;
  const redirectUri = process.env.ABSTRA_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/auth/callback`;

  if (!issuer || !clientId || !clientSecret) {
    return res.status(500).send('Authentication not configured. Set ABSTRA_ISSUER, ABSTRA_CLIENT_ID and ABSTRA_CLIENT_SECRET.');
  }

  // validate state
  const cookies = req.headers.cookie || '';
  const match = cookies.split(';').map(c=>c.trim()).find(c=>c.startsWith('auth_state='));
  const savedState = match ? match.split('=')[1] : null;
  if (!state || !savedState || state !== savedState) {
    return res.status(400).send('Invalid state');
  }

  // discover endpoints
  const wellKnownRes = await fetch(`${issuer}/.well-known/openid-configuration`);
  if (!wellKnownRes.ok) return res.status(502).send('Failed to fetch issuer configuration');
  const well = await wellKnownRes.json();

  // exchange code for tokens
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', redirectUri);
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);

  const tokenRes = await fetch(well.token_endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  });
  if (!tokenRes.ok) return res.status(502).send('Token endpoint error');
  const tokenJson = await tokenRes.json();

  // get userinfo
  const userRes = await fetch(well.userinfo_endpoint, {
    headers: { Authorization: `Bearer ${tokenJson.access_token}` }
  });
  if (!userRes.ok) return res.status(502).send('Failed to fetch userinfo');
  const profile = await userRes.json();

  // create session cookie
  const sessionToken = await signSession(profile);
  const maxAge = 8 * 60 * 60; // 8 hours
  const isProd = process.env.NODE_ENV === 'production' || (process.env.NEXT_PUBLIC_BASE_URL || '').startsWith('https');
  const secureFlag = isProd ? 'Secure; ' : '';
  res.setHeader('Set-Cookie', `auth_token=${sessionToken}; HttpOnly; Path=/; Max-Age=${maxAge}; ${secureFlag}SameSite=Lax`);

  // clear state cookie and redirect
  res.setHeader('Set-Cookie', `auth_state=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Lax`);
  res.writeHead(302, { Location: '/qa-dashboard' });
  res.end();
}
