import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllYachts } from "../services/api/allYachtsService";

const YachtList = () => {
  const [yachts, setYachts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchYachts();
  }, []);

  const fetchYachts = async () => {
    try {
      const data = await getAllYachts();
      setYachts(data);
    } catch (error) {
      console.error('Error fetching yachts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white px-6 py-3 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4 pb-4">
        <h2 className="text-2xl font-sora font-bold">Listed Yachts</h2>
        <Link to="/listings" className="text-[#BEA355] font-semibold">
          View All
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BEA355]"></div>
        </div>
      ) : (
        yachts.slice(0, 4).map((item) => (
          <div
            key={item.yacht.id}
            className="flex items-center justify-between mb-4 border-b last:border-b-0 pb-4"
          >
            <img
              src={`https://api.takeoffyachts.com${item.yacht.yacht_image}`}
              alt={item.yacht.name}
              className="w-14 h-14 rounded-md object-cover"
            />
            <div className="flex-1 px-4">
              <h3 className="text-lg font-semibold">{item.yacht.name}</h3>
              <p className="text-sm text-gray-500">${item.yacht.per_hour_price}/hr</p>
            </div>
            <p className="text-sm text-[#BEA355] bg-[#BEA3550F] p-2 rounded-xl">
              {item.yacht.guest} guests
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default YachtList;
