'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function CreatePost() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (content.trim().length === 0) {
      setError('Le contenu ne peut pas être vide');
      return;
    }

    if (content.length > 280) {
      setError('Le contenu ne peut pas dépasser 280 caractères');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${API_URL}/api/posts`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Rediriger vers la page d'accueil
      router.push('/');
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        router.push('/login');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Erreur lors de la création du post');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white border border-[#E5E7EB] rounded p-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-8">
          Créer un nouveau post
        </h1>

        {error && (
          <div className="bg-white border border-[#DC2626] text-[#DC2626] px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Quoi de neuf ?
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              maxLength={280}
              required
              className="w-full px-4 py-3 border border-[#D1D5DB] rounded focus:outline-none focus:border-[#2563EB] transition-colors duration-200 resize-none"
              placeholder="Partagez vos pensées..."
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-[#6B7280]">
                {content.length}/280 caractères
              </p>
              <div className={`text-sm font-medium ${
                content.length > 280 ? 'text-[#DC2626]' : 
                content.length > 240 ? 'text-[#F59E0B]' : 'text-[#10B981]'
              }`}>
                {280 - content.length} restants
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || content.trim().length === 0}
              className="flex-1 bg-[#2563EB] text-white py-3 px-4 rounded hover:bg-[#1E40AF] transition-colors duration-200 disabled:bg-[#D1D5DB] disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Publication...' : 'Publier'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex-1 bg-white border border-[#D1D5DB] text-[#4B5563] py-3 px-4 rounded hover:bg-[#F3F4F6] transition-colors duration-200 font-medium"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
