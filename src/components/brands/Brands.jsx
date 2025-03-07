import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Typography, Button, IconButton } from "@material-tailwind/react";
import { Link } from 'react-router-dom';
import { getAllBrands } from '../../services/api/brandService';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const data = await getAllBrands();
      setBrands(data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPageBrands = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return brands.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(brands.length / itemsPerPage);

  return (
    <div className="p-6">
      <Card className="h-full w-full p-4">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography className='font-sora' variant="h3" color="blue-gray">
                All Brands
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Manage your brands
              </Typography>
            </div>
            <Link to="/brands/add">
              <Button className="flex items-center bg-[#BEA355] gap-3 rounded-full font-medium capitalize" size="md">
                Add Brand
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
              {loading ? (
                <tr>
                  <td colSpan="2" className="p-4 text-center">Loading...</td>
                </tr>
              ) : brands.length === 0 ? (
                <tr>
                  <td colSpan="2" className="p-4 text-center">No brands found</td>
                </tr>
              ) : (
                getCurrentPageBrands().map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50">
                    <td className="p-4">{brand.title}</td>
                    <td className="p-4">
                      <Link to={`/brands/edit/${brand.id}`}> 
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

export default Brands;