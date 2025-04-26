import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Input, Textarea } from "@material-tailwind/react";
import { useNavigate, useParams } from 'react-router-dom';
import FileUpload from '../common/ImagesUploader/FileUpload';
import MapPicker from '../common/MapPicker';
import { toast } from 'react-toastify';
import experienceService from '../../services/api/experienceService';

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  min_price: z.string().transform(val => Number(val)).pipe(z.number().positive()),
  max_price: z.string().transform(val => Number(val)).pipe(z.number().positive()),
  guest: z.string().transform(val => Number(val)).pipe(z.number().positive()),
  cancel_time_in_hour: z.string().transform(val => Number(val)).pipe(z.number().positive()),
  duration_hour: z.string().transform(val => Number(val)).pipe(z.number().positive()),
  number_of_cabin: z.string().transform(val => Number(val)).pipe(z.number().positive()),
  capacity: z.string().transform(val => Number(val)).pipe(z.number().positive()),
  sleep_capacity: z.string().transform(val => Number(val)).pipe(z.number().positive()),
  per_day_price: z.string().transform(val => Number(val)).pipe(z.number().positive()),
  per_hour_price: z.string().transform(val => Number(val)).pipe(z.number().positive()),
  length: z.string().optional(),
  power: z.string().optional(),
  engine_type: z.string().optional(),
  crew_member: z.string().optional(),
  description: z.string().optional(),
  flag: z.string().optional(),
  crew_language: z.string().optional(),
  food_name: z.string().optional(),
  food_price: z.string().transform(val => val ? Number(val) : undefined).optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  user_id: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  yacht_image: z.instanceof(File).optional(),
  darkimage: z.instanceof(File).optional(),
  experience_image: z.instanceof(File).optional(),
});

const AddExperience = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [yachtImage, setYachtImage] = useState(null);
  const [darkImage, setDarkImage] = useState(null);
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
    const fetchExperienceData = async () => {
      if (!id) {
        setInitialLoading(false);
        return;
      }
      try {
        const response = await experienceService.getExperienceById(id);
        const experience = response.data;
        console.log('Fetched experience data:', experience); // Log the fetched data
        reset({
          name: experience.name,
          title: experience.title,
          location: experience.location,
          min_price: experience.min_price,
          max_price: experience.max_price,
          guest: experience.guest,
          cancel_time_in_hour: experience.cancel_time_in_hour,
          duration_hour: experience.duration_hour,
          number_of_cabin: experience.number_of_cabin,
          capacity: experience.capacity,
          sleep_capacity: experience.sleep_capacity,
          per_day_price: experience.per_day_price,
          per_hour_price: experience.per_hour_price,
          length: experience.length,
          power: experience.power,
          engine_type: experience.engine_type,
          crew_member: experience.crew_member,
          description: experience.description,
          flag: experience.flag,
          crew_language: experience.crew_language,
          food_name: experience.food_name,
          food_price: experience.food_price,
          category: experience.category,
          subcategory: experience.subcategory,
          user_id: experience.user_id,
          latitude: experience.latitude,
          longitude: experience.longitude,
        });
        // setLocation({ lat: experience.latitude, lng: experience.longitude });
        if (experience.latitude && experience.longitude) {
          setLocation({
            lat: parseFloat(experience.latitude),
            lng: parseFloat(experience.longitude)
          });
        }
      } catch (error) {
        toast.error('Error fetching experience: ' + error.message);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchExperienceData();
  }, [id, reset]);

  const handleLocationSelect = (location) => {
    setLocation(location);
  };

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      latitude: location.lat,
      longitude: location.lng,
      yacht_image: yachtImage,
      darkimage: darkImage,
      experience_image: mainImage,
    };
    try {
      if (isEditMode) {
        await experienceService.updateExperience(id, formData);
        toast.success('Experience updated successfully!');
      } else {
        await experienceService.createExperience(formData);
        toast.success('Experience added successfully!');
      }
      navigate('/experiences'); // Redirect to experiences list
    } catch (error) {
      toast.error('Error saving experience: ' + error.message);
    }
  };

  if (initialLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-6">{isEditMode ? 'Edit' : 'Add'} Experience</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name">Name</label>
              <Input {...register('name')} error={!!errors.name} />
            </div>
            <div>
              <label htmlFor="title">Title</label>
              <Input {...register('title')} error={!!errors.title} />
            </div>
            <div>
              <label htmlFor="location">Location</label>
              <Input {...register('location')} error={!!errors.location} />
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
              <label htmlFor="guest">Guest Capacity</label>
              <Input type="number" {...register('guest')} error={!!errors.guest} />
            </div>
            <div>
              <label htmlFor="cancel_time_in_hour">Cancel Time (hours)</label>
              <Input type="number" {...register('cancel_time_in_hour')} error={!!errors.cancel_time_in_hour} />
            </div>
            <div>
              <label htmlFor="duration_hour">Duration (hours)</label>
              <Input type="number" {...register('duration_hour')} error={!!errors.duration_hour} />
            </div>
            <div>
              <label htmlFor="number_of_cabin">Number of Cabins</label>
              <Input type="number" {...register('number_of_cabin')} error={!!errors.number_of_cabin} />
            </div>
            <div>
              <label htmlFor="capacity">Capacity</label>
              <Input type="number" {...register('capacity')} error={!!errors.capacity} />
            </div>
            <div>
              <label htmlFor="sleep_capacity">Sleep Capacity</label>
              <Input type="number" {...register('sleep_capacity')} error={!!errors.sleep_capacity} />
            </div>
            <div>
              <label htmlFor="per_day_price">Per Day Price</label>
              <Input type="number" {...register('per_day_price')} error={!!errors.per_day_price} />
            </div>
            <div>
              <label htmlFor="per_hour_price">Per Hour Price</label>
              <Input type="number" {...register('per_hour_price')} error={!!errors.per_hour_price} />
            </div>
            <div>
              <label htmlFor="length">Length</label>
              <Input type="number" {...register('length')} error={!!errors.length} />
            </div>
            <div>
              <label htmlFor="power">Power</label>
              <Input type="number" {...register('power')} error={!!errors.power} />
            </div>
            <div>
              <label htmlFor="engine_type">Engine Type</label>
              <Input {...register('engine_type')} />
            </div>
            <div>
              <label htmlFor="crew_member">Crew Member</label>
              <Input {...register('crew_member')} />
            </div>
            <div className="col-span-2">
              <label htmlFor="description">Description</label>
              <Textarea cols={30} rows={5} {...register('description')} />
            </div>
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Location on Map</label>
              <div className="h-[400px] w-full rounded-lg overflow-hidden">
                <MapPicker
                  onLocationSelect={handleLocationSelect}
                  initialLocation={location}
                />
              </div>
              {location && (
                <div className="mt-2 text-sm text-gray-500">
                  Selected coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="flag">Flag</label>
              <Input {...register('flag')} />
            </div>
            <div>
              <label htmlFor="crew_language">Crew Language</label>
              <Input {...register('crew_language')} />
            </div>
            <div>
              <label htmlFor="food_name">Food Name</label>
              <Input {...register('food_name')} />
            </div>
            <div>
              <label htmlFor="food_price">Food Price</label>
              <Input type="number" {...register('food_price')} />
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <Input {...register('category')} />
            </div>
            <div>
              <label htmlFor="subcategory">Subcategory</label>
              <Input {...register('subcategory')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Yacht Image</label>
              <FileUpload
                onFilesChange={setYachtImage}
                maxFiles={1}
                acceptedFileTypes="image/*"
                containerClassName="border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dark Image</label>
              <FileUpload
                onFilesChange={setDarkImage}
                maxFiles={1}
                acceptedFileTypes="image/*"
                containerClassName="border border-gray-200 rounded-lg"
              />
            </div>
          </div>
          <div className="flex w-full">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Experience Image</label>
              <FileUpload
                onFilesChange={setMainImage}
                maxFiles={1}
                acceptedFileTypes="image/*"
                containerClassName="border border-gray-200 rounded-lg"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#BEA355] text-white px-6 py-2 float-right rounded-full hover:bg-[#A58B3D] transition-colors disabled:opacity-50"
          >
            {loading ? `${isEditMode ? 'Updating' : 'Adding'} Experience...` : `${isEditMode ? 'Update' : 'Add'} Experience`}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default AddExperience;
