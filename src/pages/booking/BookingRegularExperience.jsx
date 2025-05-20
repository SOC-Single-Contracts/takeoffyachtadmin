import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ExperienceBookingGlobal from './ExperienceBookingGlobal.jsx';
const BookingRegularExperience = () => {
    const yachtsType = useLocation().pathname.split('/')[2];
  
  return (

    <>
    <ExperienceBookingGlobal
     yachtsType={yachtsType}

     />
    </>
  )

}
export default BookingRegularExperience;