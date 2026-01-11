import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/Forms/LoginForm';

export default function Login() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <LoginForm />
      <p className="text-center mt-4">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
