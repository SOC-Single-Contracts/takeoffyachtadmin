// import React, { useState, useEffect } from 'react';

// import { Card, CardHeader, CardBody, CardFooter, Typography, Button, IconButton } from "@material-tailwind/react";
// import { Link } from 'react-router-dom';
// import { getAllBoats } from '../../services/api/boatService';


// const F1Boats = () => {
//   const [boats, setBoats] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   useEffect(() => {
//     // fetchBoats();
//   }, []);

//   const fetchBoats = async () => {
//     try {
//       // Pass 'f1' as the feature to filter F1 boats
//       const data = await getAllBoats();
//       setBoats(data);
//     } catch (error) {
//       console.error('Error fetching F1 boats:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getCurrentPageBoats = () => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     return boats.slice(startIndex, endIndex);
//   };

//   const totalPages = Math.ceil(boats.length / itemsPerPage);

// //test
// //   useEffect(()=>{
// // console.log("boats",boats)
// //   },[boats])

//     if (boats.length<=0) {
//       return (
//         <div className="p-6">
//           <Card className="h-full w-full p-4">
//             <CardHeader floated={false} shadow={false} className="rounded-none">
//               <div className="animate-pulse h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
//             </CardHeader>
//             <CardBody className="overflow-auto px-0">
//               <div className="space-y-4">
//                 {[1, 2, 3].map((i) => (
//                   <div key={i} className="animate-pulse">
//                     <div className="h-16 bg-gray-100 rounded"></div>
//                   </div>
//                 ))}
//               </div>
//             </CardBody>
//           </Card>
//         </div>
//       );
//     }
//   return (

//     <div className="p-6">
//       <Card className="h-full w-full p-4">
//         <CardHeader floated={false} shadow={false} className="rounded-none">
//           <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
//             <div>
//               <Typography variant="h3" className='font-sora' color="black">
//                 F1 Boats
//               </Typography>
//               <Typography color="gray" className="mt-1 font-normal">
//                 Manage your F1 boat listings
//               </Typography>
//             </div>
//             <Link to="/boats/f1/add">
//               <Button className="flex items-center bg-[#BEA355] gap-3 rounded-full capitalize font-medium" size="sm">
//                 Add F1 Boat
//               </Button>
//             </Link>
//           </div>
//         </CardHeader>
//         <CardBody className="overflow-auto px-0">
//           {loading ? (
//             <div className="flex justify-center items-center h-40">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BEA355]"></div>
//             </div>
//           ) : (
//             <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm bg-white">
//               <thead className="bg-black text-white text-sm uppercase font-medium">
//                 <tr>
//                   <th className="border-b border-blue-gray-100 p-4">Title</th>
//                   <th className="border-b border-blue-gray-100 p-4">Location</th>
//                   <th className="border-b border-blue-gray-100 p-4">Price per day</th>
//                   <th className="border-b border-blue-gray-100 p-4">Status</th>
//                   <th className="border-b border-blue-gray-100 p-4">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {getCurrentPageBoats().map((boat) => (
//                   <tr key={boat?.id} className="hover:bg-gray-50">
//                     <td className="p-4">{boat?.title}</td>
//                     <td className="p-4">{boat?.location}</td>
//                     <td className="p-4">{boat?.per_day_price} AED</td>
//                     <td className="p-4">
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                         boat?.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                       }`}>
//                         {boat?.status ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td className="p-4">
//                       <Link to={`/boats/f1/edit/${boat?.id}`}>
//                         <Button variant="text" className="text-[#BEA355]">
//                           Edit
//                         </Button>
//                       </Link>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </CardBody>
//         <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
//           <Button 
//             variant="outlined" 
//             size="sm"
//             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </Button>
//           <div className="flex items-center gap-2">
//             {[...Array(totalPages)].map((_, index) => (
//               <IconButton
//                 key={index + 1}
//                 variant={currentPage === index + 1 ? "outlined" : "text"}
//                 size="sm"
//                 onClick={() => setCurrentPage(index + 1)}
//               >
//                 {index + 1}
//               </IconButton>
//             ))}
//           </div>
//           <Button 
//             variant="outlined" 
//             size="sm"
//             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// };
import React, { useEffect, useState } from "react";
import BoatsListingGlobal from "../../components/boats/boatsListingGlobal";
const F1Boats = () => {
return(
  <>
  <BoatsListingGlobal yachtsType={"f1yachts"} />
  </>
);
};

export default F1Boats;