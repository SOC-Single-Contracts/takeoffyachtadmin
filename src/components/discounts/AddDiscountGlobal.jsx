import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { addDiscount, getDiscount, updateDiscount } from '../../services/api/discountService';
import { getAllBrands } from '../../services/api/brandService';

const discountSchema = z.object({
  code: z.string().min(1, "Code is required"),
  discount: z.any().optional(),
  valid_from: z.string().optional(),
  valid_to: z.string().optional(),
  max_uses: z.any().optional(),
  is_active: z.boolean().optional(),
});

const AddDiscountGlobal = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const token = localStorage.getItem('token');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [brandList, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(prev => !prev);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      code: '',
      discount: 0,
      valid_from: '',
      valid_to: '',
      max_uses: 1,
      is_active: true,
    }
  });
  const watchedValues = watch(); // Watches all form fields


  // Fetch discount for edit mode
  const fetchDiscount = async () => {
    try {
      setLoading(true);
      const data = await getDiscount(id, token);
      reset({
        code: data.code,
        discount: data.discount,
        valid_from: data.valid_from ? data.valid_from.slice(0,10) : '',
        valid_to: data.valid_to ? data.valid_to.slice(0,10) : '',
        max_uses: data.max_uses,
        is_active: data.is_active,
      });
      if (data.brands) {
        // Assuming brandList is fetched later, you can sync selectedBrands after brandList loaded
        setSelectedBrands(data.brands.map(id => ( id ))); 
      }
    } catch (error) {
      console.error('Error fetching discount:', error);
      setError('Discount not found');
      setTimeout(() => navigate('/discounts'), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Fetch brands/Brands for selection
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const data = await getAllBrands(token);
      setBrands(data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode) fetchDiscount();
  }, [id]);

  useEffect(() => {
    fetchBrands();
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const handleCheckboxChange = (brand) => {
    setSelectedBrands(prev => {
      const exists = prev.find(b => b.id === brand.id);
      if (exists) {
        return prev.filter(b => b.id !== brand.id);
      } else {
        return [...prev, brand];
      }
    });
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        id:isEditMode? id:null,
        code: data.code,
        discount: data.discount,
        valid_from: data.valid_from || "",
        valid_to: data.valid_to || "",
        max_uses: data.max_uses || 1,
        is_active: data.is_active ?? true,
        brand_ids: selectedBrands.map(b => b.id),
      };

      if (isEditMode) {
        await updateDiscount(id, payload, token);
        toast.success('Discount updated successfully!');
      } else {
        await addDiscount(payload, token);
        toast.success('Discount added successfully!');
      }

      navigate('/discounts');
    } catch (error) {
      console.error('Error saving discount:', error);
      toast.error(error.response?.data?.message || 'Failed to save discount');
    } finally {
      setLoading(false);
    }
  };

  // Watch is_active checkbox for controlled input
  const isActiveValue = watch("is_active");

  //test
  useEffect(()=>{
console.log("watchedValues,selectedBrands",watchedValues,selectedBrands)
console.log("errors",errors)
  },[watchedValues,selectedBrands,errors])

  return (
    <div className="p-6">
      <Card className="h-full w-full p-4">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography className='font-sora' variant="h3" color="blue-gray">
                {isEditMode ? 'Edit Discount' : 'Add New Discount'}
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                {isEditMode ? 'Update the discount details' : 'Fill in the details to add a discount'}
              </Typography>
            </div>
          </div>
        </CardHeader>

        <CardBody className="overflow-auto px-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div>
              <label className="block mb-2">Code <span className="text-red-700">*</span></label>
              <input
                type="text"
                {...register("code")}
                className={`w-full border rounded-lg p-2 ${errors.code ? "border-red-500" : "border-gray-300"}`}
                placeholder="Discount Code"
              />
              {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}
            </div>

            <div className="relative w-full" ref={dropdownRef}>
              <label className="block mb-1 font-medium">Select Brands</label>
              <div
                onClick={toggleDropdown}
                className="border border-gray-300 rounded-lg p-2 cursor-pointer w-full bg-white focus:ring-1 focus:ring-[#BEA355]"
              >
                {selectedBrands.length > 0
                  ? selectedBrands.map(pkg => pkg.name).join(', ')
                  : 'Select brand(s)'}
              </div>

              {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                  {brandList.map(pkg => (
                    <label
                      key={pkg.id}
                      className="flex items-center cursor-pointer px-4 py-2 hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        className="form-checkbox cursor-pointer mr-2 text-[#BEA355]"
                        checked={selectedBrands.some(p => p.id === pkg.id)}
                        onChange={() => handleCheckboxChange(pkg)}
                      />
                      {pkg.name} 
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* <div>
              <label className="block mb-2">Discount Amount <span className="text-red-700"></span></label>
              <input
                type="number"
                 step="any"
                {...register("discount", { valueAsNumber: true })}
                className={`w-full border rounded-lg p-2 ${errors.discount ? "border-red-500" : "border-gray-300"}`}
                placeholder="20"
              />
              {errors.discount && <p className="text-red-500 text-sm">{errors.discount.message}</p>}
            </div> */}

            {/* <div>
              <label className="block mb-2">Valid From</label>
              <input
                type="date"
                {...register("valid_from")}
                className="w-full border rounded-lg p-2 border-gray-300"
              />
            </div>

            <div>
              <label className="block mb-2">Valid To</label>
              <input
                type="date"
                {...register("valid_to")}
                className="w-full border rounded-lg p-2 border-gray-300"
              />
            </div> */}

            <div>
              <label className="block mb-2">Max Uses</label>
              <input
                type="number"
                step="any"
                {...register("max_uses", { valueAsNumber: true })}
                className="w-full border rounded-lg p-2 border-gray-300"
                placeholder="100"
              />
            </div>

            {/* <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("is_active")}
                // defaultChecked={true}
                id="is_active"
              />
              <label htmlFor="is_active">Active</label>
            </div> */}

      

            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/discounts')}
                className="px-4 py-2 text-gray-600 rounded-full border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#BEA355] text-white rounded-full hover:bg-yellow-600 disabled:opacity-50"
              >
                {loading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Discount' : 'Add Discount')}
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddDiscountGlobal;
