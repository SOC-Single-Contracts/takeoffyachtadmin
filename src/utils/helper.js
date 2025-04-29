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
  export const getS3PathOnly = (url) => {
    try {
      const decoded = decodeURIComponent(url);
      const split = decoded.split("amazonaws.com/");
      
      // Ensure there's a path part after 'amazonaws.com/'
      if (split.length > 1 && split[1]) {
        return split[1];
      }
  
      // If 'amazonaws.com/' not found or no path after it
      return decoded;
    } catch {
      return url;
    }
  };
  
  