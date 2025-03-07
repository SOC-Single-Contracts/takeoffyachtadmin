import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Input, Textarea, Select, Option } from "@material-tailwind/react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getBoatById, getSingleF1BoatById } from '../../services/api/boatService';
import { toast } from 'react-toastify';
import MapPicker from '../common/MapPicker';
import { useAuth } from '../../context/AuthContext';

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
  length: z.unknown().optional(),
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

const AddF1Boat = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [location, setLocation] = useState(null);


  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      status: true,
      user_id: '1',
    }
  });
  const watchedValues = watch(); // Watches all form fields

  useEffect(() => {
    const fetchBoatData = async () => {
      if (!id) {
        setInitialLoading(false);
        return;
      }


      try {
        const data = await getSingleF1BoatById(id);
        // Transform the data to match form fields
        const formData = {
          ...data,
          // Convert number fields to strings for the form
          min_price: String(data.min_price),
          max_price: String(data.max_price),
          guest: String(data.guest),
          cancel_time_in_hour: String(data.cancel_time_in_hour),
          // duration_hour: String(data.duration_hour),
          // duration_minutes: String(data.duration_minutes),
          latitude: String(data?.latitude),
          longitude: String(data?.longitude),
          number_of_cabin: String(data.number_of_cabin),
          capacity: String(data.capacity),
          sleep_capacity: String(data.sleep_capacity),
          per_day_price: String(data.per_day_price),
        };
        reset(formData);
        if (data.latitude && data.longitude) {
          setLocation({ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) });
        }
      } catch (error) {
        console.error('Error fetching boat data:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchBoatData();
  }, [id, reset]);

  const handleLocationSelect = useCallback((newLocation) => {
    setLocation(newLocation);
  }, []);
  //test
  useEffect(() => {
    // console.log("Form values changed:", watchedValues);
    console.log("errors", errors)
  }, [watchedValues, errors, location]);

  const onSubmit = async (data) => {
    if (!location) {
      toast.error('Please select a location on the map');
      return;
    }
    if (data?.yacht_image?.length <= 0) {
      toast.error('Please select a main yacht image');
      return;
    }
    if (data?.darkimage?.length <= 0) {
      toast.error('Please select a dark image');
      return;
    }
    if (data?.lightimage?.length <= 0) {
      toast.error('Please select a main light image');
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();

      // Add features for F1 boat
      const features = {
        'f1': 'true'
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
      // Include location from map

      formData.append('latitude', location.lat);
      formData.append('longitude', location.lng);
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
        ? `https://api.takeoffyachts.com/yacht/f1-yachts-details/${id}/`
        : 'https://api.takeoffyachts.com/yacht/f1-yachts/';
      const response = await axios({
        method: isEditMode ? 'put' : 'post',
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user?.token}`,
        },
      });

      console.log(response)

      if (response.data.error_code === 'pass') {
        navigate('/boats/f1');
      }else if(response.status == 200 && isEditMode){
        navigate('/boats/f1');

      } else {
        console.error('Error creating/updating yacht:', response.data.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(`Failed to update'${error}`)

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
      <Card className="px-6 py-14">
        <h1 className="text-3xl font-bold mb-6 font-sora">{isEditMode ? 'Edit' : 'Add'} F1 Boat</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="">

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label htmlFor="name">Name</label>
                <Input className='rounded-lg' {...register('name')} error={!!errors.name} />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="title">Title</label>
                <Input {...register('title')} error={!!errors.title} />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>

              <div>
                <label htmlFor="location">Location</label>
                <Input {...register('location')} error={!!errors.location} />
                {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
              </div>

              <div>
                <label htmlFor="min_price">Min Price</label>
                <Input type="number" {...register('min_price')} error={!!errors.min_price} />
                {errors.min_price && <p className="text-red-500 text-sm">{errors.min_price.message}</p>}
              </div>

              <div>
                <label htmlFor="max_price">Max Price</label>
                <Input type="number" {...register('max_price')} error={!!errors.max_price} />
                {errors.max_price && <p className="text-red-500 text-sm">{errors.max_price.message}</p>}
              </div>

              <div>
                <label htmlFor="guest">Guest Capacity</label>
                <Input type="number" {...register('guest')} error={!!errors.guest} />
                {errors.guest && <p className="text-red-500 text-sm">{errors.guest.message}</p>}
              </div>

              <div>
                <label htmlFor="cancel_time_in_hour">Cancel Time (hours)</label>
                <Input type="number" {...register('cancel_time_in_hour')} error={!!errors.cancel_time_in_hour} />
                {errors.cancel_time_in_hour && <p className="text-red-500 text-sm">{errors.cancel_time_in_hour.message}</p>}
              </div>

              <div>
                <label htmlFor="duration_hour">Duration (hours)</label>
                <Input type="number" {...register('duration_hour')} error={!!errors.duration_hour} />
                {errors.duration_hour && <p className="text-red-500 text-sm">{errors.duration_hour.message}</p>}
              </div>

              <div>
                <label htmlFor="duration_minutes">Duration (minutes)</label>
                <Input type="number" {...register('duration_minutes')} error={!!errors.duration_minutes} />
                {errors.duration_minutes && <p className="text-red-500 text-sm">{errors.duration_minutes.message}</p>}
              </div>

              <div>
                <label htmlFor="number_of_cabin">Number of Cabins</label>
                <Input type="number" {...register('number_of_cabin')} error={!!errors.number_of_cabin} />
                {errors.number_of_cabin && <p className="text-red-500 text-sm">{errors.number_of_cabin.message}</p>}
              </div>

              <div>
                <label htmlFor="capacity">Capacity</label>
                <Input type="number" {...register('capacity')} error={!!errors.capacity} />
                {errors.capacity && <p className="text-red-500 text-sm">{errors.capacity.message}</p>}
              </div>

              <div>
                <label htmlFor="sleep_capacity">Sleep Capacity</label>
                <Input type="number" {...register('sleep_capacity')} error={!!errors.sleep_capacity} />
                {errors.sleep_capacity && <p className="text-red-500 text-sm">{errors.sleep_capacity.message}</p>}
              </div>

              <div>
                <label htmlFor="per_day_price">Per Day Price</label>
                <Input type="number" {...register('per_day_price')} error={!!errors.per_day_price} />
                {errors.per_day_price && <p className="text-red-500 text-sm">{errors.per_day_price.message}</p>}
              </div>

              <div>
                <label htmlFor="length">Length</label>
                <Input {...register('length')} />
                {errors?.length && <p className="text-red-500 text-sm">{errors?.length.message}</p>}
              </div>

              <div>
                <label htmlFor="power">Power</label>
                <Input {...register('power')} />
                {errors.power && <p className="text-red-500 text-sm">{errors.power.message}</p>}
              </div>

              <div>
                <label htmlFor="engine_type">Engine Type</label>
                <Input {...register('engine_type')} />
                {errors.engine_type && <p className="text-red-500 text-sm">{errors.engine_type.message}</p>}
              </div>

              <div>
                <label htmlFor="crew_member">Crew Member</label>
                <Input {...register('crew_member')} />
                {errors.crew_member && <p className="text-red-500 text-sm">{errors.crew_member.message}</p>}
              </div>

              <div>
                <label htmlFor="description">Description</label>
                <Textarea {...register('description')} />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>

              <div>
                <label htmlFor="notes">Notes</label>
                <Textarea {...register('notes')} />
                {errors.notes && <p className="text-red-500 text-sm">{errors.notes.message}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Location on Map</label>
                <div className="h-[450px] w-full overflow-hidden">
                  <MapPicker
                    onLocationSelect={handleLocationSelect}
                    initialLocation={location}
                  />
                </div>
                {location && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    Selected Coordinates:
                    <div className="bg-blue-100 text-blue-800 text-sm font-medium py-1 px-3 rounded-full shadow-md">
                      Latitude: {location.lat.toFixed(6)}
                    </div>
                    <div className="bg-green-100 text-green-800 text-sm font-medium py-1 px-3 rounded-full shadow-md">
                      Longitude: {location.lng.toFixed(6)}
                    </div>
                  </div>
                )}
              </div>

              <div className=''>
                <label className="block text-sm font-medium text-gray-700">Yacht Image *</label>
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
                {errors.yacht_image && <p className="text-red-500 text-sm">{errors.yacht_image.message}</p>}
              </div>

              <div className='mt-3'>
                <label className="block text-sm font-medium text-gray-700">Dark Image *</label>
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
                {errors.darkimage && <p className="text-red-500 text-sm">{errors.darkimage.message}</p>}

              </div>

              <div className='mt-3'>
                <label className="block text-sm font-medium text-gray-700">Light Image *</label>
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
                {errors.lightimage && <p className="text-red-500 text-sm">{errors.lightimage.message}</p>}

              </div>
            </div>


          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#BEA355] text-white px-6 py-2 float-right rounded-full hover:bg-[#A58B3D] transition-colors disabled:opacity-50"
          >
            {loading ? `${isEditMode ? 'Updating' : 'Adding'} F1 Boat...` : `${isEditMode ? 'Update' : 'Add'} F1 Boat`}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default AddF1Boat;