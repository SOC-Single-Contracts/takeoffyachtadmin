import React, { useState, useEffect, useRef } from "react";
import { formatFileSize } from "../../../utils/helper";
import LazyImage from "./LazyImage";
import yachtImage from "../../../assets/images/fycht.jpg";

const FileUpload = ({
  onFilesChange,
  maxFiles = null,
  acceptedFileTypes = "*",
  containerClassName = "",
  apiImages,
}) => {
  const [files, setFiles] = useState({});
  const [previewImages, setPreviewImages] = useState([]);

  const fileInputRef = useRef(null);
  const dragIdRef = useRef(null);
  const previewImagesRef = useRef([]);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const updated = { ...files };

    for (const file of selectedFiles) {
      if (maxFiles && Object.keys(updated).length >= maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        break;
      }

      const objectURL = URL.createObjectURL(file);
      updated[objectURL] = {
        id: objectURL,
        file,
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
        isImage: file.type.match("image.*"),
        url: objectURL,
      };
    }

    setFiles(updated);
    onFilesChange?.(Object.values(updated));
    e.target.value = null;
  };

  const handleDelete = (ev, id) => {
    ev.preventDefault();
    const updated = { ...files };
    delete updated[id];
    setFiles(updated);
    onFilesChange?.(Object.values(updated));
  };

  const handleDragOver = (ev) => {
    ev.preventDefault();
  };

  const handleDragStart = (ev, id) => {
    dragIdRef.current = id;
  };

  const handleDropImage = (ev, id) => {
    ev.preventDefault();
    const dragId = dragIdRef.current;
    if (!dragId) return;

    const dragImage = previewImagesRef.current.find((img) => img.id === dragId);
    const dropImage = previewImagesRef.current.find((img) => img.id === id);

    if (!dragImage || !dropImage) return;

    const updatedImages = moveItem(dragImage.id, dropImage.id);

    previewImagesRef.current = updatedImages; // update ref
    setPreviewImages(updatedImages); // trigger UI update
    onFilesChange?.(Object.values(updatedImages));

    dragIdRef.current = null;
  };

  const moveItem = (fromId, toId) => {
    const updated = [...previewImagesRef.current];
    const fromIndex = updated.findIndex((img) => img.id === fromId);
    const toIndex = updated.findIndex((img) => img.id === toId);

    if (fromIndex === -1 || toIndex === -1) return updated;

    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);

    return updated;
  };

  const clearFiles = () => {
    setFiles({});
    onFilesChange?.([]);
  };

  useEffect(() => {
    const images = Object.values(files);
    setPreviewImages(images);
    previewImagesRef.current = images;
  }, [files]);

  useEffect(() => {
    if (apiImages?.length > 0) {
      const updatedFiles = {};
      apiImages.forEach((img) => {
        updatedFiles[img.id] = img;
      });
      setFiles(updatedFiles);
    }
  }, [apiImages]);

  return (
    <div className={`bg-white classFormultipleImage rounded-lg shadow-sm ${containerClassName}`}>
      <div className="p-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="mb-3 text-gray-700">
            <span>Upload More Images of Yacht</span>
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
            Select Images
          </button>
        </div>

        {/* File preview */}
        <div className="mt-6">
          {previewImages.length === 0 ? (
            <div className="text-center py-8">
              <img
                className="mx-auto w-32 opacity-50"
                src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                alt="no files"
              />
              <span className="text-sm text-gray-500">No files selected</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {previewImages.map((item, index) => (
                <div
                  key={item.id}
                  id={item.id}
                  draggable
                  onDragOver={handleDragOver}
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDrop={(e) => handleDropImage(e, item.id)}
                  className="relative group cursor-pointer"
                >
                  <div>
                    <LazyImage
                      src={item?.url || yachtImage}
                      placeholder={yachtImage}
                      alt={"Image Not Found"}
                      className="rounded-lg object-cover w-[80px] h-[80px] sm:w-[80px] md:w-[120px] overflow-hidden transition-all duration-300 hover:opacity-100"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-100 group-hover:opacity-100 transition-opacity rounded-lg">
                    <div className="p-3 text-white">
                      <button
                        onClick={(e) => handleDelete(e, item.id)}
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
  );
};

export default FileUpload;
