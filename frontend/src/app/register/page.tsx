'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
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

    // Validation côté client
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('Le mot de passe doit contenir au moins une majuscule');
      return;
    }

    if (!/[a-z]/.test(formData.password)) {
      setError('Le mot de passe doit contenir au moins une minuscule');
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      setError('Le mot de passe doit contenir au moins un chiffre');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/users/register`, {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });

      // Stocker le token et le username
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.user.username);

      // Rediriger vers la page d'accueil
      router.push('/');
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Erreur lors de l\'inscription');
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
          Inscription
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
            <label htmlFor="username" className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded focus:outline-none focus:border-[#2563EB] transition-colors duration-200"
              placeholder="username"
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
            <p className="text-xs text-[#6B7280] mt-1.5">
              8 caractères min, avec majuscule, minuscule et chiffre
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
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
            {loading ? 'Inscription en cours...' : 'S\'inscrire'}
          </button>
        </form>

        <p className="text-center text-[#6B7280] mt-6">
          Déjà inscrit ?{' '}
          <Link href="/login" className="text-[#2563EB] hover:text-[#1E40AF] font-medium transition-colors duration-200">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
