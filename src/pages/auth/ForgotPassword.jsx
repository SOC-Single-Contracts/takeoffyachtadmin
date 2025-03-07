import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, logo } from '../../assets/images';
import { forgotPassword } from '../../services/api/auth';
import { Button } from '@material-tailwind/react';
import { forgotPasswordSchema } from '../../validations/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      // Validate email
      const validationResult = forgotPasswordSchema.safeParse({ email });
      if (!validationResult.success) {
        const errorMessage = validationResult.error.errors[0].message;
        setError(errorMessage);
        toast.error(errorMessage);
        setLoading(false);
        return;
      }

      const response = await forgotPassword(email);
      
      if (response.status === 'success' && response.details?.user_id) {
        toast.success('Password reset instructions sent to your email!');
        // Redirect to reset password page with user_id
        navigate(`/reset-password/${response.details.user_id}`);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send reset instructions';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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

          <h1 className="text-3xl font-semibold mb-6 text-center font-sora">Forgot Password</h1>
          <p className="text-gray-600 text-center mb-8">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
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
                  placeholder="john@example.com"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#BEA355] focus:outline-none"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              size="md"
              className="w-full bg-[#BEA355] rounded-full text-white py-4 px-4 transition capitalize font-medium disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </Button>

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <p className="text-sm text-center mt-4">
              Remember your password?{" "}
              <Link to="/login" className="text-yellow-600 font-medium hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
