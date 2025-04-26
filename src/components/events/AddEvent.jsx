// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import MapPicker from '../common/MapPicker';
// import FileUpload from '../common/FileUpload';

// const AddEvent = () => {
//   const [loading, setLoading] = useState(false);
//   const [location, setLocation] = useState(null);
//   const [eventImage, setEventImage] = useState(null);
//   const [packageImage, setPackageImage] = useState(null);
//   const [status, setStatus] = useState('t');
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     location: '',
//     title: '',
//     cancel_time_in_hour: '',
//     duration_hour: '',
//     total_tickets: '',
//     notes: '',
//     description: '',
//     package_type: '',
//     number_of_ticket: '',
//     price: '',
//     package_duration_hour: '',
//     package_description: '',
//     feature_name: '',
//     feature_price: '',
//     event_image: '',
//     package_image: '',
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const requestBody = {
//         name: formData.name,
//         location: formData.location,
//         title: formData.title,
//         longitude: location ? location.lng : 0,
//         latitude: location ? location.lat : 0,
//         cancel_time_in_hour: parseInt(formData.cancel_time_in_hour),
//         status: status,
//         duration_hour: parseInt(formData.duration_hour),
//         total_tickets: parseInt(formData.total_tickets),
//         notes: formData.notes,
//         description: formData.description,
//         package_type: formData.package_type,
//         number_of_ticket: parseInt(formData.number_of_ticket),
//         price: parseInt(formData.price),
//         package_duration_hour: parseInt(formData.package_duration_hour),
//         package_description: formData.package_description,
//         feature_name: formData.feature_name,
//         feature_price: formData.feature_price,
//         // event_image: eventImage ? eventImage.name : "",
//         // package_image: packageImage ? packageImage.name : "",
//         user_id: 1
//       };

//       const response = await fetch("https://api.takeoffyachts.com/yacht/event/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(requestBody)
//       });

//       const data = await response.json();

//       if (response.ok) {
//         toast.success('Event created successfully!');
//         navigate('/events');
//       } else {
//         throw new Error(data.message || 'Something went wrong');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error(error.message || 'Failed to create event');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   return (
//     <div className="p-6">
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <h1 className="text-3xl font-bold mb-6 font-sora">Add New Event</h1>
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Event Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Title
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Location
//               </label>
//               <input
//                 type="text"
//                 name="location"
//                 value={formData.location}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded"
//               >
//                 <option value="t">Active</option>
//                 <option value="f">Inactive</option>
//               </select>
//           </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Cancel Time (hours)
//               </label>
//               <input
//                 type="number"
//                 name="cancel_time_in_hour"
//                 value={formData.cancel_time_in_hour}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Duration (hours)
//               </label>
//               <input
//                 type="number"
//                 name="duration_hour"
//                 value={formData.duration_hour}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Total Tickets
//               </label>
//               <input
//                 type="number"
//                 name="total_tickets"
//                 value={formData.total_tickets}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Price
//               </label>
//               <input
//                 type="number"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Package Type
//               </label>
//               <input
//                 type="text"
//                 name="package_type"
//                 value={formData.package_type}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Number of Tickets
//               </label>
//               <input
//                 type="number"
//                 name="number_of_ticket"
//                 value={formData.number_of_ticket}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Package Duration (hours)
//               </label>
//               <input
//                 type="number"
//                 name="package_duration_hour"
//                 value={formData.package_duration_hour}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Feature Names (comma-separated)
//               </label>
//               <input
//                 type="text"
//                 name="feature_name"
//                 value={formData.feature_name}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded"
//                 placeholder="e.g., f1,f2"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Feature Prices (comma-separated)
//               </label>
//               <input
//                 type="text"
//                 name="feature_price"
//                 value={formData.feature_price}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded"
//                 placeholder="e.g., 1,4"
//                 required
//               />
//             </div>
//           </div>

//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows="4"
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Package Description
//               </label>
//               <textarea
//                 name="package_description"
//                 value={formData.package_description}
//                 onChange={handleInputChange}
//                 rows="4"
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Notes
//               </label>
//               <textarea
//                 name="notes"
//                 value={formData.notes}
//                 onChange={handleInputChange}
//                 rows="4"
//                 className="w-full p-2 border rounded"
//               />
//             </div>

//             {/* <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Event Image</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setEventImage(e.target.files[0])}
//                 className="w-full p-2 border rounded"
//               />
//           </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Package Image</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setPackageImage(e.target.files[0])}
//                 className="w-full p-2 border rounded"
//               />
//             </div> */}

//             <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Event Image</label>
//               <FileUpload
//                 label="Event Image"
//                 onFilesChange={(files) => setEventImage(files[0])}
//               />
//             </div>

//             <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Package Image</label>
//               <FileUpload
//                 label="Package Image"
//                 onFilesChange={(files) => setPackageImage(files[0])}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Location on Map</label>
//               <MapPicker
//                 onLocationSelect={setLocation}
//                 initialLocation={location}
//               />
//               {location && (
//                 <div className="mt-2 text-sm text-gray-500">
//                   Selected coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="flex justify-end">
//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-[#BEA355] rounded-full text-white px-6 py-2 rounded hover:bg-[#BEA355] disabled:opacity-50"
//             >
//               {loading ? 'Creating Event...' : 'Create Event'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddEvent;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MapPicker from '../common/MapPicker';
import FileUpload from '../common/ImagesUploader/FileUpload';

const AddEvent = () => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [eventImage, setEventImage] = useState(null);
  const [packageImage, setPackageImage] = useState(null);
  const [status, setStatus] = useState('t');
  const [activeTab, setActiveTab] = useState('event'); // State for tab selection
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    title: '',
    cancel_time_in_hour: '',
    duration_hour: '',
    total_tickets: '',
    notes: '',
    description: '',
    package_type: '',
    number_of_ticket: '',
    price: '',
    package_duration_hour: '',
    package_description: '',
    feature_name: '',
    feature_price: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestBody = {
        name: formData.name,
        location: formData.location,
        title: formData.title,
        longitude: location ? location.lng : 0,
        latitude: location ? location.lat : 0,
        cancel_time_in_hour: parseInt(formData.cancel_time_in_hour),
        status: status,
        duration_hour: parseInt(formData.duration_hour),
        total_tickets: parseInt(formData.total_tickets),
        notes: formData.notes,
        description: formData.description,
        package_type: formData.package_type,
        number_of_ticket: parseInt(formData.number_of_ticket),
        price: parseInt(formData.price),
        package_duration_hour: parseInt(formData.package_duration_hour),
        package_description: formData.package_description,
        feature_name: formData.feature_name,
        feature_price: formData.feature_price,
        event_image: eventImage ? eventImage.name : "default.png",
        package_image: packageImage ? packageImage.name : "default.png",
        user_id: 1
      };

      const response = await fetch("https://api.takeoffyachts.com/yacht/event/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Event created successfully!');
        navigate('/events');
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPackage = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestBody = {
        event: 1,
        name: formData.name,
        location: formData.location,
        title: formData.title,
        longitude: location ? location.lng : 0,
        latitude: location ? location.lat : 0,
        cancel_time_in_hour: parseInt(formData.cancel_time_in_hour),
        status: true,
        duration_hour: parseInt(formData.duration_hour),
        total_tickets: parseInt(formData.total_tickets),
        notes: formData.notes,
        description: formData.description,
        package_type: formData.package_type,
        price: parseInt(formData.price),
        number_of_ticket: parseInt(formData.number_of_ticket),
        package_duration_hour: parseInt(formData.package_duration_hour),
        package_description: formData.package_description,
        feature_name: formData.feature_name,
        feature_price: formData.feature_price,
      };

      const response = await fetch("https://api.takeoffyachts.com/yacht/package/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Package created successfully!');
        navigate('/packages');
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to create package');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 font-sora">Manage Event & Package</h1>
        
        <div className="flex space-x-4 mb-4">
          <button
            className={`py-2 px-4 rounded-md ${activeTab === 'event' ? 'bg-[#BEA355] text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('event')}
          >
            Add Event
          </button>
          <button
            className={`py-2 px-4 rounded-md ${activeTab === 'package' ? 'bg-[#BEA355] text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('package')}
          >
            Add Package
          </button>
        </div>

        {activeTab === 'event' && (
          <form onSubmit={handleSubmitEvent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select name="status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded">
                  <option value="t">Active</option>
                  <option value="f">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cancel Time (hours)</label>
                <input type="number" name="cancel_time_in_hour" value={formData.cancel_time_in_hour} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
                <input type="number" name="duration_hour" value={formData.duration_hour} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Tickets</label>
                <input type="number" name="total_tickets" value={formData.total_tickets} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Type</label>
                <input type="text" name="package_type" value={formData.package_type} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Tickets</label>
                <input type="number" name="number_of_ticket" value={formData.number_of_ticket} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Duration (hours)</label>
                <input type="number" name="package_duration_hour" value={formData.package_duration_hour} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Feature Names (comma-separated)</label>
                <input type="text" name="feature_name" value={formData.feature_name} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="e.g., f1,f2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Feature Prices (comma-separated)</label>
                <input type="text" name="feature_price" value={formData.feature_price} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="e.g., 1,4" required />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full p-2 border rounded" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Description</label>
                <textarea name="package_description" value={formData.package_description} onChange={handleInputChange} rows="4" className="w-full p-2 border rounded" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="4" className="w-full p-2 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location on Map</label>
                <MapPicker onLocationSelect={setLocation} initialLocation={location} />
                {location && (
                  <div className="mt-2 text-sm text-gray-500">
                    Selected coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Image</label>
                <FileUpload label="Event Image" onFilesChange={(files) => setEventImage(files[0])} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Image</label>
                <FileUpload label="Package Image" onFilesChange={(files) => setPackageImage(files[0])} />
              </div>

            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="bg-[#BEA355] rounded-full text-white px-6 py-2 hover:bg-[#A58B3D] disabled:opacity-50">
                {loading ? 'Creating Event...' : 'Create Event'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'package' && (
          <form onSubmit={handleSubmitPackage} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cancel Time (hours)</label>
                <input type="number" name="cancel_time_in_hour" value={formData.cancel_time_in_hour} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
                <input type="number" name="duration_hour" value={formData.duration_hour} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Tickets</label>
                <input type="number" name="total_tickets" value={formData.total_tickets} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Tickets</label>
                <input type="number" name="number_of_ticket" value={formData.number_of_ticket} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Duration (hours)</label>
                <input type="number" name="package_duration_hour" value={formData.package_duration_hour} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Feature Names (comma-separated)</label>
                <input type="text" name="feature_name" value={formData.feature_name} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="e.g., f1,f2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Feature Prices (comma-separated)</label>
                <input type="text" name="feature_price" value={formData.feature_price} onChange={handleInputChange} className="w-full p-2 border rounded" placeholder="e.g., 10,20,30" required />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full p-2 border rounded" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Description</label>
                <textarea name="package_description" value={formData.package_description} onChange={handleInputChange} rows="4" className="w-full p-2 border rounded" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="4" className="w-full p-2 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Image</label>
                <FileUpload label="Event Image" onFilesChange={(files) => setEventImage(files[0])} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Package Image</label>
                <FileUpload label="Package Image" onFilesChange={(files) => setPackageImage(files[0])} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location on Map</label>
                <MapPicker onLocationSelect={setLocation} initialLocation={location} />
                {location && (
                  <div className="mt-2 text-sm text-gray-500">
                    Selected coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="bg-[#BEA355] rounded-full text-white px-6 py-2 hover:bg-[#A58B3D] disabled:opacity-50">
                {loading ? 'Creating Package...' : 'Create Package'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddEvent;