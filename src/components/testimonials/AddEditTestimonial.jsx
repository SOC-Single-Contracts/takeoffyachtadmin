import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { toast } from 'react-toastify';
import FileUpload from '../common/FileUpload';

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  statement: z.string().min(1, "Statement is required"),
  yacht_id: z.string().transform(val => Number(val)),
});

const AddEditTestimonial = () => {
  const [loading, setLoading] = useState(false);
  const [testimonialImage, setTestimonialImage] = useState(null);
  const [yachts, setYachts] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    // Fetch yachts for dropdown
    const fetchYachts = async () => {
      try {
        const response = await axios.post('https://api.takeoffyachts.com/yacht/check_yacht/', { user_id: 1 });
        if (response.data.error_code === 'pass') {
          setYachts(response.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching yachts:', error);
        toast.error('Failed to load yachts');
      }
    };

    // Fetch testimonial data if in edit mode
    const fetchTestimonial = async () => {
      try {
        const response = await axios.get('https://api.takeoffyachts.com/yacht/yacht_testimonal/', { yacht: id });
        if (response.data.error_code === 'pass') {
          const testimonial = response.data.testimonal.find(t => t.id === Number(id));
          reset({
            name: testimonial.name,
            location: testimonial.location,
            statement: testimonial.statement,
            yacht_id: String(testimonial.yacht_id)
          });
        }
      } catch (error) {
        console.error('Error fetching testimonial:', error);
        toast.error('Failed to load testimonial');
      }
    };

    fetchYachts();
    if (isEditMode) {
      fetchTestimonial();
    }
  }, [id, reset]);

  const handleImageChange = (files) => {
    if (files.length > 0) {
      setTestimonialImage(files[0]);
    } else {
      setTestimonialImage(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (!testimonialImage && !isEditMode) {
        toast.error('Please select an image');
        return;
      }

      setLoading(true);
      const url = 'https://api.takeoffyachts.com/yacht/yacht_testimonal/';

      const response = await axios({
        method: isEditMode ? 'put' : 'post',
        url,
        data: isEditMode ? {
          testimonal_id: id,
          statement: data.statement,
          location: data.location,
          yacht_id: data.yacht_id,
        } : {
          ...data,
          testimonal_image: testimonialImage.file,
        },
        headers: {
          'Content-Type': isEditMode ? 'application/json' : 'multipart/form-data',
        },
      });

      console.log(response.data); // Log the response for debugging

      if (response.data.error_code === 'pass' || response.data.error_code === '') {
        toast.success(`Testimonial ${isEditMode ? 'updated' : 'created'} successfully`);
        navigate('/testimonials');
      } else {
        toast.error('Failed to save testimonial: ' + (response.data.error || 'Unknown error occurred.'));
      }
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast.error('Failed to save testimonial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card className="p-6">
        <Typography variant="h4" className="font-sora mb-6">
          {isEditMode ? 'Edit' : 'Add'} Testimonial
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <Input {...register('name')} error={!!errors.name} />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <Input {...register('location')} error={!!errors.location} />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="statement" className="block text-sm font-medium text-gray-700 mb-1">
              Statement
            </label>
            <Input {...register('statement')} error={!!errors.statement} />
            {errors.statement && (
              <p className="text-red-500 text-sm mt-1">{errors.statement.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="yacht_id" className="block text-sm font-medium text-gray-700 mb-1">
              Select Yacht
            </label>
            <select
              {...register('yacht_id')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Select a yacht</option>
              {yachts.map((yacht) => (
                <option key={yacht.yacht.id} value={yacht.yacht.id}>
                  {yacht.yacht.name}
                </option>
              ))}
            </select>
            {errors.yacht_id && (
              <p className="text-red-500 text-sm mt-1">{errors.yacht_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Testimonial Image
            </label>
            <FileUpload
              onFilesChange={handleImageChange}
              maxFiles={1}
              acceptedFileTypes="image/*"
              containerClassName="border border-gray-200 rounded-lg"
            />
          </div>

          <Button
            type="submit"
            className="bg-[#BEA355] text-white px-6 py-2 rounded-full hover:bg-[#A58B3D] capitalize font-medium h-12 float-right"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Testimonial' : 'Add Testimonial'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddEditTestimonial;
