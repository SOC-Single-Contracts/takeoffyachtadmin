import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Input, Alert } from "@material-tailwind/react";
import { addBrand, getBrand, updateBrand } from '../../services/api/brandService';
import { useNavigate, useParams } from 'react-router-dom';

// Define the Zod schema for validation
const schema = z.object({
  brandTitle: z.string().min(1, "Brand Title is required"),
});

const AddBrand = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditing = Boolean(id);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isEditing) {
      fetchBrand();
    }
  }, [id]);

  const fetchBrand = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getBrand(id);
      setValue('brandTitle', data.title);
    } catch (error) {
      console.error('Error fetching brand:', error);
      setError('Brand not found or error loading brand data');
      setTimeout(() => {
        navigate('/brands');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      if (isEditing) {
        await updateBrand(id, data.brandTitle);
      } else {
        await addBrand(data.brandTitle);
      }
      navigate('/brands');
    } catch (error) {
      console.error('Error saving brand:', error);
      setError(error.response?.data?.message || 'Error saving brand. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <div className="text-center">Loading...</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-6 font-sora">
          {isEditing ? 'Edit Brand' : 'Add New Brand'}
        </h1>
        
        {error && (
          <Alert color="red" className="mb-4">
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <label htmlFor="brandTitle">Brand Title</label>
          <Input 
            // label="Brand Title" 
            {...register('brandTitle')} 
            error={!!errors.brandTitle} 
            helperText={errors.brandTitle?.message}
            className='rounded-md'
          />
          
          <div className="flex justify-between items-center mt-6">
            <Button
              type="button"
              variant="text"
              className="text-gray-500"
              onClick={() => navigate('/brands')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#BEA355] text-white px-6 py-2.5 font-medium capitalize rounded-full hover:bg-[#A58B3D] transition-colors"
            >
              {isEditing ? 'Update Brand' : 'Add Brand'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddBrand;