import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { PiImageSquare } from "react-icons/pi";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createBlog, getBlogById, updateBlog } from '../../services/api/blogsService';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [featuredImage, setFeaturedImage] = useState(null);
  const { handleSubmit, control, formState: { errors }, reset } = useForm();

  useEffect(() => {
    const fetchBlogDetails = async () => {
      if (id) {
        try {
          const blog = await getBlogById(id);
          reset({
            title: blog.title,
            content: blog.content,
            authorName: blog.author_name,
            tags: blog.tags,
            metaDescription: blog.meta_tags,
          });
          setFeaturedImage(blog.thumbnail_image);
        } catch (error) {
          console.error('Error fetching blog details:', error);
        }
      }
    };

    fetchBlogDetails();
  }, [id, reset]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFeaturedImage(file);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('author_name', data.authorName);

    if (featuredImage && featuredImage instanceof File) {
        formData.append('thumbnail_image', featuredImage);
    }

    formData.append('tags', data.tags);
    formData.append('meta_tags', data.metaDescription);
    formData.append('created_at', new Date().toISOString());

    try {
        if (id) {
            await updateBlog(id, formData);
            toast.success('Blog updated successfully');
        } else {
            await createBlog(formData);
            toast.success('Blog created successfully');
        }
        navigate('/blogs');
    } catch (error) {
        console.error('Error saving blog:', error);
        toast.error('Error saving blog');
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-lg lg:text-4xl font-bold mb-8 font-sora">Add New Blog Post</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-5">
            <div className="relative">
              <div
                className="border border-dashed bg-[#BEA35514] border-gray-400 rounded-md h-80 flex flex-col justify-center items-center text-gray-500 text-center relative z-0"
                onClick={() => document.getElementById("blog-image-upload").click()}
              >
                {featuredImage ? (
                  <img
                    src={typeof featuredImage === 'string' ? featuredImage : URL.createObjectURL(featuredImage)}
                    alt="Featured"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <>
                    <PiImageSquare fontSize="100px" color="#BEA355" />
                    <p className="text-sm text-black">
                      <strong className="text-[#BEA355]"><u>Choose a file</u></strong> or drag & drop it here
                    </p>
                    <p className="text-sm text-black">JPEG, PNG supported formats, up to 5 mb</p>
                  </>
                )}
              </div>
              <input
                id="blog-image-upload"
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="col-span-7">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block font-medium mb-2">Author Name<span className="text-red-700">*</span></label>
                <Controller
                  name="authorName"
                  control={control}
                  rules={{ required: "Author name is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      className={`w-full border rounded-lg p-2 ${
                        errors.authorName ? "border-red-500" : "border-gray-300"
                      } focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
                      placeholder="Enter author name"
                    />
                  )}
                />
                {errors.authorName && (
                  <span className="text-red-500 text-sm">{errors.authorName.message}</span>
                )}
              </div>

              <div>
                <label className="block font-medium mb-2">Title<span className="text-red-700">*</span></label>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: "Title is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      className={`w-full border rounded-lg p-2 ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      } focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
                      placeholder="Enter blog title"
                    />
                  )}
                />
                {errors.title && (
                  <span className="text-red-500 text-sm">{errors.title.message}</span>
                )}
              </div>

              <div>
                <label className="block font-medium mb-2">Content<span className="text-red-700">*</span></label>
                <Controller
                  name="content"
                  control={control}
                  rules={{ required: "Content is required" }}
                  render={({ field }) => (
                    <ReactQuill
                      {...field}
                      className={`w-full border rounded-lg ${
                        errors.content ? "border-red-500" : "border-gray-300"
                      } focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
                      placeholder="Write your blog content here..."
                    />
                  )}
                />
                {errors.content && (
                  <span className="text-red-500 text-sm">{errors.content.message}</span>
                )}
              </div>

              <div>
                <label className="block font-medium mb-2">Category<span className="text-red-700">*</span></label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`w-full border rounded-lg p-2 ${
                        errors.category ? "border-red-500" : "border-gray-300"
                      } focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
                    >
                      <option value="">Select a category</option>
                      <option value="yacht-life">Yacht Life</option>
                      <option value="destinations">Destinations</option>
                      <option value="tips">Tips & Guides</option>
                      <option value="events">Events</option>
                      <option value="news">News</option>
                    </select>
                  )}
                />
                {errors.category && (
                  <span className="text-red-500 text-sm">{errors.category.message}</span>
                )}
              </div>

              <div>
                <label className="block font-medium mb-2">Meta Description<span className="text-red-700">*</span></label>
                <Controller
                  name="metaDescription"
                  control={control}
                  rules={{ required: "Meta description is required" }}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className={`w-full border rounded-lg p-2 ${
                        errors.metaDescription ? "border-red-500" : "border-gray-300"
                      } focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
                      placeholder="Enter meta description for SEO"
                      rows="3"
                    />
                  )}
                />
                {errors.metaDescription && (
                  <span className="text-red-500 text-sm">{errors.metaDescription.message}</span>
                )}
              </div>

              <div>
                <label className="block font-medium mb-2">Tags</label>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="w-full border rounded-lg p-2 border-gray-300 focus:ring-1 focus:ring-[#BEA355] focus:outline-none"
                      placeholder="Enter tags separated by commas"
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#BEA355] text-white rounded-full hover:bg-yellow-600"
          >
            Publish Blog
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;