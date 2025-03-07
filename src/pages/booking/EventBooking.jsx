// import React, { useState, useEffect } from 'react';
// import { Card, CardHeader, CardBody, Typography, Chip, IconButton } from "@material-tailwind/react";
// import { getEventBookings } from '../../services/api/bookedService';
// import { format } from 'date-fns';

// const EventBookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const fetchBookings = async () => {
//     try {
//       setLoading(true);
//       const data = await getEventBookings(1); // Assuming event ID 1 for now
//       setBookings(data);
//     } catch (err) {
//       setError('Failed to fetch event bookings');
//       console.error('Error fetching event bookings:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     try {
//       return new Intl.DateTimeFormat('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: '2-digit',
//         hour: '2-digit',
//         minute: '2-digit',
//       }).format(new Date(dateString));
//     } catch (err) {
//       return dateString;
//     }
//   };

//   const getStatusColor = (booking) => {
//     if (booking.cancel) return 'red';
//     if (booking.partial_payment) return 'amber';
//     return 'green';
//   };

//   const getStatusText = (booking) => {
//     if (booking.cancel) return 'Cancelled';
//     if (booking.partial_payment) return 'Partial Payment';
//     return 'Confirmed';
//   };

//   // Pagination logic
//   const totalPages = Math.ceil(bookings.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentBookings = bookings.slice(startIndex, endIndex);

//   const next = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(curr => curr + 1);
//     }
//   };

//   const prev = () => {
//     if (currentPage > 1) {
//       setCurrentPage(curr => curr - 1);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6">
//         <Card className="h-full w-full p-4">
//           <CardHeader floated={false} shadow={false} className="rounded-none">
//             <div className="animate-pulse h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
//           </CardHeader>
//           <CardBody className="overflow-auto px-0">
//             <div className="space-y-4">
//               {[1, 2, 3].map((i) => (
//                 <div key={i} className="animate-pulse">
//                   <div className="h-16 bg-gray-100 rounded"></div>
//                 </div>
//               ))}
//             </div>
//           </CardBody>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <Card className="h-full w-full p-4">
//         <CardHeader floated={false} shadow={false} className="rounded-none">
//           <div className="mb-4">
//             <Typography variant="h3" color="black" className="font-sora">
//               Event Bookings
//             </Typography>
//             <Typography variant="small" color="gray" className="mt-1">
//               Manage your event bookings
//             </Typography>
//           </div>
//         </CardHeader>
//         <CardBody className="overflow-auto px-0">
//           {error ? (
//             <div className="text-center text-red-500 py-4">{error}</div>
//           ) : bookings.length === 0 ? (
//             <div className="text-center text-gray-500 py-4">No event bookings found</div>
//           ) : (
//             <>
//               <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm bg-white">
//                 <thead className="bg-black text-white text-sm uppercase font-medium">
//                   <tr>
//                     <th className="border-b border-blue-gray-100 p-4">Event</th>
//                     <th className="border-b border-blue-gray-100 p-4">Package</th>
//                     <th className="border-b border-blue-gray-100 p-4">Booking Date</th>
//                     <th className="border-b border-blue-gray-100 p-4">Duration</th>
//                     <th className="border-b border-blue-gray-100 p-4">Amount</th>
//                     <th className="border-b border-blue-gray-100 p-4">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {currentBookings.map((item) => {
//                     const booking = item.booking[0];
//                     const package_info = item.package[0];
//                     return (
//                       <tr key={booking.id} className="hover:bg-gray-50">
//                         <td className="p-4">
//                           {package_info.event_name}
//                         </td>
//                         <td className="p-4">
//                           <div>
//                             <div className="font-medium">{package_info.package_name}</div>
//                             <div className="text-sm text-gray-500">
//                               ${package_info.price} / ticket
//                             </div>
//                           </div>
//                         </td>
//                         <td className="p-4">{formatDate(booking.selected_date)}</td>
//                         <td className="p-4">{booking.duration_hour} hours</td>
//                         <td className="p-4">
//                           <div>
//                             <div className="font-medium">${booking.total_cost}</div>
//                             {booking.partial_payment && (
//                               <div className="text-sm text-gray-500">
//                                 Paid: ${booking.paid_cost}
//                               </div>
//                             )}
//                           </div>
//                         </td>
//                         <td className="p-4">
//                           <Chip
//                             size="sm"
//                             variant="ghost"
//                             value={getStatusText(booking)}
//                             color={getStatusColor(booking)}
//                           />
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>

//               {/* Pagination */}
//               <div className="flex items-center gap-4 justify-center mt-4">
//                 <IconButton
//                   size="sm"
//                   variant="outlined"
//                   onClick={prev}
//                   disabled={currentPage === 1}
//                   className="border-gray-300 text-gray-700"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth={2}
//                     stroke="currentColor"
//                     className="h-4 w-4"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M15.75 19.5L8.25 12l7.5-7.5"
//                     />
//                   </svg>
//                 </IconButton>
//                 <Typography color="gray" className="font-normal">
//                   Page <strong className="text-gray-900">{currentPage}</strong> of{" "}
//                   <strong className="text-gray-900">{totalPages}</strong>
//                 </Typography>
//                 <IconButton
//                   size="sm"
//                   variant="outlined"
//                   onClick={next}
//                   disabled={currentPage === totalPages}
//                   className="border-gray-300 text-gray-700"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth={2}
//                     stroke="currentColor"
//                     className="h-4 w-4"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M8.25 4.5l7.5 7.5-7.5 7.5"
//                     />
//                   </svg>
//                 </IconButton>
//               </div>
//             </>
//           )}
//         </CardBody>
//       </Card>
//     </div>
//   );
// };

// export default EventBookings;
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Typography, 
  Chip, 
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
} from "@material-tailwind/react";
import { getEventBookings } from '../../services/api/bookedService';
import { format } from 'date-fns';
import { CalendarDaysIcon, ClockIcon, PhoneIcon, TicketIcon } from 'lucide-react';
import { FaUserGroup, FaXmark } from 'react-icons/fa6';
import { BsCurrencyDollar } from 'react-icons/bs';
import { BiGlobeAlt } from 'react-icons/bi';
import { HiChatBubbleBottomCenterText } from 'react-icons/hi2';

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 mb-2">
    <Icon className="h-5 w-5 text-gray-600" />
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-800">{value || 'N/A'}</span>
  </div>
);

const EventBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getEventBookings(1);
      setBookings(data);
    } catch (err) {
      setError('Failed to fetch event bookings');
      console.error('Error fetching event bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(dateString));
    } catch (err) {
      return dateString;
    }
  };

  const getStatusColor = (booking) => {
    if (booking.cancel) return 'red';
    if (booking.partial_payment) return 'amber';
    return 'green';
  };

  const getStatusText = (booking) => {
    if (booking.cancel) return 'Cancelled';
    if (booking.partial_payment) return 'Partial Payment';
    return 'Confirmed';
  };

  const handleRowClick = (booking) => {
    setSelectedBooking(booking);
  };

  // Pagination logic
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = bookings.slice(startIndex, endIndex);

  const next = () => {
    if (currentPage < totalPages) {
      setCurrentPage(curr => curr + 1);
    }
  };

  const prev = () => {
    if (currentPage > 1) {
      setCurrentPage(curr => curr - 1);
    }
  };

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
    <div className="p-6">
      <Card className="h-full w-full p-4">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4">
            <Typography variant="h3" color="black" className="font-sora">
              Event Bookings
            </Typography>
            <Typography variant="small" color="gray" className="mt-1">
              Manage your event bookings
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="overflow-auto px-0">
          {error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No event bookings found</div>
          ) : (
            <>
              <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm bg-white">
                <thead className="bg-black text-white text-sm uppercase font-medium">
                  <tr>
                    <th className="border-b border-blue-gray-100 p-4">User Id</th>
                    <th className="border-b border-blue-gray-100 p-4">Event</th>
                    <th className="border-b border-blue-gray-100 p-4">Package</th>
                    <th className="border-b border-blue-gray-100 p-4">Booking Date</th>
                    <th className="border-b border-blue-gray-100 p-4">Duration</th>
                    <th className="border-b border-blue-gray-100 p-4">Amount</th>
                    <th className="border-b border-blue-gray-100 p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.map((item) => {
                    const booking = item.info; // Access booking data from info
                    const package_info = item.package; // Access package data directly
                    if (!booking || !package_info) {
                      return null; // Skip rendering this row if data is not available
                    }
                    return (
                      <tr 
                        key={booking.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(item)}
                      >
                        <td className='p-4'>{package_info.User || (booking && booking.user_id) || ''}</td>
                        <td className="p-4">
                          {package_info.event_name}
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{package_info.package_name}</div>
                            <div className="text-sm text-gray-500">
                              ${package_info.price} / ticket
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{formatDate(package_info.created_on)}</td>
                        <td className="p-4">{booking.duration_hour} hours</td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">${booking.total_cost}</div>
                            {booking.partial_payment && (
                              <div className="text-sm text-gray-500">
                                Paid: ${booking.paid_cost}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <Chip
                            size="sm"
                            variant="ghost"
                            value={getStatusText(booking)}
                            color={getStatusColor(booking)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center gap-4 justify-center mt-4">
                <IconButton
                  size="sm"
                  variant="outlined"
                  onClick={prev}
                  disabled={currentPage === 1}
                  className="border-gray-300 text-gray-700 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </IconButton>
                <Typography color="gray" className="font-normal">
                  Page <strong className="text-gray-900">{currentPage}</strong> of{" "}
                  <strong className="text-gray-900">{totalPages}</strong>
                </Typography>
                <IconButton
                  size="sm"
                  variant="outlined"
                  onClick={next}
                  disabled={currentPage === totalPages}
                  className="border-gray-300 text-gray-700 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </IconButton>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      {/* Detailed Modal */}
      <Dialog 
        size="xxl" 
        open={selectedBooking !== null} 
        handler={() => setSelectedBooking(null)}
        className="bg-white rounded-lg"
      >
        {selectedBooking && (
          <>
            <DialogHeader className="flex items-center justify-between">
              <Typography variant="h4">
                Booking Details
              </Typography>
              <IconButton
                variant="text"
                onClick={() => setSelectedBooking(null)}
                className="text-gray-700 flex items-center justify-center"
              >
                <FaXmark className="h-6 w-6" />
              </IconButton>
            </DialogHeader>
            <DialogBody divider className="overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Event Information */}
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-4">
                    Event Information
                  </Typography>
                  <div className="space-y-3">
                    <InfoRow 
                      icon={TicketIcon}
                      label="Event"
                      value={selectedBooking.package.event_name}
                    />
                    <InfoRow 
                      icon={TicketIcon}
                      label="Package"
                      value={selectedBooking.package.package_name}
                    />
                    <InfoRow 
                      icon={BsCurrencyDollar}
                      label="Price per Ticket"
                      value={`$${selectedBooking.package.price}`}
                    />
                    <InfoRow 
                      icon={FaUserGroup}
                      label="Available Tickets"
                      value={selectedBooking.package.number_of_ticket}
                    />
                  </div>
                </div>

                {/* Booking Details */}
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-4">
                    Booking Details
                  </Typography>
                  <div className="space-y-3">
                    <InfoRow 
                      icon={CalendarDaysIcon}
                      label="Booking Date"
                      value={formatDate(selectedBooking.info.selected_date)}
                    />
                    <InfoRow 
                      icon={ClockIcon}
                      label="Duration"
                      value={`${selectedBooking.info.duration_hour} hours`}
                    />
                    <InfoRow 
                      icon={PhoneIcon}
                      label="Phone"
                      value={selectedBooking.info.phone_number}
                    />
                    <InfoRow 
                      icon={BiGlobeAlt}
                      label="Country"
                      value={selectedBooking.info.country?.toUpperCase()}
                    />
                    {selectedBooking.info.message && (
                      <InfoRow 
                        icon={HiChatBubbleBottomCenterText}
                        label="Message"
                        value={selectedBooking.info.message}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="mt-8">
                <Typography variant="h6" color="blue-gray" className="mb-4">
                  Payment Information
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Total Amount</div>
                    <div className="text-2xl font-bold">
                      ${selectedBooking.info.total_cost}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Paid Amount</div>
                    <div className="text-2xl font-bold">
                      ${selectedBooking.info.paid_cost}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Remaining</div>
                    <div className="text-2xl font-bold">
                      ${selectedBooking.info.remaining_cost}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Chip
                    size="lg"
                    variant="ghost"
                    value={getStatusText(selectedBooking.info)}
                    color={getStatusColor(selectedBooking.info)}
                    className="float-right bg-black text-white"
                  />
                </div>
              </div>
            </DialogBody>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default EventBookings;