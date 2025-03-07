import React, { useState, useEffect } from 'react';
import { Card, Button, Typography } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const TestimonialList = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get('https://api.takeoffyachts.com/yacht/yacht_testimonal/');
      if (response.data.error_code === 'pass') {
        setTestimonials(response.data.testimonal || []);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (testimonialId) => {
    navigate(`/testimonials/edit/${testimonialId}`);
  };

  const handleDelete = async (testimonialId) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        const response = await axios.delete(`https://api.takeoffyachts.com/yacht/yacht_testimonal/${testimonialId}`);
        if (response.data.error_code === 'pass') {
          toast.success('Testimonial deleted successfully');
          fetchTestimonials();
        }
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        toast.error('Failed to delete testimonial');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BEA355]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="font-sora">Testimonials</Typography>
          <Button
            className="bg-[#BEA355] text-white px-6 py-2 rounded-full hover:bg-[#A58B3D] capitalize font-medium"
            onClick={() => navigate('/testimonials/add')}
          >
            Add Testimonial
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-4 shadow-lg transition-transform transform hover:scale-105 duration-300 border border-gray-200 rounded-lg">
              <div className="relative pb-4 rounded-lg overflow-hidden">
                {testimonial.testimonal_image ? (
                  <img
                    src={`https://api.takeoffyachts.com${testimonial.testimonal_image}`}
                    alt={testimonial.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <Typography color="gray">No Image Available</Typography>
                  </div>
                )}
                <div className="p-4">
                  <Typography variant="h6" className="font-semibold text-lg mb-1 text-[#BEA355]">{testimonial.name}</Typography>
                  <Typography variant="small" color="gray" className="mb-2">{testimonial.location}</Typography>
                  <Typography variant="paragraph" className="mb-4 text-gray-700">{testimonial.statement || 'No statement provided'}</Typography>
                  {testimonial.star_count && (
                    <Typography variant="small" color="gray" className="mb-2">
                      Rating: {testimonial.star_count} stars
                    </Typography>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      className="bg-[#BEA355] hover:bg-[#A58B3D] text-white"
                      onClick={() => handleEdit(testimonial.id)}
                    >
                      Edit
                    </Button>
                    {/* <Button
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => handleDelete(testimonial.id)}
                    >
                      Delete
                    </Button> */}
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {testimonials.length === 0 && (
            <div className="col-span-3 text-center py-8">
              <Typography color="gray">No testimonials found</Typography>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TestimonialList;
