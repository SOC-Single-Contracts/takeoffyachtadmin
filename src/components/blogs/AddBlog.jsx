import React, { useEffect, useRef, useState, useMemo } from 'react';
import { PiImageSquare } from "react-icons/pi";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createBlog, getBlogById, updateBlog } from '../../services/api/blogsService';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.takeoffyachts.com';
const S3URL = import.meta.env.VITE_S3_URL || 'https://images-yacht.s3.us-east-1.amazonaws.com';


const AddBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState({
    featuredImage: null,
    authorName: '',
    title: '',
    content: '',
    tags: '',
    metaDescription: '',
  });


  const quillRef = useRef(null);

  const updateBlogData = (field, value) => {
    setBlogData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('images', file);

      try {
        const res = await fetch(`${BASE_URL}/yacht/upload_to_s3/`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        // console.log(data)
        let imageUrl = '';

        if (data?.image_urls?.length > 0) {
          imageUrl = data.image_urls[0].replace(
            `${BASE_URL}`,
            `${S3URL}`
          );
        } else {
          console.warn("No image URLs found.");
          // Optionally assign a fallback
          imageUrl = '/assets/images/Imagenotavailable.png';
        }

        // console.log("imageUrl",imageUrl)
        if (quillRef.current && quillRef.current.getEditor) {
          const editor = quillRef.current.getEditor();
          editor.focus();
          const range = editor.getSelection();

          if (range) {
            editor.insertEmbed(range.index, 'image', imageUrl);
          } else {
            editor.insertEmbed(0, 'image', imageUrl);
          }
        }
      } catch (err) {
        console.error('Image upload failed:', err);
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), []);

  const formats = useMemo(() => [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'color', 'background',
    'align', 'link', 'image', 'video',
  ], []);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      if (id) {
        try {
          const blog = await getBlogById(id);
          setBlogData({
            title: blog.title,
            content: blog.content,
            authorName: blog.author_name,
            tags: blog.tags,
            metaDescription: blog.meta_tags,
            featuredImage: blog.thumbnail_image,
          });
        } catch (error) {
          console.error('Error fetching blog details:', error);
        }
      }
    };
    fetchBlogDetails();
  }, [id]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    updateBlogData('featuredImage', file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

      // Validate required fields
  if (!blogData.featuredImage) {
    toast.error('Please select a Blog Image');
    return;
  }
  if (!blogData.authorName.trim()) {
    toast.error('Author Name is required');
    return;
  }
  if (!blogData.title.trim()) {
    toast.error('Title is required');
    return;
  }
  if (!blogData.content.trim()) {
    toast.error('Content is required');
    return;
  }
  // if (!blogData.metaDescription.trim()) {
  //   toast.error('Meta Description is required');
  //   return;
  // }
    const formData = new FormData();
    formData.append('title', blogData.title);
    formData.append('content', blogData.content);
    formData.append('author_name', blogData.authorName);
    if (blogData.featuredImage && blogData.featuredImage instanceof File) {
      formData.append('thumbnail_image', blogData.featuredImage);
    }
    formData.append('tags', blogData.tags);
    formData.append('meta_tags', blogData.metaDescription);
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
      <h1 className="text-lg lg:text-4xl font-bold mb-8 font-sora">{id ? "Edit Blog Post" : "Add New Blog Post"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-5">
            <div className="relative">
              <div
                className="border border-dashed bg-[#BEA35514] border-gray-400 rounded-md h-80 flex flex-col justify-center items-center text-gray-500 text-center relative z-0"
                onClick={() => document.getElementById("blog-image-upload").click()}
              >
                {blogData.featuredImage ? (
                  <img
                    src={typeof blogData.featuredImage === 'string' ? blogData.featuredImage : URL.createObjectURL(blogData.featuredImage)}
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
                <input
                  value={blogData.authorName}
                  onChange={(e) => updateBlogData('authorName', e.target.value)}
                  className="w-full border rounded-lg p-2 border-gray-300 focus:ring-1 focus:ring-[#BEA355] focus:outline-none"
                  placeholder="Enter author name"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Title<span className="text-red-700">*</span></label>
                <input
                  value={blogData.title}
                  onChange={(e) => updateBlogData('title', e.target.value)}
                  className="w-full border rounded-lg p-2 border-gray-300 focus:ring-1 focus:ring-[#BEA355] focus:outline-none"
                  placeholder="Enter blog title"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Content<span className="text-red-700">*</span></label>
                <ReactQuill
                  value={blogData.content}
                  onChange={(value) => updateBlogData('content', value)}
                  className="w-full border rounded-lg border-gray-300 focus:ring-1 focus:ring-[#BEA355] focus:outline-none"
                  placeholder="Write your blog content here..."
                  modules={modules}
                  formats={formats}
                  ref={quillRef}
                  theme="snow"
                />
              </div>

              {/* <div>
                <label className="block font-medium mb-2">Meta Description<span className="text-red-700">*</span></label>
                <textarea
                  value={blogData.metaDescription}
                  onChange={(e) => updateBlogData('metaDescription', e.target.value)}
                  className="w-full border rounded-lg p-2 border-gray-300 focus:ring-1 focus:ring-[#BEA355] focus:outline-none"
                  placeholder="Enter meta description for SEO"
                  rows="3"
                />
              </div> */}

              {/* <div>
                <label className="block font-medium mb-2">Tags</label>
                <input
                  value={blogData.tags}
                  onChange={(e) => updateBlogData('tags', e.target.value)}
                  className="w-full border rounded-lg p-2 border-gray-300 focus:ring-1 focus:ring-[#BEA355] focus:outline-none"
                  placeholder="Enter tags separated by commas"
                />
              </div> */}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
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