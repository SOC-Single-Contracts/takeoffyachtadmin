import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Typography, Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, CardFooter, IconButton } from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import { getAllSpecifications } from '../../services/api/specificationsService';

const Specifications = () => {
  const [loading, setLoading] = useState(true);
  const [specifications, setSpecifications] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSpecifications();
  }, []);

  const fetchSpecifications = async () => {
    try {
      setLoading(true);
      const data = await getAllSpecifications();
      setSpecifications(data);
    } catch (err) {
      setError('Failed to fetch specifications');
      console.error('Error fetching specifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPageSpecifications = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return specifications.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(specifications.length / itemsPerPage);

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
              <Typography variant="h3" className='font-sora' color="blue-gray">
                All Specifications
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Manage your yacht specifications
              </Typography>
            </div>
            <Link to="/specifications/add">
              <Button className="flex items-center bg-[#BEA355] rounded-full gap-3 capitalize font-medium" size="md">
                Add Specification
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardBody className="overflow-auto px-0">
          {error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : specifications.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No specifications found</div>
          ) : (
            <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm bg-white">
              <thead className="bg-black text-white text-sm uppercase font-medium">
                <tr>
                  <th className="border-b border-blue-gray-100 p-4">Title</th>
                  <th className="border-b border-blue-gray-100 p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentPageSpecifications().map((specification) => (
                  <tr key={specification.id} className="hover:bg-gray-50">
                    <td className="p-4">{specification.title}</td>
                    <td className="p-4">
                      <Link to={`/specifications/edit/${specification.id}`}> 
                        <Button variant="text" className="text-[#BEA355]">
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {specifications.length === 0 && (
                  <tr>
                    <td colSpan={2} className="p-4 text-center text-gray-500">
                      No specifications found
                    </td>
                  </tr>
                )}
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

export default Specifications;