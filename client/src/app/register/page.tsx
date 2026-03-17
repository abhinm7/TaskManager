'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // The Axios interceptor automatically AES-encrypts this outgoing payload
      const response = await api.post('/auth/register', { email, password });
      
      // Backend automatically sets the HttpOnly cookie on register, so we just log them in locally
      login(response.data.user);
    } catch (err: any) {
      // Catches our backend 409 conflict error if the email is already in use
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-96 rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Create Account</h2>
        {error && <p className="mb-4 text-sm font-semibold text-red-500">{error}</p>}
        
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
            minLength={6}
          />
        </div>

        <button type="submit" className="mb-4 w-full rounded bg-green-600 p-2 font-medium text-white transition hover:bg-green-700">
          Sign Up
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-blue-600 hover:underline">
            Log in here
          </Link>
        </p>
      </form>
    </div>
  );
}