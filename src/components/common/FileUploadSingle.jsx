import React, { useState, useEffect, useRef } from "react";
import { formatFileSize } from "../../utils/helper";
import LazyImage from "./ImagesUploader/LazyImage";
import yachtImage from "../../assets/images/fycht.jpg"

const FileUploadSingle = ({
  onFilesChange,
  acceptedFileTypes = "*",
  containerClassName = "",
  apiImage,
}) => {
  const [fileData, setFileData] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const objectURL = URL.createObjectURL(selectedFile);

    const updated = {
      id: objectURL,
      file: selectedFile,
      name: selectedFile.name,
      size: formatFileSize(selectedFile.size),
      type: selectedFile.type,
      isImage: selectedFile.type.match("image.*"),
      url: objectURL,
    };

    setFileData(updated);
    onFilesChange?.(updated);
    e.target.value = null;
  };

  const handleDelete = () => {
    setFileData(null);
    onFilesChange?.(null);
  };

  const clearFiles = () => {
    setFileData(null);
    onFilesChange?.(null);
  };

  useEffect(() => {
    // if (apiImage) {
    // }
    setFileData(apiImage);

  }, [apiImage]);

  //test
  // useEffect(() => {
  //   console.log("fileData",fileData,apiImage)

  // }, [fileData]);

  return (
    <div className={`bg-white rounded-lg shadow-sm ${containerClassName}`}>
      <div className="p-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="mb-3 text-gray-700">
            <span>Upload Yacht Main Image</span>
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFileTypes}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-sm bg-[#BEA355] text-white rounded-lg hover:bg-[#A58B3D] transition-colors"
          >
            Select Image
          </button>
        </div>

        {/* Preview */}
        <div className="mt-6">
          {!fileData ? (
            <div className="text-center py-8">
              <img
                className="mx-auto w-32 opacity-50"
                src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                alt="no files"
              />
              <span className="text-sm text-gray-500">No image selected</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              <div className="relative group">
                <div
                //  className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  {/* <img
                    src={fileData?.url}
                    alt={"Image not found"}
                    // className="w-full h-full object-cover"
                    width={80} height={80} className={`rounded-lg object-cover  relative w-[80px] h-[80px] sm:w-[80px] md:w-[120px]  overflow-hidden transition-all duration-300 rounded-lg 
                      hover:opacity-100 
                     cursor-pointer opacity-100`}
                  /> */}
                  <LazyImage
                    src={fileData?.url}
                    placeholder={yachtImage}
                    alt={"Image Not Found"}
                    className="rounded-lg object-cover relative w-[80px] h-[80px] sm:w-[80px] md:w-[120px] overflow-hidden transition-all duration-300 hover:opacity-100 cursor-pointer opacity-100"
                  />
                </div>
                {/* <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <div className="p-3 text-white">
                    <p className="text-xs truncate">{fileData?.name}</p>
                    <p className="text-xs mt-1">{fileData?.size}</p>
                    <button
                      onClick={handleDelete}
                      className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z" />
                      </svg>
                    </button>
                  </div>
                </div> */}
                <div className="absolute inset-0 bg-black/40 opacity-100 group-hover:opacity-100 transition-opacity rounded-lg">
                    <div className="p-3 text-white">
                      {/* <p className="text-xs truncate">{item.name}</p>
                      <p className="text-xs mt-1">{item.size}</p> */}
                      <button
                        onClick={handleDelete}
                        className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z" />
                        </svg>
                      </button>
                    </div>
                  </div>
              </div>
            </div>
          )}
        </div>

        {/* Clear Button */}
        {fileData && (
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={clearFiles}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadSingle;
