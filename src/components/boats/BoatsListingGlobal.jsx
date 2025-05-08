import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Typography, Button, IconButton, Dialog, DialogHeader, DialogBody, Input } from "@material-tailwind/react";
import { Link, useLocation } from 'react-router-dom';
import { getAllBoats, getf1AllBoats } from '../../services/api/boatService';
import { FaXmark } from "react-icons/fa6";
import { ArrowLeftIcon, ArrowRightIcon, FlagIcon, LocateIcon, PowerIcon, ShipIcon, TypeIcon } from "lucide-react";
import { BsCurrencyDollar } from "react-icons/bs";
import { da } from 'date-fns/locale/da';
import { CustomPagination } from '../common/customPagination/customPagination';
import { formatDate } from '../../utils/helper';
import { set } from 'date-fns';
import { useContext } from 'react';
import { GlobalStateContext } from '../../store/GlobalStateContext.jsx';

const PAGE_SIZE = 10;

const InfoRow = ({ label, value, icon }) => (
  <div className="flex justify-between">
    <span className="font-semibold">{label}:</span>
    <span className="flex items-center">
      {icon && <icon className="h-5 w-5 mr-2" />}
      {value}
    </span>
  </div>
);

const BoatsListingGlobal = ({ yachtsType }) => {
  const currency = 'AED';
  const baseUrl = 'https://api.takeoffyachts.com';
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  const [selectedYacht, setSelectedYacht] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [totalYachts, settotalYachts] = useState(0);
  const [paginateYachts, setpaginateYachts] = useState(0);
  const [query, setQuery] = useState('');
  const [searchValue, setsearchValue] = useState('');
  // const { globalState: appState, dispatch: appDispatch } = useContext(GlobalStateContext);
  // console.log("appState", appState)
      // appDispatch({ type: "changeNumber", numberInc: page });

  // const yachtsTypee = useLocation().pathname.split('/')[2];
  // console.log(yachtsTypee)


  const openModal = (yacht) => {
    setSelectedYacht(yacht);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedYacht(null);
  };

  const handlePagination = async () => {
    try {

      if (yachtsType == "yachts") {
        let payload = {
          reqType: "handlePagination",
          YachtType: yachtsType == "f1yachts" ? "f1yachts" : "regular",
          user_id: 1,
          name: searchValue,
        }

        let response = await fetch(`${baseUrl}/yacht/check_yacht/?page=${page}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });


        const responseData = await response.json();
        if (responseData.error_code === 'pass') {
          // Sort the filtered yachts if needed
          const sortedData = responseData?.data.sort((a, b) => {
            const dateA = new Date(a.yacht.created_on);
            const dateB = new Date(b.yacht.created_on);
            return dateB - dateA; // latest date first
          });
          setBoats(sortedData);
          settotalYachts(responseData?.total_yachts)
          setpaginateYachts(responseData?.paginate_count ? responseData?.paginate_count : 0)

          if (sortedData?.length < PAGE_SIZE) {
            setHasMore(false)
          } else {
            setHasMore(true)
          }
        } else {
          setHasMore(false);
          console.error('API Error:', responseData.error);
        }
      } else if (yachtsType == "f1yachts") {
        let payload = {
          reqType: "handlePagination",
          YachtType: yachtsType == "f1yachts" ? "f1yachts" : "regular",
          user_id: 1,
          name: searchValue,
        }

        let response = await fetch(`${baseUrl}/yacht/check_yacht/?page=${page}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });


        const responseData = await response.json();
        if (responseData.error_code === 'pass') {
          // Sort the filtered yachts if needed
          const sortedData = responseData?.data.sort((a, b) => {
            const dateA = new Date(a.yacht.created_on);
            const dateB = new Date(b.yacht.created_on);
            return dateB - dateA; // latest date first
          });
          setBoats(sortedData);
          settotalYachts(responseData?.total_yachts)
          setpaginateYachts(responseData?.paginate_count ? responseData?.paginate_count : 0)


          if (sortedData?.length < PAGE_SIZE) {
            setHasMore(false)
          } else {
            setHasMore(true)
          }
        } else {
          setHasMore(false);
          console.error('API Error:', responseData.error);
        }

      } else if (yachtsType == "new_year") {
        // const data = await getAllBoats('new_year');
        // setBoats(data);
      }

    } catch (error) {
      console.error('Error fetching New Year boats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async () => {
    try {
      // Pass 'new_year' as the feature to filter New Year boats

      if (yachtsType == "yachts") {
        let payload = {
          reqType: "handleFilterChange",
          YachtType: yachtsType == "f1yachts" ? "f1yachts" : "regular",
          user_id: 1,
          name: searchValue,
        }

        let response = await fetch(`${baseUrl}/yacht/check_yacht/?page=1`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });


        const responseData = await response.json();
        if (responseData.error_code === 'pass') {
          // Sort the filtered yachts if needed
          const sortedData = responseData?.data.sort((a, b) => {
            const dateA = new Date(a.yacht.created_on);
            const dateB = new Date(b.yacht.created_on);
            return dateB - dateA; // latest date first
          });
          setBoats(sortedData);
          settotalYachts(responseData?.total_yachts)
          setpaginateYachts(responseData?.paginate_count ? responseData?.paginate_count : 0)


          if (sortedData?.length < PAGE_SIZE) {
            setHasMore(false)
          } else {
            setHasMore(true)
          }
        } else {
          setHasMore(false);
          console.error('API Error:', responseData.error);
        }
      } else if (yachtsType == "f1yachts") {

        let payload = {
          reqType: "handleFilterChange",
          YachtType: yachtsType == "f1yachts" ? "f1yachts" : "regular",
          user_id: 1,
          name: searchValue
        }

        let response = await fetch(`${baseUrl}/yacht/check_yacht/?page=1`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });


        const responseData = await response.json();
        if (responseData.error_code === 'pass') {
          // Sort the filtered yachts if needed
          const sortedData = responseData?.data.sort((a, b) => {
            const dateA = new Date(a.yacht.created_on);
            const dateB = new Date(b.yacht.created_on);
            return dateB - dateA; // latest date first
          });
          setBoats(sortedData);
          settotalYachts(responseData?.total_yachts)
          setpaginateYachts(responseData?.paginate_count ? responseData?.paginate_count : 0)




          if (sortedData?.length < PAGE_SIZE) {
            setHasMore(false)
          } else {
            setHasMore(true)
          }
        } else {
          setHasMore(false);
          console.error('API Error:', responseData.error);
        }

      } else if (yachtsType == "new_year") {
        // const data = await getAllBoats('new_year');
        // setBoats(data);
      }

    } catch (error) {
      console.error('Error fetching New Year boats:', error);
    } finally {
      setLoading(false);
      setPage(1)

    }
  };

  const handleNext = () => {
    setPage((prevPage) => prevPage + 1)
  }
  const handlePrev = () => {
    setPage((prevPage) => prevPage - 1)
  }

  const totalPages = Math.ceil(paginateYachts / itemsPerPage);
  useEffect(() => {
    const handler = setTimeout(() => {
      setsearchValue(query);
      setPage(1); 
    }, 500);

    return () => {
      clearTimeout(handler); // Clear the timeout if query changes before 500ms
    };
  }, [query]);

  useEffect(() => {
    if (page > 1) {
      handlePagination();
    }

  }, [page]);

  useEffect(() => {
    if (searchValue) {
      handleFilterChange();
    } else if (!searchValue && page == 1) {
      handlePagination();
    }
  }, [searchValue]);
  //test
  // useEffect(() => {
  //   // console.log("loading", loading)
  //   // console.log("yachtsType", yachtsType)
  //   console.log("totalPages", totalPages)
  //   // console.log("boats", boats)
  //   // console.log("totalYachts", totalYachts)
  //   // console.log("selectedYacht", selectedYacht)
  //   console.log("paginateYachts", paginateYachts)
  //   console.log("searchValue",Boolean(searchValue) )
  // }, [loading, boats, totalYachts, selectedYacht,searchValue,paginateYachts])
  if (loading) {
    return (
      <div className="p-6">
        <Card className="h-full w-full p-4">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="animate-pulse h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          </CardHeader>
          <CardBody className="overflow-auto px-0">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-100 rounded"></div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }


  return (
    <div className="p-6 classForBoatsListingGlobal">
      <Card className="h-full w-full p-4">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography variant="h3" className='font-sora' color="black">
                {yachtsType === "f1yachts" ? " F1 Boats" : yachtsType === "yachts" ? " All Boats" : yachtsType === "new_year" ? "New Year Boats" : ""}
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                {yachtsType === "f1yachts" ? "Manage your F1 boat listings" : yachtsType === "yachts" ? "Manage your boat listings" : yachtsType === "new_year" ? "Manage your New Year boat listings" : ""}

              </Typography>
            </div>
            <Link to={
              yachtsType === "f1yachts"
                ? "/boats/f1yachts/add"
                : yachtsType === "yachts"
                  ? "/boats/yachts/add"
                  : yachtsType === "new_year"
                    ? "/boats/newyear/add"
                    : "/boats/yachts/add" // fallback
            }>
              <Button className="flex items-center bg-[#BEA355] gap-3 rounded-full capitalize font-medium" size="sm">
                {yachtsType === "f1yachts" ? "Add F1 Boat" : yachtsType === "yachts" ? "Add Boat" : yachtsType === "new_year" ? "Add New Year Boat" : ""}

              </Button>
            </Link>


          </div>
          <div className="grid p-3 grid-cols-1 md:grid-cols-2">
            <div>
              <Input
                className='rounded-lg '
                placeholder='Search by name'
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
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
                  <th className="border-b border-blue-gray-100 p-4">Name</th>
                  <th className="border-b border-blue-gray-100 p-4">Location</th>
                  {yachtsType == "yachts" ? <th className="border-b border-blue-gray-100 p-4">Price per hour</th> : yachtsType == "f1yachts" ? <th className="border-b border-blue-gray-100 p-4">Price per day</th> : ""}

                  <th className="border-b border-blue-gray-100 p-4">Status</th>
                  <th className="border-b border-blue-gray-100 p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {boats?.map((boat) => (
                  <tr key={boat?.yacht.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openModal(boat?.yacht)}>
                    {yachtsType === "f1yachts" ? <td className="p-4">{boat?.yacht.name}</td>
                      : yachtsType === "yachts" ? <td className="p-4">{boat?.yacht.name}</td>
                        : yachtsType === "new_year" ? <td className="p-4">{boat?.yacht.name}</td>
                          : ""}

                    <td className="p-4">{boat?.yacht.location}</td>
                    {yachtsType == "yachts" ? <td className="p-4">{boat?.yacht.per_hour_price} AED</td> : yachtsType == "f1yachts" ? <td className="p-4">{boat?.yacht.per_day_price} AED</td> : ""}

                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${boat?.yacht.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {boat?.yacht.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link
                        to={
                          yachtsType === "f1yachts"
                            ? `/boats/f1yachts/edit/${boat?.yacht.id}`
                            : yachtsType === "new_year"
                              ? `/boats/newyear/edit/${boat?.yacht.id}`
                              : `/boats/yachts/edit/${boat?.yacht.id}` // fallback for regular yachts
                        }
                      >
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
        <CardFooter className="flex flex-wrap items-center justify-center border-t border-blue-gray-50 p-4">
          {/* <CustomPagination 
  page={page}
  totalPages={totalPages}
  handleNext={handleNext}
  handlePrev={handlePrev}
  setPage={setPage}
  hasMore={hasMore}
/> */}

          {/* <Button
            variant="outlined"
            size="sm"
            onClick={() => setPage((prevPage) => prevPage - 1)}
            disabled={page == 1}
            className='flex'
          >
            <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />

            Previous
          </Button>
          <div className="flex py-3 flex-wrap items-center gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <IconButton
                key={index + 1}
                variant={page === index + 1 ? "outlined" : "text"}
                // variant='outlined'
                size="sm"
                onClick={() => {
                  setPage(index + 1);

                }}
              >
                {index + 1}
              </IconButton>
            ))}

          </div>
          <Button
            variant="outlined"
            size="sm"
            onClick={() => setPage((prevPage) => prevPage + 1)}
            disabled={!hasMore}
            className='flex'

          >
            Next
            <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />

          </Button> */}


          {paginateYachts > 0 ? <div className="flex items-center gap-4 justify-center mt-4">
            <IconButton
              size="sm"
              variant="outlined"
              onClick={() => setPage((prevPage) => prevPage - 1)}
              disabled={page == 1}
              className="border-gray-300 text-gray-700 flex items-center justify-center"
            >
              <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />


            </IconButton>
            <Typography color="gray" className="font-normal">
              Page <strong className="text-gray-900">{page}</strong> of{" "}
              <strong className="text-gray-900">{totalPages}</strong>
            </Typography>
            <IconButton
              size="sm"
              variant="outlined"
              onClick={() => setPage((prevPage) => prevPage + 1)}
              disabled={!hasMore}
              className="border-gray-300 text-gray-700 flex items-center justify-center"
            >
              <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />

            </IconButton>
          </div> : yachtsType == "f1yachts" ? "No F1 yacht found" : "No yacht found"}






        </CardFooter>
      </Card>
      {/* Modal for displaying yacht details */}
      {/* Modal for displaying yacht details */}
      <Dialog
        size="xxl"
        open={isModalOpen}
        handler={closeModal}
        className="bg-white rounded-lg"
      >
        {selectedYacht && (
          <>
            <DialogHeader className="flex items-center justify-between">
              {yachtsType == "yachts" ? <Typography variant="h4">
                Yacht Details
              </Typography> : yachtsType == "f1yachts" ? <Typography variant="h4">
                F1 Yacht Details
              </Typography> : ""}

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
                    Yacht Information
                  </Typography>
                  <div className="space-y-3">
                    <InfoRow
                      icon={ShipIcon}
                      label="Name"
                      value={selectedYacht.name}
                    />
                    <InfoRow
                      icon={LocateIcon}
                      label="Location"
                      value={selectedYacht.location}
                    />
                    {yachtsType == "yachts" ? <InfoRow
                      // icon={BsCurrencyDollar}
                      label="Price per Hour"
                      value={`${currency} ${selectedYacht.per_hour_price} `}
                    /> : yachtsType == "f1yachts" ? <InfoRow
                      // icon={"AED"}
                      label="Price per Day"
                      value={`${currency} ${selectedYacht.per_day_price}`}
                    /> : ""}

                    <InfoRow
                      icon={TypeIcon}
                      label="Type"
                      value={selectedYacht.type || 'N/A'}
                    />
                    <InfoRow
                      icon={FlagIcon}
                      label="Status"
                      value={selectedYacht.status ? 'Active' : 'Inactive'}
                    />
                  </div>
                </div>

                {/* Additional Details */}
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-4">
                    Additional Details
                  </Typography>
                  <div className="space-y-3">
                    <InfoRow
                      icon={PowerIcon}
                      label="Length"
                      value={selectedYacht.length ? `${selectedYacht.length} ft` : 'N/A'}
                    />
                    <InfoRow
                      icon={PowerIcon}
                      label="Power"
                      value={selectedYacht.power || 'N/A'}
                    />
                    <InfoRow
                      icon={TypeIcon}
                      label="Crew Members"
                      value={selectedYacht.crew_member || 'N/A'}
                    />
                    <InfoRow
                      icon={TypeIcon}
                      label="Guest Capacity"
                      value={selectedYacht.guest ? `${selectedYacht.guest} guests` : 'N/A'}
                    />
                    <InfoRow
                      icon={TypeIcon}
                      label="Sleeping Capacity"
                      value={selectedYacht.sleep_capacity ? `${selectedYacht.sleep_capacity} guests` : 'N/A'}
                    />
                  </div>
                </div>
              </div>

              {/* Availability */}
              {yachtsType == "yachts" ? <div className="mt-8">
                <Typography variant="h6" color="blue-gray" className="mb-4">
                  Availability
                </Typography>
                {selectedYacht.availability && (
                  <>
                    <InfoRow
                      label="Available From"
                      value={typeof selectedYacht.availability === 'string' ? JSON.parse(selectedYacht.availability.replace(/'/g, '"')).from || 'N/A' : formatDate(selectedYacht.availability?.from) || 'N/A'}
                    />
                    <InfoRow
                      label="Available To"
                      value={typeof selectedYacht.availability === 'string' ? JSON.parse(selectedYacht.availability.replace(/'/g, '"')).to || 'N/A' : formatDate(selectedYacht.availability?.to) || 'N/A'}
                    />
                  </>
                )}
              </div> : yachtsType == "f1yachts" ? "" : ""}


              {/* Features */}
              {yachtsType == "yachts" ? <div className="mt-8">
                <Typography variant="h6" color="blue-gray" className="mb-4">
                  Features:
                </Typography>
                <div className=" gap-4">
                  {selectedYacht?.features && selectedYacht?.features.length > 0 ? (
                    selectedYacht?.features.map((feature, index) => (
                      <span key={index} className="text-gray-800 mx-2 dark:text-gray-200 font-medium">{feature}</span>

                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-xs">N/A</p>
                  )}
                </div>

              </div> : yachtsType == "f1yachts" ? "" : ""}


              {/* Description */}
              {selectedYacht.description && (
                <div className="mt-8">
                  <Typography variant="h6" color="blue-gray" className="mb-4">
                    Description
                  </Typography>
                  <p className="text-gray-700">{selectedYacht.description}</p>
                </div>
              )}

              {/* Notes */}
              {selectedYacht.notes && (
                <div className="mt-8">
                  <Typography variant="h6" color="blue-gray" className="mb-4">
                    Notes
                  </Typography>
                  <div
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: selectedYacht.notes }}
                  />
                </div>
              )}
            </DialogBody>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default BoatsListingGlobal;