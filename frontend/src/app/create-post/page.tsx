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
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          ✍️ Créer un nouveau post
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Quoi de neuf ?
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              maxLength={280}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Partagez vos pensées..."
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                {content.length}/280 caractères
              </p>
              <div className={`text-sm font-medium ${
                content.length > 280 ? 'text-red-600' : 
                content.length > 240 ? 'text-orange-600' : 'text-green-600'
              }`}>
                {280 - content.length} caractères restants
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || content.trim().length === 0}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Publication...' : '📤 Publier'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition font-medium"
            >
              Annuler
            </button>
          </div>
        </form>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">💡 Conseils :</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Soyez concis et percutant</li>
            <li>• Partagez des idées intéressantes</li>
            <li>• Respectez les autres utilisateurs</li>
            <li>• Utilisez un langage approprié</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
