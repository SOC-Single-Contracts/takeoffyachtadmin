import React, { useState, useEffect } from "react";

import { GoDotFill } from "react-icons/go";
import avatar from "../assets/images/Avatar.png";
import { getAllUsers } from '../services/api/userManagement';
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, CardFooter, Typography, Button, IconButton, Dialog, DialogHeader, DialogBody, Input } from "@material-tailwind/react";
import { ArrowLeftIcon, ArrowRightIcon, FlagIcon, LocateIcon, PowerIcon, ShipIcon, TypeIcon } from "lucide-react";
import { FaXmark } from "react-icons/fa6";
import axios from "axios";

const InfoRow = ({ label, value, icon }) => (
  <div className="flex justify-between">
    <span className="font-semibold">{label}:</span>
    <span className="flex items-center">
      {icon && <icon className="h-5 w-5 mr-2" />}
      {value}
    </span>
  </div>
);

const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.takeoffyachts.com';

const ActiveUsersTable = ({ limit }) => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = limit || 10;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYacht, setSelectedYacht] = useState(null);
  const [query, setQuery] = useState('');
  const [searchValue, setsearchValue] = useState('');





  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      const formattedUsers = data.map(user => ({
        id: user.ID,
        name: user.Username,
        email: user.Email,
        status: user.user_type === 'ADM' ? 'Admin' :
          user.user_type === 'CLT' ? 'Client' : 'User',
        wallet: user?.wallet
      }));
      setAllUsers(formattedUsers);
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (yacht) => {
    setSelectedYacht(yacht);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedYacht(null);
  };
  const getStatusClass = (status) => {
    switch (status) {
      case 'Admin':
        return "bg-purple-100 text-purple-700";
      case 'Client':
        return "bg-blue-100 text-blue-700";
      case 'User':
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCurrentPageUsers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return users.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handleFilterChange = () => {
    const filtered = allUsers.filter((user) =>
      user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      user.email.toLowerCase().includes(searchValue.toLowerCase())
    );
    setUsers(filtered);
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
      setUsers(allUsers);
    }
  }, [searchValue]);

  useEffect(() => {
    fetchUsers();
  }, []);

  //test
  //   useEffect(()=>{
  // console.log(getCurrentPageUsers()) 
  //   },[ getCurrentPageUsers()])
  // console.log(selectedYacht)

  // useEffect(()=>{
  // console.log("searchValue",searchValue)
  // },[searchValue])

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
  const deleteUser = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/Auth/profile/delete_user/`,
        {
          data:
          {
            admin_id: 3,
            user_id: id
          }
        }
      );
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  return (
    <div className="w-full">
      <Card className="h-full w-full p-4">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography variant="h3" className='font-sora' color="black">
                Active Users
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                These are details about all users
              </Typography>
            </div>
          </div>

          <div className="grid p-3 grid-cols-1 md:grid-cols-2">
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
            <thead className="bg-black text-white text-sm uppercase font-medium text-gray-600 rounded-t-lg">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800 rounded-b-lg font-bold">
              {getCurrentPageUsers().map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-[#BEA35514] hover:cursor-pointer"
                  onClick={() => openModal(user)}
                >
                  <td className="py-4 px-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full">
                      <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    {user.name}
                  </td>
                  <td className="py-4 px-4">{user.email}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`flex items-center justify-center gap-1 w-fit px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                        user.status
                      )}`}
                    >
                      <GoDotFill />{user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex justify-center items-center gap-2">
                    <button

                      onClick={(e) => {
                        e.stopPropagation(); // Prevents the row click from firing
                        navigate(`/wallet/add-money?userId=${user.id}`);
                      }}
                      className="bg-[#BEA355] submitButton my-4 text-white px-6 py-2 float-right rounded-full  transition-colors disabled:opacity-50"
                    >
                      Add Money
                    </button>
                    <button

                      onClick={(e) => {
                        e.stopPropagation(); // Prevents the row click from firing
                        deleteUser(user.id);
                      }}
                      className="bg-[#BEA355] submitButton my-4 text-white px-6 py-2 float-right rounded-full  transition-colors disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                  {/* <td className="py-3 px-4 text-right">
                    <button className="text-gray-500 hover:text-gray-700 rotate-90">•••</button>
                  </td> */}
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
      <Dialog
        size="xxl"
        open={isModalOpen}
        handler={closeModal}
        className="bg-white rounded-lg"
      >
        {selectedYacht && (
          <>
            <DialogHeader className="flex items-center justify-between">
              <Typography variant="h4">
                User Details
              </Typography>

              <IconButton
                variant="text"
                onClick={closeModal}
                className="text-gray-700 flex items-center justify-center"
              >
                <FaXmark className="h-6 w-6" />
              </IconButton>
            </DialogHeader>
            <DialogBody divider className="overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Yacht Information */}
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-4">
                    User Information
                  </Typography>
                  <div className="space-y-3">
                    <InfoRow
                      icon={ShipIcon}
                      label="Name"
                      value={selectedYacht?.name}
                    />
                    <InfoRow
                      icon={LocateIcon}
                      label="Email"
                      value={selectedYacht?.email}
                    />
                    <InfoRow
                      icon={LocateIcon}
                      label="Type"
                      value={selectedYacht?.status || 'N/A'}
                    />
                    <InfoRow
                      icon={TypeIcon}
                      label="Wallet Balance"
                      value={
                        selectedYacht?.wallet?.balance != null
                          ? `AED ${selectedYacht.wallet.balance}`
                          : '0'
                      }
                    />

                  </div>
                </div>

              </div>


            </DialogBody>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default ActiveUsersTable;
