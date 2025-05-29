import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Input, Textarea,Radio  } from "@material-tailwind/react";
import axios from 'axios';
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
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
import { zodSchemaEvent, zodSchemaPackage } from '../../utils/zodSchemaEventPackage';
import { getSingleEventbyId, getSinglePackagebyId } from '../../services/api/eventService';
import { eventData, eventStatesUpdates, packageData, packageStatesUpdates } from '../../utils/customizeObjEventsPackage';




const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.takeoffyachts.com';

const AddEventPackageGlobal = ({ yachtsType, setActiveTab }) => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [inclusions, setInclusions] = useState([]);
  const [packageList, setPackageList] = useState([]);
  const [selectedPackages, setSelectedPackages] = useState([])
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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [cities, setCities] = useState([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(true);
  const [packageSold, setPackageSold] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const selectedSchema =
    yachtsType === "event" ? zodSchemaEvent : yachtsType === "package" ? zodSchemaPackage : zodSchemaEmpty;
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;


  const [searchParams] = useSearchParams(); // ✅ This returns a URLSearchParams instance
  const [eventId, setEventId] = useState(null);
  const [eventIdInitialized, setEventIdInitialized] = useState(false)


  const eventCategories = [
    // {
    //   name: "Select Event Type",
    //   value: ""
    // },
    {
      name: "Year",
      value: "YEAR"
    },
    {
      name: "Normal",
      value: "NORMAL"
    },
    {
      name: "F1",
      value: "F1"
    }
  ];




  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(selectedSchema),
    defaultValues: {
      status: true,
      user_id: '1',
      location: '',
    }
  });
  const watchedValues = watch(); // Watches all form fields


  const fetchEvent = async () => {
    if (!id) {
      setInitialLoading(false);
      return;
    }

    try {
      let data;
      const response = await getSingleEventbyId(id);
      // console.log(response)
      data = response;

      setSelectedYacht(data);
      reset(eventData(data));

      const updates = eventStatesUpdates(data);

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
      if (updates?.start_time) setStartTime(updates?.start_time);
      if (updates?.end_time) setEndTime(updates?.end_time);
      if (updates?.selectednyInclusion) setSelectedNyInclusion(updates?.selectednyInclusion);
      if (updates?.selectedPackages) setSelectedPackages(updates?.selectedPackages);





    } catch (error) {
      console.error('Error fetching boat data:', error);
    } finally {
      setInitialLoading(false);
    }
  };
  const fetchSinglePackageData = async () => {
    if (!id) {
      setInitialLoading(false);
      return;
    }

    try {
      let data;

      const response = await getSinglePackagebyId(id);
      data = response;
      setSelectedYacht(data);
      reset(packageData(data));

      const updates = packageStatesUpdates(data);

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
      if (updates?.start_time) setStartTime(updates?.start_time);
      if (updates?.end_time) setEndTime(updates?.end_time);
      if (updates?.packageSold) setPackageSold(updates?.packageSold);

    } catch (error) {
      console.error('Error fetching package data:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get("eventId");
    setEventId(id);
    setEventIdInitialized(true); // Mark it as initialized
  }, [searchParams]);


  useEffect(() => {
    if (!eventIdInitialized) return; // Don't run until eventId is set

    if (yachtsType === "event") {
      // console.log("get single event");
      fetchEvent();
    } else if (eventId == null && yachtsType === "package") {
      // console.log("get single package");
      fetchSinglePackageData();
    } else {
      setInitialLoading(false)
    }
  }, [id, reset, eventId, yachtsType, eventIdInitialized]);

  useEffect(() => {
    const fetchInclusions = async () => {
      try {
        const data = await getAllInclusions();
        setInclusions(data);
      } catch (error) {
        console.error('Error fetching inclusions:', error);
      }
    };
    // fetchInclusions();
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
    // fetchCategories();
  }, []);


  useEffect(() => {
    const fetchPackageList = async () => {
      try {
        const response = await axios.get('https://api.takeoffyachts.com/yacht/package/');
        if (response?.data?.error_code === 'pass') {
          setPackageList(response?.data?.package);
        }
      } catch (error) {
        console.error('Error fetching PackageList:', error);
        setPackageList([]);
      }
    };
    if (yachtsType == "event") {
      fetchPackageList();

    }
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
    // fetchFeaturesList();
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
    // fetchFoodOptions();
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

  const handleSubmitEvent = async (data) => {

    // console.log(data)
    try {

      if (!mainImage && !isEditMode) {
        toast.error('Please select a main Event image');
        return;
      }
 

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
        if (!['event_image'].includes(key)) {
          const value = key === 'status' ? String(data[key]) : data[key];
          if (value !== null && value !== undefined && value !== '') {
            formData.append(key, value);
          }
        }
      });

  
      formData.append('latitude', locationLatLng ? locationLatLng.lat : 25.180775);
      formData.append('longitude', locationLatLng ? locationLatLng.lng : 55.336947);
      formData.append('meeting_point_link', meetingPoint);
      formData.append('car_parking_link', carParking);
      formData.append('taxi_drop_off_link', taxiDropOff);
      formData.append('location_url', yachtLocationLink);

      if (mainImage?.file instanceof File) {
        formData.append('event_image', mainImage.file);
      }


      formData.append('notes', notes);
      formData.append('from_date', fromDate);
      formData.append('to_date', toDate);
      formData.append('start_time', startTime);
      formData.append('end_time', endTime);

      formData.append('foods_list', JSON.stringify([]));


      if (selectedPackages?.length >= 0) {
        const filteredPackages = selectedPackages.map(pkg => ({
          price: pkg.price,
          quantity_available: pkg.quantity_available,
          package_type: pkg.package_type

        }));

        formData.append('packages_system', JSON.stringify(filteredPackages));
      }

      // console.log("FormData contents:");
      // for (let pair of formData.entries()) {
      //   console.log(`${pair[0]}:`, pair[1]);
      // }

      let url;

      url = isEditMode
        ? `https://api.takeoffyachts.com/yacht/event/`
        : 'https://api.takeoffyachts.com/yacht/event/';

      const response = await axios({
        method: isEditMode ? 'put' : 'post',
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response?.data?.error_code === 'pass') {
        if (isEditMode) {
          toast.success(`Event successfully ${isEditMode ? 'updated' : 'added'}`);
          navigate('/events');
        } else {
          // toast.success(`Event successfully ${isEditMode ? 'updated' : 'added'}`);
          navigate(`/events/add?eventId=${response?.data?.data?.id}`);
          setActiveTab("package")
        }

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
  const handleSubmitPackage = async (data) => {

    // console.log(data)
    try {
      if (!eventId && !isEditMode) {
        toast.error('Please Create Event First');
        return;
      }

      setLoading(true);
      const formData = new FormData();

      formData.append('isSold', packageSold);
      if (eventId) {
        formData.append('event', eventId);
      }
      Object.keys(data).forEach(key => {
        if (!['event_image'].includes(key)) {
          const value = key === 'status' ? String(data[key]) : data[key];
          if (value !== null && value !== undefined && value !== '') {
            formData.append(key, value);
          }
        }
      });
      // console.log("FormData contents:");
      // for (let pair of formData.entries()) {
      //   console.log(`${pair[0]}:`, pair[1]);
      // }

      let url;

      url = (isEditMode && !eventId)
        ? `https://api.takeoffyachts.com/yacht/package/`
        : 'https://api.takeoffyachts.com/yacht/package/';

      const response = await axios({
        method: (isEditMode && !eventId) ? 'put' : 'post',
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response?.data?.error_code === 'pass') {
        if (isEditMode && !eventId) {
          toast.success(`Package successfully ${isEditMode ? 'updated' : 'created'}`);
          navigate('/packages');
        } else {
          toast.success(`Event successfully ${isEditMode ? 'updated' : 'created'}`);
          navigate('/events');
        }

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


  const handleCheckboxChange = (pkg) => {
    setSelectedPackages(prev => {
      const exists = prev.find(p => p.id === pkg.id);
      if (exists) {
        return prev.filter(p => p.id !== pkg.id);
      } else {
        return [...prev, pkg];
      }
    });
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };


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

    if (yachtsType === "event") {
      fetchCities();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
  //     startTime,
  //     endTime,
  //     selectedFeatures,
  //     selectedInclusion,
  //     selectedCategories,
  //     selectedFoodOptions,
  //     selectedPackages,
  //     meetingPoint,
  //     taxiDropOff,
  //     carParking,
  //     yachtLocationLink,
  //     packageSold
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
  //   carParking,
  //   selectedPackages,
  //   startTime,
  //   endTime,
  //   packageSold
  // ]);


  // useEffect(() => {
  //   // console.log("Form values changed:", watchedValues);
  //   console.log("errors", errors)
  //   console.log("selectedYacht", selectedYacht)
  // }, [watchedValues, errors, selectedYacht]);
  // useEffect(() => {
  //   console.log("debuggingObject", debuggingObject)
  //   console.log("eventId", eventId)
  // }, [debuggingObject])





  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BEA355]"></div>
      </div>
    );
  }

  return (
    <div id="AddBoatGlobal" className="p-0">
      <Card className="p-3 cardClass shadow-none">
        {yachtsType == "event" ? <h1 className="text-3xl mt-4  px-6 font-bold mb-6 font-sora">{isEditMode ? 'Edit' : 'Add'} Event</h1>
          : yachtsType == "package" ? <h1 className="text-3xl mt-4  px-6 font-bold mb-6 font-sora">{isEditMode && !eventId ? 'Edit' : 'Add'} Package</h1>
            : ""}

        <form onSubmit={handleSubmit(yachtsType === "package" ? handleSubmitPackage : yachtsType === "event" ? handleSubmitEvent : "")} className=" ">
          {yachtsType == "event" ? <>

            {(isEditMode) && <div className="grid grid-cols-1 md:grid-cols-1 px-6 pb-5  gap-6">

              <div className="relative w-full" ref={dropdownRef}>
                <label className="block mb-1 font-medium">Event current Packages</label>

                <div
                  onClick={toggleDropdown}
                  className="border border-gray-300 rounded-lg p-2 cursor-pointer w-full bg-white focus:ring-1 focus:ring-[#BEA355]"
                >
                  {selectedPackages.length > 0
                    ? selectedPackages.map(pkg => pkg.package_type).join(', ')
                    : 'Current Package(s)'}
                </div>

                {isOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                    {selectedYacht?.packages_system?.map(pkg => (
                      <label
                        key={pkg.id}
                        className="flex items-center  cursor-pointer px-4 py-2 hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox cursor-pointer mr-2 text-[#BEA355]"
                          checked={selectedPackages.some(p => p.id === pkg.id)}
                          onChange={() => handleCheckboxChange(pkg)}
                        />
                        {pkg?.package_type} - AED {pkg?.price}
                      </label>
                    ))}
                  </div>
                )}
              </div>



            </div>}


            <div className="grid grid-cols-1 md:grid-cols-2 px-6 pb-6  gap-6">
              {yachtsType == "event" && <div className=''>
                <label className="block">Event Type<span className="text-red-700">*</span></label>
                <select
                  {...register("event_type")}
                  className={`w-full border rounded-lg p-2 ${errors.event_type ? "border-red-500" : "border-gray-300"} focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
                >
                  <option value="">Select Event Type</option>
                  {eventCategories?.map((type) => {
                    return (
                      <option value={type?.value}>{type?.name}</option>
                    )
                  })}




                </select>
                {errors.event_type && <p className="text-red-500 text-sm">{errors.event_type.message}</p>}
              </div>}

              <div>
                <label htmlFor="name">Name</label>
                <Input className='rounded-lg' {...register('name')} error={!!errors.name} />
              </div>

              <div>
                <label htmlFor="title">Title</label>
                <Input className='rounded-lg' {...register('title')} error={!!errors.title} />
              </div>


              {yachtsType == "event" && <div>
                <label htmlFor="location">Location</label>
                {!isCitiesLoading &&         <select
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
         
              </div>}

              {yachtsType == "event" && <div>
                <label htmlFor="cancel_time_in_hours">Cancel Time (hours)</label>
                <Input className='rounded-lg' type="number" step="any" {...register('cancel_time_in_hours')} error={!!errors.cancel_time_in_hours} />
              </div>}

              {yachtsType == "event" && <div>
                <label htmlFor="duration_hour">Duration (hours)</label>
                <Input className='rounded-lg' type="number" step="any" {...register('duration_hour')} error={!!errors.duration_hour} />
              </div>}


              <div>
                <label htmlFor="per_day_price">Per Day Price</label>
                <Input className='rounded-lg' type="number" step="any" {...register('per_day_price')} error={!!errors.per_day_price} />
              </div>


              <div className="col-span-">
                <label htmlFor="description">Description</label>
                <Textarea className='rounded-lg' cols={30} rows={5} {...register('description')} error={!!errors.description} />
              </div>

              {yachtsType == "event" && <div className="col-span- mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <ReactQuill value={notes} onChange={setNotes} />
              </div>}


            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 px-6 pb-6  gap-6">
              {yachtsType == "event" && <>

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

                <div>
                  <label htmlFor="from_date">Start Time</label>
                  <Input
                    className="rounded-lg"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(prev => `${e.target.value}`)}
                  />
                </div>
                <div>
                  <label htmlFor="to_date">End Time</label>
                  <Input
                    className="rounded-lg"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(prev => `${e.target.value}`)}
                  />
                </div>

              </>}

            </div>

            {yachtsType == "event" && <div className='grid grid-cols-1 md:grid-cols-2 px-6 pb-6  gap-6'>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Location</label>
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
            </div>}

            <div className="grid grid-cols-1 md:grid-cols-2 p-6  gap-6">
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#BEA355] submitButton my-4 text-white px-6 py-2 float-right rounded-full hover:bg-[#A58B3D] transition-colors disabled:opacity-50"
            >


              {yachtsType == "event" ? loading ? `${isEditMode ? 'Updating' : 'Adding'} Event...` : `${isEditMode ? 'Update' : 'Add'} Event` : yachtsType == "package" ? loading ? `${isEditMode ? 'Updating' : 'Adding'} Event...` : `${isEditMode ? 'Update' : 'Add'} package` : ""}
            </button>


            <div className="grid grid-cols-1 md:grid-cols-2 p-6  gap-6">
              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-2">Main  Image (Required)</label>

                <FileUploadSingle
                  onFilesChange={handleMainImageChange}
                  maxFiles={1}
                  acceptedFileTypes="image/*"
                  containerClassName="border border-gray-200 rounded-lg"
                  apiImage={mainImage}
                  componentType={yachtsType == "event" ? "Event" : yachtsType == "package" ? "package" : ''}
                />
              </div>
            </div>

          </> : yachtsType == "package" ? <>



            <div className="grid grid-cols-1 md:grid-cols-2 p-6  gap-6">
              <div>
                <label htmlFor="package_type">Package Type</label>
                <Input className='rounded-lg' {...register('package_type')} error={!!errors.package_type} />
              </div>

              <div>
                <label htmlFor="quantity_available">Package Quantity</label>
                <Input className='rounded-lg' type="number" step="any"
                  {...register('quantity_available')}
                  error={!!errors.quantity_available} />
              </div>



              <div>
                <label htmlFor="price">Package Price</label>
                <Input className='rounded-lg' type="number" step="any" {...register('price')} error={!!errors.price} />
              </div>

              <div>

              <Card className="p-4">
  <p className="font-medium mb-2">Package Sold:</p>
  <div className="flex gap-6 items-center">
    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="package-sold"
        value="true"
        checked={packageSold === true}
        onChange={() => setPackageSold(true)}
        className="accent-green-600 w-4 h-4"
      />
      <span>Yes</span>
    </label>
    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="package-sold"
        value="false"
        checked={packageSold === false}
        onChange={() => setPackageSold(false)}
        className="accent-green-600 w-4 h-4"
      />
      <span>No</span>
    </label>
  </div>
</Card>


</div>
              <div className="col-span-">
                <label htmlFor="description">Package Description</label>
                <Textarea className='rounded-lg' cols={30} rows={5} {...register('description')} error={!!errors.description} />
              </div>


            




            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 p-6  gap-6">
            </div>
            {yachtsType === "event" && (
              <button
                type="submit"
                disabled={loading}
                className="bg-[#BEA355] submitButton my-4 text-white px-6 py-2 float-right rounded-full hover:bg-[#A58B3D] transition-colors disabled:opacity-50"
              >
                {loading
                  ? `${isEditMode ? "Updating" : "Adding"} Event...`
                  : `${isEditMode ? "Update" : "Add"} Event`}
              </button>
            )}

            {yachtsType === "package" && (
              <button
                type="submit"
                disabled={loading}
                className="bg-[#BEA355] submitButton my-4 text-white px-6 py-2 float-right rounded-full hover:bg-[#A58B3D] transition-colors disabled:opacity-50"
              >
                {loading
                  ? `${isEditMode ? "Updating" : "Adding"} Package...`
                  : `${isEditMode && !eventId ? "Update" : "Add"} Package`}
              </button>
            )}


          </> : ""}

        </form>

      </Card>
    </div>
  );
};

export default AddEventPackageGlobal;