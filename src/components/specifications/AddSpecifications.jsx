import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Input, Button } from "@material-tailwind/react";
import { useNavigate, useParams } from 'react-router-dom';
import { addSpecification, updateSpecification, getSpecification } from '../../services/api/specificationsService';

// Define the Zod schema for validation
const schema = z.object({
  specificationTitle: z.string().min(1, "Specification Title is required"),
});

const AddSpecifications = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentSpecification, setCurrentSpecification] = useState(null);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (id) {
      fetchSpecification();
    }
  }, [id]);

  const fetchSpecification = async () => {
    try {
      setFetchLoading(true);
      const data = await getSpecification(id);
      setCurrentSpecification(data);
      setValue('specificationTitle', data.title);
    } catch (err) {
      setError('Failed to fetch specification details');
      console.error('Error fetching specification:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');

      if (id) {
        await updateSpecification(id, { title: data.specificationTitle });
      } else {
        await addSpecification({ title: data.specificationTitle });
      }

      navigate('/specifications');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-6 font-sora">{id ? 'Edit' : 'Add New'} Specification</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <label htmlFor="specificationTitle">Specification Title</label>
          <Input 
            // label="Specification Title" 
            {...register('specificationTitle')} 
            defaultValue={currentSpecification?.title || ''}
            className="!border !border-gray-300 bg-white text-gray-900 mt-1 rounded-md shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
            labelProps={{
              className: "text-gray-700 font-medium"
            }}
          />
          {errors.specificationTitle && (
            <p className="text-red-500 text-sm mt-1">{errors.specificationTitle.message}</p>
          )}
          
          <Button
            size="md"
            type="submit"
            disabled={loading}
            className="bg-[#BEA355] hover:bg-[#A58B3D] text-white px-6 py-2 rounded-full transition-colors flex items-center justify-center text-sm capitalize font-medium disabled:bg-gray-400"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></span>
            ) : null}
            {id ? 'Update' : 'Add'} Specification
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddSpecifications;