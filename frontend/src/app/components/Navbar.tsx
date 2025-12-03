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
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    router.push('/');
  };

  if (!mounted) {
    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
              Pas ouf.
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo / Site Title */}
          <Link href="/" className="group">
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight group-hover:text-[#2563EB] transition-colors">
                Pas ouf.
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Tu n'en avais pas besoin, c'est là.
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === '/' 
                  ? 'text-[#2563EB]' 
                  : 'text-gray-600 hover:text-[#1A1A1A]'
              }`}
            >
              Accueil
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  href="/create-post"
                  className={`text-sm font-medium transition-colors ${
                    pathname === '/create-post'
                      ? 'text-[#2563EB]'
                      : 'text-gray-600 hover:text-[#1A1A1A]'
                  }`}
                >
                  Nouveau Post
                </Link>
                <Link
                  href="/profile"
                  className={`text-sm font-medium transition-colors ${
                    pathname === '/profile'
                      ? 'text-[#2563EB]'
                      : 'text-gray-600 hover:text-[#1A1A1A]'
                  }`}
                >
                  @{username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`text-sm font-medium transition-colors ${
                    pathname === '/login'
                      ? 'text-[#2563EB]'
                      : 'text-gray-600 hover:text-[#1A1A1A]'
                  }`}
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-md hover:bg-[#1D4ED8] transition-colors"
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
