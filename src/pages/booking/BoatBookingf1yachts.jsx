import React, { useState, useEffect, useCallback } from 'react';
import BoatBookingGlobal from './BoatBookingGlobal';
import { useLocation } from 'react-router-dom';
const BoatBookingf1yachts = () => {
  const yachtsType = useLocation().pathname.split('/')[2];
  // console.log(yachtsType)
  return (

    <>
    <BoatBookingGlobal yachtsType={yachtsType}/>
    </>
  )

}
export default BoatBookingf1yachts;