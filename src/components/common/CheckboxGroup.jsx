import React from 'react';

const CheckboxGroup = ({ options, selectedValues, onChange }) => {
  const handleChange = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div>
      {options.map((option, index) => (
        <label key={index} className="flex items-center">
          <input
            type="checkbox"
            value={option}
            checked={selectedValues.includes(option)}
            onChange={() => handleChange(option)}
            className="mr-2"
          />
          {option}
        </label>
      ))}
    </div>
  );
};

export default CheckboxGroup;