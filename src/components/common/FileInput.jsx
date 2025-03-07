import React, { useState } from 'react';

const FileInput = ({ label, multiple = false, onChange, accept = "image/*", ...props }) => {
  const [fileNames, setFileNames] = useState('');

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    setFileNames(files.map(file => file.name).join(', '));
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type="file"
          className="hidden"
          onChange={handleChange}
          multiple={multiple}
          accept={accept}
          {...props}
        />
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => document.querySelector(`input[name="${props.name}"]`).click()}
            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BEA355]"
          >
            Choose {multiple ? 'Files' : 'File'}
          </button>
          {fileNames && (
            <p className="text-sm text-gray-500 truncate">
              Selected: {fileNames}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileInput;
