import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Typography, Button, IconButton } from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import { getAllDiscounts } from '../../services/api/discountService'; // ✅ Update the API service

const Discounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const data = await getAllDiscounts(token); // ✅ Use discount API
      setDiscounts(data || []);
    } catch (error) {
      console.error('Error fetching discounts:', error);
      setDiscounts([]);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPageDiscounts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return discounts.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(discounts.length / itemsPerPage);

  return (
    <div className="p-6">
      <Card className="h-full w-full p-4">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography className='font-sora' variant="h3" color="blue-gray">
                All Discounts
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Manage your discounts
              </Typography>
            </div>
            <Link to="/discounts/add">
              <Button className="flex items-center bg-[#BEA355] gap-3 rounded-full font-medium capitalize" size="md">
                Add Discount
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardBody className="overflow-auto px-0">
          <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm bg-white">
            <thead className="bg-black text-white text-sm uppercase font-medium">
              <tr>
                <th className="border-b border-blue-gray-100 p-4">Code</th>
                <th className="border-b border-blue-gray-100 p-4">Status</th>
                <th className="border-b border-blue-gray-100 p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="2" className="p-4 text-center">Loading...</td>
                </tr>
              ) : discounts.length === 0 ? (
                <tr>
                  <td colSpan="2" className="p-4 text-center">No discounts found</td>
                </tr>
              ) : (
                getCurrentPageDiscounts().map((discount) => (
                  <tr key={discount.id} className="hover:bg-gray-50">
                    <td className="p-4">{discount.code}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${!discount?.is_expired || !discount?.is_active  ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {!discount?.is_expired || discount?.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link to={`/discounts/edit/${discount.id}`}>
                        <Button variant="text" className="text-[#BEA355]">Edit</Button>
                      </Link>
                    </td>
                  </tr>
                ))
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
    </div>
  );
};

export default Discounts;
