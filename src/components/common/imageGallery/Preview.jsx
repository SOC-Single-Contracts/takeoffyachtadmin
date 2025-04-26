import React, { useState, useEffect, Fragment } from "react";


const Preview = ({ imagesPreviewUrls, deleteImage }) => {
  const [previewImages, setPreviewImages] = useState([]);
  const [dragId, setDragId] = useState(null);

  useEffect(() => {
    setPreviewImages(imagesPreviewUrls);
  }, [imagesPreviewUrls]);

  const handleOver = (ev) => {
    ev.preventDefault();
  };

  const handleDrag = (ev) => {
    setDragId(ev.currentTarget.id);
  };

  const handleDrop = (ev) => {
    ev.preventDefault();
    const dragImage = previewImages.find((img) => String(img.id) === dragId);
    const dropImage = previewImages.find(
      (img) => String(img.id) === ev.currentTarget.id
    );

    const updatedImages = moveItem(dragImage.id - 1, dropImage.id - 1);
    setPreviewImages(updatedImages);
  };

  const moveItem = (from, to) => {
    const updated = [...previewImages];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    return updated;
  };

  const handleDelete = (id) => {
    deleteImage(id);
  };


  //test

  useEffect(()=>{
 console.log("previewImages",previewImages)
  },[previewImages])

  return (
    <div className="wrapper">
      {previewImages.length > 0 &&
        previewImages.map((item, index) => {
          const imageWithId = { ...item, id: index + 1 };
          return (
            <div
              className="gallery"
              key={index}
              id={String(imageWithId.id)}
              draggable
              onDragOver={handleOver}
              onDragStart={handleDrag}
              onDrop={handleDrop}
            >
              <img
                src={imageWithId.file}
                alt={imageWithId.name}
                width="600"
                height="400"
              />
              <div className="desc">
                <div className="image-order">
                  {/* <FontAwesomeIcon
                    className="delete-icon"
                    onClick={() => handleDelete(imageWithId.id)}
                    icon={faTrash}
                  /> */}
                  <button                   onClick={() => handleDelete(imageWithId.id)} >delete</button>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Preview;
