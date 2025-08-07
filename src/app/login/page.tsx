'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();
    if (res.ok) {
      setStatus('✅ Login Conjouring successful!');
      window.location.href = "/"
    } else {
      setStatus(`❌ Failed... ${result.error}`);
    }
  }

  return (
    <div className="min-h-screen p-8 sm:p-20 grid grid-rows-[20px_1fr_20px] justify-items-center gap-16 font-sans">
      <form onSubmit={handleLogin} className='row-start-2 flex flex-col gap-8 items-center sm:items-start'>
        <h1>Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="mb-4 px-4 py-2 rounded bg-zinc-900 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full max-w-md"
        />
        <br></br>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="mb-4 px-4 py-2 rounded bg-zinc-900 text-zinc-100 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full max-w-md"
        />
        <br></br>
        <button type="submit" >Login</button>
        {status && <p>{status}</p>}
      </form>
    </div>
  );
}