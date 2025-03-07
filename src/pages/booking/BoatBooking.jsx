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
import { getBoatBookings } from '../../services/api/bookedService';
import { format } from 'date-fns';
import { Anchor, AnchorIcon, CalendarDaysIcon, ClipboardIcon, ClockIcon, MapPin, PhoneIcon, Users, UsersIcon } from 'lucide-react';
import { FaXmark } from 'react-icons/fa6';
import { BiGlobeAlt } from 'react-icons/bi';

const BoatBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getBoatBookings(1);
      setBookings(data);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (booking, yacht) => {
    setSelectedBooking({ booking, yacht });
    setIsModalOpen(true);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy hh:mm a');
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

  // Pagination logic
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = bookings.slice(startIndex, endIndex);

  const next = () => {
    if (currentPage < totalPages) setCurrentPage(curr => curr + 1);
  };

  const prev = () => {
    if (currentPage > 1) setCurrentPage(curr => curr - 1);
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-blue-50 rounded-lg">
        <Icon className="h-5 w-5 text-blue-500" />
      </div>
      <div>
        <Typography variant="small" color="gray" className="font-normal">
          {label}
        </Typography>
        <Typography color="blue-gray" className="font-medium">
          {value}
        </Typography>
      </div>
    </div>
  );

  const PaymentInfoCard = ({ title, value }) => (
    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
      <Typography color="gray" className="text-sm font-normal mb-1">
        {title}
      </Typography>
      <Typography className="text-xl font-semibold text-blue-gray-800">
        {value}
      </Typography>
    </div>
  );
    

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
              Boat Bookings
            </Typography>
            <Typography variant="small" color="gray" className="mt-1">
              Manage your boat bookings
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="overflow-auto px-0">
          {error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No bookings found</div>
          ) : (
            <>
              <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm bg-white">
                <thead className="bg-black text-white text-sm uppercase font-medium">
                  <tr>
                    <th className="border-b border-blue-gray-100 p-4">User Id</th>
                    <th className="border-b border-blue-gray-100 p-4">Yacht</th>
                    <th className="border-b border-blue-gray-100 p-4">Booking Date</th>
                    <th className="border-b border-blue-gray-100 p-4">Duration</th>
                    <th className="border-b border-blue-gray-100 p-4">Guests</th>
                    <th className="border-b border-blue-gray-100 p-4">Amount</th>
                    <th className="border-b border-blue-gray-100 p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.map((item) => {
                    const booking = item.booking[0];
                    const yacht = item.yacht[0];
                    return (
                      <tr 
                        key={booking.id} 
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleRowClick(booking, yacht)}
                      >
                        <td className="p-4">{booking.User || booking.info?.user_id || ''}</td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{yacht.title}</div>
                            <div className="text-sm text-gray-500">{yacht.location}</div>
                          </div>
                        </td>
                        <td className="p-4">{formatDate(booking.selected_date)}</td>
                        <td className="p-4">{booking.duration_hour} hours</td>
                        <td className="p-4">{booking.info?.guest || 'N/A'}</td>
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

              {/* Booking Details Modal */}
              <Dialog
                open={isModalOpen}
                handler={() => setIsModalOpen(false)}
                size="xxl"
                className="bg-white rounded-xl shadow-xl"
              >
                {selectedBooking && (
                  <>
                    {/* Header */}
                    <DialogHeader className="flex items-center justify-between border-b border-gray-200 p-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <AnchorIcon className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <Typography variant="h5">Booking Details</Typography>
                          <Typography variant="small" color="gray">
                            Booking ID: #{selectedBooking.booking.id}
                          </Typography>
                        </div>
                      </div>
                      <IconButton
                        variant="text"
                        color="gray"
                        className="flex items-center justify-center"
                        onClick={() => setIsModalOpen(false)}
                      >
                        <FaXmark className="h-5 w-5" />
                      </IconButton>
                    </DialogHeader>

                    {/* Body */}
                    <DialogBody className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Yacht Information */}
                        <div>
                          <Typography variant="h6" color="blue-gray" className="mb-4">
                            Yacht Information
                          </Typography>
                          <div className="space-y-3">
                            <InfoRow
                              icon={Anchor}
                              label="Yacht Name"
                              value={selectedBooking.yacht.title}
                            />
                            <InfoRow
                              icon={MapPin}
                              label="Location"
                              value={selectedBooking.yacht.location}
                            />
                            <InfoRow
                              icon={Users}
                              label="Capacity"
                              value={`${selectedBooking.yacht.capacity} guests`}
                            />
                            <InfoRow
                              icon={ClipboardIcon}
                              label="Notes"
                              value={selectedBooking.yacht.notes || "No notes available"}
                            />
                          </div>
                        </div>

                        {/* Booking Information */}
                        <div>
                          <Typography variant="h6" color="blue-gray" className="mb-4">
                            Booking Information
                          </Typography>
                          <div className="space-y-3">
                            <InfoRow
                              icon={CalendarDaysIcon}
                              label="Booking Date"
                              value={formatDate(selectedBooking.booking.selected_date)}
                            />
                            <InfoRow
                              icon={ClockIcon}
                              label="Duration"
                              value={`${selectedBooking.booking.duration_hour} hours`}
                            />
                            <InfoRow
                              icon={UsersIcon}
                              label="Number of Guests"
                              value={selectedBooking.booking.info?.guest || 'N/A'}
                            />
                            {selectedBooking.booking.phone_number && (
                              <InfoRow
                                icon={PhoneIcon}
                                label="Contact Number"
                                value={selectedBooking.booking.phone_number}
                              />
                            )}
                            {selectedBooking.booking.country && (
                              <InfoRow
                                icon={BiGlobeAlt}
                                label="Country"
                                value={selectedBooking.booking.country.toUpperCase()}
                              />
                            )}
                            {selectedBooking.booking.message && (
                              <InfoRow
                                icon={ClipboardIcon}
                                label="Message"
                                value={selectedBooking.booking.message}
                              />
                            )}
                          </div>
                        </div>

                        {/* Payment Information */}
                        <div className="md:col-span-2">
                          <Typography variant="h6" color="blue-gray" className="mb-4">
                            Payment Details
                          </Typography>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <PaymentInfoCard
                                label="Total Amount"
                                value={`$${selectedBooking.booking.total_cost}`}
                              />
                              <PaymentInfoCard
                                label="Paid Amount"
                                value={`$${selectedBooking.booking.paid_cost}`}
                              />
                              <PaymentInfoCard
                                label="Status"
                                value={
                                  <Chip
                                    size="sm"
                                    variant="ghost"
                                    value={getStatusText(selectedBooking.booking)}
                                    color={getStatusColor(selectedBooking.booking)}
                                    className="mt-1"
                                  />
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogBody>
                  </>
                )}
              </Dialog>
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
    </div>
  );
};

export default BoatBookings;