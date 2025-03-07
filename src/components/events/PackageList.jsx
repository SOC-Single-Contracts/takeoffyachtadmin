import { Card, CardBody, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';;

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("https://api.takeoffyachts.com/yacht/package/");
        if (!response.ok) {
          throw new Error('Failed to fetch packages');
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setPackages(data.package);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return <div>Loading packages...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log('Packages:', packages);
  if (!Array.isArray(packages)) {
    return <div>No packages available.</div>;
  }

  return (
    <div className="p-0">
      <Card className="h-full w-full p-4">
        <Typography variant="h3" className='font-sora' color="blue-gray">
          Package List
        </Typography>
        <CardBody className="overflow-x-auto px-0">
          <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm bg-white">
            <thead className="bg-black text-white text-sm uppercase font-medium">
              <tr>
                <th className="border-b border-blue-gray-100 p-4">Package Type</th>
                <th className="border-b border-blue-gray-100 p-4">Price</th>
                <th className="border-b border-blue-gray-100 p-4">Description</th>
                <th className="border-b border-blue-gray-100 p-4">Status</th>
                <th className="border-b border-blue-gray-100 p-4">Duration</th>
              </tr>
            </thead>
            <tbody>
              {packages.map(pkg => (
                <tr key={pkg.id} className="hover:bg-[#BEA35514]">
                  <td className="p-4">{pkg.package_type}</td>
                  <td className="p-4">${pkg.price}</td>
                  <td className="p-4">{pkg.description}</td>
                  <td className="p-4">{pkg.status ? 'Available' : 'Unavailable'}</td>
                  <td className="p-4">{pkg.duration_hour} hours</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default PackageList;