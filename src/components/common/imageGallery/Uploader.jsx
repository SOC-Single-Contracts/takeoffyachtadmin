import React, { useState } from "react";

const Uploader = ({ imagesPreviewUrls }) => {
  const [imageValidationError, setImageValidationError] = useState(null);

  const checkMimeType = (event) => {
    const { files } = event.target;
    let err = "";
    const types = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    for (let x = 0; x < files.length; x += 1) {
      if (types.every((type) => files[x].type !== type)) {
        err += `${files[x].type} is not a supported format\n`;
      }
    }

    if (err !== "") {
      event.target.value = null;
      setImageValidationError(err);
      return false;
    }

    return true;
  };

  const filesSelectedHandler = (e) => {
    if (checkMimeType(e)) {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = {
            file: reader.result,
            size: file.size,
            name: file.name
          };
          setImageValidationError(null);
          imagesPreviewUrls(result);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <div id="main">
      <input
        type="file"
        name="file"
        id="file"
        className="custom-file-input"
        onChange={filesSelectedHandler}
        accept="image/png, image/jpeg, image/webp"
        multiple
      />
      <p>Drag your images here or click in this area.</p>
      {imageValidationError && <span className="error-msg">{imageValidationError}</span>}
    </div>
  );
};

export default Uploader;
