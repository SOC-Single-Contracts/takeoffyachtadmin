import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, logo } from '../../assets/images';
import { resetPassword } from '../../services/api/auth';
import { Button } from '@material-tailwind/react';
import { resetPasswordSchema } from '../../validations/auth';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate passwords
      const validationResult = resetPasswordSchema.safeParse({
        password: newPassword,
        confirmPassword
      });

      if (!validationResult.success) {
        const errorMessage = validationResult.error.errors[0].message;
        setError(errorMessage);
        toast.error(errorMessage);
        setLoading(false);
        return;
      }

      const response = await resetPassword(userId, { 
        new_password: newPassword, 
        reset_password: confirmPassword 
      });

      toast.success('Password reset successful! Please login with your new password.');
      navigate('/login', { 
        replace: true,
        state: { message: 'Password has been reset successfully. Please login with your new password.' }
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Password reset failed';
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

          <h1 className="text-3xl font-semibold mb-6 text-center font-sora">Reset Password</h1>
          <p className="text-gray-600 text-center mb-8">
            Please enter your new password.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password<span className='text-red-500'>*</span>
              </label>
              <div className="relative mt-1">
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="********"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#BEA355] focus:outline-none"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters long and contain uppercase, lowercase, and numbers
              </p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password<span className='text-red-500'>*</span>
              </label>
              <div className="relative mt-1">
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
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
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
