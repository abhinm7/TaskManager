'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-96 rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Sign In</h2>
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            className="w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            className="w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}