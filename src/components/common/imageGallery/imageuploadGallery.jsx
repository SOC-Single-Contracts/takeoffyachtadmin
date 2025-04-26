import React, { useState, useRef, useEffect } from 'react';
import Uploader from './Uploader';
import Preview from './Preview';


const S3URL = "https://images-yacht.s3.us-east-1.amazonaws.com"

const ImageUploadGallery = ({ onFilesChange, maxFiles = null, acceptedFileTypes = "*", containerClassName = "",additionalImages }) => {
  const [files, setFiles] = useState({});
  const [imagesPreviewUrls, setImagesPreviewUrls] = useState([]);

  const handleImagesPreviewUrls = (result) => {
    setImagesPreviewUrls((prev) => [...prev, result]);
  };

  const deleteImage = (id) => {
    setImagesPreviewUrls((prev) => prev.filter((image) => image.id !== id));
  };

  useEffect(()=>{

    const formattedImages = additionalImages?.map((img, index) => ({
        name: `Image ${index + 1}`,
        size: 'unknown', // You can replace this if you have actual sizes
            file: `${img.startsWith('http') ? '' : S3URL}${img}`
      }));
    
      setImagesPreviewUrls(formattedImages)

  },[additionalImages])

 

  //test

//   useEffect(()=>{
// console.log("files in upload",files)
//   },[files])



  return (
    <div className={`bg-white rounded-lg classForImageUploaderCustom shadow-sm ${containerClassName}`}>
      <div
        className="relative"

      >


        {/* Upload area */}
        <div className="p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="mb-3 text-gray-700">
              <span>Drag and drop your files anywhere or</span>
            </p>
            <Uploader imagesPreviewUrls={handleImagesPreviewUrls} />
      {imagesPreviewUrls.length > 0 && (
        <Preview
          imagesPreviewUrls={imagesPreviewUrls}
          deleteImage={deleteImage}
        />
      )}
    
          </div>

    


          {/* <div className="text-center py-8">
                <img
                  className="mx-auto w-32 opacity-50"
                  src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                  alt="no files"
                />
                <span className="text-sm text-gray-500">No files selected</span>
              </div> */}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadGallery;
