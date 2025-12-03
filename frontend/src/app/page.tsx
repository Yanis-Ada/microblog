'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Post {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    username: string;
    bio: string | null;
  };
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/posts`);
      setPosts(response.data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center text-gray-500">
          Chargement...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Header de la page */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">
          Fil d'actualité
        </h2>
        <p className="text-gray-600">
          Les dernières pensées de la communauté
        </p>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Liste des posts */}
      {posts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">Aucun post pour le moment.</p>
          <Link
            href="/create-post"
            className="inline-block px-6 py-3 bg-[#2563EB] text-white font-medium rounded-lg hover:bg-[#1D4ED8] transition-colors"
          >
            Créer le premier post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              {/* Header du post */}
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">
                    {post.author.username.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Info auteur */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <Link
                      href={`/profile/${post.author.id}`}
                      className="font-semibold text-[#1A1A1A] hover:text-[#2563EB] transition-colors truncate"
                    >
                      @{post.author.username}
                    </Link>
                    <span className="text-gray-500 text-sm">•</span>
                    <time className="text-gray-500 text-sm flex-shrink-0">
                      {formatDate(post.createdAt)}
                    </time>
                  </div>
                  {post.author.bio && (
                    <p className="text-sm text-gray-600 mt-0.5 truncate">
                      {post.author.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Contenu du post */}
              <div className="pl-16">
                <p className="text-[#1A1A1A] text-base leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
