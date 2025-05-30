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

const EventsListingGlobal = ({ yachtsType }) => {
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

      if (yachtsType == "event") {
        let payload = {
          reqType: "handlePagination",
          user_id: 1,
          search: searchValue,
          page: page,
          callingFrom:"admin"
        }

        let response = await fetch(`${baseUrl}/yacht/check_eventsystem/?page=${page}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });


        const responseData = await response.json();
        if (responseData?.success == true) {
          // Sort the filtered yachts if needed
          const sortedData = [...responseData?.events]
          setBoats(sortedData);
          settotalYachts(responseData?.total_events)
          setpaginateYachts(responseData?.paginated_count ? responseData?.paginated_count : 0)

          if (sortedData?.length < PAGE_SIZE) {
            setHasMore(false)
          } else {
            setHasMore(true)
          }
        } else {
          setHasMore(false);
          console.error('API Error:', responseData.error);
        }
      } else if (yachtsType == "other-event") {
        let payload = {
          reqType: "handlePagination",
          user_id: 1,
          search: searchValue,
          page: page
        }

        let response = await fetch(`${baseUrl}/yacht/check_eventsystem/?page=${page}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });


        const responseData = await response.json();
        if (responseData?.success == true) {
          // Sort the filtered yachts if needed
          const sortedData = [...responseData?.events]

          setBoats(sortedData);
          settotalYachts(responseData?.total_events)
          setpaginateYachts(responseData?.paginated_count ? responseData?.paginated_count : 0)


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

      if (yachtsType == "event") {
        let payload = {
          reqType: "handleFilterChange",
          user_id: 1,
          search: searchValue,
          page: 1,
          callingFrom:"admin"

        }

        let response = await fetch(`${baseUrl}/yacht/check_eventsystem/?page=1`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });


        const responseData = await response.json();
        if (responseData?.success == true) {
          // Sort the filtered yachts if needed
          const sortedData = [...responseData?.events]
          setBoats(sortedData);
          settotalYachts(responseData?.total_events)
          setpaginateYachts(responseData?.paginated_count ? responseData?.paginated_count : 0)


          if (sortedData?.length < PAGE_SIZE) {
            setHasMore(false)
          } else {
            setHasMore(true)
          }
        } else {
          setHasMore(false);
          console.error('API Error:', responseData.error);
        }
      } else if (yachtsType == "other-event") {

        let payload = {
          reqType: "handleFilterChange",
          user_id: 1,
          search: searchValue
        }

        let response = await fetch(`${baseUrl}/yacht/check_eventsystem/?page=1`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });


        const responseData = await response.json();
        if (responseData?.success == true) {
          // Sort the filtered yachts if needed
          const sortedData = [...responseData?.events]
          setBoats(sortedData);
          settotalYachts(responseData?.total_events)
          setpaginateYachts(responseData?.paginated_count ? responseData?.paginated_count : 0)




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
    // console.log("loading", loading)
    // console.log("yachtsType", yachtsType)
    // console.log("totalPages", totalPages)
    // console.log("boats", boats)
    // console.log("totalYachts", totalYachts)
    // console.log("selectedYacht", selectedYacht)
    // console.log("paginateYachts", paginateYachts)
    // console.log("searchValue",Boolean(searchValue) )
  // }, [loading, boats, totalYachts, selectedYacht, searchValue, paginateYachts])
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
                {yachtsType === "other-event" ? " F1 event" : yachtsType === "event" ? " All Events" : yachtsType === "new_year" ? "New Year Boats" : ""}
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                {yachtsType === "other-event" ? "Manage your F1 event listings" : yachtsType === "event" ? "Manage your event listings" : yachtsType === "new_year" ? "Manage your New Year boat listings" : ""}

              </Typography>
            </div>
            <Link to={
              yachtsType === "other-event"
                ? "/event/f1-exp/add"
                : yachtsType === "event"
                  ? "/events/add"
                  : yachtsType === "new_year"
                    ? "/event/newyear/add"
                    : "/events/add" // fallback
            }>
              <Button className="flex items-center bg-[#BEA355] gap-3 rounded-full capitalize font-medium" size="sm">
                {yachtsType === "other-event" ? "Add F1 Event" : yachtsType === "event" ? "Add Event" : yachtsType === "new_year" ? "Add New Year Boat" : ""}

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
                  {yachtsType == "event" ? <th className="border-b border-blue-gray-100 p-4">Event Type</th> : yachtsType == "other-event" ? <th className="border-b border-blue-gray-100 p-4">Price per day</th> : ""}

                  <th className="border-b border-blue-gray-100 p-4">Name</th>
                  <th className="border-b border-blue-gray-100 p-4">Location</th>

                  <th className="border-b border-blue-gray-100 p-4">Packages</th>

                  <th className="border-b border-blue-gray-100 p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {boats?.map((boat) => {
                  let packages = boat?.packages_system
                  
                  return (
                    <tr key={boat?.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openModal(boat)}>
                      {yachtsType == "event" ? <td className="p-4">{boat?.event_type}</td> : yachtsType == "other-event" ? <td className="p-4">{boat?.per_day_price} AED</td> : ""}

                      {yachtsType === "other-event" ? <td className="p-4">{boat?.name}</td>
                        : yachtsType === "event" ? <td className="p-4">{boat?.name}</td>
                          : yachtsType === "new_year" ? <td className="p-4">{boat?.name}</td>
                            : ""}
                      <td className="p-4">{boat?.location}</td>

                      <td className="p-4">
                        {packages?.length > 0 ? packages.map(pkg => (
                          <div key={pkg.id}>{pkg.package_type} - AED {pkg.price}</div>
                        )) : 'No packages available'}
                      </td>


                      <td className="p-4">
                        <Link
                          to={
                            yachtsType === "other-event"
                              ? `/event/f1-exp/edit/${boat?.id}`
                              : yachtsType === "new_year"
                                ? `/event/newyear/edit/${boat?.id}`
                                : `/events/edit/${boat?.id}?eventId=${boat?.id}` // fallback for regular yachts
                          }
                        >
                          <Button variant="text" className="text-[#BEA355]">
                            Edit
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )

                })}
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
          </div> : yachtsType == "other-event" ? "No F1 Event found" : "No Event found"}






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
              {yachtsType == "event" ? <Typography variant="h4">
                Event Details
              </Typography> : yachtsType == "other-event" ? <Typography variant="h4">
                F1 Event Details
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
                    Event Information
                  </Typography>
                  <div className="space-y-3">
                    <InfoRow
                      icon={ShipIcon}
                      label="Name"
                      value={selectedYacht?.name}
                    />
                    <InfoRow
                      icon={LocateIcon}
                      label="Location"
                      value={selectedYacht?.location}
                    />
                    {yachtsType == "event" ? <InfoRow
                      // icon={BsCurrencyDollar}
                      label="Price"
                      value={`${currency} ${selectedYacht?.total_days_price
                      } `}
                    /> : yachtsType == "other-event" ? <InfoRow
                      // icon={"AED"}
                      label="Price per Day"
                      value={`${currency} ${selectedYacht?.per_day_price}`}
                    /> : ""}

                    <InfoRow
                      icon={TypeIcon}
                      label="Type"
                      value={selectedYacht?.event_type || 'N/A'}
                    />
                    <InfoRow
                      icon={FlagIcon}
                      label="Status"
                      value={selectedYacht?.status ? 'Active' : 'Inactive'}
                    />
                  </div>
                </div>

                {/* Additional Details */}
                {/* <div>
                  <Typography variant="h6" color="blue-gray" className="mb-4">
                    Additional Details
                  </Typography>
                  <div className="space-y-3">
                    <InfoRow
                      icon={PowerIcon}
                      label="Length"
                      value={selectedYacht?.length ? `${selectedYacht?.length} ft` : 'N/A'}
                    />
                    <InfoRow
                      icon={PowerIcon}
                      label="Power"
                      value={selectedYacht?.power || 'N/A'}
                    />
                    <InfoRow
                      icon={TypeIcon}
                      label="Crew Members"
                      value={selectedYacht?.crew_member || 'N/A'}
                    />
                    <InfoRow
                      icon={TypeIcon}
                      label="Guest Capacity"
                      value={selectedYacht?.guest ? `${selectedYacht?.guest} guests` : 'N/A'}
                    />
                    <InfoRow
                      icon={TypeIcon}
                      label="Sleeping Capacity"
                      value={selectedYacht?.sleep_capacity ? `${selectedYacht?.sleep_capacity} guests` : 'N/A'}
                    />
                  </div>
                </div> */}
              </div>

              {/* Availability */}
              {/* {yachtsType == "event" ? <div className="mt-8">
                <Typography variant="h6" color="blue-gray" className="mb-4">
                  Availability
                </Typography>
                {selectedYacht?.availability && (
                  <>
                    <InfoRow
                      label="Available From"
                      value={typeof selectedYacht?.availability === 'string' ? JSON.parse(selectedYacht?.availability.replace(/'/g, '"')).from || 'N/A' : formatDate(selectedYacht?.from_date) || 'N/A'}
                    />
                    <InfoRow
                      label="Available To"
                      value={typeof selectedYacht?.availability === 'string' ? JSON.parse(selectedYacht?.availability.replace(/'/g, '"')).to || 'N/A' : formatDate(selectedYacht?.to_date) || 'N/A'}
                    />
                  </>
                )}
              </div> : yachtsType == "other-event" ? "" : ""} */}


  


              {/* Description */}
              {/* {selectedYacht?.description && (
                <div className="mt-8">
                  <Typography variant="h6" color="blue-gray" className="mb-4">
                    Description
                  </Typography>
                  <p className="text-gray-700">{selectedYacht?.description}</p>
                </div>
              )} */}

              {/* Notes */}
              {selectedYacht?.notes && (
                <div className="mt-8">
                  <Typography variant="h6" color="blue-gray" className="mb-4">
                    Notes
                  </Typography>
                  <div
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: selectedYacht?.notes }}
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

export default EventsListingGlobal;