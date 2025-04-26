import { formatFileSize } from "./helper";
const S3URL = "https://images-yacht?.s3.us-east-1.amazonaws.com"


export const yachtData = (data) => {

    let obj = {
            // ...data?.yacht,

            // user_id:1,
            // yacht:data?.yacht?.id,
            // min_price: String(data?.yacht?.min_price),
            // max_price: String(data?.yacht?.max_price),
            // guest: String(data?.yacht?.guest),
            // cancel_time_in_hour: String(data?.yacht?.cancel_time_in_hour),
            // duration_hour: String(data?.yacht?.duration_hour),
            // duration_minutes: String(data?.yacht?.duration_minutes),
            // number_of_cabin: String(data?.yacht?.number_of_cabin),
            // capacity: String(data?.yacht?.capacity),
            // sleep_capacity: String(data?.yacht?.sleep_capacity),
            // per_day_price: String(data?.yacht?.per_day_price),
            // per_hour_price: String(data?.yacht?.per_hour_price),


    user_id: 1,
    yacht: data?.yacht?.id,
    name: data?.yacht?.name,
    title: data?.yacht?.title,
    location: data?.yacht?.location,
    min_price: String(data?.yacht?.min_price),
    max_price: String(data?.yacht?.max_price),
    guest: String(data?.yacht?.guest),
    cancel_time_in_hour: String(data?.yacht?.cancel_time_in_hour),
    duration_hour: String(data?.yacht?.duration_hour),
    duration_minutes: String(data?.yacht?.duration_minutes),
    number_of_cabin: String(data?.yacht?.number_of_cabin),
    capacity: String(data?.yacht?.capacity),
    sleep_capacity: String(data?.yacht?.sleep_capacity),
    per_day_price: String(data?.yacht?.per_day_price),
    per_hour_price: String(data?.yacht?.per_hour_price),
    power: data?.yacht?.power,
    engine_type: data?.yacht?.type,
    crew_member: data?.yacht?.crew_member,
    description: data?.yacht?.description,
    from_date: data?.yacht?.from_date,
    to_date: data?.yacht?.to_date,
    length:data?.yacht?.length,
    // ny_price: data?.yacht?.ny_price,
    // ny_firework: data?.yacht?.ny_firework,
    ny_status: false,
    // ny_availability: data?.yacht?.ny_availability,
    // ny_inclusion: data?.yacht?.ny_inclusion,
    }
    return obj
  };

  export const f1yachtData = (data) => {


   let obj = {
            // ...data?.yacht,

            // user_id:1,
            // yacht:data?.yacht?.id,
            // min_price: String(data?.yacht?.min_price),
            // max_price: String(data?.yacht?.max_price),
            // guest: String(data?.yacht?.guest),
            // cancel_time_in_hour: String(data?.yacht?.cancel_time_in_hour),
            // duration_hour: String(data?.yacht?.duration_hour),
            // duration_minutes: String(data?.yacht?.duration_minutes),
            // number_of_cabin: String(data?.yacht?.number_of_cabin),
            // capacity: String(data?.yacht?.capacity),
            // sleep_capacity: String(data?.yacht?.sleep_capacity),
            // per_day_price: String(data?.yacht?.per_day_price),
            // per_hour_price: String(data?.yacht?.per_hour_price),


    user_id: 1,
    yacht: data?.id,
    name: data?.name,
    title: data?.title,
    location: data?.location,
    min_price: String(data?.min_price),
    max_price: String(data?.max_price),
    guest: String(data?.guest),
    cancel_time_in_hour: String(data?.cancel_time_in_hour),
    duration_hour: String(data?.duration_hour),
    duration_minutes: String(data?.duration_minutes),
    number_of_cabin: String(data?.number_of_cabin),
    capacity: String(data?.capacity),
    sleep_capacity: String(data?.sleep_capacity),
    per_day_price: String(data?.per_day_price),
    power: data?.power,
    engine_type: data?.type,
    crew_member: data?.crew_member,
    description: data?.description,
    from_date: data?.from_date,
    to_date: data?.to_date,
    length:data?.length,
    // ny_price: data?.ny_price,
    // ny_firework: data?.ny_firework,
    ny_status: false,
    // ny_availability: data?.ny_availability,
    // ny_inclusion: data?.ny_inclusion,
    }
    return obj
  };
  

  export const regularYachtsStatesUpdates = (data, setLocation,setAdditionalImages,setMainImage,setCrewLanguage,setFlag,setSelectedFeatures,setSelectedCategories,setSelectedInclusion,setSelectedFoodOptions) => {
    if (data?.yacht?.latitude && data?.yacht?.longitude) {
        setLocation({
            lat: parseFloat(data?.yacht?.latitude),
            lng: parseFloat(data?.yacht?.longitude)
          });
    }
    if(data?.yacht?.crew_language){
        setCrewLanguage(data?.yacht?.crew_language)

    }
    if(data?.yacht?.flag){
        setFlag(data?.yacht?.flag)

    }
    if (data?.yacht?.features?.length > 0) {
        const featureNames = data?.yacht?.features.map(feature => feature.name);
        setSelectedFeatures(featureNames);
      }
      if (data?.categories?.length > 0) {
        const categoriesNames = data?.categories.map(cat => cat);
        setSelectedCategories(categoriesNames);
      }
      if (data?.inclusion?.length > 0) {
        const inclusionsNames = data?.inclusion.map(inclusion => inclusion?.name);
        setSelectedInclusion(inclusionsNames);
      }
      if (data?.food?.length > 0) {
        const foodNames = data?.food.map(food => food?.name);
        setSelectedFoodOptions(foodNames);
      }


    ///setAdditionalImages
    const carosuelImages = [
        data?.yacht?.image1,
        data?.yacht?.image2,
        data?.yacht?.image3,
        data?.yacht?.image4,
        data?.yacht?.image5,
        data?.yacht?.image6,
        data?.yacht?.image7,
        data?.yacht?.image8,
        data?.yacht?.image9,
        data?.yacht?.image10,
        data?.yacht?.image11,
        data?.yacht?.image12,
        data?.yacht?.image13,
        data?.yacht?.image14,
        data?.yacht?.image15,
        data?.yacht?.image16,
        data?.yacht?.image17,
        data?.yacht?.image18,
        data?.yacht?.image19,
        data?.yacht?.image20,
      ].filter((image) => typeof image === "string" && image.trim() !== "");
      
      const updatedArr = carosuelImages?.map((url) => {
        // const objectURL = URL.createObjectURL(new Blob([url], { type: 'image/jpeg' })); // For example, Blob usage
        const objectURL = `${url.startsWith('http') ? '' : S3URL}${url}`
        return {
          id: objectURL,
          file: { name: url, type: 'image/jpeg', size: url.length }, // Mocking file properties as an example
          name: url,
          size: formatFileSize(url.length), // You can adjust the size as per your logic
          type: 'image/jpeg', // You might want to adjust this type if it's not always JPEG
          isImage: true, // This will always be true as these are image URLs
          url: objectURL,
          isFromApi: true,

        };
      });
      
      setAdditionalImages(updatedArr);


    /// main yachtImage

    const mainImage = [
        data?.yacht?.yacht_image,
      ].filter((image) => typeof image === "string" && image.trim() !== "");
      
      const mainImageArr = mainImage?.map((url) => {
        // const objectURL = URL.createObjectURL(new Blob([url], { type: 'image/jpeg' })); // For example, Blob usage
        const objectURL = `${url.startsWith('http') ? '' : S3URL}${url}`
        return {
          id: objectURL,
          file: { name: url, type: 'image/jpeg', size: url.length }, // Mocking file properties as an example
          name: url,
          size: formatFileSize(url.length), // You can adjust the size as per your logic
          type: 'image/jpeg', // You might want to adjust this type if it's not always JPEG
          isImage: true, // This will always be true as these are image URLs
          url: objectURL,
          isFromApi: true,
        };
      });

      setMainImage(mainImageArr[0])
      

 
  };

  export const f1YachtsStatesUpdates = (data, setLocation,setAdditionalImages,setMainImage,setCrewLanguage,setFlag,setSelectedFeatures,setSelectedCategories,setSelectedInclusion,setSelectedFoodOptions) => {
    if (data?.yacht?.latitude && data?.yacht?.longitude) {
        setLocation({
            lat: parseFloat(data?.yacht?.latitude),
            lng: parseFloat(data?.yacht?.longitude)
          });
    }
    if(data?.yacht?.crew_language){
        setCrewLanguage(data?.yacht?.crew_language)

    }
    if(data?.yacht?.flag){
        setFlag(data?.yacht?.flag)

    }
    if (data?.yacht?.features?.length > 0) {
        const featureNames = data?.yacht?.features.map(feature => feature.name);
        setSelectedFeatures(featureNames);
      }

      if (data?.categories?.length > 0) {
        const categoriesNames = data?.categories.map(cat => cat);
        setSelectedCategories(categoriesNames);
      }
      if (data?.inclusion?.length > 0) {
        const inclusionsNames = data?.inclusion.map(inclusion => inclusion?.name);
        setSelectedInclusion(inclusionsNames);
      }

      if (data?.food?.length > 0) {
        const foodNames = data?.food.map(food => food?.name);
        setSelectedFoodOptions(foodNames);
      }

    ///setAdditionalImages
    const carosuelImages = [
        data?.yacht?.image1,
        data?.yacht?.image2,
        data?.yacht?.image3,
        data?.yacht?.image4,
        data?.yacht?.image5,
        data?.yacht?.image6,
        data?.yacht?.image7,
        data?.yacht?.image8,
        data?.yacht?.image9,
        data?.yacht?.image10,
        data?.yacht?.image11,
        data?.yacht?.image12,
        data?.yacht?.image13,
        data?.yacht?.image14,
        data?.yacht?.image15,
        data?.yacht?.image16,
        data?.yacht?.image17,
        data?.yacht?.image18,
        data?.yacht?.image19,
        data?.yacht?.image20,
      ].filter((image) => typeof image === "string" && image.trim() !== "");
      
      const updatedArr = carosuelImages?.map((url) => {
        // const objectURL = URL.createObjectURL(new Blob([url], { type: 'image/jpeg' })); // For example, Blob usage
        const objectURL = `${url.startsWith('http') ? '' : S3URL}${url}`
        return {
          id: objectURL,
          file: { name: url, type: 'image/jpeg', size: url.length }, // Mocking file properties as an example
          name: url,
          size: formatFileSize(url.length), // You can adjust the size as per your logic
          type: 'image/jpeg', // You might want to adjust this type if it's not always JPEG
          isImage: true, // This will always be true as these are image URLs
          url: objectURL,
          isFromApi: true,

        };
      });
      
    //   setAdditionalImages(updatedArr);


    /// main yachtImage

    const mainImage = [
        data?.yacht?.yacht_image,
      ].filter((image) => typeof image === "string" && image.trim() !== "");
      
      const mainImageArr = mainImage?.map((url) => {
        // const objectURL = URL.createObjectURL(new Blob([url], { type: 'image/jpeg' })); // For example, Blob usage
        const objectURL = `${url.startsWith('http') ? '' : S3URL}${url}`
        return {
          id: objectURL,
          file: { name: url, type: 'image/jpeg', size: url.length }, // Mocking file properties as an example
          name: url,
          size: formatFileSize(url.length), // You can adjust the size as per your logic
          type: 'image/jpeg', // You might want to adjust this type if it's not always JPEG
          isImage: true, // This will always be true as these are image URLs
          url: objectURL,
          isFromApi: true,
        };
      });

      setMainImage(mainImageArr[0])
      

 
  };