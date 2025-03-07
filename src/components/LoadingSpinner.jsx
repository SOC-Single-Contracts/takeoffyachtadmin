import React from 'react';
import { CircularProgress } from '@material-tailwind/react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <CircularProgress color="blue" />
    </div>
  );
};

export default LoadingSpinner;
