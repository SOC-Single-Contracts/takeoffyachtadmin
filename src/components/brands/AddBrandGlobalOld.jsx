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
  brandDescription: z.string().optional(),
});

const AddBrandGlobal = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditing = Boolean(id);
  const token = localStorage.getItem('token');


  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm({
    resolver: zodResolver(schema),
  });
  const watchedValues = watch(); // Watches all form fields

  useEffect(() => {
    if (isEditing) {
      fetchBrand();
    }
  }, [id]);

  const fetchBrand = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getBrand(id, token);
      // setValue('brandTitle', data.name,);
      reset({
        brandTitle: data.name,
        brandDescription: data.description || '', // Assuming description is optional
      });
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
    console.log("Form data:", data);
    let payload = {
      name: data.brandTitle,
      description: data.brandDescription || '',
    };
    try {
      setLoading(true);
      setError('');
      if (isEditing) {
        await updateBrand(id, payload, token);
      } else {
        await addBrand(payload, token);
      }
      navigate('/brands');
    } catch (error) {
      console.error('Error saving brand:', error);
      setError(error.response?.data?.message || 'Error saving brand. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  //test 

  useEffect(() => {
    console.log("debugging object", watchedValues);
  }, [watchedValues]);

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
          <label htmlFor="brandTitle">Name</label>
          <Input
            // label="Brand Title" 
            {...register('brandTitle')}
            error={!!errors.brandTitle}
            helperText={errors.brandTitle?.message}
            className='rounded-md'
          />
          <div className='mt-5'>
            <label htmlFor="brandDescription">Description</label>
            <Input
              // label="Brand Title" 
              {...register('brandDescription')}
              error={!!errors.brandDescription}
              helperText={errors.brandDescription?.message}
              className='rounded-md'
            />
          </div>

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

export default AddBrandGlobal;