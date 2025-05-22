import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import EventBookingGlobal from '../../pages/booking/EventBookingGlobal.jsx';
const BookingEventAll = () => {
    const yachtsType = useLocation().pathname.split('/')[2];
  
  return (

    <>
    <EventBookingGlobal
     yachtsType={yachtsType}

     />
    </>
  )

}
export default BookingEventAll;