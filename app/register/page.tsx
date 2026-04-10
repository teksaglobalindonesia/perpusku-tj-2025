'use client';

import { useState } from 'react';
import { registerUser } from '../../lib/auth';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);

      if (type === 'success') {
        window.location.href = '/login';
      }
    }, 5000);
  };

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError('Semua field wajib diisi!');
      return;
    }

    try {
      setError('');
      await registerUser(username, email, password);

      showNotification('Register berhasil!', 'success');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-green-700">Register</h2>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Username
          </label>
          <input
            type="text"
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="w-1/2 rounded-lg bg-gray-400 p-3 text-white hover:bg-gray-500"
          >
            Batal
          </button>

          <button
            onClick={handleRegister}
            className="w-1/2 rounded-lg bg-green-600 p-3 text-white hover:bg-green-700"
          >
            Register
          </button>
        </div>

        {notification && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div
              className={`w-[320px] rounded-2xl p-6 text-center text-white shadow-2xl ${
                notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
              }`}
            >
              <div className="mb-3 text-4xl">
                {notification.type === 'success' ? '✔' : '✖'}
              </div>

              <h3 className="mb-1 text-lg font-semibold">
                {notification.type === 'success'
                  ? 'Berhasil'
                  : 'Terjadi Kesalahan'}
              </h3>

              <p className="text-sm opacity-90">{notification.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
