'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function EditProfile() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchProfile(token);
  }, [router]);

  const fetchProfile = async (token: string) => {
    try {
      setLoadingProfile(true);
      const response = await axios.get(`${API_URL}/api/users/me/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData({
        username: response.data.username,
        bio: response.data.bio || '',
      });
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        router.push('/login');
      } else {
        setError('Erreur lors du chargement du profil');
      }
      console.error(err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${API_URL}/api/users/me/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Mettre à jour le username dans le localStorage
      localStorage.setItem('username', response.data.user.username);

      setSuccess('Profil mis à jour avec succès !');
      
      // Rediriger vers le profil après 1 seconde
      setTimeout(() => {
        router.push('/profile');
      }, 1000);
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        router.push('/login');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Erreur lors de la mise à jour du profil');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <p className="text-center text-[#6B7280]">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white border border-[#E5E7EB] rounded p-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-8">
          Modifier mon profil
        </h1>

        {error && (
          <div className="bg-white border border-[#DC2626] text-[#DC2626] px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-white border border-[#10B981] text-[#10B981] px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
            <p className="text-xs text-[#6B7280] mt-1.5">
              3-30 caractères, uniquement lettres, chiffres et underscores
            </p>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Biographie
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              maxLength={160}
              className="w-full px-4 py-2.5 border border-[#D1D5DB] rounded focus:outline-none focus:border-[#2563EB] transition-colors duration-200 resize-none"
              placeholder="Parlez-nous de vous... (max 160 caractères)"
            />
            <p className="text-xs text-[#6B7280] mt-1.5">
              {formData.bio.length}/160 caractères
            </p>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#2563EB] text-white py-2.5 px-4 rounded hover:bg-[#1E40AF] transition-colors duration-200 disabled:bg-[#D1D5DB] disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="flex-1 bg-white border border-[#D1D5DB] text-[#4B5563] py-2.5 px-4 rounded hover:bg-[#F3F4F6] transition-colors duration-200 font-medium"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
