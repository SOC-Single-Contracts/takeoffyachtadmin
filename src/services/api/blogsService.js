import axios from 'axios';

const API_URL = 'https://api.takeoffyachts.com/Blogs/blogs/';

export const getAllBlogs = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getBlogById = async (id) => {
  const response = await axios.get(`${API_URL}${id}/`);
  return response.data;
};

export const createBlog = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateBlog = async (id, data) => {
  const response = await axios.put(`${API_URL}${id}/`, data);
  return response.data;
};