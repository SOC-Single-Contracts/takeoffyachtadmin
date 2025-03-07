import { useState, useEffect } from "react";

const CustomDropdown = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [months, setMonths] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    // Get last 12 months
    const getLastMonths = () => {
      const result = [];
      for (let i = 0; i < 12; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthYear = date.toLocaleString('default', { 
          month: 'long',
          year: 'numeric'
        });
        result.push({
          label: monthYear,
          value: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
        });
      }
      return result;
    };

    const monthsList = getLastMonths();
    setMonths(monthsList);
    setSelected(monthsList[0]); // Set current month as default
  }, []);

  const handleSelect = (month) => {
    setSelected(month);
    setIsOpen(false);
    if (onFilterChange) {
      onFilterChange(month.value);
    }
  };

  if (!selected) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="border border-gray-300 p-2 rounded-md min-w-full text-left flex items-center gap-2"
      >
        {selected.label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4 ml-2 text-gray-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute w-full min-w-fit mt-1 bg-white border border-gray-300 rounded-md shadow-md z-10 max-h-60 overflow-y-auto">
          {months.map((month) => (
            <li
              key={month.value}
              onClick={() => handleSelect(month)}
              className="p-2 hover:bg-[#BEA355] hover:text-white hover:cursor-pointer"
            >
              {month.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
