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

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <p className="text-center text-[#6B7280]">Chargement du profil...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white border border-[#E5E7EB] text-[#DC2626] px-6 py-4 rounded">
          {error || 'Erreur lors du chargement'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* En-tête du profil */}
      <div className="bg-white border border-[#E5E7EB] rounded p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-2xl">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-[#1A1A1A]">@{user.username}</h1>
              <p className="text-sm text-[#6B7280] mt-1">
                Membre depuis {formatDate(user.createdAt)}
              </p>
            </div>
          </div>

          <Link
            href="/edit-profile"
            className="text-[#2563EB] hover:text-[#1E40AF] font-medium transition-colors duration-200 border border-[#2563EB] px-4 py-2 rounded hover:bg-[#EFF6FF]"
          >
            Modifier le profil
          </Link>
        </div>

        {user.bio && <p className="text-[#4B5563] mt-4">{user.bio}</p>}
        {!user.bio && <p className="text-[#9CA3AF] mt-4 italic">Pas de biographie</p>}

        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-[#E5E7EB]">
          <div>
            <span className="font-bold text-[#1A1A1A]">{user.posts.length}</span>
            <span className="text-[#6B7280] ml-1">posts</span>
          </div>
          <div className="text-[#6B7280]">{user.email}</div>
        </div>
      </div>

      {/* Posts de l'utilisateur */}
      <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Mes posts</h2>

      {user.posts.length === 0 && (
        <div className="bg-white border border-[#E5E7EB] text-center px-6 py-12 rounded">
          <p className="text-[#6B7280] text-lg mb-4">Vous n'avez pas encore de posts.</p>
          <Link
            href="/create-post"
            className="inline-block bg-[#2563EB] text-white px-6 py-2.5 rounded hover:bg-[#1E40AF] transition-colors duration-200"
          >
            Créer votre premier post
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {user.posts.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-[#E5E7EB] rounded p-6 hover:shadow-md transition-shadow duration-200"
          >
            <p className="text-[#1A1A1A] text-base mb-4 leading-relaxed">{post.content}</p>

            <div className="flex justify-between items-center">
              <div className="text-sm text-[#6B7280]">
                {getTimeAgo(post.createdAt)}
                {post.updatedAt !== post.createdAt && (
                  <span className="ml-2 text-xs text-[#9CA3AF]">(modifié)</span>
                )}
              </div>

              <div className="flex gap-4">
                <Link
                  href={`/edit-post/${post.id}`}
                  className="text-[#2563EB] hover:text-[#1E40AF] font-medium transition-colors duration-200"
                >
                  Modifier
                </Link>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="text-[#DC2626] hover:text-[#B91C1C] font-medium transition-colors duration-200"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
