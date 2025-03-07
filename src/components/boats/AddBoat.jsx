import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Input, Textarea } from "@material-tailwind/react";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getBoatById } from '../../services/api/boatService';
import { getAllInclusions } from '../../services/api/inclusionsService';
import FileUpload from '../common/FileUpload';
import MapPicker from '../common/MapPicker';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
  length: z.any().optional(),
  power: z.string().optional(),
  engine_type: z.string().optional(),
  crew_member: z.string().optional(),
  notes: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  food_name: z.string().optional(),
  food_price: z.string().transform(val => val ? Number(val) : undefined).optional(),
  menucategory: z.string().optional(),
  inclusion: z.array(z.string()).optional(),
  user_id: z.string().optional(),
  category_name: z.string().optional(),
  yacht_name: z.string().optional(),
  flag: z.string().optional(),
  crew_language: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  features: z.array(z.string()).optional(),
  brand_id: z.string().optional(),
  ny_price: z.string().transform(val => Number(val)).pipe(z.number().positive()).optional(),
  ny_firework: z.boolean().optional(),
  ny_status: z.boolean().optional(),
  ny_availability: z.object({
    from: z.string(),
    to: z.string(),
  }).optional(),
  ny_inclusion: z.array(z.string()).optional(),
});

const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const validateImage = (file) => {
  if (!file) return null;
  
  if (!VALID_IMAGE_TYPES.includes(file.type)) {
    return 'File must be an image (JPEG, PNG, GIF, or WEBP)';
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return 'Image size must be less than 5MB';
  }
  
  return null;
};

const AddBoat = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [notes, setNotes] = useState('');
  const [flag, setFlag] = useState('');
  const [crewLanguage, setCrewLanguage] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [features, setFeatures] = useState([]);
  const [inclusions, setInclusions] = useState([]);
  const [inclusion, setInclusion] = useState([]);
  const [nyInclusion, setNyInclusion] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [category, setCategory] = useState('');
  const [foodName, setFoodName] = useState('');
  const [foodPrice, setFoodPrice] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [foodOptions, setFoodOptions] = useState([]);
  const [selectedFoodOptions, setSelectedFoodOptions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [nyStatusChecked, setNyStatusChecked] = useState(false);

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
        const formData = {
          ...data.yacht,
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
        
        if (data.yacht.latitude && data.yacht.longitude) {
          setLocation({
            lat: parseFloat(data.yacht.latitude),
            lng: parseFloat(data.yacht.longitude)
          });
        }
      } catch (error) {
        console.error('Error fetching boat data:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchBoatData();
  }, [id, reset]);

  useEffect(() => {
    const fetchInclusions = async () => {
      try {
        const data = await getAllInclusions();
        setInclusions(data);
      } catch (error) {
        console.error('Error fetching inclusions:', error);
      }
    };
    fetchInclusions();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://api.takeoffyachts.com/yacht/category_data/');
        if (response.data.error_code === 'pass') {
          setCategories(response.data.category);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]); 
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get('https://api.takeoffyachts.com/yacht/subcategory_data/');
        if (response.data.error_code === 'pass') {
          setSubcategories(response.data.sub_category);
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        setSubcategories([]);
      }
    };
    fetchSubcategories();
  }, []);

  useEffect(() => {
    const fetchFoodOptions = async () => {
      try {
        const response = await axios.get('https://api.takeoffyachts.com/yacht/food/');
        if (response.data.error_code === 'pass') {
          setFoodOptions(response.data.extra);
        }
      } catch (error) {
        console.error('Error fetching food options:', error);
      }
    };
    fetchFoodOptions();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get('https://api.takeoffyachts.com/yacht/brand/');
        if (response.data.error_code === 'pass') {
          setBrands(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
        toast.error('Failed to fetch brands');
      }
    };
    fetchBrands();
  }, []);

  const handleLocationSelect = useCallback((newLocation) => {
    setLocation(newLocation);
  }, []);

  const onSubmit = async (data) => {
    try {
      if (!mainImage && !isEditMode) {
        toast.error('Please select a main yacht image');
        return;
      }

      if (!location) {
        toast.error('Please select a location on the map');
        return;
      }

      if (!selectedBrand) {
        toast.error('Please select a brand');
        return;
      }

      // Validate main image
      if (mainImage) {
        const mainImageError = validateImage(mainImage.file);
        if (mainImageError) {
          toast.error(`Main image error: ${mainImageError}`);
          return;
        }
      }

      // Validate additional images
      const imageErrors = [];
      additionalImages.forEach((img, index) => {
        const error = validateImage(img.file);
        if (error) {
          imageErrors.push(`Image ${index + 1}: ${error}`);
        }
      });

      if (imageErrors.length > 0) {
        imageErrors.forEach(error => toast.error(error));
        return;
      }

      if (data.ny_status) {
        // Validate ny_ fields only if ny_status is checked
        if (!data.ny_price) {
          toast.error('New Year Price is required when NY Status is checked');
          return;
        }
        if (!data.ny_availability) {
          toast.error('New Year Availability is required when NY Status is checked');
          return;
        }
        if (!data.ny_availability.from) {
          toast.error('New Year Availability From is required when NY Status is checked');
          return;
        }
        if (!data.ny_availability.to) {
          toast.error('New Year Availability To is required when NY Status is checked');
          return;
        }
      }

      setLoading(true);
      const formData = new FormData();
      
      // Current date and time for availability
      const now = new Date();
      const availability = {
        data: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0]
      };
      formData.append('availability', JSON.stringify(availability));
      
      Object.keys(data).forEach(key => {
        if (!['yacht_image'].includes(key)) {
          const value = key === 'status' ? String(data[key]) : data[key];
          formData.append(key, value);
        }
      });

      // Append ny_ keys only once
      formData.append('ny_status', data.ny_status);
      if (data.ny_status) {
        formData.append('ny_price', data.ny_price); // Only append if it exists
        formData.append('ny_firework', data.ny_firework);
        const ny_availability = {
          from: data.ny_availability.from,
          to: data.ny_availability.to,
        };
        formData.append('ny_availability', JSON.stringify(ny_availability));
        formData.append('ny_inclusion', JSON.stringify(nyInclusion)); // Use nyInclusion state
      }
      formData.append('latitude', location.lat);
      formData.append('longitude', location.lng);
      if (mainImage) {
        formData.append('yacht_image', mainImage.file);
      }

      // Append additional images
      additionalImages.forEach((img, index) => {
        formData.append(`image${index + 1}`, img.file);
      });
      formData.append('notes', notes);
      formData.append('flag', flag);
      formData.append('crew_language', crewLanguage);
      formData.append('from_date', fromDate);
      formData.append('to_date', toDate);
      formData.append('features', JSON.stringify(features));
      formData.append('inclusion', JSON.stringify(inclusion));
      formData.append('category', JSON.stringify(selectedCategories));
      formData.append('food_name', foodName);
      formData.append('food_price', foodPrice);
      formData.append('brand_id', selectedBrand);
      if (selectedFoodOptions.length > 0) {
        formData.append('food_options', JSON.stringify(selectedFoodOptions));
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
        toast.success(`Yacht successfully ${isEditMode ? 'updated' : 'added'}`);
        navigate('/boats');
      } else {
        // Handle API validation errors
        if (response.data.error) {
          const errorObj = JSON.parse(response.data.error);
          Object.entries(errorObj).forEach(([key, errors]) => {
            errors.forEach(error => {
              toast.error(`${key}: ${error.string}`);
            });
          });
        } else {
          toast.error('Error creating/updating yacht. Please try again.');
        }
      }
    } catch (error) {
      if (error.response?.data?.error) {
        try {
          const errorObj = JSON.parse(error.response.data.error);
          Object.entries(errorObj).forEach(([key, errors]) => {
            errors.forEach(error => {
              toast.error(`${key}: ${error.string}`);
            });
          });
        } catch (e) {
          toast.error('An error occurred while processing your request');
        }
      } else {
        toast.error('An error occurred while saving the yacht');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMainImageChange = useCallback((files) => {
    if (files.length > 0) {
      const error = validateImage(files[0].file);
      if (error) {
        toast.error(`Main image error: ${error}`);
        return;
      }
      setMainImage(files[0]);
    } else {
      setMainImage(null);
    }
  }, []);

  const handleAdditionalImagesChange = useCallback((files) => {
    // Validate each file
    const validFiles = files.filter((file, index) => {
      const error = validateImage(file.file);
      if (error) {
        toast.error(`Additional image ${index + 1}: ${error}`);
        return false;
      }
      return true;
    });

    setAdditionalImages(validFiles.slice(0, 20));
  }, []);

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
        <h1 className="text-3xl font-bold mb-6 font-sora">{isEditMode ? 'Edit' : 'Add'} Boat</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <label htmlFor="name">Name</label>
            <Input className='rounded-lg' {...register('name')} error={!!errors.name} />
            </div>
            <div>
            <label htmlFor="brand_id">Brand</label>
            <div className="relative">
              <button
                className="block w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BEA355]"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {selectedBrand ? brands.find(brand => brand.id === selectedBrand)?.title : 'Select a brand'}
              </button>
              {dropdownOpen && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1">
                  {brands.map((brand, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedBrand(brand.id);
                        setDropdownOpen(false);
                      }}
                      className="cursor-pointer hover:bg-gray-100 py-2 px-4 rounded-lg"
                    >
                      {brand.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
            </div>
            <div>
            <label htmlFor="title">Title</label>
            <Input className='rounded-lg' {...register('title')} error={!!errors.title} />
            </div>
            <div>
            <label htmlFor="location">Location</label>
            <Input className='rounded-lg' {...register('location')} error={!!errors.location} />
            </div>
            <div>
            <label htmlFor="min_price">Min Price</label>
            <Input className='rounded-lg' type="number" {...register('min_price')} error={!!errors.min_price} />
            </div>
            <div>
            <label htmlFor="max_price">Max Price</label>
            <Input className='rounded-lg' type="number" {...register('max_price')} error={!!errors.max_price} />
            </div>
            <div>
            <label htmlFor="guest">Guest Capacity</label>
            <Input className='rounded-lg' type="number" {...register('guest')} error={!!errors.guest} />
            </div>
            <div>
            <label htmlFor="cancel_time_in_hour">Cancel Time (hours)</label>
            <Input className='rounded-lg' type="number" {...register('cancel_time_in_hour')} error={!!errors.cancel_time_in_hour} />
            </div>
            <div>
            <label htmlFor="duration_hour">Duration (hours)</label>
            <Input className='rounded-lg' type="number" {...register('duration_hour')} error={!!errors.duration_hour} />
            </div>
            <div>
            <label htmlFor="duration_minutes">Duration (minutes)</label>
            <Input className='rounded-lg' type="number" {...register('duration_minutes')} error={!!errors.duration_minutes} />
            </div>
            <div>
            <label htmlFor="number_of_cabin">Number of Cabins</label>
            <Input className='rounded-lg' type="number" {...register('number_of_cabin')} error={!!errors.number_of_cabin} />
            </div>
            <div>
            <label htmlFor="capacity">Capacity</label>
            <Input className='rounded-lg' type="number" {...register('capacity')} error={!!errors.capacity} />
            </div>
            <div>
            <label htmlFor="sleep_capacity">Sleep Capacity</label>
            <Input className='rounded-lg' type="number" {...register('sleep_capacity')} error={!!errors.sleep_capacity} />
            </div>
            <div>
            <label htmlFor="per_day_price">Per Day Price</label>
            <Input className='rounded-lg' type="number" {...register('per_day_price')} error={!!errors.per_day_price} />
            </div>
            <div>
            <label htmlFor="per_hour_price">Per Hour Price</label>
            <Input className='rounded-lg' type="number" {...register('per_hour_price')} error={!!errors.per_hour_price} />
            </div>
            <div>
            <label htmlFor="length">Length</label>
            <Input className='rounded-lg' type="number" {...register('length')} error={!!errors.length} />
            </div>
            <div>
            <label htmlFor="power">Power</label>
            <Input className='rounded-lg' type="number" {...register('power')} error={!!errors.power} />
            </div>
            <div>
            <label htmlFor="engine_type">Engine Type</label>
            <Input className='rounded-lg' {...register('engine_type')} error={!!errors.engine_type} />
            </div>
            <div>
            <label htmlFor="crew_member">Crew Member</label>
            <Input className='rounded-lg' {...register('crew_member')} error={!!errors.crew_member} />
            </div>
            <div className='flex items-center gap-2'>
            <label htmlFor="ny_status">New Year Status</label>
            <input 
              type="checkbox" 
              {...register('ny_status')} 
              onChange={(e) => {
                setNyStatusChecked(e.target.checked);
                console.log('NY Status Checked:', e.target.checked);
              }} 
              className="form-checkbox h-5 w-5 text-[#BEA355]"
            />
          </div>
          {nyStatusChecked && (
            <>
          <div>
            <label htmlFor="ny_price">New Year Price</label>
            <Input className='rounded-lg' type="number" {...register('ny_price')} error={!!errors.ny_price} />
          </div>
          <div className='flex items-center gap-2'>
            <label htmlFor="ny_firework">New Year Firework</label>
            <input 
              type="checkbox" 
              {...register('ny_firework')} 
              onChange={(e) => {
                console.log('NY Firework Checked:', e.target.checked);
              }} 
              className="form-checkbox h-5 w-5 text-[#BEA355]"
            />
          </div>
          <div>
            <label htmlFor="ny_availability">New Year Availability</label>
            <div className="flex space-x-2">
              <Input className='rounded-lg' type="time" {...register('ny_availability.from')} />
              <Input className='rounded-lg' type="time" {...register('ny_availability.to')} />
            </div>
            {errors.ny_availability && <p className="text-red-500 text-sm">{errors.ny_availability.message}</p>}
          </div>
          <div>
            <label htmlFor="ny_inclusion" className="block text-sm font-medium text-gray-700 mb-2">New Year Inclusion</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {inclusions.map((inc) => (
                <button
                  key={inc.id}
                  type="button"
                  onClick={() => {
                    setNyInclusion(prev => 
                      prev.includes(inc.id)
                        ? prev.filter(i => i !== inc.id)
                        : [...prev, inc.id]
                    );
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${nyInclusion.includes(inc.id) ? 'bg-[#BEA355] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {inc.name}
                </button>
              ))}
            </div>
          </div>
          </>
            )}
            <div className="col-span-2">
              <label htmlFor="description">Description</label>
              <Textarea className='rounded-lg' cols={30} rows={5} {...register('description')} error={!!errors.description} />
            </div>
            
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <ReactQuill value={notes} onChange={setNotes} />
            </div>
            
            <div className="col-span-2 mb-4">
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
            
            <div>
              <label htmlFor="flag">Flag</label>
              <Input className='rounded-lg' value={flag} onChange={(e) => setFlag(e.target.value)} />
            </div>
            <div>
              <label htmlFor="crew_language">Crew Language</label>
              <Input className='rounded-lg' value={crewLanguage} onChange={(e) => setCrewLanguage(e.target.value)} />
            </div>
            <div>
              <label htmlFor="from_date">From Date</label>
              <Input className='rounded-lg' type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div>
              <label htmlFor="to_date">To Date</label>
              <Input className='rounded-lg' type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
            <div>
              <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-2">Features</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {subcategories.map((feature, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setFeatures(prev => 
                        prev.includes(feature)
                          ? prev.filter(f => f !== feature)
                          : [...prev, feature]
                      )
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                      ${features.includes(feature)
                        ? 'bg-[#BEA355] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="inclusion" className="block text-sm font-medium text-gray-700 mb-2">Inclusion</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {inclusions.map((inc) => (
                  <button
                    key={inc.id}
                    type="button"
                    onClick={() => {
                      setInclusion(prev => 
                        prev.includes(inc.id)
                          ? prev.filter(i => i !== inc.id)
                          : [...prev, inc.id]
                      );
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${inclusion.includes(inc.id) ? 'bg-[#BEA355] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {inc.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setSelectedCategories(prev => 
                        prev.includes(category)
                          ? prev.filter(c => c !== category)
                          : [...prev, category]
                      )
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                      ${selectedCategories.includes(category)
                        ? 'bg-[#BEA355] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="food_options" className="block text-sm font-medium text-gray-700 mb-2">Food Options</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {foodOptions.map((food) => (
                  <button
                    key={food.id}
                    type="button"
                    onClick={() => {
                      setSelectedFoodOptions(prev => 
                        prev.includes(food.name)
                          ? prev.filter(f => f !== food.name)
                          : [...prev, food.name]
                      )
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                      ${selectedFoodOptions.includes(food.name)
                        ? 'bg-[#BEA355] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {food.name} - ${food.price}
                  </button>
                ))}
              </div>
            </div>

          </div>
          <div className="flex w-full">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Yacht Image (Required)</label>
                <FileUpload
                  onFilesChange={handleMainImageChange}
                  maxFiles={1}
                  acceptedFileTypes="image/*"
                  containerClassName="border border-gray-200 rounded-lg"
                />
              </div>
              <div className="w-full ml-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">More Yacht Images</label>
                <FileUpload
                  onFilesChange={handleAdditionalImagesChange}
                  maxFiles={20}
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
            {loading ? `${isEditMode ? 'Updating' : 'Adding'} Boat...` : `${isEditMode ? 'Update' : 'Add'} Boat`}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default AddBoat;