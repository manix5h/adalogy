import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../../components/Forms/RegisterForm';

export default function Register() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <RegisterForm />
      <p className="text-center mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
}
