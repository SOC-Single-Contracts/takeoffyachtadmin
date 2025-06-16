import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Input, Textarea } from "@material-tailwind/react";
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getBoatById, getSingleBoatById, getSingleF1BoatById } from '../../services/api/boatService';
import { getAllInclusions } from '../../services/api/inclusionsService';
import FileUpload from '../common/ImagesUploader/FileUpload';
import MapPicker from '../common/MapPicker';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { validateImage } from '../../utils/globalFunctions';
import { f1yachtData, f1YachtsStatesUpdates, regularYachtsStatesUpdates, yachtData } from '../../utils/customizeObj';
import ImageUploadGallery from '../common/imageGallery/imageuploadGallery';
import FileUploadOld from '../common/FileUploadold';
import FileUploadSingle from '../common/FileUploadSingle';
import { format, parse } from 'date-fns';
import { getS3PathOnly } from '../../utils/helper';
import { zodSchemaf1Experiences, zodSchemaRegularExperiences, zodSchemaEmpty } from '../../utils/zodSchemaExperience';
import { experienceData, f1experienceData, f1experiencesStatesUpdates, regularexperiencesStatesUpdates } from '../../utils/customizeObjExperience';


const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.takeoffyachts.com';



const AddExperienceGlobal = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const yachtsType = useLocation().pathname.split('/')[2];
  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [locationLatLng, setLocationLatLng] = useState(null);
  const [meetPointLatLng, setMeetPointLatLng] = useState(null);
  const [carParkingLatLng, setCarParkingLatLng] = useState(null);
  const [taxiLatLng, setTaxiLatLng] = useState(null);
  const [meetingPoint, setMeetingPoint] = useState("");
  const [yachtLocationLink, setyachtLocationLink] = useState("");
  const [carParking, setcarParking] = useState("")
  const [taxiDropOff, settaxiDropOff] = useState("")
  const [notes, setNotes] = useState('');
  const [flag, setFlag] = useState('');
  const [crewLanguage, setCrewLanguage] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [inclusions, setInclusions] = useState([]);
  const [selectedInclusion, setSelectedInclusion] = useState([]);
  const [selectednyInclusion, setSelectedNyInclusion] = useState([]);
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
  const [selectedYacht, setSelectedYacht] = useState({})
  const [debuggingObject, setDebuggingObject] = useState({})
  const [cities, setCities] = useState([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(true);
  const selectedSchema =
    yachtsType === "regular-exp" ? zodSchemaRegularExperiences : yachtsType === "f1-exp" ? zodSchemaf1Experiences : zodSchemaEmpty;
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [durationMinutesList, setDurationMinutesList] = useState([{
    name: "30 Mins",
    value: 0.5
  },
  {
    name: "60 Mins",
    value: 1
  },
  {
    name: "90 Mins",
    value: 1.5
  },
  {
    name: "120 Mins",
    value: 2
  }
  ])


  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(selectedSchema),
    defaultValues: {
      status: true,
      user_id: '1',
      location: '',
    }
  });
  const watchedValues = watch(); // Watches all form fields


  const fetchRegularBoatData = async () => {
    if (!id) {
      setInitialLoading(false);
      return;
    }

    try {
      const response = await fetch(`${'https://api.takeoffyachts.com'}/yacht/get_experience/1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },

      });

      if (!response.ok) {
        throw new Error('Failed to fetch experience');
      }
      let apiResponse = await response.json();
      const newData = apiResponse?.data;
      const data = newData?.find(
        (item) => item?.experience && item?.experience.id.toString() == id
      );
      setSelectedYacht(data);
      reset(experienceData(data));

      const updates = regularexperiencesStatesUpdates(data);


      if (updates?.locationLatLng) setLocationLatLng(updates?.locationLatLng);
      if (updates?.meetPointLatLng) setMeetPointLatLng(updates?.meetPointLatLng);
      if (updates?.carParkingLatLng) setCarParkingLatLng(updates?.carParkingLatLng);
      if (updates?.taxiLatLng) setTaxiLatLng(updates?.taxiLatLng);
      if (updates?.meetingPoint) setMeetingPoint(updates?.meetingPoint);
      if (updates?.yachtLocationLink) setyachtLocationLink(updates?.yachtLocationLink);
      if (updates?.carParking) setcarParking(updates?.carParking);
      if (updates?.taxiDropOff) settaxiDropOff(updates?.taxiDropOff);
      if (updates?.additionalImages) setAdditionalImages(updates?.additionalImages);
      if (updates?.mainImage) setMainImage(updates?.mainImage);
      if (updates?.crewLanguage) setCrewLanguage(updates?.crewLanguage);
      if (updates?.flag) setFlag(updates?.flag);
      if (updates?.selectedFeatures) setSelectedFeatures(updates?.selectedFeatures);
      if (updates?.selectedCategories) setSelectedCategories(updates?.selectedCategories);
      if (updates?.selectedInclusion) setSelectedInclusion(updates?.selectedInclusion);
      if (updates?.selectedFoodOptions) setSelectedFoodOptions(updates?.selectedFoodOptions);
      if (updates?.from_date) setFromDate(updates?.from_date);
      if (updates?.to_date) setToDate(updates?.to_date);
      if (updates?.selectednyInclusion) setSelectedNyInclusion(updates?.selectednyInclusion);




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
      // const response = await getSingleF1BoatById(id);
      // data = response;
      const response = await getSingleBoatById(id, yachtsType == "f1-exp" ? "f1-exp" : "regular");
      data = response?.find(item => item.yacht && item.yacht.id.toString() == id);
      setSelectedYacht(data);
      reset(f1experienceData(data));

      const updates = f1experiencesStatesUpdates(data);

      if (updates?.locationLatLng) setLocationLatLng(updates?.locationLatLng);
      if (updates?.meetPointLatLng) setMeetPointLatLng(updates?.meetPointLatLng);
      if (updates?.carParkingLatLng) setCarParkingLatLng(updates?.carParkingLatLng);
      if (updates?.taxiLatLng) setTaxiLatLng(updates?.taxiLatLng);
      if (updates?.meetingPoint) setMeetingPoint(updates?.meetingPoint);
      if (updates?.yachtLocationLink) setyachtLocationLink(updates?.yachtLocationLink);
      if (updates?.carParking) setcarParking(updates?.carParking);
      if (updates?.taxiDropOff) settaxiDropOff(updates?.taxiDropOff);
      if (updates?.additionalImages) setAdditionalImages(updates?.additionalImages);
      if (updates?.mainImage) setMainImage(updates?.mainImage);
      if (updates?.crewLanguage) setCrewLanguage(updates?.crewLanguage);
      if (updates?.flag) setFlag(updates?.flag);
      if (updates?.selectedFeatures) setSelectedFeatures(updates?.selectedFeatures);
      if (updates?.selectedCategories) setSelectedCategories(updates?.selectedCategories);
      if (updates?.selectedInclusion) setSelectedInclusion(updates?.selectedInclusion);
      if (updates?.selectedFoodOptions) setSelectedFoodOptions(updates?.selectedFoodOptions);
      if (updates?.from_date) setFromDate(updates?.from_date);
      if (updates?.to_date) setToDate(updates?.to_date);
    } catch (error) {
      console.error('Error fetching boat data:', error);
    } finally {
      setInitialLoading(false);
    }
  };


  useEffect(() => {



    if (yachtsType == "regular-exp") {
      fetchRegularBoatData();

    } else if (yachtsType == "f1-exp") {
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
        if (response?.data?.error_code === 'pass') {
          setCategoriesList(response?.data?.category);
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
        // const response = await axios.get('https://api.takeoffyachts.com/yacht/subcategory_data/');
        const response = await axios.get('https://api.takeoffyachts.com/yacht/feature-images/');
        // console.log("response",response)
        if (response?.data?.error_code === 'pass') {
          setFeaturesList(response?.data?.data);
        }
        // if (response?.data?.error_code === 'pass') {
        //   setFeaturesList(response?.data?.sub_category);
        // // }
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
        if (response?.data?.error_code === 'pass') {
          const categories = ['extra', 'food', 'sport', 'misc'];
          const allOptions = [];

          categories.forEach(category => {
            if (Array.isArray(response.data[category])) {
              allOptions.push(...response.data[category]);
            }
          });

          setFoodOptions(allOptions);
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
        if (response?.data?.error_code === 'pass') {
          // setBrandsList(response?.data?.data);
        }
      } catch (error) {
        console.error('Error fetching brandsList:', error);
        toast.error('Failed to fetch brandsList');
      }
    };
    // fetchBrands();
  }, []);

  const handleLocationSelect = useCallback((newLocation, type) => {
    // console.log("type",type,newLocation)
    if (type == "yachtLocation") {
      let url = `https://www.google.com/maps/search/?api=1&query=${newLocation?.lat},${newLocation?.lng}`
      setLocationLatLng(newLocation);
      setyachtLocationLink(url)
    } else if (type == "meetingPoint") {
      let url = `https://www.google.com/maps/search/?api=1&query=${newLocation?.lat},${newLocation?.lng}`
      setMeetPointLatLng(newLocation);
      setMeetingPoint(url)
    } else if (type == "carParking") {
      let url = `https://www.google.com/maps/search/?api=1&query=${newLocation?.lat},${newLocation?.lng}`
      setCarParkingLatLng(newLocation);
      setcarParking(url)
    } else if (type == "taxiDropOff") {
      let url = `https://www.google.com/maps/search/?api=1&query=${newLocation?.lat},${newLocation?.lng}`
      setTaxiLatLng(newLocation);
      settaxiDropOff(url)
    } else {
      setLocationLatLng(newLocation);
    }
  }, []);

  const handleSubmitYachts = async (data) => {

    // console.log(data)
    try {
      if (!mainImage && !isEditMode) {
        toast.error('Please select a main Experience image');
        return;
      }
      // if (!locationLatLng) {
      //   toast.error('Please select a Yacht location on the map');
      //   return;
      // }
      // if (!meetingPoint) {
      //   toast.error('Please select a meetingPoint on the map');
      //   return;
      // }
      // if (!carParking) {
      //   toast.error('Please select a carParking on the map');
      //   return;
      // }
      // if (!taxiDropOff) {
      //   toast.error('Please select a taxiDropOff on the map');
      //   return;
      // }

      // if (!selectedBrand) {
      //   toast.error('Please select a brand');
      //   return;
      // }

      // if (!data.length) {
      //   toast.error('Length is required');
      //   return;
      // }  

      // Validate main image
      if (mainImage && mainImage?.file) {
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
        if (!data.ny_price) {
          toast.error('New Year Price is required when NY Status is checked');
          return;
        }
        if (!data.ny_availability_from) {
          toast.error('New Year Availability From is required when NY Status is checked');
          return;
        }
        if (!data.ny_availability_to) {
          toast.error('New Year Availability To is required when NY Status is checked');
          return;
        }
      }

      setLoading(true);
      const formData = new FormData();

      if (!isEditMode || isEditMode) {
        // Current date and time for availability
        const now = new Date();
        const availability = {
          // data: now.toISOString().split('T')[0],
          // time: now.toTimeString().split(' ')[0]
          from: fromDate,
          to: toDate
        };
        formData.append('availability', JSON.stringify(availability));
      }

      Object.keys(data).forEach(key => {
        if (!['experience_image'].includes(key)) {
          const value = key === 'status' ? String(data[key]) : data[key];
          if (value !== null && value !== undefined && value !== '') {
            formData.append(key, value);
          }
        }
      });

      // Append ny_ keys only once
      if (data.ny_status) {
        formData.append('ny_price', data.ny_price);
        formData.append('new_year_per_hour_price', data.ny_price);
        formData.append('new_year_per_day_price', data.ny_price);
        formData.append('ny_firework', data.ny_firework);

        const new_availability = {
          from: data?.ny_availability_from,
          to: data?.ny_availability_to
        };
        const formattedFrom = format(parse(new_availability.from, 'HH:mm', new Date()), 'HH:mm:ss');
        const formattedTo = format(parse(new_availability.to, 'HH:mm', new Date()), 'HH:mm:ss');
        formData.append('ny_availability', JSON.stringify(new_availability));
        formData.append('new_year_start_time', formattedFrom);
        formData.append('new_year_end_time', formattedTo);
        formData.append('ny_inclusion', JSON.stringify(selectednyInclusion));
      }
      // const ny_availability = {///remove
      //   from: data?.ny_availability?.from,
      //   to: data?.ny_availability?.to,
      // };
      // formData.set('ny_availability', JSON.stringify(ny_availability));///remove
      //locationLatLng
      formData.append('latitude', locationLatLng ? locationLatLng.lat : 25.180775);
      formData.append('longitude', locationLatLng ? locationLatLng.lng : 55.336947);
      formData.append('meeting_point_link', meetingPoint);
      formData.append('car_parking_link', carParking);
      formData.append('taxi_drop_off_link', taxiDropOff);
      formData.append('location_url', yachtLocationLink);

      if (mainImage?.file instanceof File) {
        formData.append('experience_image', mainImage.file);
      }

      // Append additional images
      for (let i = 0; i < 20; i++) {
        const img = additionalImages[i];

        if (img?.file instanceof File) {
          formData.append(`image${i + 1}`, img.file);
        } else if (img?.isFromApi && img.url) {
          const urlPath = getS3PathOnly(img.url);
          formData.append(`image${i + 1}`, urlPath);
        } else {
          // Append a null placeholder for missing images
          formData.append(`image${i + 1}`, '');
        }
      }
      formData.append('notes', notes);
      formData.append('type', data?.engine_type);
      formData.append('flag', flag);
      formData.append('crew_language', crewLanguage);
      formData.append('from_date', fromDate);
      formData.append('to_date', toDate);
      if (selectedFeatures?.length > 0) {
        formData.append('features', JSON.stringify(selectedFeatures));
        formData.append('subcategory', JSON.stringify(selectedFeatures));
      }

      if (selectedInclusion?.length > 0) {
        formData.append('inclusion', JSON.stringify(selectedInclusion));
      }
      if (selectedCategories?.length > 0) {
        formData.append('category', JSON.stringify(selectedCategories));

      }
      // formData.append('food_name', foodName);
      // formData.append('food_price', foodPrice);
      // formData.append('brand_id', selectedBrand);
      if (isEditMode && selectedFoodOptions.length > 0) {
        formData.append('foods', JSON.stringify(selectedFoodOptions));
      } else if (selectedFoodOptions.length > 0) {
        const singleQuotedArray = `[${selectedFoodOptions.map(item => `'${item}'`).join(',')}]`;
        formData.append('foods', JSON.stringify(selectedFoodOptions));
      }
      if (yachtsType !== "regular-exp") {
        formData.append('experience_type', JSON.stringify(yachtsType == "regular-exp" ? "" : yachtsType == "f1-exp" ? "f1" : ""));

      }

      formData.append('place_id', 1);
      if (isEditMode) {
        formData.append('id', id);

      }


      // console.log("FormData contents:");
      // for (let pair of formData.entries()) {
      //   console.log(`${pair[0]}:`, pair[1]);
      // }

      let url;

      url = isEditMode
        ? `https://api.takeoffyachts.com/yacht/experience/`
        : 'https://api.takeoffyachts.com/yacht/experience/';

      const response = await axios({
        method: isEditMode ? 'put' : 'post',
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response?.data?.error_code === 'pass') {
        toast.success(`Experience successfully ${isEditMode ? 'updated' : 'added'}`);
        navigate('/experiences/regular-exp');
      } else {
        // Handle API validation errors
        if (response.error) {
          const { data } = response.error;
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
      console.error(error)
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

    // console.log(data)
    try {
      if (!mainImage && !isEditMode) {
        toast.error('Please select a main Experience image');
        return;
      }

      // if (!locationLatLng) {
      //   toast.error('Please select a Yacht location on the map');
      //   return;
      // }

      // if (!meetingPoint) {
      //   toast.error('Please select a meetingPoint on the map');
      //   return;
      // }
      // if (!carParking) {
      //   toast.error('Please select a carParking on the map');
      //   return;
      // }
      // if (!taxiDropOff) {
      //   toast.error('Please select a taxiDropOff on the map');
      //   return;
      // }

      // if (!selectedBrand) {
      //   toast.error('Please select a brand');
      //   return;
      // }

      // if (!data.length) {
      //   toast.error('Length is required');
      //   return;
      // } 

      // Validate main image
      if (mainImage && mainImage?.file) {
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
        if (!data.ny_price) {
          toast.error('New Year Price is required when NY Status is checked');
          return;
        }
        if (!data.ny_availability_from) {
          toast.error('New Year Availability From is required when NY Status is checked');
          return;
        }
        if (!data.ny_availability_to) {
          toast.error('New Year Availability To is required when NY Status is checked');
          return;
        }
      }

      setLoading(true);
      const formData = new FormData();

      if (!isEditMode || isEditMode) {
        // Current date and time for availability
        const now = new Date();
        const availability = {
          // data: now.toISOString().split('T')[0],
          // time: now.toTimeString().split(' ')[0]
          from: fromDate,
          to: toDate
        };
        formData.append('availability', JSON.stringify(availability));
      }

      Object.keys(data).forEach(key => {
        if (!['experience_image'].includes(key)) {
          const value = key === 'status' ? String(data[key]) : data[key];
          if (value !== null && value !== undefined && value !== '') {
            formData.append(key, value);
          }
        }
      });

      // Append ny_ keys only once

      formData.append('ny_status', false);
      // const ny_availability = {///remove
      //   from: data?.ny_availability?.from,
      //   to: data?.ny_availability?.to,
      // };
      // formData.set('ny_availability', JSON.stringify(ny_availability));///remove

      formData.append('latitude', locationLatLng ? locationLatLng.lat : 25.180775);
      formData.append('longitude', locationLatLng ? locationLatLng.lng : 55.336947);
      formData.append('meeting_point_link', meetingPoint);
      formData.append('car_parking_link', carParking);
      formData.append('taxi_drop_off_link', taxiDropOff);
      formData.append('location_url', yachtLocationLink);
      if (mainImage?.file instanceof File) {
        formData.append('experience_image', mainImage.file);
      }

      // Append additional images
      for (let i = 0; i < 20; i++) {
        const img = additionalImages[i];

        if (img?.file instanceof File) {
          formData.append(`image${i + 1}`, img.file);
        } else if (img?.isFromApi && img.url) {
          const urlPath = getS3PathOnly(img.url);
          formData.append(`image${i + 1}`, urlPath);
        } else {
          // Append a null placeholder for missing images
          formData.append(`image${i + 1}`, '');
        }
      }
      formData.append('notes', notes);
      formData.append('type', data?.engine_type);
      formData.append('flag', flag);
      formData.append('crew_language', crewLanguage);
      formData.append('from_date', fromDate);
      formData.append('to_date', toDate);
      if (selectedFeatures?.length > 0) {
        formData.append('features', JSON.stringify(selectedFeatures));
        formData.append('subcategory', JSON.stringify(selectedFeatures));
      }
      if (selectedInclusion?.length > 0) {
        formData.append('inclusion', JSON.stringify(selectedInclusion));
      }
      if (selectedCategories?.length > 0) {
        formData.append('category', JSON.stringify(selectedCategories));

      }
      // formData.append('food_name', foodName);
      // formData.append('food_price', foodPrice);
      // formData.append('brand_id', selectedBrand);
      if (isEditMode && selectedFoodOptions.length > 0) {
        formData.append('food_name', JSON.stringify(selectedFoodOptions));
      } else if (selectedFoodOptions.length > 0) {
        const singleQuotedArray = `[${selectedFoodOptions.map(item => `'${item}'`).join(',')}]`;
        formData.append('food_name', singleQuotedArray);
      }
      if (yachtsType !== "regular-exp") {
        formData.append('experience_type', JSON.stringify(yachtsType == "regular-exp" ? "" : yachtsType == "f1-exp" ? "f1" : ""));

      }
      formData.append('place_id', 1);

      if (isEditMode) {
        formData.append('id', id);

      }


      // console.log("FormData contents:");
      // for (let pair of formData.entries()) {
      //   console.log(`${pair[0]}:`, pair[1]);
      // }

      let url;

      url = isEditMode
        ? `https://api.takeoffyachts.com/yacht/f1-yachts-details/`
        : 'https://api.takeoffyachts.com/yacht/f1-yachts/';

      const response = await axios({
        method: isEditMode ? 'put' : 'post',
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response?.data?.error_code === 'pass') {
        toast.success(`f1 Experience successfully ${isEditMode ? 'updated' : 'added'}`);
        navigate('/experiences/f1-exp');

      } else {
        // Handle API validation errors
        if (response?.data?.error) {
          let error = response?.data?.error
          // const errorObj = JSON.parse(response?.data?.error);
          // Object.entries(errorObj).forEach(([key, errors]) => {
          //   errors.forEach(error => {
          //     toast.error(`${key}: ${error.string}`);
          //   });
          // });
          const errorArray = error.response.data?.details?.length;
          errorArray.forEach((error, key) => {
            toast.error(`${error}`);
          });
        } else {
          toast.error('Error creating/updating yacht. Please try again.');
        }
      }
    } catch (error) {
      console.error(error)
      if (error.response?.data?.error) {
        try {
          const errorObj = JSON.parse(error.response?.data?.error);
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
    if (files) {
      const error = validateImage(files);
      if (error) {
        toast.error(`Main image error: ${error}`);
        return;
      }
      setMainImage(files);
    } else {
      setMainImage(null);
    }
  }, []);

  const handleAdditionalImagesChange = useCallback((files) => {
    // console.log(files)
    // Validate each file
    const validFiles = files.filter((file, index) => {
      const error = validateImage(file.file);
      if (error) {
        toast.error(`Additional image ${index + 1}: ${error}`);
        return false;
      }
      return true;
    });

    setAdditionalImages([...additionalImages, ...validFiles.slice(0, 20)]);
  }, []);
  // Fetch cities from City API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsCitiesLoading(true);
        const response = await fetch(`${BASE_URL}/yacht/city/`);
        const data = await response.json();

        if (data.error_code === 'pass') {
          setCities(data.data);
        } else {
          console.error('Failed to fetch cities:', data.error);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
        toast.error('Failed to fetch cities');
      } finally {
        setIsCitiesLoading(false);
      }
    };

    fetchCities();
  }, []);
  //test
  // useEffect(() => {
  //   const newData = {
  //     ...watchedValues,
  //     locationLatLng,
  //     meetPointLatLng,
  //     carParkingLatLng,
  //     taxiLatLng,
  //     additionalImages,
  //     mainImage,
  //     notes,
  //     flag,
  //     crewLanguage,
  //     fromDate,
  //     toDate,
  //     selectedFeatures,
  //     selectedInclusion,
  //     selectedCategories,
  //     selectedFoodOptions,
  //     meetingPoint,
  //     taxiDropOff,
  //     carParking,
  //     yachtLocationLink
  //   };

  //   setDebuggingObject((prev) => {
  //     const hasChanged = JSON.stringify(prev) !== JSON.stringify(newData);
  //     if (hasChanged) {
  //       return newData;
  //     }
  //     return prev;
  //   });
  // }, [
  //   watchedValues, errors, locationLatLng, meetPointLatLng, carParkingLatLng, taxiLatLng, additionalImages, mainImage,
  //   selectedYacht, notes, flag, crewLanguage, fromDate, toDate,
  //   selectedFeatures, selectedInclusion, selectedCategories, selectedFoodOptions,
  //   meetingPoint,
  //   taxiDropOff,
  //   yachtLocationLink,
  //   carParking
  // ]);

  // useEffect(() => {
  //   // console.log("Form values changed:", watchedValues);
  //   console.log("errors", errors)
  //   console.log("selectedYacht", selectedYacht)
  // }, [watchedValues, errors, selectedYacht]);
  // useEffect(() => {
  //   console.log("debuggingObject", debuggingObject)
  // }, [debuggingObject])



  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BEA355]"></div>
      </div>
    );
  }

  return (
    <div id="AddBoatGlobal" className="p-6">
      <Card className="p-3 cardClass">
        {yachtsType == "regular-exp" ? <h1 className="text-3xl mt-4  px-6 font-bold mb-6 font-sora">{isEditMode ? 'Edit' : 'Add'} Experience</h1>
          : yachtsType == "f1-exp" ? <h1 className="text-3xl mt-4  px-6 font-bold mb-6 font-sora">{isEditMode ? 'Edit' : 'Add'} f1 Experience</h1>
            : ""}

        <form onSubmit={handleSubmit(yachtsType === "f1-exp" ? handleSubmitf1Yachts : yachtsType === "regular-exp" ? handleSubmitYachts : "")} className=" ">
          {/* <div className="grid grid-cols-1 md:grid-cols-2 p-6  gap-6"> */}
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
          {/* <div>
              <label htmlFor="title">Title</label>
              <Input className='rounded-lg' {...register('title')} error={!!errors.title} />
            </div> */}
          {/* </div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 p-6  gap-6">
            <div>
              <label htmlFor="name">Name</label>
              <Input className='rounded-lg' {...register('name')} error={!!errors.name} />
            </div>
            <div>
              <label htmlFor="location">Location</label>
              {/* <Input className='rounded-lg' {...register('location')} error={!!errors.location} /> */}
              {!isCitiesLoading &&      <select
                {...register("location")}
                error={!!errors.location}
                className={`w-full border rounded-lg p-2 border-gray-300 focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
              >
                <option disabled value="">Select Location</option>
                {cities?.length > 0 && cities?.map((city, index) => {
                  return (
                    <option key={index} value={city?.name}>{city?.name}</option>
                  )
                })}




              </select>}
         
            </div>
            {yachtsType == "regular-exp" && <div>
              <label htmlFor="location">Duration Min</label>
              <select
                {...register("min_duration_hour", { valueAsNumber: true })}

                error={!!errors.min_duration_hour}
                className={`w-full border rounded-lg p-2 border-gray-300 focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
              >
                <option disabled value="">Select Minimum Duration</option>
                {durationMinutesList?.length > 0 && durationMinutesList?.map((duration, index) => {
                  return (
                    <option key={index} value={duration?.value}>{duration?.name}</option>
                  )
                })}




              </select>
            </div>}

            {/* <div>
              <label htmlFor="min_price">Min Price</label>
              <Input className='rounded-lg' type="number" step="any" {...register('min_price')} error={!!errors.min_price} />
            </div>
            <div>
              <label htmlFor="max_price">Max Price</label>
              <Input className='rounded-lg' type="number" step="any" {...register('max_price')} error={!!errors.max_price} />
            </div> */}
            <div>
              <label htmlFor="guest">Guest Capacity</label>
              <Input className='rounded-lg' type="number" step="any" {...register('guest')} error={!!errors.guest} />
            </div>
            <div>
              <label htmlFor="cancel_time_in_hour">Cancel Time (hours)</label>
              <Input className='rounded-lg' type="number" step="any" {...register('cancel_time_in_hour')} error={!!errors.cancel_time_in_hour} />
            </div>
            {/* {yachtsType == "regular-exp" && <div>
              <label htmlFor="duration_hour">Duration (hour)</label>
              <Input className='rounded-lg' type="number" step="any" {...register('duration_hour')} error={!!errors.duration_hour} />
            </div>} */}

            {/* <div>
              <label htmlFor="duration_minutes">Duration (minutes)</label>
              <Input className='rounded-lg' type="number" step="any" {...register('duration_minutes')} error={!!errors.duration_minutes} />
            </div> */}
            <div>
              <label htmlFor="number_of_cabin">Number of Cabins</label>
              <Input className='rounded-lg' type="number" step="any" {...register('number_of_cabin')} error={!!errors.number_of_cabin} />
            </div>
            <div>
              <label htmlFor="capacity">Capacity</label>
              <Input className='rounded-lg' type="number" step="any" {...register('capacity')} error={!!errors.capacity} />
            </div>
            <div>
              <label htmlFor="sleep_capacity">Sleep Capacity</label>
              <Input className='rounded-lg' type="number" step="any" {...register('sleep_capacity')} error={!!errors.sleep_capacity} />
            </div>
            <div>
              <label htmlFor="per_day_price">Per Day Price</label>
              <Input className='rounded-lg' type="number" step="any" {...register('per_day_price')} error={!!errors.per_day_price} />
            </div>
            {yachtsType == "regular-exp" && <div>
              <label htmlFor="per_hour_price">Per Hour Price</label>
              <Input className='rounded-lg' type="number" step="any" {...register('per_hour_price')} error={!!errors.per_hour_price} />
            </div>}

            <div>
              <label htmlFor="length">Length</label>
              <Input className='rounded-lg' type="number" step="any" {...register('length')} error={!!errors.length} />
              {errors.length && <p className="text-red-500 text-sm">{errors.length.message}</p>}

            </div>

            <div>
              <label htmlFor="power">Power</label>
              <Input className='rounded-lg' type="text" step="any" {...register('power')} error={!!errors.power} />
            </div>
            <div>
              <label htmlFor="engine_type">Engine Type</label>
              <Input className='rounded-lg' {...register('engine_type')} error={!!errors.engine_type} />
            </div>
            <div>
              <label htmlFor="crew_member">Crew Member</label>
              <Input className='rounded-lg' {...register('crew_member')} error={!!errors.crew_member} />
            </div>
            {false && yachtsType == "regular-exp" && <div className='flex items-center gap-2'>
              <label htmlFor="ny_status">New Year Status</label>
              <input
                type="checkbox"
                {...register('ny_status')}
                // onChange={(e) => {
                //   setNyStatusChecked(e.target.checked);
                //   // console.log('NY Status Checked:', e.target.checked);
                // }}
                className="form-checkbox h-5 w-5 text-[#BEA355]"
              />
            </div>}

            {watchedValues?.ny_status && yachtsType == "regular-exp" && (
              <>
                <div>
                  <label htmlFor="ny_price">New Year Price</label>
                  <Input className='rounded-lg' type="number" step="any" {...register('ny_price')} error={!!errors.ny_price} />
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
                    <Input className='rounded-lg' type="time" {...register('ny_availability_from')}
                    //  error={!!errors.ny_availability} 
                    />
                    <Input className='rounded-lg' type="time" {...register('ny_availability_to')}
                    //  error={!!errors.ny_availability}
                    />
                  </div>
                  {/* {errors.ny_availability && <p className="text-red-500 text-sm">{errors.ny_availability.message}</p>} */}
                </div>
                <div>
                  <label htmlFor="ny_inclusion" className="block text-sm font-medium text-gray-700 mb-2">New Year Inclusion</label>
                  <div
                    className="grid grid-cols-2 md:grid-cols-3 gap-2"


                  >
                    {inclusions?.map((inc) => (
                      <button
                        key={inc.id}
                        type="button"
                        onClick={() => {
                          setSelectedNyInclusion(prev =>
                            prev.includes(inc.name)
                              ? prev.filter(i => i !== inc.name)
                              : [...prev, inc.name]
                          );
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectednyInclusion.includes(inc.name) ? 'bg-[#BEA355] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Point</label>
              <div className="h-[450px] w-full overflow-hidden">
                <MapPicker
                  onLocationSelect={(newLocation) => handleLocationSelect(newLocation, "meetingPoint")}
                  initialLocation={meetPointLatLng}
                />
              </div>
              {meetPointLatLng && (
                <div className="mt-2 flex flex-wrap gap-2">
                  Selected Coordinates:
                  <div className="bg-blue-100 text-blue-800 text-sm font-medium py-1 px-3 rounded-full shadow-md">
                    Latitude: {meetPointLatLng.lat.toFixed(6)}
                  </div>
                  <div className="bg-green-100 text-green-800 text-sm font-medium py-1 px-3 rounded-full shadow-md">
                    Longitude: {meetPointLatLng.lng.toFixed(6)}
                  </div>
                </div>
              )}

            </div>
            <div className="col-span- mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Car Parking</label>
              <div className="h-[450px] w-full overflow-hidden">
                <MapPicker
                  onLocationSelect={(newLocation) => handleLocationSelect(newLocation, "carParking")}
                  initialLocation={carParkingLatLng}
                />
              </div>
              {carParkingLatLng && (
                <div className="mt-2 flex flex-wrap gap-2">
                  Selected Coordinates:
                  <div className="bg-blue-100 text-blue-800 text-sm font-medium py-1 px-3 rounded-full shadow-md">
                    Latitude: {carParkingLatLng.lat.toFixed(6)}
                  </div>
                  <div className="bg-green-100 text-green-800 text-sm font-medium py-1 px-3 rounded-full shadow-md">
                    Longitude: {carParkingLatLng.lng.toFixed(6)}
                  </div>
                </div>
              )}

            </div>
            <div className="col-span- mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Taxi Drop Off</label>
              <div className="h-[450px] w-full overflow-hidden">
                <MapPicker
                  onLocationSelect={(newLocation) => handleLocationSelect(newLocation, "taxiDropOff")}
                  initialLocation={taxiLatLng}
                />
              </div>
              {taxiLatLng && (
                <div className="mt-2 flex flex-wrap gap-2">
                  Selected Coordinates:
                  <div className="bg-blue-100 text-blue-800 text-sm font-medium py-1 px-3 rounded-full shadow-md">
                    Latitude: {taxiLatLng.lat.toFixed(6)}
                  </div>
                  <div className="bg-green-100 text-green-800 text-sm font-medium py-1 px-3 rounded-full shadow-md">
                    Longitude: {taxiLatLng.lng.toFixed(6)}
                  </div>
                </div>
              )}

            </div>

            <div className="col-span- mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Location</label>
              <div className="h-[450px] w-full overflow-hidden">
                <MapPicker
                  onLocationSelect={(newLocation) => handleLocationSelect(newLocation, "yachtLocation")}
                  initialLocation={locationLatLng}
                />
              </div>
              {locationLatLng && (
                <div className="mt-2 flex flex-wrap gap-2">
                  Selected Coordinates:
                  <div className="bg-blue-100 text-blue-800 text-sm font-medium py-1 px-3 rounded-full shadow-md">
                    Latitude: {locationLatLng.lat.toFixed(6)}
                  </div>
                  <div className="bg-green-100 text-green-800 text-sm font-medium py-1 px-3 rounded-full shadow-md">
                    Longitude: {locationLatLng.lng.toFixed(6)}
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
              <Input className='rounded-lg' type="date"
                value={fromDate ? fromDate.split('T')[0] : ''}
                onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div>
              <label htmlFor="to_date">To Date</label>
              <Input className='rounded-lg' type="date"
                value={toDate ? toDate.split('T')[0] : ''}

                onChange={(e) => setToDate(e.target.value)} />
            </div>


          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 p-6  gap-6">
            <div>
              <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-2">Features</label>
              <div
                //  className={`rounded-lg object-cover  relative w-[80px] h-[80px] sm:w-[80px] md:w-[120px]   rounded-lg 
                //   hover:opacity-100 
                //  cursor-pointer opacity-100`}

                className="grid grid-cols-2 md:grid-cols-3 gap-2"
              >
                {featureList?.map((feature, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setSelectedFeatures(prev =>
                        prev.includes(feature?.name)
                          ? prev.filter(f => f !== feature?.name)
                          : [...prev, feature?.name]
                      )
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                      ${selectedFeatures.includes(feature?.name)
                        ? 'bg-[#BEA355] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {feature?.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="inclusion" className="block text-sm font-medium text-gray-700 mb-2">Inclusion</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {inclusions?.map((inc) => (
                  <button
                    key={inc.id}
                    type="button"
                    onClick={() => {
                      setSelectedInclusion(prev =>
                        prev.includes(inc.name)
                          ? prev.filter(i => i !== inc.name)
                          : [...prev, inc.name]
                      );
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedInclusion.includes(inc.name) ? 'bg-[#BEA355] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {inc.name}
                  </button>
                ))}


              </div>
            </div>

            {yachtsType == "regular-exp" ? <div>
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
            </div> : yachtsType == "f1-exp" ? <div>
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
            </div> : ""}

            <div>
              <label htmlFor="food_options" className="block text-sm font-medium text-gray-700 mb-2">Food Options</label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                {[...new Map(foodOptions?.map(f => [f.name, f])).values()]?.map((food, index) => (
                  <div key={food.id} className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFoodOptions(prev =>
                          prev.some(f => f.name === food.name)
                            ? prev.filter(f => f.name !== food.name)
                            : [...prev, { name: food.name, quantity: 1 }]
                        );
                      }}
                      className={`w-full px-4 py-2 rounded-full text-sm font-medium transition-colors relative
                        ${selectedFoodOptions.some(f => f.name === food.name)
                          ? 'bg-[#BEA355] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {selectedFoodOptions.some(f => f.name === food.name) && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFoodOptions(prev => 
                                prev.map(f => 
                                  f.name === food.name 
                                    ? { ...f, quantity: Math.max(1, f.quantity - 1) }
                                    : f
                                )
                              );
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFoodOptions(prev => 
                                prev.map(f => 
                                  f.name === food.name 
                                    ? { ...f, quantity: f.quantity + 1 }
                                    : f
                                )
                              );
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
                          >
                            +
                          </button>
                        </>
                      )}
                      <div className='flex justify-center'>
                        <span className={`${selectedFoodOptions.some(f => f.name === food.name) ? '' : ''} text-center`}>
                          {food.name} - {import.meta.env.VITE_CURRENCY || "AED"} {food.price}
                          {selectedFoodOptions.find(f => f.name === food.name)?.quantity && 
                            ` | qty: ${selectedFoodOptions.find(f => f.name === food.name).quantity}`}
                        </span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#BEA355] submitButton my-4 text-white px-6 py-2 float-right rounded-full hover:bg-[#A58B3D] transition-colors disabled:opacity-50"
          >


            {yachtsType == "regular-exp" ? loading ? `${isEditMode ? 'Updating' : 'Adding'} Experience...` : `${isEditMode ? 'Update' : 'Add'} Experience` : yachtsType == "f1-exp" ? loading ? `${isEditMode ? 'Updating' : 'Adding'} Experience...` : `${isEditMode ? 'Update' : 'Add'} F1 Experience` : ""}
          </button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 p-6  gap-6">
          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-2">Main Experience Image (Required)</label>
            {/* <FileUploadOld
                onFilesChange={handleMainImageChange}
                maxFiles={1}
                acceptedFileTypes="image/*"
                containerClassName="border border-gray-200 rounded-lg"
              /> */}
            <FileUploadSingle
              onFilesChange={handleMainImageChange}
              maxFiles={1}
              acceptedFileTypes="image/*"
              containerClassName="border border-gray-200 rounded-lg"
              apiImage={mainImage}
              componentType={yachtsType == "regular-exp" ? "Experience" : yachtsType == "f1-exp" ? "f1 Experience" : ''}

            />
          </div>
          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-2">More Experience Images</label>
            <FileUpload
              onFilesChange={handleAdditionalImagesChange}
              maxFiles={20}
              acceptedFileTypes="image/*"
              containerClassName="border border-gray-200 rounded-lg"
              apiImages={additionalImages}
              componentType={yachtsType == "regular-exp" ? "Experience" : yachtsType == "f1-exp" ? "f1 Experience" : ''}

            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AddExperienceGlobal;