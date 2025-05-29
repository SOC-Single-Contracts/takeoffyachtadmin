import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Typography, Button, IconButton, Dialog, DialogHeader, DialogBody, DialogFooter, Input } from "@material-tailwind/react";
import { Link, useNavigate } from 'react-router-dom';
import { getAllExtras, updateExtra } from '../../services/api/extrasService';
import { toast } from 'react-toastify';
import { use } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_S3_URL || 'https://images-yacht.s3.us-east-1.amazonaws.com';

const PackagesListingGlobal = () => {
  const [allItems, setAllItems] = useState([]);
  const [originalItems, setOriginalItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newPrice, setNewPrice] = useState("");
  const itemsPerPage = 5;
  const [query, setQuery] = useState('');
  const [searchValue, setsearchValue] = useState('');







  const handleFilterChange = () => {
    const filtered = originalItems.filter((pkg) => {
      const packageType = pkg?.package_type?.toLowerCase() || "";
      const description = pkg?.description?.toLowerCase() || "";
      const price = pkg?.price?.toString().toLowerCase() || "";

      return (
        packageType.includes(searchValue.toLowerCase()) ||
        description.includes(searchValue.toLowerCase()) ||
        price.includes(searchValue.toLowerCase())
      );
    });

    setAllItems(filtered);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setsearchValue(query);
    }, 500);

    return () => {
      clearTimeout(handler); // Clear the timeout if query changes before 500ms
    };
  }, [query]);

  useEffect(() => {
    setCurrentPage(1);
    if (searchValue) {
      handleFilterChange();
    } else if (!searchValue) {
      setAllItems(originalItems);
    }
  }, [searchValue]);
  useEffect(() => {
    const fetchPackageList = async () => {
      try {
        const response = await axios.get('https://api.takeoffyachts.com/yacht/package/');
        if (response?.data?.error_code === 'pass') {
          setAllItems(response?.data?.package);
          setOriginalItems(response?.data?.package);
          setLoading(false)
        }
      } catch (error) {
        console.error('Error fetching PackageList:', error);
        setAllItems([]);
        setLoading(false)

      }
    };
    fetchPackageList();
  }, []);



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
      fetchPackageList(); // Refresh the list
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

  //test

  // useEffect(()=>{

  //   console.log("allItems",allItems)
  // },[allItems])
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
                All Packages
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Manage all your Package items
              </Typography>
            </div>

            {/* <Link to="/packages/add">
              <Button className="flex items-center bg-[#BEA355] rounded-full capitalize gap-3 font-medium" size="sm">
                Add New Package
              </Button>
            </Link> */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <Input
                className='rounded-lg '
                placeholder='Search'
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-auto px-0">
          <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm bg-white">
            <thead className="bg-black text-white text-sm uppercase font-medium">
              <tr>
                <th className="border-b border-blue-gray-100 p-4">Package Type</th>
                <th className="border-b border-blue-gray-100 p-4">Price</th>
                <th className="border-b border-blue-gray-100 p-4">Description</th>
                <th className="border-b border-blue-gray-100 p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4">{item?.package_type}</td>
                  <td className="p-4">
                    {import.meta.env.VITE_CURRENCY || "AED"}   {item?.price}

                  </td>
                  <td className="p-4">{item.description}</td>

                  <td className="p-4">
                    <Button
                      variant="text"
                      className="text-[#BEA355]"
                      onClick={() => navigate(`/packages/edit/${item?.id}`)}
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

export default PackagesListingGlobal;
