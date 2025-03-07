import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Typography, Button } from "@material-tailwind/react";
import experienceService from '../../services/api/experienceService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const AllExperiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await experienceService.getAllExperiencesNew();
        console.log(response.data); // Log the response to check its structure
        if (Array.isArray(response.data.data)) {
          setExperiences(response.data.data);
        } else {
          toast.error('Unexpected response format');
        }
      } catch (error) {
        toast.error('Error fetching experiences: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <Card className="h-full w-full p-4">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex justify-between items-center">
            <Typography variant="h3" className='font-sora' color="blue-gray">
              All Experiences
            </Typography>
            <Link to="/experiences/add">
              <Button className="bg-[#BEA355] rounded-full capitalize font-medium font-md">Add Experience</Button>
            </Link>
          </div>
        </CardHeader>
        <CardBody className="overflow-auto px-0">
          <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm bg-white">
            <thead className="bg-black text-white text-sm uppercase font-medium">
              <tr>
                <th className="border-b border-blue-gray-100 p-4">Name</th>
                <th className="border-b border-blue-gray-100 p-4">Location</th>
                <th className="border-b border-blue-gray-100 p-4">Title</th>
                <th className="border-b border-blue-gray-100 p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((experience) => (
                <tr key={experience.id} className="hover:bg-[#BEA35514]">
                  <td className="p-4">{experience.experience.name || 'N/A'}</td>
                  <td className="p-4">{experience.experience.location || 'N/A'}</td>
                  <td className="p-4">{experience.experience.title || 'N/A'}</td>
                  <td className="p-4">
                    <Link to={`/experiences/edit/${experience.experience.id}`}>  
                      <Button variant="text" className="text-[#BEA355]">Edit</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default AllExperiences;
