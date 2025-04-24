// import React, { useEffect, useState } from "react";

// import { Card, CardHeader, CardBody, CardFooter, Typography, Button, Dialog, DialogHeader, DialogBody, IconButton } from "@material-tailwind/react";
// import { Link } from 'react-router-dom';
// import { FaXmark } from "react-icons/fa6";
// import { FlagIcon, LocateIcon, PowerIcon, ShipIcon, TypeIcon } from "lucide-react";
// import { BsCurrencyDollar } from "react-icons/bs";

// const InfoRow = ({ label, value, icon }) => (
//   <div className="flex justify-between">
//     <span className="font-semibold">{label}:</span>
//     <span className="flex items-center">
//       {icon && <icon className="h-5 w-5 mr-2" />}
//       {value}
//     </span>
//   </div>
// );


// const Boats = () => {
//   const currency = 'AED';
//   const baseUrl =  'https://api.takeoffyachts.com';

//   const [yachtData, setYachtData] = useState([]);
//   const [selectedYacht, setSelectedYacht] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     const fetchData = async (id) => {
//       try {
//         const response = await fetch(`${baseUrl}/yacht/get_yacht/${id}`);
//         const data = await response.json();
//         setYachtData(data.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     // fetchData(1);
//   }, []);

//   const openModal = (yacht) => {
//     setSelectedYacht(yacht);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedYacht(null);
//   };


//   if (!yachtData) {
//     return (
//       <div className="p-6">
//         <Card className="h-full w-full p-4">
//           <CardHeader floated={false} shadow={false} className="rounded-none">
//             <div className="animate-pulse h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
//           </CardHeader>
//           <CardBody className="overflow-auto px-0">
//             <div className="space-y-4">
//               {[1, 2, 3].map((i) => (
//                 <div key={i} className="animate-pulse">
//                   <div className="h-16 bg-gray-100 rounded"></div>
//                 </div>
//               ))}
//             </div>
//           </CardBody>
//         </Card>
//       </div>
//     );
//   }

//   const { categories, yacht } = yachtData;

//   return (

//     <div className="p-6">
//       <Card className="h-full w-full p-4">
//         <CardHeader floated={false} shadow={false} className="rounded-none">
//           <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
//             <div>
//               <Typography variant="h3" className='font-sora' color="black">
//                 All Boats
//               </Typography>
//               <Typography color="gray" className="mt-1 font-normal">
//                 Manage your boat listings
//               </Typography>
//             </div>
//             <div className="flex w-full shrink-0 gap-2 md:w-max">
//               <Link to="/boats/add">
//                 <Button className="flex items-center bg-[#BEA355] gap-3 rounded-full capitalize font-medium" size="sm">
//                   Add Boat
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </CardHeader>
//         <CardBody className="overflow-auto px-0">
//           <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm bg-white mb-6">
//             <thead className="bg-black text-white text-sm uppercase font-medium">
//               <tr>
//                 <th className="border-b border-blue-gray-100 p-4">Title</th>
//                 <th className="border-b border-blue-gray-100 p-4">Location</th>
//                 <th className="border-b border-blue-gray-100 p-4">Price (per hour)</th>
//                 <th className="border-b border-blue-gray-100 p-4">Status</th>
//                 <th className="border-b border-blue-gray-100 p-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {yachtData.map((item) => (
//                 <tr className="cursor-pointer" key={item.yacht.id} onClick={() => openModal(item.yacht)}>
//                   <td className="p-4">{item.yacht.name}</td>
//                   <td className="p-4">{item.yacht.location}</td>
//                   <td className="p-4">{currency} {item.yacht.per_hour_price}</td>
//                   <td className="p-4">
//                     <span className={`px-2 py-1 rounded-full text-xs ${
//                       item.yacht.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                     }`}>
//                       {item.yacht.status ? 'Active' : 'Inactive'}
//                     </span>
//                   </td>
//                   <td className="p-4">
//                     <Link to={`/boats/edit/1?id=${item.yacht.id}`}>
//                       <Button variant="text" className="text-[#BEA355]">
//                         Edit
//                       </Button>
//                     </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </CardBody>
//         <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
//           <Button variant="outlined" size="sm">
//             Previous
//           </Button>
//           <Button variant="outlined" size="sm">
//             Next
//           </Button>
//         </CardFooter>
//       </Card>

//       {/* Modal for displaying yacht details */}
//      {/* Modal for displaying yacht details */}
// <Dialog 
//   size="xxl" 
//   open={isModalOpen} 
//   handler={closeModal}
//   className="bg-white rounded-lg"
// >
//   {selectedYacht && (
//     <>
//       <DialogHeader className="flex items-center justify-between">
//         <Typography variant="h4">
//           Yacht Details
//         </Typography>
//         <IconButton
//           variant="text"
//           onClick={closeModal}
//           className="text-gray-700 flex items-center justify-center"
//         >
//           <FaXmark className="h-6 w-6" />
//         </IconButton>
//       </DialogHeader>
//       <DialogBody divider className="overflow-y-auto max-h-[80vh]">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Yacht Information */}
//           <div>
//             <Typography variant="h6" color="blue-gray" className="mb-4">
//               Yacht Information
//             </Typography>
//             <div className="space-y-3">
//               <InfoRow 
//                 icon={ShipIcon} 
//                 label="Name" 
//                 value={selectedYacht.name} 
//               />
//               <InfoRow 
//                 icon={LocateIcon} 
//                 label="Location" 
//                 value={selectedYacht.location} 
//               />
//               <InfoRow 
//                 icon={BsCurrencyDollar} 
//                 label="Price per Hour" 
//                 value={`$${selectedYacht.per_hour_price}`} 
//               />
//               <InfoRow 
//                 icon={TypeIcon} 
//                 label="Type" 
//                 value={selectedYacht.type || 'N/A'} 
//               />
//               <InfoRow 
//                 icon={FlagIcon} 
//                 label="Status" 
//                 value={selectedYacht.status ? 'Active' : 'Inactive'} 
//               />
//             </div>
//           </div>

//           {/* Additional Details */}
//           <div>
//             <Typography variant="h6" color="blue-gray" className="mb-4">
//               Additional Details
//             </Typography>
//             <div className="space-y-3">
//               <InfoRow 
//                 icon={PowerIcon} 
//                 label="Length" 
//                 value={selectedYacht.length ? `${selectedYacht.length} ft` : 'N/A'} 
//               />
//               <InfoRow 
//                 icon={PowerIcon} 
//                 label="Power" 
//                 value={selectedYacht.power || 'N/A'} 
//               />
//               <InfoRow 
//                 icon={TypeIcon} 
//                 label="Crew Members" 
//                 value={selectedYacht.crew_member || 'N/A'} 
//               />
//               <InfoRow 
//                 icon={TypeIcon} 
//                 label="Guest Capacity" 
//                 value={selectedYacht.guest ? `${selectedYacht.guest} guests` : 'N/A'} 
//               />
//               <InfoRow 
//                 icon={TypeIcon} 
//                 label="Sleeping Capacity" 
//                 value={selectedYacht.sleep_capacity ? `${selectedYacht.sleep_capacity} guests` : 'N/A'} 
//               />
//             </div>
//           </div>
//         </div>

//         {/* Availability */}
//         <div className="mt-8">
//           <Typography variant="h6" color="blue-gray" className="mb-4">
//             Availability
//           </Typography>
//           {selectedYacht.availability && (
//             <>
//               <InfoRow 
//                 label="Available From" 
//                 value={typeof selectedYacht.availability === 'string' ? JSON.parse(selectedYacht.availability.replace(/'/g, '"')).from || 'N/A' : selectedYacht.availability?.from || 'N/A'} 
//               />
//               <InfoRow 
//                 label="Available To" 
//                 value={typeof selectedYacht.availability === 'string' ? JSON.parse(selectedYacht.availability.replace(/'/g, '"')).to || 'N/A' : selectedYacht.availability?.to || 'N/A'} 
//               />
//             </>
//           )}
//         </div>

//         {/* Features */}
//         <div className="mt-8">
//           <Typography variant="h6" color="blue-gray" className="mb-4">
//             Features
//           </Typography>
//           <div className="grid grid-cols-2 gap-4">
//             {selectedYacht.features && typeof selectedYacht.features === 'string' && (
//               <div>
//                 {JSON.parse(selectedYacht.features.replace(/'/g, '"')).key}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Description */}
//         {selectedYacht.description && (
//           <div className="mt-8">
//             <Typography variant="h6" color="blue-gray" className="mb-4">
//               Description
//             </Typography>
//             <p className="text-gray-700">{selectedYacht.description}</p>
//           </div>
//         )}

//         {/* Notes */}
//         {selectedYacht.notes && (
//           <div className="mt-8">
//             <Typography variant="h6" color="blue-gray" className="mb-4">
//               Notes
//             </Typography>
//             <div 
//               className="text-gray-700"
//               dangerouslySetInnerHTML={{ __html: selectedYacht.notes }}
//             />
//           </div>
//         )}
//       </DialogBody>
//     </>
//   )}
// </Dialog>
//     </div>
//   );
import React, { useEffect, useState } from "react";
import BoatsListingGlobal from "../../components/boats/boatsListingGlobal";
const Boats = () => {

return(
  <>
  <BoatsListingGlobal yachtsType={"yachts"} />
  </>
);
};

export default Boats;  