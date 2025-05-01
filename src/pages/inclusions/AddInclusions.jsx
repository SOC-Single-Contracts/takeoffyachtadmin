import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Input } from "@material-tailwind/react";
import { useNavigate, useParams } from 'react-router-dom';
import { addInclusion, updateInclusion, getInclusion } from '../../services/api/inclusionsService';

// Define the Zod schema for validation
const schema = z.object({
  darkIcon: z.any(),
  lightIcon: z.any(),
  inclusionTitle: z.string().min(1, "Inclusion Title is required"),
});
const S3URL = "https://images-yacht.s3.us-east-1.amazonaws.com"

const AddInclusion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentInclusion, setCurrentInclusion] = useState(null);
  const [darkPreview, setDarkPreview] = useState(null);
  const [lightPreview, setLightPreview] = useState(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(schema),
  });

  // Watch for file changes
  const darkIconFile = watch('darkIcon');
  const lightIconFile = watch('lightIcon');
  const watchedValues = watch(); // Watches all form fields


  useEffect(() => {
    if (darkIconFile?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDarkPreview(reader.result);
      };
      reader.readAsDataURL(darkIconFile[0]);
    }
  }, [darkIconFile]);

  useEffect(() => {
    if (lightIconFile?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLightPreview(reader.result);
      };
      reader.readAsDataURL(lightIconFile[0]);
    }
  }, [lightIconFile]);

  useEffect(() => {
    if (id) {
      fetchInclusion();
    }
  }, [id]);

  const fetchInclusion = async () => {
    try {
      setFetchLoading(true);
      const data = await getInclusion(id);
      setCurrentInclusion(data);
      setValue('inclusionTitle', data.title);
    } catch (err) {
      setError('Failed to fetch inclusion details');
      console.error('Error fetching inclusion:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('title', data.inclusionTitle);
      
      if (data.darkIcon[0]) {
        formData.append('dark_icon', data.darkIcon[0]);
      }
      
      if (data.lightIcon[0]) {
        formData.append('light_icon', data.lightIcon[0]);
      }

      if (id) {
        await updateInclusion(id, {
          title: data.inclusionTitle,
          dark_icon: data.darkIcon[0],
          light_icon: data.lightIcon[0]
        });
      } else {
        await addInclusion(formData);
      }

      navigate('/inclusions');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };


  //test

  useEffect(()=>{
console.log("watchedValues",watchedValues)
  },[watchedValues])

  if (fetchLoading) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
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
        <h1 className="text-3xl font-bold mb-6 font-sora">{id ? 'Edit' : 'Add New'} Inclusion</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="inclusionTitle">Inclusion Title</label>
            <Input 
              // label="Inclusion Title" 
              {...register('inclusionTitle')} 
              defaultValue={currentInclusion?.title || ''}
              className="!border !border-gray-300 bg-white text-gray-900 rounded-md mt-1 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
              labelProps={{
                className: "text-gray-700 font-medium"
              }}
            />
            {errors.inclusionTitle && (
              <p className="text-red-500 text-sm mt-1">{errors.inclusionTitle.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {id ? 'Update Dark Icon' : 'Dark Icon'}
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  {...register('darkIcon')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="bg-white border border-gray-300 rounded-lg p-4 text-center relative">
                  <span className="text-gray-500">Choose file or drag and drop</span>
                  {darkPreview && (
                    <div className="mt-2">
                      <img 
                        src={darkPreview}
                        alt="Dark Icon Preview"
                        className="w-16 h-16 object-contain mx-auto border rounded p-2"
                      />
                    </div>
                  )}
                </div>
              </div>
              {errors.darkIcon && (
                <p className="text-red-500 text-sm mt-1">{errors.darkIcon.message}</p>
              )}
              {id && currentInclusion?.dark_icon && !darkPreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Current Dark Icon:</p>
                  <img 
                    src={`${S3URL}${currentInclusion.dark_icon}`}
                    alt="Current Dark Icon"
                    className="w-16 h-16 object-contain border rounded p-2"
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {id ? 'Update Light Icon' : 'Light Icon'}
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  {...register('lightIcon')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="bg-white border border-gray-300 rounded-lg p-4 text-center relative">
                  <span className="text-gray-500">Choose file or drag and drop</span>
                  {lightPreview && (
                    <div className="mt-2">
                      <img 
                        src={lightPreview}
                        alt="Light Icon Preview"
                        className="w-16 h-16 object-contain mx-auto border rounded p-2"
                      />
                    </div>
                  )}
                </div>
              </div>
              {errors.lightIcon && (
                <p className="text-red-500 text-sm mt-1">{errors.lightIcon.message}</p>
              )}
              {id && currentInclusion?.light_icon && !lightPreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Current Light Icon:</p>
                  <img 
                    src={`${S3URL}${currentInclusion.light_icon}`}
                    alt="Current Light Icon"
                    className="w-16 h-16 object-contain border rounded p-2"
                  />
                </div>
              )}
            </div>
          </div>
          
          <Button
            size="md"
            type="submit"
            disabled={loading}
            className="bg-[#BEA355] hover:bg-[#A58B3D] text-white px-6 py-2 rounded-full transition-colors flex items-center justify-center text-md capitalize font-medium disabled:bg-gray-400"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></span>
            ) : null}
            {id ? 'Update' : 'Add'} Inclusion
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddInclusion;