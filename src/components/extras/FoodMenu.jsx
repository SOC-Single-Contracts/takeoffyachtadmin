import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Typography, Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, CardFooter, IconButton } from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import { getAllExtras, updateExtra } from '../../services/api/extrasService';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.VITE_S3_URL || 'https://images-yacht.s3.us-east-1.amazonaws.com';

const FoodMenu = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await getAllExtras();
      const foodItems = response.food.map(item => ({
        id: item.id,
        title: item.name,
        price: item.price,
        image: item.food_image ? `${BASE_URL}${item.food_image}` : null

      }));
      setFoodItems(foodItems);
    } catch (error) {
      console.error('Error fetching food items:', error);
      toast.error('Failed to fetch food items');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return foodItems.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(foodItems.length / itemsPerPage);

  const handleOpen = (item) => {
    setSelectedItem(item);
    setNewPrice(item.price.toString());
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
    setNewPrice("");
  };

  const handleEdit = async () => {
    if (!selectedItem || !newPrice || isNaN(newPrice)) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      await updateExtra(selectedItem.id, parseFloat(newPrice));
      toast.success('Price updated successfully');
      handleClose();
      fetchFoodItems(); // Refresh the list
    } catch (error) {
      console.error('Error updating price:', error);
      toast.error('Failed to update price');
    }
  };

  //test

  useEffect(()=>{
 console.log("Current Page Items: ", getCurrentPageItems());  
  },[getCurrentPageItems()])

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
                All Food Menu
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Manage your food items
              </Typography>
            </div>
            <Link to="/extras/add">
              <Button className="flex items-center bg-[#BEA355] rounded-full capitalize gap-3 font-medium" size="sm">
                Add New Food Item
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardBody className="overflow-auto px-0">
          <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm bg-white">
            <thead className="bg-black text-white text-sm uppercase font-medium">
              <tr>
                <th className="border-b border-blue-gray-100 p-4">Title</th>
                <th className="border-b border-blue-gray-100 p-4">Price</th>
                <th className="border-b border-blue-gray-100 p-4">Image</th>
                <th className="border-b border-blue-gray-100 p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentPageItems().map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4">{item.title}</td>
                  <td className="p-4">{import.meta.env.VITE_CURRENCY || "AED"} {item.price}</td>
                  <td className="p-4">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="p-4">
                    <Button 
                      variant="text" 
                      className="text-[#BEA355]"
                      onClick={() => handleOpen(item)}
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
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

      {/* Edit Price Modal */}
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
        <DialogHeader className="font-sora justify-center">Edit Price</DialogHeader>
        <DialogBody divider className="px-6">
          <div className="space-y-4">
            <Typography variant="paragraph" color="blue-gray" className="font-normal text-center">
              Update price for {selectedItem?.title}
            </Typography>
            <Input
              type="number"
              label="Price"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="focus:ring-[#BEA355]"
              containerProps={{ className: "min-w-[72px]" }}
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
            Update Price
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default FoodMenu;