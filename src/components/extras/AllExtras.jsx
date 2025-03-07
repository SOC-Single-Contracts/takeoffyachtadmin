import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Typography, Button, IconButton, Dialog, DialogHeader, DialogBody, DialogFooter, Input } from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import { getAllExtras, updateExtra } from '../../services/api/extrasService';
import { toast } from 'react-toastify';

const BASE_URL = 'https://api.takeoffyachts.com';

const AllExtras = () => {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAllItems();
  }, []);

  const fetchAllItems = async () => {
    try {
      const response = await getAllExtras();
      
      const foodItems = response.food.map(item => ({
        id: item.id,
        title: item.name,
        price: item.price,
        category: 'food',
        image: item.food_image ? `${BASE_URL}${item.food_image}` : null
      }));

      const sportItems = response.sport.map(item => ({
        id: item.id,
        title: item.name,
        price: item.price,
        category: 'sport',
        image: item.food_image ? `${BASE_URL}${item.food_image}` : null
      }));

      const extraItems = response.extra.map(item => ({
        id: item.id,
        title: item.name,
        price: item.price,
        category: 'misc',
        image: item.food_image ? `${BASE_URL}${item.food_image}` : null
      }));

      const allItems = [...foodItems, ...sportItems, ...extraItems];
      setAllItems(allItems);
    } catch (error) {
      console.error('Error fetching all items:', error);
      toast.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

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
      fetchAllItems(); // Refresh the list
    } catch (error) {
      console.error('Error updating price:', error);
      toast.error('Failed to update price');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(allItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = allItems.slice(startIndex, endIndex);

  const next = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getPageNumbers = () => {
    const delta = 1; // Number of pages to show before and after current page
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
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
                All Extras
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Manage all your extra items
              </Typography>
            </div>
            <Link to="/extras/add">
              <Button className="flex items-center bg-[#BEA355] rounded-full capitalize gap-3 font-medium" size="sm">
                Add New Item
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardBody className="overflow-auto px-0">
          <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm bg-white">
            <thead className="bg-black text-white text-sm uppercase font-medium">
              <tr>
                <th className="border-b border-blue-gray-100 p-4">Title</th>
                <th className="border-b border-blue-gray-100 p-4">Category</th>
                <th className="border-b border-blue-gray-100 p-4">Price</th>
                <th className="border-b border-blue-gray-100 p-4">Image</th>
                <th className="border-b border-blue-gray-100 p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4">{item.title}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.category === 'food' ? 'bg-green-100 text-green-800' :
                      item.category === 'sport' ? 'bg-blue-100 text-blue-800' :
                      item.category === 'misc' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">${item.price}</td>
                  <td className="p-4">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-6 bg-gray-100 rounded flex items-center justify-center">
                        <Typography variant="small" className="text-gray-500">
                          No image
                        </Typography>
                      </div>
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
          
          {/* Pagination */}
          <div className="flex items-center gap-4 justify-center mt-4">
            <Button
              variant="text"
              className="flex items-center gap-2 text-[#BEA355]"
              onClick={prev}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {getPageNumbers().map((number, index) => (
                <React.Fragment key={index}>
                  {number === "..." ? (
                    <span className="px-3 py-2">...</span>
                  ) : (
                    <IconButton
                      variant={currentPage === number ? "filled" : "text"}
                      className={currentPage === number ? "bg-[#BEA355]" : "text-[#BEA355]"}
                      onClick={() => setCurrentPage(number)}
                    >
                      {number}
                    </IconButton>
                  )}
                </React.Fragment>
              ))}
            </div>

            <Button
              variant="text"
              className="flex items-center gap-2 text-[#BEA355]"
              onClick={next}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardBody>
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
            <Typography variant="paragraph" color="blue-gray" className="font-normal text-center mb-4">
              Update price for {selectedItem?.title}
            </Typography>
            <label htmlFor="price">Price</label>
            <Input
              type="number"
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

export default AllExtras;
