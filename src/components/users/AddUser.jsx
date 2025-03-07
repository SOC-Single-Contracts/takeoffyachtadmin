import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { addUser } from '../../services/api/userManagement';
import { Button } from '@material-tailwind/react';

const USER_TYPES = [
  { value: 'ADM', label: 'Admin User' },
  { value: 'CLT', label: 'Consultant User' },
  { value: 'RGU', label: 'Regular User' }
];

const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  userType: z.enum(['ADM', 'CLT', 'RGU'], {
    required_error: 'Please select a user type'
  })
});

const AddUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      userType: 'RGU'
    }
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const userData = {
        Username: data.username.trim(),
        Email: data.email.trim(),
        Password: data.password,
        user_type: data.userType
      };

      await addUser(userData);
      toast.success('User added successfully!');
      navigate('/users');
    } catch (error) {
      console.error('Error adding user:', error);
      const errorMessage = error.response?.data?.detail
        ? Object.values(error.response.data.detail).flat()[0]
        : 'Failed to add user';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-lg lg:text-4xl font-bold mb-8 font-sora">Add New User</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block font-medium mb-2">User Type<span className="text-red-700">*</span></label>
          <Controller
            name="userType"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={`w-full border rounded-lg p-2 ${errors.userType ? "border-red-500" : "border-gray-300"} focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
              >
                {USER_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.userType && (
            <span className="text-red-500 text-sm">{errors.userType.message}</span>
          )}
        </div>

        <div>
          <label className="block font-medium mb-2">Username<span className="text-red-700">*</span></label>
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                className={`w-full border rounded-lg p-2 ${errors.username ? "border-red-500" : "border-gray-300"} focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
                placeholder="Enter username"
              />
            )}
          />
          {errors.username && (
            <span className="text-red-500 text-sm">{errors.username.message}</span>
          )}
        </div>

        <div>
          <label className="block font-medium mb-2">Email<span className="text-red-700">*</span></label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                className={`w-full border rounded-lg p-2 ${errors.email ? "border-red-500" : "border-gray-300"} focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
                placeholder="Enter email"
              />
            )}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div>
          <label className="block font-medium mb-2">Password<span className="text-red-700">*</span></label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                className={`w-full border rounded-lg p-2 ${errors.password ? "border-red-500" : "border-gray-300"} focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
                placeholder="Enter password"
              />
            )}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/users')}
            className="px-4 py-2 text-gray-600 rounded-full border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <Button
            size="sm"
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#BEA355] text-white rounded-full hover:bg-yellow-600 disabled:opacity-50 capitalize font-medium"
          >
            {loading ? 'Adding...' : 'Add User'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
