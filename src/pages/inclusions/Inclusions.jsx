import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Typography, Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, CardFooter, IconButton } from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import { getAllInclusions } from '../../services/api/inclusionsService';

const AllInclusions = () => {
  const [loading, setLoading] = useState(true);
  const [inclusions, setInclusions] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchInclusions();
  }, []);

  const fetchInclusions = async () => {
    try {
      setLoading(true);
      const data = await getAllInclusions();
      setInclusions(data);
    } catch (err) {
      setError('Failed to fetch inclusions');
      console.error('Error fetching inclusions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPageInclusions = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return inclusions.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(inclusions.length / itemsPerPage);

  if (loading) {
    return (
      <div className="p-6">
        <Card className="h-full w-full p-4">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center animate-pulse">
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </CardHeader>
          <CardBody className="overflow-auto px-0">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded"></div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="h-full w-full p-4">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography className='font-sora' variant="h3" color="blue-gray">
                All Inclusions
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Manage your inclusions
              </Typography>
            </div>
            <Link to="/inclusions/add">
              <Button className="flex items-center bg-[#BEA355] rounded-full gap-3 capitalize font-medium" size="md">
                Add Inclusion
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardBody className="overflow-auto px-0">
          {error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : inclusions.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No inclusions found</div>
          ) : (
            <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm bg-white">
              <thead className="bg-black text-white text-sm uppercase font-medium">
                <tr>
                  <th className="border-b border-blue-gray-100 p-4">Dark Icon</th>
                  <th className="border-b border-blue-gray-100 p-4">Light Icon</th>
                  <th className="border-b border-blue-gray-100 p-4">Title</th>
                  <th className="border-b border-blue-gray-100 p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentPageInclusions().map((inclusion) => (
                  <tr key={inclusion.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      {inclusion.dark_icon ? (
                        <img 
                          src={`https://api.takeoffyachts.com${inclusion.dark_icon}`}
                          alt="Dark Icon" 
                          className="w-8 h-8 object-contain"
                        />
                      ) : 'No icon'}
                    </td>
                    <td className="p-4">
                      {inclusion.light_icon ? (
                        <img 
                          src={`https://api.takeoffyachts.com${inclusion.light_icon}`}
                          alt="Light Icon"
                          className="w-8 h-8 object-contain"
                        />
                      ) : 'No icon'}
                    </td>
                    <td className="p-4">{inclusion.name}</td>
                    <td className="p-4">
                      <Link to={`/inclusions/edit/${inclusion.id}`}> 
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

export default AllInclusions;