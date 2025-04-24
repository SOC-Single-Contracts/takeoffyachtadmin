import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Input, Textarea } from "@material-tailwind/react";
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getBoatById, getSingleBoatById, getSingleF1BoatById } from '../../services/api/boatService';
import { getAllInclusions } from '../../services/api/inclusionsService';
import FileUpload from '../common/FileUpload';
import MapPicker from '../common/MapPicker';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { validateImage } from '../../utils/globalFunctions';
import { zodSchemaEmpty, zodSchemaf1Yachts, zodSchemaRegularYachts } from '../../utils/zodSchema';
import { f1yachtData, yachtData } from '../../utils/customizeObj';




const AddBoatGlobal = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const yachtsType = useLocation().pathname.split('/')[2];
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [notes, setNotes] = useState('');
  const [flag, setFlag] = useState('');
  const [crewLanguage, setCrewLanguage] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [inclusions, setInclusions] = useState([]);
  const [inclusion, setInclusion] = useState([]);
  const [nyInclusion, setNyInclusion] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [brandsList, setBrandsList] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [category, setCategory] = useState('');
  const [foodName, setFoodName] = useState('');
  const [foodPrice, setFoodPrice] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [featureList, setFeaturesList] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [foodOptions, setFoodOptions] = useState([]);
  const [selectedFoodOptions, setSelectedFoodOptions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [nyStatusChecked, setNyStatusChecked] = useState(false);
  const [selectedYacht,setSelectedYacht] = useState({})
  const selectedSchema =
  yachtsType === "yachts" ? zodSchemaRegularYachts : yachtsType === "f1yachts" ? zodSchemaf1Yachts : zodSchemaEmpty;
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;


  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(selectedSchema),
    defaultValues: {
      status: true,
      user_id: '1',
    }
  });
  const watchedValues = watch(); // Watches all form fields

 
  const fetchRegularBoatData = async () => {
    if (!id) {
      setInitialLoading(false);
      return;
    }

    try {
      let data;
      const response = await getSingleBoatById(id);
      data = response?.find(
        (item) => item.yacht && item.yacht.id.toString() == id
      );

      // console.log(response,data)
      setSelectedYacht(data)
      reset(yachtData(data));

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
  const fetchf1BoatData = async () => {
    if (!id) {
      setInitialLoading(false);
      return;
    }

    try {
      let data;
      const response = await getSingleF1BoatById(id);
      console.log(response)
      data = response
      // console.log(response,data)
      setSelectedYacht(data)
      reset(f1yachtData(data));

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


  useEffect(() => {


    if (yachtsType == "yachts"){
      fetchRegularBoatData();

    } else if (yachtsType == "f1yachts"){
      fetchf1BoatData()

    }
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
          setCategoriesList(response.data.category);
        }
      } catch (error) {
        console.error('Error fetching categoriesList:', error);
        setCategoriesList([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFeaturesList = async () => {
      try {
        const response = await axios.get('https://api.takeoffyachts.com/yacht/subcategory_data/');
        if (response.data.error_code === 'pass') {
          setFeaturesList(response.data.sub_category);
        }
      } catch (error) {
        console.error('Error fetching featureList:', error);
        setFeaturesList([]);
      }
    };
    fetchFeaturesList();
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
          // setBrandsList(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching brandsList:', error);
        toast.error('Failed to fetch brandsList');
      }
    };
    // fetchBrands();
  }, []);

  const handleLocationSelect = useCallback((newLocation) => {
    setLocation(newLocation);
  }, []);

  const handleSubmitYachts = async (data) => {

    console.log(data)
    try {
      if (!mainImage && !isEditMode) {
        toast.error('Please select a main yacht image');
        return;
      }

      if (!location) {
        toast.error('Please select a location on the map');
        return;
      }

      // if (!selectedBrand) {
      //   toast.error('Please select a brand');
      //   return;
      // }

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

      if (!data.length) {
        toast.error('Length is required');
        return;
      }

      if (data.ny_status && false) {
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

      if(!isEditMode){
      // Current date and time for availability
      const now = new Date();
      const availability = {
        data: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0]
      };
      formData.append('availability', JSON.stringify(availability));
      }

      Object.keys(data).forEach(key => {
        if (!['yacht_image'].includes(key)) {
          const value = key === 'status' ? String(data[key]) : data[key];
          formData.append(key, value);
        }
      });

      // Append ny_ keys only once
      // formData.append('ny_status', data.ny_status);
      if (data.ny_status && false) {
        formData.append('ny_price', data.ny_price);
        formData.append('ny_firework', data.ny_firework);
      
        const from = data.ny_availability?.from || '';
        const to = data.ny_availability?.to || '';
      
        const nyAvailabilityArray = [{ from, to }];
        const nyAvailabilityString = JSON.stringify(nyAvailabilityArray);
      
        formData.append('ny_availability', nyAvailabilityString); // ✅ Valid JSON
        formData.append('ny_inclusion', JSON.stringify(nyInclusion));
      }
      // const ny_availability = {///remove
      //   from: data?.ny_availability?.from,
      //   to: data?.ny_availability?.to,
      // };
      // formData.set('ny_availability', JSON.stringify(ny_availability));///remove

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
      formData.append('features', JSON.stringify(selectedFeatures));
      formData.append('inclusion', JSON.stringify(inclusion));
      formData.append('category', JSON.stringify(selectedCategories));
      // formData.append('food_name', foodName);
      // formData.append('food_price', foodPrice);
      // formData.append('brand_id', selectedBrand);
      if (selectedFoodOptions.length > 0) {
        formData.append('food_options', JSON.stringify(selectedFoodOptions));
      }
      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      let url ;

       url =  isEditMode
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
        navigate('/boats/yachts');
      } else {
        // Handle API validation errors
        if (error.response) {
          const { data } = error.response;
      
          // Check for detailed validation errors
          if (data.details && typeof data.details === 'object') {
            Object.entries(data.details).forEach(([field, messages]) => {
              if (Array.isArray(messages)) {
                messages.forEach((message) => {
                  toast.error(`${field}: ${message}`);
                });
              } else {
                toast.error(`${field}: ${messages}`);
              }
            });
          } else if (data.error) {
            // Display general error message
            toast.error(data.error);
          } else {
            // Fallback for unexpected error structures
            toast.error('An unexpected error occurred.');
          }
        } else {
          // Handle errors without a response (e.g., network errors)
          toast.error('Network error. Please try again.');
        }
      }
    } catch (error) {
      console.log(error)
      if (error.response) {
        const { data } = error.response;
    
        // Check for detailed validation errors
        if (data.details && typeof data.details === 'object') {
          Object.entries(data.details).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach((message) => {
                toast.error(`${field}: ${message}`);
              });
            } else {
              toast.error(`${field}: ${messages}`);
            }
          });
        } else if (data.error) {
          // Display general error message
          toast.error(data.error);
        } else {
          // Fallback for unexpected error structures
          toast.error('An unexpected error occurred.');
        }
      } else {
        // Handle errors without a response (e.g., network errors)
        toast.error('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  
  };
  const handleSubmitf1Yachts = async (data) => {

    console.log(data)
    try {
      if (!mainImage && !isEditMode) {
        toast.error('Please select a main yacht image');
        return;
      }

      if (!location) {
        toast.error('Please select a location on the map');
        return;
      }

      // if (!selectedBrand) {
      //   toast.error('Please select a brand');
      //   return;
      // }

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

      if (!data.length) {
        toast.error('Length is required');
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

      if(!isEditMode){
      // Current date and time for availability
      const now = new Date();
      const availability = {
        data: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0]
      };
      formData.append('availability', JSON.stringify(availability));
      }

      Object.keys(data).forEach(key => {
        if (!['yacht_image'].includes(key)) {
          const value = key === 'status' ? String(data[key]) : data[key];
          formData.append(key, value);
        }
      });

 


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
      formData.append('features', JSON.stringify(selectedFeatures));
      formData.append('inclusion', JSON.stringify(inclusion));
      formData.append('category', JSON.stringify(selectedCategories));
      // formData.append('food_name', foodName);
      // formData.append('food_price', foodPrice);
      // formData.append('brand_id', selectedBrand);
      if (selectedFoodOptions.length > 0) {
        formData.append('food_options', JSON.stringify(selectedFoodOptions));
      }
      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      let url ;

         url =  isEditMode
          ? `https://api.takeoffyachts.com/yacht/f1-yachts/${id}/`
          : 'https://api.takeoffyachts.com/yacht/f1-yachts/';

      const response = await axios({
        method: isEditMode ? 'put' : 'post',
        url,
        data: formData, 
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.error_code === 'pass') {
        toast.success(`f1 Yacht successfully ${isEditMode ? 'updated' : 'added'}`);
        navigate('/boats/f1yachts');

      } else {
        // Handle API validation errors
        if (response.data.error) {
          let error = response.data.error
          // const errorObj = JSON.parse(response.data.error);
          // Object.entries(errorObj).forEach(([key, errors]) => {
          //   errors.forEach(error => {
          //     toast.error(`${key}: ${error.string}`);
          //   });
          // });
          const errorArray = error.response.data?.details?.length;
          errorArray.forEach((error,key)=>{
              toast.error(`${error}`);
          });
        } else {
          toast.error('Error creating/updating yacht. Please try again.');
        }
      }
    } catch (error) {
      console.log(error)
      if (error.response?.data?.error) {
        try {
          const errorObj = JSON.parse(error.response.data.error);
          Object.entries(errorObj).forEach(([key, errors]) => {
            errors.forEach(error => {
              toast.error(`${key}: ${error.string}`);
            });
          });
          // const errorArray = error.response.data?.details?.length;
          // errorArray.forEach((error,key)=>{
          //     toast.error(`${error}`);
          // });
        } catch (e) {
          toast.error('An error occurred while processing your request');
        }
      } else {
        toast.error('An error occurred while saving the yacht');
        console.error(error)
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
    console.log(files)
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
//test
  // useEffect(() => {
  //   console.log("Form values changed:", watchedValues);
  //   console.log("errors", errors)
  //   console.log("additionalImages",additionalImages)
  //   console.log("mainImage",mainImage)
  //   console.log("selectedYacht",selectedYacht)

  // }, [watchedValues, errors, location,additionalImages,mainImage,selectedYacht]);

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BEA355]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="p-3">
      {yachtsType == "yachts" ?         <h1 className="text-3xl mt-4  px-6 font-bold mb-6 font-sora">{isEditMode ? 'Edit' : 'Add'} Boat</h1>
 : yachtsType == "f1yachts" ?         <h1 className="text-3xl mt-4  px-6 font-bold mb-6 font-sora">{isEditMode ? 'Edit' : 'Add'} f1 Boat</h1>
 :""}

        <form onSubmit={handleSubmit(yachtsType === "f1yachts" ? handleSubmitf1Yachts : yachtsType === "yachts" ? handleSubmitYachts : "")} className=" ">
          <div className="grid grid-cols-1 md:grid-cols-2 p-6  gap-6">
            <div>
              <label htmlFor="name">Name</label>
              <Input className='rounded-lg' {...register('name')} error={!!errors.name} />
            </div>
            {/* <div>
              <label htmlFor="brand_id">Brand</label>
              <div className="relative">
                <button
                  className="block w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BEA355]"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {selectedBrand ? brandsList.find(brand => brand.id === selectedBrand)?.title : 'Select a brand'}
                </button>
                {dropdownOpen && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1">
                    {brandsList.map((brand, index) => (
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
            </div> */}
            <div>
              <label htmlFor="title">Title</label>
              <Input className='rounded-lg' {...register('title')} error={!!errors.title} />
            </div>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 p-6  gap-6">

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
            {errors.length && <p className="text-red-500 text-sm">{errors.length.message}</p>}

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
            {yachtsType == "yachts" && false &&   <div className='flex items-center gap-2'>
              <label htmlFor="ny_status">New Year Status</label>
              <input
                type="checkbox"
                {...register('ny_status')}
                onChange={(e) => {
                  setNyStatusChecked(e.target.checked);
                  // console.log('NY Status Checked:', e.target.checked);
                }}
                className="form-checkbox h-5 w-5 text-[#BEA355]"
              />
            </div>}
          
            {nyStatusChecked && yachtsType == "yachts" && false && (
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
                      // console.log('NY Firework Checked:', e.target.checked);
                    }}
                    className="form-checkbox h-5 w-5 text-[#BEA355]"
                  />
                </div>
                <div>
                  <label htmlFor="ny_availability">New Year Availability</label>
                  <div className="flex space-x-2">
                    <Input className='rounded-lg' type="time" {...register('ny_availability.from')}
                    //  error={!!errors.ny_availability} 
                     />
                    <Input className='rounded-lg' type="time" {...register('ny_availability.to')} 
                    //  error={!!errors.ny_availability}
                     />
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
            <div className="col-span-">
              <label htmlFor="description">Description</label>
              <Textarea className='rounded-lg' cols={30} rows={5} {...register('description')} error={!!errors.description} />
            </div>

            <div className="col-span- mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <ReactQuill value={notes} onChange={setNotes} />
            </div>

            <div className="col-span- mb-4">
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
         
       
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 p-6  gap-6">
          <div>
              <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-2">Features</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {featureList.map((feature, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setSelectedFeatures(prev =>
                        prev.includes(feature)
                          ? prev.filter(f => f !== feature)
                          : [...prev, feature]
                      )
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                      ${selectedFeatures.includes(feature)
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
                {categoriesList.map((category, index) => (
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

<div className="grid grid-cols-1 md:grid-cols-2 p-6  gap-6">
<div className="">
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Yacht Image (Required)</label>
              <FileUpload
                onFilesChange={handleMainImageChange}
                maxFiles={1}
                acceptedFileTypes="image/*"
                containerClassName="border border-gray-200 rounded-lg"
              />
            </div>
            <div className="">
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
            className="bg-[#BEA355] my-4 text-white px-6 py-2 float-right rounded-full hover:bg-[#A58B3D] transition-colors disabled:opacity-50"
          >
            

            {yachtsType == "yachts" ? loading ? `${isEditMode ? 'Updating' : 'Adding'} Boat...` : `${isEditMode ? 'Update' : 'Add'} Boat` : yachtsType == "f1yachts" ? loading ? `${isEditMode ? 'Updating' : 'Adding'} Boat...` : `${isEditMode ? 'Update' : 'Add'} F1 Boat` :""}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default AddBoatGlobal;