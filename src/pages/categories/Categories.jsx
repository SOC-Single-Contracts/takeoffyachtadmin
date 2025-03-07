import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Typography, Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, CardFooter, IconButton } from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import { getAllCategories, updateCategory } from '../../services/api/categoryService';
import { toast } from 'react-toastify';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newName, setNewName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategories();
      const categoriesArray = response.category || [];
      const formattedCategories = categoriesArray.map((name, index) => ({
        id: index + 1,
        name: name
      }));
      setCategories(formattedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPageCategories = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return categories.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const handleOpen = (category) => {
    setSelectedCategory(category);
    setNewName(category.name);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
    setNewName("");
  };

  const handleEdit = async () => {
    if (!selectedCategory || !newName.trim()) {
      toast.error('Please enter a valid name');
      return;
    }

    try {
      await updateCategory(selectedCategory.id, newName.trim());
      toast.success('Category updated successfully');
      handleClose();
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
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
              <Typography variant="h3" className='font-sora' color="blue-gray">
                All Categories
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Manage your categories
              </Typography>
            </div>
            <Link to="/categories/add">
              <Button className="flex items-center bg-[#BEA355] gap-3 rounded-full capitalize font-medium" size="sm">
                Add New Category
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
              {getCurrentPageCategories().map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="p-4">{category.name}</td>
                  <td className="p-4">
                    <Button 
                      variant="text" 
                      className="text-[#BEA355]"
                      onClick={() => handleOpen(category)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={2} className="p-4 text-center text-gray-500">
                    No categories found
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

      {/* Edit Category Modal */}
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
        <DialogHeader className="font-sora justify-center">Edit Category</DialogHeader>
        <DialogBody divider className="px-6">
          <div className="space-y-4">
            <Typography variant="paragraph" color="blue-gray" className="font-normal text-center">
              Update name for {selectedCategory?.name}
            </Typography>
            {/* <label htmlFor="categoryName">Category Name</label> */}
            <Input
              type="text"
              // label="Category Name"
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
            className="rounded-full bg-[#BEA355] rounded-full hover:bg-yellow-600 capitalize font-medium" 
            onClick={handleEdit}
          >
            Update Category
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Categories;