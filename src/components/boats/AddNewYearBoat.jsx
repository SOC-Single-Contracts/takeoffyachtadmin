import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Input, Textarea, Select, Option } from "@material-tailwind/react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getBoatById } from '../../services/api/boatService';

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  min_price: z.string().transform(val => Number(val)).pipe(z.number().positive()),
  max_price: z.string().transform(val => Number(val)).pipe(z.number().positive()),
  longitude: z.string().optional(),
  latitude: z.string().optional(),
  guest: z.string().transform(val => Number(val)).pipe(z.number().positive()),
  cancel_time_in_hour: z.string().transform(val => Number(val)).pipe(z.number().positive()),
  status: z.boolean().optional(),
  duration_hour: z.string().transform(val => Number(val)).pipe(z.number().positive()),
  duration_minutes: z.string().transform(val => Number(val)).pipe(z.number().positive()),
  number_of_cabin: z.string().transform(val => Number(val)).pipe(z.number().positive()),
  capacity: z.string().transform(val => Number(val)).pipe(z.number().positive()),
  sleep_capacity: z.string().transform(val => Number(val)).pipe(z.number().positive()),
  per_day_price: z.string().transform(val => Number(val)).pipe(z.number().positive()),
  per_hour_price: z.string().transform(val => Number(val)).pipe(z.number().positive()),
  length: z.string().optional(),
  power: z.string().optional(),
  engine_type: z.string().optional(),
  crew_member: z.string().optional(),
  notes: z.string().optional(),
  description: z.string().optional(),
  yacht_image: z.any().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  food_name: z.string().optional(),
  food_price: z.string().transform(val => val ? Number(val) : undefined).optional(),
  menucategory: z.string().optional(),
  inclusion: z.string().optional(),
  darkimage: z.any().optional(),
  lightimage: z.any().optional(),
  user_id: z.string().optional(),
  category_name: z.string().optional(),
  yacht_name: z.string().optional(),
});

const AddNewYearBoat = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      status: true,
      user_id: '1',
    }
  });

  useEffect(() => {
    const fetchBoatData = async () => {
      if (!id) {
        setInitialLoading(false);
        return;
      }

      try {
        const data = await getBoatById(id);
        // Transform the data to match form fields
        const formData = {
          ...data.yacht,
          // Convert number fields to strings for the form
          min_price: String(data.yacht.min_price),
          max_price: String(data.yacht.max_price),
          guest: String(data.yacht.guest),
          cancel_time_in_hour: String(data.yacht.cancel_time_in_hour),
          duration_hour: String(data.yacht.duration_hour),
          duration_minutes: String(data.yacht.duration_minutes),
          number_of_cabin: String(data.yacht.number_of_cabin),
          capacity: String(data.yacht.capacity),
          sleep_capacity: String(data.yacht.sleep_capacity),
          per_day_price: String(data.yacht.per_day_price),
          per_hour_price: String(data.yacht.per_hour_price),
        };
        reset(formData);
      } catch (error) {
        console.error('Error fetching boat data:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchBoatData();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Add features for New Year boat
      const features = {
        'new_year': 'true'
      };
      
      // Current date and time for availability
      const now = new Date();
      const availability = {
        data: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0]
      };

      // Append all text and number fields
      Object.keys(data).forEach(key => {
        if (!['yacht_image', 'darkimage', 'lightimage'].includes(key)) {
          const value = key === 'status' ? String(data[key]) : data[key];
          formData.append(key, value);
        }
      });

      // Append special fields
      formData.append('features', JSON.stringify(features));
      formData.append('availability', JSON.stringify(availability));

      // Append files if new ones are selected
      if (data.yacht_image?.[0]) {
        formData.append('yacht_image', data.yacht_image[0]);
      }
      if (data.darkimage?.[0]) {
        formData.append('darkimage', data.darkimage[0]);
      }
      if (data.lightimage?.[0]) {
        formData.append('lightimage', data.lightimage[0]);
      }

      const url = isEditMode 
        ? `https://api.takeoffyachts.com/yacht/yacht/${id}/`
        : 'https://api.takeoffyachts.com/yacht/yacht/';

      const response = await axios({
        method: isEditMode ? 'put' : 'post',
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.error_code === 'pass') {
        navigate('/boats/newyear');
      } else {
        console.error('Error creating/updating yacht:', response.data.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BEA355]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-6 font-sora">{isEditMode ? 'Edit' : 'Add'} New Year Boat</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Name" {...register('name')} error={!!errors.name} />
            <Input label="Title" {...register('title')} error={!!errors.title} />
            <Input label="Location" {...register('location')} error={!!errors.location} />
            <Input type="number" label="Min Price" {...register('min_price')} error={!!errors.min_price} />
            <Input type="number" label="Max Price" {...register('max_price')} error={!!errors.max_price} />
            <Input label="Longitude" {...register('longitude')} />
            <Input label="Latitude" {...register('latitude')} />
            <Input type="number" label="Guest Capacity" {...register('guest')} error={!!errors.guest} />
            <Input type="number" label="Cancel Time (hours)" {...register('cancel_time_in_hour')} error={!!errors.cancel_time_in_hour} />
            <Input type="number" label="Duration (hours)" {...register('duration_hour')} error={!!errors.duration_hour} />
            <Input type="number" label="Duration (minutes)" {...register('duration_minutes')} error={!!errors.duration_minutes} />
            <Input type="number" label="Number of Cabins" {...register('number_of_cabin')} error={!!errors.number_of_cabin} />
            <Input type="number" label="Capacity" {...register('capacity')} error={!!errors.capacity} />
            <Input type="number" label="Sleep Capacity" {...register('sleep_capacity')} error={!!errors.sleep_capacity} />
            <Input type="number" label="Per Day Price" {...register('per_day_price')} error={!!errors.per_day_price} />
            <Input type="number" label="Per Hour Price" {...register('per_hour_price')} error={!!errors.per_hour_price} />
            <Input label="Length" {...register('length')} />
            <Input label="Power" {...register('power')} />
            <Input label="Engine Type" {...register('engine_type')} />
            <Input label="Crew Member" {...register('crew_member')} />
            
            <div className="col-span-2">
              <Textarea label="Description" {...register('description')} />
            </div>
            
            <div className="col-span-2">
              <Textarea label="Notes" {...register('notes')} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Yacht Image</label>
              <input 
                type="file" 
                {...register('yacht_image')} 
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-[#BEA355] file:text-white
                hover:file:bg-[#A58B3D]
                file:cursor-pointer cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Dark Image</label>
              <input 
                type="file" 
                {...register('darkimage')} 
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-[#BEA355] file:text-white
                hover:file:bg-[#A58B3D]
                file:cursor-pointer cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Light Image</label>
              <input 
                type="file" 
                {...register('lightimage')} 
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-[#BEA355] file:text-white
                hover:file:bg-[#A58B3D]
                file:cursor-pointer cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#BEA355] text-white px-6 py-2 rounded-full hover:bg-[#A58B3D] transition-colors disabled:opacity-50"
          >
            {loading ? `${isEditMode ? 'Updating' : 'Adding'} New Year Boat...` : `${isEditMode ? 'Update' : 'Add'} New Year Boat`}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default AddNewYearBoat;