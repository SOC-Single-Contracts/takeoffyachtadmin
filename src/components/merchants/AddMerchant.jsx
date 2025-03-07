import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { zodResolver } from '@hookform/resolvers/zod';
import { addUser } from '../../services/api/userManagement';
import { Button } from '@material-tailwind/react';

const merchantSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
});

const AddMerchant = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(merchantSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const userData = {
        Username: `${data.firstName} ${data.lastName}`.trim(),
        Email: data.email.trim(),
        Password: data.password,
        user_type: 'CLT'
      };

      await addUser(userData);
      toast.success('Merchant added successfully!');
      navigate('/merchants');
    } catch (error) {
      console.error('Error adding merchant:', error);
      const errorMessage = error.response?.data?.detail
        ? Object.values(error.response.data.detail).flat()[0]
        : 'Failed to add merchant';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-lg lg:text-4xl font-bold mb-8 font-sora">Add New Merchant</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-2">First Name<span className="text-red-700">*</span></label>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className={`w-full border rounded-lg p-2 ${errors.firstName ? "border-red-500" : "border-gray-300"} focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
                  placeholder="Enter first name"
                />
              )}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-2">Last Name<span className="text-red-700">*</span></label>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className={`w-full border rounded-lg p-2 ${errors.lastName ? "border-red-500" : "border-gray-300"} focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
                  placeholder="Enter last name"
                />
              )}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
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
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
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
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/merchants')}
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
            {loading ? 'Adding...' : 'Add Merchant'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddMerchant;
