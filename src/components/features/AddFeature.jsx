import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Input, Button } from "@material-tailwind/react";
import { createSubcategory } from '../../services/api/subcategoryService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  featureTitle: z.string().min(1, "Feature Title is required"),
});

const AddFeature = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await createSubcategory(data.featureTitle);
      toast.success('Feature created successfully');
      navigate('/features');
    } catch (error) {
      console.error('Error creating feature:', error);
      toast.error('Failed to create feature');
    }
  };

  return (
    <div className="p-6">
      <Card className="p-6">
        <h1 className="text-3xl font-sora font-semibold mb-6">Add New Feature</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="featureTitle">Feature Title</label>
            <Input 
              // label="Feature Title" 
              {...register('featureTitle')} 
              error={!!errors.featureTitle}
              className="rounded-md mt-1"
            />
            {errors.featureTitle && (
              <span className="text-red-500 text-sm">{errors.featureTitle.message}</span>
            )}
          </div>
          
          <div className="flex justify-end gap-4">
            <Button
              variant="text"
              color="gray"
              onClick={() => navigate('/features')}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-full bg-[#BEA355] font-medium capitalize"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Add Feature'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddFeature;
