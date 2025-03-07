import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Typography, Button, IconButton } from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import { getAllBoats } from '../../services/api/boatService';

const NewYearBoats = () => {
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBoats();
  }, []);

  const fetchBoats = async () => {
    try {
      // Pass 'new_year' as the feature to filter New Year boats
      const data = await getAllBoats('new_year');
      setBoats(data);
    } catch (error) {
      console.error('Error fetching New Year boats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPageBoats = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return boats.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(boats.length / itemsPerPage);

  return (
    <div className="p-6">
      <Card className="h-full w-full p-4">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography variant="h3" className='font-sora' color="black">
                New Year Boats
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Manage your New Year boat listings
              </Typography>
            </div>
            <Link to="/boats/newyear/add">
              <Button className="flex items-center bg-[#BEA355] gap-3 rounded-full capitalize font-medium" size="sm">
                Add New Year Boat
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardBody className="overflow-auto px-0">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BEA355]"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm bg-white">
              <thead className="bg-black text-white text-sm uppercase font-medium">
                <tr>
                  <th className="border-b border-blue-gray-100 p-4">Title</th>
                  <th className="border-b border-blue-gray-100 p-4">Location</th>
                  <th className="border-b border-blue-gray-100 p-4">Price per hour</th>
                  <th className="border-b border-blue-gray-100 p-4">Status</th>
                  <th className="border-b border-blue-gray-100 p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentPageBoats().map((boat) => (
                  <tr key={boat.yacht.id} className="hover:bg-gray-50">
                    <td className="p-4">{boat.yacht.title}</td>
                    <td className="p-4">{boat.yacht.location}</td>
                    <td className="p-4">{boat.yacht.per_hour_price} AED</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        boat.yacht.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {boat.yacht.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link to={`/boats/newyear/edit/${boat.yacht.id}`}>
                        <Button variant="text" className="text-[#BEA355]">
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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

export default NewYearBoats;