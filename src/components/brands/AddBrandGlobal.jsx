import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardBody, Typography, Button } from "@material-tailwind/react";
import { addExtra } from '../../services/api/extrasService';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { addBrand, getBrand, updateBrand } from '../../services/api/brandService';
import FileUploadSingle from '../common/FileUploadSingle';
import { validateImage } from '../../utils/globalFunctions';
import { formatFileSize } from '../../utils/helper';

const extrasSchema = z.object({
  brandTitle: z.string().min(1, "Brand Title is required"),
  brandDescription: z.string().optional(),
  image: z.any()
});

const CATEGORY_MAP = {
  'Food and Beverages': 'food',
  'Water Sports': 'sport',
  'Miscellaneous': 'misc',
  'extra': 'extra',


};
const S3URL = import.meta.env.VITE_S3_URL || 'https://images-yacht.s3.us-east-1.amazonaws.com';

const AddBrandGlobal = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const [error, setError] = useState('');
  const isEditing = Boolean(id);
  const token = localStorage.getItem('token');
  const [mainImage, setMainImage] = useState(null);
  const isEditMode = !!id;



  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({
    resolver: zodResolver(extrasSchema),
  });
  const watchedValues = watch(); // Watches all form fields


  const onSubmit = async (data) => {
    // console.log("Form data:", data);
    try {
      if (!mainImage && !isEditMode) {
        toast.error('Please select a brand  image');
        return;
      }


      setLoading(true);
      const formData = new FormData();
      formData.append('name', data.brandTitle);
      formData.append('description', data.brandDescription || '');
      if (mainImage?.file instanceof File) {
        formData.append('image', mainImage.file);
      }
      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}:`, value);
      // }


      if (isEditing) {
        await updateBrand(id, formData, token);
      } else {
        await addBrand(formData, token);
      }
      toast.success(isEditing ? 'Brand updated successfully!' : 'Brand added successfully!');

      navigate('/brands');
    } catch (error) {
      console.error('Error adding brand:', error);
      toast.error(error.response?.data?.message || 'Failed to add brand');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMainImageChange = useCallback((files) => {
    if (files) {
      const error = validateImage(files);
      if (error) {
        toast.error(`Main brand error: ${error}`);
        return;
      }
      setMainImage(files);
    } else {
      setMainImage(null);
    }
  }, []);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropImage = async () => {
    if (selectedImage) {
      const canvas = document.createElement('canvas');
      const image = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        image.src = e.target.result;
        image.onload = () => {
          canvas.width = croppedAreaPixels.width;
          canvas.height = croppedAreaPixels.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height
          );
          canvas.toBlob((blob) => {
            setCroppedImage(blob);
          }, 'image/jpeg');
        };
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const fetchBrand = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getBrand(id, token);
      // setValue('brandTitle', data.name,);
      reset({
        brandTitle: data.name,
        brandDescription: data.description || '', // Assuming description is optional
      });
          let mainImage = data?.image;
          if (typeof mainImage === "string" && mainImage.trim() !== "") {
              const objectURL = `${mainImage.startsWith('http') ? '' : S3URL}${mainImage}`;
               mainImage = {
                  id: objectURL,
                  file: { name: mainImage, type: 'image/jpeg', size: mainImage.length },
                  name: mainImage,
                  size: formatFileSize(mainImage.length),
                  type: 'image/jpeg',
                  isImage: true,
                  url: objectURL,
                  isFromApi: true,
              };
          }
      if (mainImage) setMainImage(mainImage);

    } catch (error) {
      console.error('Error fetching brand:', error);
      setError('Brand not found or error loading brand data');
      setTimeout(() => {
        navigate('/brands');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (isEditing) {
      fetchBrand();
    }
  }, [id]);

  //test 

  // useEffect(() => {
  //   console.log(watchedValues, mainImage);

  // }, [watchedValues, mainImage]);


  return (
    <div className="p-6">
      <Card className="h-full w-full p-4">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography className='font-sora' variant="h3" color="blue-gray">
                Add New Brands
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Fill in the details to add a new brands
              </Typography>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-auto px-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* <div>
              <label className="block mb-2">Category<span className="text-red-700">*</span></label>
              <select
                {...register("category")}
                className={`w-full border rounded-lg p-2 ${errors.category ? "border-red-500" : "border-gray-300"} focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
              >
                <option value="">Select a category</option>
                <option value="Food and Beverages">Food and Beverages</option>
                <option value="Water Sports">Water Sports</option>
                <option value="Miscellaneous">Miscellaneous</option>
                <option value="extra">Extra</option>



              </select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div> */}

            <div>
              <label className="block mb-2">Name<span className="text-red-700">*</span></label>
              <input
                type="text"
                {...register("brandTitle")}
                className={`w-full border rounded-lg p-2 ${errors.brandTitle ? "border-red-500" : "border-gray-300"} focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
                placeholder="name"
              />
              {errors.brandTitle && <p className="text-red-500 text-sm">{errors.brandTitle.message}</p>}
            </div>

            <div>
              <label className="block mb-2">Description<span className="text-red-700"></span></label>
              <input
                type="text"
                {...register("brandDescription")}
                className={`w-full border rounded-lg p-2 ${errors.brandDescription ? "border-red-500" : "border-gray-300"} focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
                placeholder="Description"
              />
              {errors.brandDescription && <p className="text-red-500 text-sm">{errors.brandDescription.message}</p>}
            </div>

            <div>
              <label className="block mb-2">Image</label>
              {/* <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#BEA355] transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleBrowseClick}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {previewUrl ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg mb-4"
                    />
                    <p className="text-sm text-gray-600">Click or drag to change image</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      />
                    </svg>
                    <div className="text-sm text-gray-600">
                      <span className="text-[#BEA355]">Click to upload</span> or drag and drop
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
              </div> */}


              <FileUploadSingle
                onFilesChange={handleMainImageChange}
                maxFiles={1}
                acceptedFileTypes="image/*"
                containerClassName="border border-gray-200 rounded-lg"
                apiImage={mainImage}
                componentType="brand"
              />
            </div>

            {/* <div className="mt-6">
              <Typography className='font-sora' variant="h4" color="blue-gray">
                Crop Image
              </Typography>
              <div className="relative h-64 w-full">
                <Cropper
                  image={previewUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 3}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <Button onClick={handleCropImage} className="mt-4 bg-[#BEA355] rounded-full capitalize font-medium">Crop Image</Button>
              {croppedImage && <img src={URL.createObjectURL(croppedImage)} alt="Cropped" className="mt-4" />}
            </div> */}

            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/brands')}
                className="px-4 py-2 text-gray-600 rounded-full border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#BEA355] text-white rounded-full hover:bg-yellow-600 disabled:opacity-50"
              >
                {loading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Brand' : 'Add Brand')}

              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddBrandGlobal;