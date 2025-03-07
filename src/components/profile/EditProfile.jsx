import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
const EditProfile = () => {
 const { handleSubmit, control, formState: { errors } } = useForm();
 const [profilePicture, setProfilePicture] = useState(null);
  const handleProfilePictureUpload = (e) => {
   const file = e.target.files[0];
   setProfilePicture(file);
 };
  const onSubmit = (data) => {
   console.log("Form Data:", data);
   console.log("Profile Picture:", profilePicture);
 };
  return (
   <div className="w-full p-6 bg-white rounded-xl shadow-lg">
     <h1 className="text-lg lg:text-4xl font-bold mb-8 font-sora">Profile Settings</h1>
     <form onSubmit={handleSubmit(onSubmit)}>
       <div className="grid grid-cols-2 gap-4">
         <div>
           <label className="block font-medium mb-2">Role<span className="text-red-700">*</span></label>
           <Controller
             name="role"
             control={control}
             rules={{ required: "Role is required" }}
             render={({ field }) => (
               <select
                 {...field}
                 className={`w-full border rounded-lg p-2 ${
                   errors.role ? "border-red-500" : "border-gray-300"
                 } focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
               >
                 <option defaultValue value="admin">Admin</option>
                 {/* <option value="admin">Admin</option> */}
                 <option value="merchant">Merchant</option>
                 <option value="user">User</option>
               </select>
             )}
           />
           {errors.role && (
             <span className="text-red-500 text-sm">{errors.role.message}</span>
           )}
         </div>
         <div>
           <label className="block font-medium mb-2">First Name<span className="text-red-700">*</span></label>
           <Controller
             name="firstName"
             control={control}
             rules={{ required: "First name is required" }}
             render={({ field }) => (
               <input
                 {...field}
                 className={`w-full border rounded-lg p-2 ${
                   errors.firstName ? "border-red-500" : "border-gray-300"
                 } focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
                 placeholder="Enter here"
               />
             )}
           />
           {errors.firstName && (
             <span className="text-red-500 text-sm">{errors.firstName.message}</span>
           )}
         </div>
         <div>
           <label className="block font-medium mb-2">Last Name<span className="text-red-700">*</span></label>
           <Controller
             name="lastName"
             control={control}
             rules={{ required: "Last name is required" }}
             render={({ field }) => (
               <input
                 {...field}
                 className={`w-full border rounded-lg p-2 ${
                   errors.lastName ? "border-red-500" : "border-gray-300"
                 } focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
                 placeholder="Enter here"
               />
             )}
           />
           {errors.lastName && (
             <span className="text-red-500 text-sm">{errors.lastName.message}</span>
           )}
         </div>
         <div>
           <label className="block font-medium mb-2">Phone<span className="text-red-700">*</span></label>
           <Controller
             name="phone"
             control={control}
             rules={{ required: "Phone is required" }}
             render={({ field }) => (
               <input
                 {...field}
                 className={`w-full border rounded-lg p-2 ${
                   errors.phone ? "border-red-500" : "border-gray-300"
                 } focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
                 placeholder="Enter here"
               />
             )}
           />
           {errors.phone && (
             <span className="text-red-500 text-sm">{errors.phone.message}</span>
           )}
         </div>
         <div>
           <label className="block font-medium mb-2">Email<span className="text-red-700">*</span></label>
           <Controller
             name="email"
             control={control}
             rules={{ required: "Email is required" }}
             render={({ field }) => (
               <input
                 {...field}
                 type="email"
                 className={`w-full border rounded-lg p-2 ${
                   errors.email ? "border-red-500" : "border-gray-300"
                 } focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
                 placeholder="Enter here"
               />
             )}
           />
           {errors.email && (
             <span className="text-red-500 text-sm">{errors.email.message}</span>
           )}
         </div>
         <div>
           <label className="block font-medium mb-2">Username<span className="text-red-700">*</span></label>
           <Controller
             name="username"
             control={control}
             rules={{ required: "Username is required" }}
             render={({ field }) => (
               <input
                 {...field}
                 className={`w-full border rounded-lg p-2 ${
                   errors.username ? "border-red-500" : "border-gray-300"
                 } focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
                 placeholder="Enter here"
               />
             )}
           />
           {errors.username && (
             <span className="text-red-500 text-sm">{errors.username.message}</span>
           )}
         </div>
         <div>
           <label className="block font-medium mb-2">Profile Picture<span className="text-red-700">*</span></label>
           <input
             type="file"
             accept="image/*"
             onChange={handleProfilePictureUpload}
             className="w-full border rounded-lg p-2 focus:ring-1 focus:ring-[#BEA355] focus:outline-none"
           />
         </div>
         <div>
           <label className="block font-medium mb-2">Status<span className="text-red-700">*</span></label>
           <Controller
             name="status"
             control={control}
             rules={{ required: "Status is required" }}
             render={({ field }) => (
               <select
                 {...field}
                 className={`w-full border rounded-lg p-2 ${
                   errors.status ? "border-red-500" : "border-gray-300"
                 } focus:ring-1 focus:ring-[#BEA355] focus:outline-none`}
               >
                 <option value="">Select status</option>
                 <option value="active">Active</option>
                 <option value="inactive">Inactive</option>
               </select>
             )}
           />
           {errors.status && (
             <span className="text-red-500 text-sm">{errors.status.message}</span>
           )}
         </div>
       </div>
        <div className="mt-6 flex justify-end gap-4">
         <button
           type="submit"
           className="px-4 py-2 bg-[#BEA355] text-white rounded-full hover:bg-yellow-600"
         >
           Update User
         </button>
       </div>
     </form>
   </div>
 );
}
export default EditProfile;