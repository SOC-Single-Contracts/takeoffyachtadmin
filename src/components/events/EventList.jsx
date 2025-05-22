import React, { useEffect, useState } from 'react';
import EventsListingGlobal from './EventsListingGlobal';
// import axios from 'axios';
// import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";

// const EventList = () => {
//     const [events, setEvents] = useState([]);

//     useEffect(() => {
//         const fetchEvents = async () => {
//             const response = await axios.get('https://api.takeoffyachts.com/yacht/get_event/1');
//             setEvents(response.data.data);
//         };

//         fetchEvents();
//     }, []);

//     return (
//         <div className="p-0">
//             <Card className="h-full w-full p-4">
//                     <Typography variant="h3" className='font-sora' color="blue-gray">
//                         Event List
//                     </Typography>
//                 <CardBody className="overflow-x-auto px-0">
//                     <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-sm bg-white">
//                         <thead className="bg-black text-white text-sm uppercase font-medium">
//                             <tr>
//                                 <th className="border-b border-blue-gray-100 p-4">Name</th>
//                                 <th className="border-b border-blue-gray-100 p-4">Location</th>
//                                 <th className="border-b border-blue-gray-100 p-4">Title</th>
//                                 <th className="border-b border-blue-gray-100 p-4">Description</th>
//                                 <th className="border-b border-blue-gray-100 p-4">Packages</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {events.map(eventData => {
//                                 const event = eventData.event;
//                                 const packages = eventData.packages;
//                                 return (
//                                     <tr key={event.id} className="hover:bg-[#BEA35514]">
//                                         <td className="p-4">{event.name}</td>
//                                         <td className="p-4">{event.location}</td>
//                                         <td className="p-4">{event.title}</td>
//                                         <td className="p-4 truncate ellipsis max-w-[100px]">{event.description}</td>
//                                         <td className="p-4">
//                                             {packages.length > 0 ? packages.map(pkg => (
//                                                 <div key={pkg.id}>{pkg.name} - ${pkg.package_price}</div>
//                                             )) : 'No packages available'}
//                                         </td>
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>
//                     </table>
//                 </CardBody>
//             </Card>
//         </div>
//     );
// };

// export default EventList;


const EventList  = ()=>{
    return(
        <EventsListingGlobal yachtsType="event" />
  
    )
  }
  export default EventList;