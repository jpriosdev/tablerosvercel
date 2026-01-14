import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/auth/local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.message || 'Login failed');
        return;
      }
      // success -> redirect
      window.location.href = '/qa-dashboard';
    } catch (e) {
      setError(e.message || 'Network error');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-semibold mb-4">Iniciar sesión</h1>
        <form onSubmit={submit}>
          <label className="block text-sm">Email</label>
          <input className="w-full border rounded px-2 py-1 mb-3" value={email} onChange={e=>setEmail(e.target.value)} />
          <label className="block text-sm">Contraseña</label>
          <input type="password" className="w-full border rounded px-2 py-1 mb-3" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <div className="text-red-600 mb-3">{error}</div>}
          <button className="w-full bg-blue-600 text-white py-2 rounded">Entrar</button>
        </form>

        <div className="mt-4 text-sm">
          <p>O usar proveedor corporativo:</p>
          <Link href="/api/auth/login"><a className="text-blue-600">Iniciar con Abstracta (OIDC)</a></Link>
        </div>
      </div>
    </div>
  );
}
