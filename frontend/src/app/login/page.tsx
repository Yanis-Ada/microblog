'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/users/login`, formData);

      // Stocker le token et le username
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.user.username);

      // Rediriger vers la page d'accueil
      router.push('/');
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Erreur lors de la connexion');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white border border-[#E5E7EB] rounded p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-[#1A1A1A] mb-8">
          Connexion
        </h1>

        {error && (
          <div className="bg-white border border-[#DC2626] text-[#DC2626] px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded focus:outline-none focus:border-[#2563EB] transition-colors duration-200"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded focus:outline-none focus:border-[#2563EB] transition-colors duration-200"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563EB] text-white py-2.5 px-4 rounded hover:bg-[#1E40AF] transition-colors duration-200 disabled:bg-[#D1D5DB] disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-[#6B7280] mt-6">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-[#2563EB] hover:text-[#1E40AF] font-medium transition-colors duration-200">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
