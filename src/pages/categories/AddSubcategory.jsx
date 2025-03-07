import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Input, Button } from "@material-tailwind/react";
import { createSubcategory } from '../../services/api/subcategoryService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Define the Zod schema for validation
const schema = z.object({
  subcategoryTitle: z.string().min(1, "Subcategory Title is required"),
});

const AddSubcategory = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await createSubcategory(data.subcategoryTitle);
      toast.success('Subcategory created successfully');
      navigate('/categories/subcategories');
    } catch (error) {
      console.error('Error creating subcategory:', error);
      toast.error('Failed to create subcategory');
    }
  };

  return (
    <div className="p-6">
      <Card className="p-6">
        <h1 className="text-3xl font-sora font-semibold mb-6">Add New Subcategory</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Input 
              label="Subcategory Title" 
              {...register('subcategoryTitle')} 
              error={!!errors.subcategoryTitle}
            />
            {errors.subcategoryTitle && (
              <span className="text-red-500 text-sm">{errors.subcategoryTitle.message}</span>
            )}
          </div>
          
          <div className="flex justify-end gap-4">
            <Button
              variant="text"
              color="gray"
              onClick={() => navigate('/categories/subcategories')}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-full bg-[#BEA355] font-medium capitalize"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Add Subcategory'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddSubcategory;
