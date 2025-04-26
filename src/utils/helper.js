const handleNavigate = (path) => {
    window.location.href = path;
}

export default handleNavigate;




export const formatFileSize = (size) => {
    return size > 1024
      ? size > 1048576
        ? Math.round(size / 1048576) + "mb"
        : Math.round(size / 1024) + "kb"
      : size + "b";
  };