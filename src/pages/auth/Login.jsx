import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login, logo } from '../../assets/images';
import React, { useState, useEffect } from "react";
import { login as loginApi } from '../../services/api/auth';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@material-tailwind/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Display success message if coming from signup
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginApi(email, password);
      authLogin(response.token, response.Username);
      // Navigate to home page or the page user tried to access
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block w-1/2">
        <img
          src={login} 
          alt="Yacht"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full h-screen overflow-scroll md:w-1/2 flex items-center justify-center bg-white pt-16">
        <div className="w-full max-w-md px-8 py-8">
          <img src={logo} alt="yacht logo" className='max-w-[200px] mx-auto my-8'/>

          <h1 className="text-3xl font-semibold mb-6 text-center font-sora">Login</h1>
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email<span className='text-red-500'>*</span>
              </label>
              <div className="relative mt-1">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ham@example.com"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#BEA355] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password<span className='text-red-500'>*</span>
              </label>
              <div className="relative mt-1">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#BEA355] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* <div className="text-right mb-4">
              <a href="/forgot-password" className="text-sm text-[#BEA355] hover:underline">
                Forgot Password?
              </a>
            </div> */}

            <Button
            size='md'
              type="submit"
              className="w-full bg-[#BEA355] rounded-full text-white py-4 px-4 transition capitalize font-medium "
            >
              Login
            </Button>

            {/* <p className="text-sm text-center mt-4">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-yellow-600 font-medium hover:underline">
                Sign Up
              </Link>
            </p> */}

            {/* <div className="flex items-center my-6">
              <hr className="flex-1 border-t border-gray-300" />
              <span className="px-4 text-sm text-gray-500">OR</span>
              <hr className="flex-1 border-t border-gray-300" />
            </div> */}

            {/* <div className="space-y-4">
                <button className="w-full relative flex items-center justify-center rounded-full py-2 bg-slate-100 hover:bg-gray-200">
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        className="absolute left-4 w-5 h-5"
                    />
                    <p className="text-center font-semibold">Sign in with Google</p>
                </button>
                <button className="w-full relative flex items-center justify-center rounded-full py-2 bg-slate-100 hover:bg-gray-200">
                    <img
                        src="https://www.svgrepo.com/show/448224/facebook.svg"
                        alt="Facebook"
                        className="absolute left-4 w-5 h-5"
                    />
                    <p className="text-center font-semibold">Sign in with Facebook</p>
                </button>
                <button className="w-full relative flex items-center justify-center rounded-full py-2 bg-slate-100 hover:bg-gray-200">
                    <img
                    src="https://www.svgrepo.com/show/494331/apple-round.svg"
                    alt="Apple"
                    className="absolute left-4 w-5 h-5"
                    />
                    <p className="text-center font-semibold">Sign in with Apple</p>
                </button>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;