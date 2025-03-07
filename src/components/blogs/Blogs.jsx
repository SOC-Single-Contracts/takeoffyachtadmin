import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Typography, Button } from "@material-tailwind/react";
import { getAllBlogs } from '../../services/api/blogsService';
import { Link, useNavigate } from 'react-router-dom';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getAllBlogs();
        setBlogs(response.data); // Set blogs from the data property
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  const handleRowClick = (blogId) => {
    navigate(`/blogs/add/${blogId}`);
  };

  // Pagination logic
  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBlogs = blogs.slice(startIndex, endIndex);

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

  return (
    <div className="p-6">
      <Card className="h-full w-full p-4">
        <CardHeader floated={false} shadow={false} className="rounded-none flex justify-between">
          <Typography className='font-sora' variant="h3" color="black">
            All Blog Posts
          </Typography>
          <p></p>
          <Link to="/blogs/add">
            <Button className="flex items-center bg-[#BEA355] gap-3 rounded-full capitalize font-medium" size="md">
              Add Blog
            </Button>
          </Link>
        </CardHeader>
        <CardBody className="overflow-auto px-0">
          <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm bg-white">
            <thead className="bg-black text-white text-sm uppercase font-medium">
              <tr>
                <th className="border-b border-blue-gray-100 p-4">Title</th>
                <th className="border-b border-blue-gray-100 p-4">Author Name</th>
                <th className="border-b border-blue-gray-100 p-4">Created At</th>
              </tr>
            </thead>
            <tbody>
              {currentBlogs.map(blog => (
                <tr key={blog.ID} className="hover:bg-gray-50" onClick={() => handleRowClick(blog.ID)}>
                  <td className="p-4">{blog.title}</td>
                  <td className="p-4">{blog.author_name}</td>
                  <td className="p-4">{new Date(blog.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-black">
            <Button className='text-black font-medium' onClick={prev} disabled={currentPage === 1}>Previous</Button>
            <Typography color="gray" className="font-normal">
              Page <strong className="text-gray-900">{currentPage}</strong> of <strong className="text-gray-900">{totalPages}</strong>
            </Typography>
            <Button className='text-black font-medium' onClick={next} disabled={currentPage === totalPages}>Next</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Blogs;