'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  // Évite les erreurs de hydration en n'affichant rien côté serveur
  if (!mounted) {
    return (
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              📝 Microblog
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="hover:text-blue-600 text-gray-700">
                Accueil
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            📝 Microblog
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className={`hover:text-blue-600 ${
                pathname === '/' ? 'text-blue-600 font-semibold' : 'text-gray-700'
              }`}
            >
              Accueil
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  className={`hover:text-blue-600 ${
                    pathname === '/profile' ? 'text-blue-600 font-semibold' : 'text-gray-700'
                  }`}
                >
                  Mon Profil
                </Link>
                <Link
                  href="/create-post"
                  className={`hover:text-blue-600 ${
                    pathname === '/create-post' ? 'text-blue-600 font-semibold' : 'text-gray-700'
                  }`}
                >
                  Nouveau Post
                </Link>
                <span className="text-gray-600">@{username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`hover:text-blue-600 ${
                    pathname === '/login' ? 'text-blue-600 font-semibold' : 'text-gray-700'
                  }`}
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
