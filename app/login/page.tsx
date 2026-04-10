'use client';

import { useState } from 'react';
import { loginUser } from '../../lib/auth';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setError('');
      await loginUser(identifier, password);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-green-700">PerpusKu</h1>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Email / Username
          </label>
          <input
            type="text"
            placeholder="Masukkan email atau username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 pr-10 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full rounded-lg bg-green-600 p-3 font-medium text-white transition hover:bg-green-700"
        >
          Login
        </button>
      </div>
    </div>
  );
}
