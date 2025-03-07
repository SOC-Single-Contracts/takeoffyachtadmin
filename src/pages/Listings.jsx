import React, { useState, useEffect } from "react";
import useHandleNavigate from "../hooks/useHandleNavigate";
import { getAllYachts } from "../services/api/allYachtsService";

const Listings = () => {
  const [yachts, setYachts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectAll, setSelectAll] = useState(false);
  const [selected, setSelected] = useState([]);

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

  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      setSelected(yachts.map((item) => item.yacht.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((yachtId) => yachtId !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleNavigate = useHandleNavigate();

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Listed Yachts</h2>
        <button
          className="bg-[#BEA355] text-white px-6 md:px-14 py-2 rounded-full hover:bg-yellow-600"
          onClick={() => handleNavigate("/boats/add")}
        >
          Add New
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BEA355]"></div>
        </div>
      ) : (
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-black text-white text-sm font-medium text-left">
              <th className="py-3 px-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                  <span
                    className={`w-[18px] h-[18px] border-2 rounded-sm transition-all ${
                      selectAll
                        ? "bg-[#BEA355] border-[#BEA355]"
                        : "bg-transparent border-gray-400"
                    }`}
                  >
                    {selectAll && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="white"
                        className="w-full h-full absolute top-0 left-0"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                </label>
              </th>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Facilities</th>
              <th className="py-3 px-4 text-left">Bookings</th>
              <th className="py-3 px-4 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {yachts.map((item) => (
              <tr
                key={item.yacht.id}
                className={`border-b ${
                  selected.includes(item.yacht.id)
                    ? "bg-[#BEA35514]"
                    : "hover:bg-[#BEA35514]"
                } hover:cursor-pointer`}
              >
                <td className="py-4 px-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={selected.includes(item.yacht.id)}
                      onChange={() => handleSelect(item.yacht.id)}
                    />
                    <span
                      className={`w-[18px] h-[18px] border-2 rounded-sm transition-all ${
                        selected.includes(item.yacht.id)
                          ? "bg-[#BEA355] border-[#BEA355]"
                          : "bg-transparent border-gray-400"
                      }`}
                    >
                      {selected.includes(item.yacht.id) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="white"
                          className="w-full h-full absolute top-0 left-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>
                  </label>
                </td>
                <td className="py-3 px-4">
                  <img
                    src={`https://api.takeoffyachts.com${item.yacht.yacht_image}`}
                    alt={item.yacht.name}
                    className="w-20 h-12 object-cover rounded-md"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x48?text=No+Image';
                    }}
                  />
                </td>
                <td className="py-3 px-4">{item.yacht.name}</td>
                <td className="py-3 px-4">
                  {`${item.yacht.length} ft. • ${item.yacht.guest} Guests • ${item.yacht.number_of_cabin} Cabins`}
                </td>
                <td className="py-3 px-4">{item.yacht.capacity}</td>
                <td className="py-3 px-4 text-right">
                  <button className="text-gray-500 hover:text-gray-700 rotate-90">
                    •••
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Listings;