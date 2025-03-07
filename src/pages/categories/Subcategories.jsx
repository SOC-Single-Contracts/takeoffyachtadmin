import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Typography, Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input } from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import { getAllSubcategories, updateSubcategory } from '../../services/api/subcategoryService';
import { toast } from 'react-toastify';

const Subcategories = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const response = await getAllSubcategories();
      const subcategoriesArray = response.sub_category || [];
      // Transform string array into array of objects with id and name
      const formattedSubcategories = subcategoriesArray.map((name, index) => ({
        id: index + 1,
        name: name
      }));
      setSubcategories(formattedSubcategories);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      toast.error('Failed to fetch subcategories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setNewName(subcategory.name);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSubcategory(null);
    setNewName("");
  };

  const handleEdit = async () => {
    if (!selectedSubcategory || !newName.trim()) {
      toast.error('Please enter a valid name');
      return;
    }

    try {
      await updateSubcategory(selectedSubcategory.id, newName.trim());
      toast.success('Subcategory updated successfully');
      handleClose();
      fetchSubcategories();
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
                All Subcategories
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Manage your subcategories
              </Typography>
            </div>
            <Link to="/categories/subcategory/add">
              <Button className="flex items-center bg-[#BEA355] rounded-full capitalize gap-3 font-medium" size="sm">
                Add New Subcategory
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
              {subcategories.map((subcategory) => (
                <tr key={subcategory.id} className="hover:bg-gray-50">
                  <td className="p-4">{subcategory.name}</td>
                  <td className="p-4">
                    <Button 
                      variant="text" 
                      className="text-[#BEA355]"
                      onClick={() => handleOpen(subcategory)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
              {subcategories.length === 0 && (
                <tr>
                  <td colSpan={2} className="p-4 text-center text-gray-500">
                    No subcategories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Edit Subcategory Modal */}
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
        <DialogHeader className="font-sora justify-center">Edit Subcategory</DialogHeader>
        <DialogBody divider className="px-6">
          <div className="space-y-4">
            <Typography variant="paragraph" color="blue-gray" className="font-normal text-center">
              Update name for {selectedSubcategory?.name}
            </Typography>
            <Input
              type="text"
              label="Subcategory Name"
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
            className="rounded-full bg-[#BEA355]" 
            onClick={handleEdit}
          >
            Update Subcategory
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Subcategories;
