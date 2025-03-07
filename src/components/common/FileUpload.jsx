import React, { useState, useRef } from 'react';

const FileUpload = ({ onFilesChange, maxFiles = null, acceptedFileTypes = "*", containerClassName = "" }) => {
  const [files, setFiles] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const galleryRef = useRef(null);
  const counter = useRef(0);

  const formatFileSize = (size) => {
    return size > 1024
      ? size > 1048576
        ? Math.round(size / 1048576) + "mb"
        : Math.round(size / 1024) + "kb"
      : size + "b";
  };

  const addFile = (file) => {
    if (maxFiles && Object.keys(files).length >= maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const isImage = file.type.match("image.*");
    const objectURL = URL.createObjectURL(file);

    const newFile = {
      id: objectURL,
      file,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      isImage,
      url: objectURL
    };

    const updated = { ...files, [objectURL]: newFile };
    setFiles(updated);
    onFilesChange?.(Object.values(updated));
  };

  const handleFileSelect = (e) => {
    for (const file of e.target.files) {
      addFile(file);
    }
    e.target.value = null; // Reset input
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    counter.current = 0;

    for (const file of e.dataTransfer.files) {
      addFile(file);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    if (!e.dataTransfer.types.includes('Files')) return;
    counter.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    counter.current--;
    if (counter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = (fileId) => {
    setFiles(prev => {
      const updated = { ...prev };
      delete updated[fileId];
      onFilesChange?.(Object.values(updated));
      return updated;
    });
  };

  const clearFiles = () => {
    setFiles({});
    onFilesChange?.([]);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm ${containerClassName}`}>
      <div
        className="relative"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {/* Drag overlay */}
        <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center rounded-lg transition-all ${
          isDragging ? 'bg-white/70' : 'pointer-events-none'
        }`}>
          <svg className={`w-12 h-12 mb-3 text-[#BEA355] transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0'}`} 
               xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.479 10.092c-.212-3.951-3.473-7.092-7.479-7.092-4.005 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408zm-7.479-1.092l4 4h-3v4h-2v-4h-3l4-4z" />
          </svg>
          <p className={`text-lg text-[#BEA355] transition-opacity ${isDragging ? 'opacity-100' : 'opacity-0'}`}>
            Drop files to upload
          </p>
        </div>

        {/* Upload area */}
        <div className="p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="mb-3 text-gray-700">
              <span>Drag and drop your files anywhere or</span>
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple={maxFiles !== 1}
              accept={acceptedFileTypes}
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-sm bg-[#BEA355] text-white rounded-lg hover:bg-[#A58B3D] transition-colors"
            >
              Select Files
            </button>
          </div>

          {/* File preview */}
          <div ref={galleryRef} className="mt-6">
            {Object.keys(files).length === 0 ? (
              <div className="text-center py-8">
                <img
                  className="mx-auto w-32 opacity-50"
                  src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                  alt="no files"
                />
                <span className="text-sm text-gray-500">No files selected</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Object.values(files).map((file) => (
                  <div key={file.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      {file.isImage ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M15 2v5h5v15h-16v-20h11zm1-2h-14v24h20v-18l-6-6z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <div className="p-3 text-white">
                        <p className="text-xs truncate">{file.name}</p>
                        <p className="text-xs mt-1">{file.size}</p>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          {Object.keys(files).length > 0 && (
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={clearFiles}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
