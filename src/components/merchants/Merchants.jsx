import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import avatar from "../../assets/images/Avatar.png";
import { getAllUsers } from '../../services/api/userManagement';

const TABLE_HEAD = ["Name", "Email", "Status", ""];

const Merchants = () => {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      const users = await getAllUsers();
      // Filter only CLT users
      const consultantUsers = users.filter(user => user.user_type === 'CLT').map(user => ({
        id: user.ID,
        name: user.Username,
        email: user.Email,
        status: user.user_type === 'CLT' ? 'Active' : 'Inactive'
      }));
      setMerchants(consultantUsers);
    } catch (error) {
      console.error('Error fetching merchants:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Inactive":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCurrentPageMerchants = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return merchants.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(merchants.length / itemsPerPage);

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
                All Merchants
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                These are details about all merchants
              </Typography>
            </div>
            <div className="flex w-full shrink-0 gap-2 md:w-max">
              <Link to="/merchants/add">
                <Button className="flex items-center bg-[#BEA355] gap-3 rounded-full capitalize font-medium" color="blue" size="sm">
                  Add Merchant
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-auto px-0">
          <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm bg-white">
            <thead className="bg-black text-white text-sm uppercase font-medium text-gray-600 rounded-t-lg">
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th key={head} className="py-3 px-4">
                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800 rounded-b-lg font-bold">
              {getCurrentPageMerchants().map((merchant) => (
                <tr
                  key={merchant.id}
                  className="hover:bg-[#BEA35514] hover:cursor-pointer"
                >
                  <td className="py-4 px-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full">
                      <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    {merchant.name}
                  </td>
                  <td className="py-4 px-4">{merchant.email}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`flex items-center justify-center gap-1 w-fit px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                        merchant.status
                      )}`}
                    >
                      <GoDotFill />
                      {merchant.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-gray-500 hover:text-gray-700 rotate-90">•••</button>
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
    </div>
  );
};

export default Merchants;
