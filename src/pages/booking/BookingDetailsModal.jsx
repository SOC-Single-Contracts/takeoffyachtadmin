import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "@material-tailwind/react";

const BookingDetailsModal = ({ booking, isOpen, onClose }) => {
  console.log("BookingDetailsModal isOpen:", isOpen); // Log the modal state
  if (!isOpen) return null; // Ensure the modal is removed from the DOM when closed

  if (!booking || !booking.yacht) {
    return null; // Prevent rendering if booking or yacht is undefined
  }

  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalHeader>Booking Details</ModalHeader>
      <ModalBody>
      {booking ? (
        <div>
          <p><strong>Yacht Name:</strong> {booking.yacht.name || 'N/A'}</p>
          <p><strong>Booking Date:</strong> {new Date(booking.selected_date).toLocaleString() || 'N/A'}</p>
          <p><strong>Duration:</strong> {booking.duration_hour || 'N/A'} hours</p>
          <p><strong>Guests:</strong> {booking.info.guest || 'N/A'}</p>
          <p><strong>Total Cost:</strong> ${booking.total_cost || 'N/A'}</p>
          <p><strong>Status:</strong> {booking.cancel ? 'Cancelled' : 'Confirmed'}</p>
          {/* Add more details as needed */}
        </div>
      ) : (
        <p>No booking data available.</p>
      )}
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};

export default BookingDetailsModal;
