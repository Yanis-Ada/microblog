'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

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
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🐳 Fil d'actualité (Docker Edition)
        </h1>
        <p className="text-gray-600 flex items-center gap-2">
          Découvrez les derniers posts de la communauté
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Running in Docker</span>
        </p>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600">Chargement des posts...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-6 rounded text-center">
          <p className="text-lg">Aucun post pour le moment.</p>
          <p className="text-sm mt-2">Soyez le premier à partager vos pensées !</p>
        </div>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {post.author.username.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-800">
                  @{post.author.username}
                </h3>
                {post.author.bio && (
                  <p className="text-sm text-gray-500">{post.author.bio}</p>
                )}
              </div>
            </div>

            <p className="text-gray-800 text-lg mb-3">{post.content}</p>

            <div className="text-sm text-gray-500">
              {formatDate(post.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
