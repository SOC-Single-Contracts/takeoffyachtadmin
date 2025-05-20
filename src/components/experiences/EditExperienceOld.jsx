import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Input, Textarea, Select, Option, Button } from "@material-tailwind/react";
import experienceService from '../../services/api/experienceService';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  title: z.string().min(1, "Title is required"),
  min_price: z.number().positive(),
  max_price: z.number().positive(),
  longitude: z.string().optional(),
  latitude: z.string().optional(),
  guest: z.number().positive(),
  cancel_time_in_hour: z.number().positive(),
  status: z.boolean().optional(),
  duration_hour: z.number().positive(),
  number_of_cabin: z.number().positive(),
  capacity: z.number().positive(),
  sleep_capacity: z.number().positive(),
  per_day_price: z.number().positive(),
  per_hour_price: z.number().positive(),
  length: z.string().optional(),
  power: z.string().optional(),
  engine_type: z.string().optional(),
  availability: z.string().optional(),
  features: z.string().optional(),
  flag: z.string().optional(),
  crew_member: z.string().optional(),
  crew_language: z.string().optional(),
  notes: z.string().optional(),
  description: z.string().optional(),
  yacht_image: z.instanceof(File).optional(),
  // Add more fields as necessary
});

const EditExperience = () => {
  const { id } = useParams();
  console.log('Editing experience with ID:', id); // Log the ID to verify
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const experience = await experienceService.getExperienceById(id);
        // Set form values
        Object.keys(experience).forEach(key => {
          setValue(key, experience[key]);
        });
      } catch (error) {
        toast.error('Error fetching experience: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      await experienceService.updateExperience(id, data);
      toast.success('Experience updated successfully!');
      // Optionally redirect or reset the form
    } catch (error) {
      toast.error('Error updating experience: ' + error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-6">Edit Experience</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name">Name</label>
            <Input {...register('name')} error={!!errors.name} />
          </div>
          <div>
            <label htmlFor="location">Location</label>
            <Input {...register('location')} error={!!errors.location} />
          </div>
          <div>
            <label htmlFor="title">Title</label>
            <Input {...register('title')} error={!!errors.title} />
          </div>
          <div>
            <label htmlFor="min_price">Min Price</label>
            <Input type="number" {...register('min_price')} error={!!errors.min_price} />
          </div>
          <div>
            <label htmlFor="max_price">Max Price</label>
            <Input type="number" {...register('max_price')} error={!!errors.max_price} />
          </div>
          <div>
            <label htmlFor="guest">Guest</label>
            <Input type="number" {...register('guest')} error={!!errors.guest} />
          </div>
          <div>
            <label htmlFor="cancel_time_in_hour">Cancel Time (hours)</label>
            <Input type="number" {...register('cancel_time_in_hour')} error={!!errors.cancel_time_in_hour} />
          </div>
          <div>
            <label htmlFor="status">Status</label>
            <Select {...register('status')}>
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </div>
          {/* Add more fields as necessary */}
          <Button type="submit">Update Experience</Button>
        </form>
      </Card>
    </div>
  );
};

export default EditExperience;
