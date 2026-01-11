import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const navItems = {
    worker: [
      { label: 'Dashboard', path: '/worker/dashboard' },
      { label: 'Campaigns', path: '/worker/campaigns' },
      { label: 'My Tasks', path: '/worker/tasks' },
      { label: 'Earnings', path: '/worker/earnings' },
      { label: 'Withdrawals', path: '/worker/withdrawals' },
      { label: 'Profile', path: '/worker/profile' },
    ],
    advertiser: [
      { label: 'Dashboard', path: '/advertiser/dashboard' },
      { label: 'Create Campaign', path: '/advertiser/create' },
      { label: 'My Campaigns', path: '/advertiser/campaigns' },
      { label: 'Earnings', path: '/advertiser/earnings' },
      { label: 'Profile', path: '/advertiser/profile' },
    ],
    admin: [
      { label: 'Dashboard', path: '/admin/dashboard' },
      { label: 'Users', path: '/admin/users' },
      { label: 'Campaigns', path: '/admin/campaigns' },
      { label: 'Disputes', path: '/admin/disputes' },
    ],
  };

  const items = navItems[user.role] || [];

  return (
    <nav className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
        <div className={`${isOpen ? 'block' : 'hidden'} md:flex gap-4`}>
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block md:inline hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
