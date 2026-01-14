import crypto from 'crypto';

export default async function handler(req, res) {
  const issuer = process.env.ABSTRA_ISSUER;
  const clientId = process.env.ABSTRA_CLIENT_ID;
  const redirectUri = process.env.ABSTRA_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/auth/callback`;

  if (!issuer || !clientId) {
    return res.status(500).send('Authentication is not configured. Set ABSTRA_ISSUER and ABSTRA_CLIENT_ID.');
  }

  const state = crypto.randomBytes(16).toString('hex');
  const maxAge = 10 * 60; // 10 minutes
  res.setHeader('Set-Cookie', `auth_state=${state}; HttpOnly; Path=/; Max-Age=${maxAge}; Secure; SameSite=Lax`);

  // discover endpoints
  const wellKnownRes = await fetch(`${issuer}/.well-known/openid-configuration`);
  if (!wellKnownRes.ok) return res.status(502).send('Failed to fetch issuer configuration');
  const well = await wellKnownRes.json();

  const authUrl = new URL(well.authorization_endpoint);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'openid profile email');
  authUrl.searchParams.set('state', state);

  res.writeHead(302, { Location: authUrl.toString() });
  res.end();
}
