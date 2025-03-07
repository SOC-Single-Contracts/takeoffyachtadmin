import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Typography, Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, CardFooter, IconButton } from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import { getAllSubcategories, updateSubcategory } from '../../services/api/subcategoryService';
import { toast } from 'react-toastify';

const Features = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [newName, setNewName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const response = await getAllSubcategories();
      const featuresArray = response.sub_category || [];
      const formattedFeatures = featuresArray.map((name, index) => ({
        id: index + 1,
        name: name
      }));
      setFeatures(formattedFeatures);
    } catch (error) {
      console.error('Error fetching features:', error);
      toast.error('Failed to fetch features');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPageFeatures = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return features.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(features.length / itemsPerPage);

  const handleOpen = (feature) => {
    setSelectedFeature(feature);
    setNewName(feature.name);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFeature(null);
    setNewName("");
  };

  const handleEdit = async () => {
    if (!selectedFeature || !newName.trim()) {
      toast.error('Please enter a valid name');
      return;
    }

    try {
      await updateSubcategory(selectedFeature.id, newName.trim());
      toast.success('Feature updated successfully');
      handleClose();
      fetchFeatures();
    } catch (error) {
      console.error('Error updating subcategory:', error);
      toast.error('Failed to update subcategory');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="h-full w-full p-4">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography variant="h3" className="font-sora" color="blue-gray">
                All Features
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Manage your features
              </Typography>
            </div>
            <Link to="/features/add">
              <Button className="flex items-center bg-[#BEA355] rounded-full capitalize gap-3 font-medium" size="sm">
                Add New Feature
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardBody className="overflow-auto px-0">
          <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm bg-white">
            <thead className="bg-black text-white text-sm uppercase font-medium">
              <tr>
                <th className="border-b border-blue-gray-100 p-4">Title</th>
                <th className="border-b border-blue-gray-100 p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentPageFeatures().map((feature) => (
                <tr key={feature.id} className="hover:bg-gray-50">
                  <td className="p-4">{feature.name}</td>
                  <td className="p-4">
                    <Button 
                      variant="text" 
                      className="text-[#BEA355]"
                      onClick={() => handleOpen(feature)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
              {features.length === 0 && (
                <tr>
                  <td colSpan={2} className="p-4 text-center text-gray-500">
                    No features found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Button 
            variant="outlined" 
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <IconButton
                key={index + 1}
                variant={currentPage === index + 1 ? "outlined" : "text"}
                size="sm"
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </IconButton>
            ))}
          </div>
          <Button 
            variant="outlined" 
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </CardFooter>
      </Card>

      {/* Edit Feature Modal */}
      <Dialog
        open={open}
        handler={handleClose}
        size="xs"
        className="min-w-[80%] md:min-w-[40%]"
        dismiss={{
          outsidePress: false,
        }}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader className="font-sora justify-center">Edit Feature</DialogHeader>
        <DialogBody divider className="px-6">
          <div className="space-y-4">
            <Typography variant="paragraph" color="blue-gray" className="font-normal text-center">
              Update name for {selectedFeature?.name}
            </Typography>
            <Input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="focus:ring-[#BEA355]"
            />
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2 justify-center">
          <Button 
            variant="text" 
            color="gray" 
            onClick={handleClose}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button 
            className="rounded-full bg-[#BEA355] rounded-full capitalize font-medium" 
            onClick={handleEdit}
          >
            Update Feature
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Features;
