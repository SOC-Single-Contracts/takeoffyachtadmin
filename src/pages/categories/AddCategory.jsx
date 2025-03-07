import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Input, Button } from "@material-tailwind/react";
import { createCategory } from '../../services/api/categoryService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Define the Zod schema for validation
const schema = z.object({
  categoryTitle: z.string().min(1, "Category Title is required"),
});

const AddCategory = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await createCategory(data.categoryTitle);
      toast.success('Category created successfully');
      navigate('/categories');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    }
  };

  return (
    <div className="p-6">
      <Card className="p-6">
        <h1 className="text-3xl font-sora font-semibold mb-6">Add New Category</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="categoryTitle">Category Title</label>
            <Input 
              // label="Category Title" 
              {...register('categoryTitle')} 
              error={!!errors.categoryTitle}
              className="rounded-md mt-1"
            />
            {errors.categoryTitle && (
              <span className="text-red-500 text-sm">{errors.categoryTitle.message}</span>
            )}
          </div>
          
          <div className="flex justify-end gap-4">
            <Button
              variant="text"
              color="gray"
              onClick={() => navigate('/categories')}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-full bg-[#BEA355] rounded-full hover:bg-yellow-600 font-medium capitalize"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Add Category'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddCategory;