'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Post {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  email: string;
  username: string;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
  posts: Post[];
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/users/me/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      setError('');
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
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) return;

    try {
      await axios.delete(`${API_URL}/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Recharger le profil
      fetchProfile(token);
    } catch (err) {
      alert('Erreur lors de la suppression du post');
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <p className="text-center text-gray-600">Chargement du profil...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Erreur lors du chargement'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* En-tête du profil */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-3xl">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-800">@{user.username}</h1>
              {user.bio && <p className="text-gray-600 mt-1">{user.bio}</p>}
              {!user.bio && <p className="text-gray-400 mt-1 italic">Pas de biographie</p>}
              <p className="text-sm text-gray-500 mt-2">
                Membre depuis {formatDate(user.createdAt)}
              </p>
            </div>
          </div>

          <Link
            href="/edit-profile"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ✏️ Modifier le profil
          </Link>
        </div>
      </div>

      {/* Statistiques */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{user.posts.length}</p>
            <p className="text-gray-600">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{user.email}</p>
            <p className="text-gray-600">Email</p>
          </div>
        </div>
      </div>

      {/* Posts de l'utilisateur */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Mes posts</h2>

      {user.posts.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-6 rounded text-center">
          <p className="text-lg">Vous n'avez pas encore de posts.</p>
          <Link
            href="/create-post"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Créer votre premier post
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {user.posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <p className="text-gray-800 text-lg mb-3">{post.content}</p>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {formatDate(post.createdAt)}
              </div>

              <button
                onClick={() => handleDeletePost(post.id)}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
