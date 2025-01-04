// src/pages/Login.tsx

import { useState } from 'react';
import { signIn } from '../Services/authService';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(''); // Clear previous errors
    const response = await signIn(email, password);

    if (response.success) {
      const user = response.data;

      // Navigate based on the user role
      if (user && user.role) {
        navigateToRoleBasedDashboard(user.role);
      } else {
        setError('Unable to determine user role. Please contact support.');
      }
    } else {
      setError(response.error || 'Login failed. Please try again.');
    }
  };

  // Helper function to navigate based on role
  const navigateToRoleBasedDashboard = (role: string) => {
    switch (role) {
      case 'student':
        navigate('/dashboard', { state: { role: 'student' } });
        break;
      case 'coordinator':
        navigate('/dashboard', { state: { role: 'coordinator' } });
        break;
      default:
        setError('Invalid role. Access denied.');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <p className="mt-4 text-sm text-center">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            className="text-blue-500 cursor-pointer"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
