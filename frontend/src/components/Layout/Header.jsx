import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">
          LogoPromo
        </Link>
        <nav className="flex gap-4 items-center">
          {user ? (
            <>
              <span className="text-gray-700">Hello, {user.name}</span>
              <button
                onClick={logout}
                className="bg-danger text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
              <Link to="/register" className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
