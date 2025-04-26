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
    // from_date: data?.yacht?.from_date,
    // to_date: data?.yacht?.to_date,
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
    // from_date: data?.from_date,
    // to_date: data?.to_date,
    length:data?.length,
    // ny_price: data?.ny_price,
    // ny_firework: data?.ny_firework,
    ny_status: false,
    // ny_availability: data?.ny_availability,
    // ny_inclusion: data?.ny_inclusion,
    }
    return obj
  };
  

  export const regularYachtsStatesUpdates = (data) => {
    const updates = {};
  
    if (data?.yacht?.latitude && data?.yacht?.longitude) {
      updates.location = {
        lat: parseFloat(data.yacht.latitude),
        lng: parseFloat(data.yacht.longitude),
      };
    }
  
    if (data?.yacht?.crew_language) {
      updates.crewLanguage = data.yacht.crew_language;
    }
  
    if (data?.yacht?.flag) {
      updates.flag = data.yacht.flag;
    }
  
    if (data?.yacht?.features?.length > 0) {
      updates.selectedFeatures = data.yacht.features.map(feature => feature.name);
    }
  
    if (data?.categories?.length > 0) {
      updates.selectedCategories = data.categories.map(cat => cat);
    }
  
    if (data?.inclusion?.length > 0) {
      updates.selectedInclusion = data.inclusion.map(inclusion => inclusion?.name);
    }
  
    if (data?.food?.length > 0) {
      updates.selectedFoodOptions = data.food.map(food => food?.name);
    }
  
    /// Additional Images
    const carouselImages = [
      data?.yacht?.image1, data?.yacht?.image2, data?.yacht?.image3,
      data?.yacht?.image4, data?.yacht?.image5, data?.yacht?.image6,
      data?.yacht?.image7, data?.yacht?.image8, data?.yacht?.image9,
      data?.yacht?.image10, data?.yacht?.image11, data?.yacht?.image12,
      data?.yacht?.image13, data?.yacht?.image14, data?.yacht?.image15,
      data?.yacht?.image16, data?.yacht?.image17, data?.yacht?.image18,
      data?.yacht?.image19, data?.yacht?.image20,
    ].filter(url => typeof url === "string" && url.trim() !== "");
  
    updates.additionalImages = carouselImages.map(url => {
      const objectURL = `${url.startsWith('http') ? '' : S3URL}${url}`;
      return {
        id: objectURL,
        file: { name: url, type: 'image/jpeg', size: url.length },
        name: url,
        size: formatFileSize(url.length),
        type: 'image/jpeg',
        isImage: true,
        url: objectURL,
        isFromApi: true,
      };
    });
  
    /// Main yacht image
    const mainImage = data?.yacht?.yacht_image;
    if (typeof mainImage === "string" && mainImage.trim() !== "") {
      const objectURL = `${mainImage.startsWith('http') ? '' : S3URL}${mainImage}`;
      updates.mainImage = {
        id: objectURL,
        file: { name: mainImage, type: 'image/jpeg', size: mainImage.length },
        name: mainImage,
        size: formatFileSize(mainImage.length),
        type: 'image/jpeg',
        isImage: true,
        url: objectURL,
        isFromApi: true,
      };
    }
    if (data?.yacht?.from_date) {
        updates.from_date = data.yacht.from_date;
      }
      if (data?.yacht?.to_date) {
        updates.to_date = data.yacht.to_date;
      }
  
    return updates;
  };
  

  export const f1YachtsStatesUpdates = (data) => {
    const updates = {};
  
    if (data?.yacht?.latitude && data?.yacht?.longitude) {
      updates.location = {
        lat: parseFloat(data.yacht.latitude),
        lng: parseFloat(data.yacht.longitude),
      };
    }
  
    if (data?.yacht?.crew_language) {
      updates.crewLanguage = data.yacht.crew_language;
    }
  
    if (data?.yacht?.flag) {
      updates.flag = data.yacht.flag;
    }
  
    if (data?.yacht?.features?.length > 0) {
      updates.selectedFeatures = data.yacht.features.map(feature => feature.name);
    }
  
    if (data?.categories?.length > 0) {
      updates.selectedCategories = data.categories.map(cat => cat);
    }
  
    if (data?.inclusion?.length > 0) {
      updates.selectedInclusion = data.inclusion.map(inclusion => inclusion?.name);
    }
  
    if (data?.food?.length > 0) {
      updates.selectedFoodOptions = data.food.map(food => food?.name);
    }
  
    /// Additional Images
    const carouselImages = [
      data?.yacht?.image1, data?.yacht?.image2, data?.yacht?.image3,
      data?.yacht?.image4, data?.yacht?.image5, data?.yacht?.image6,
      data?.yacht?.image7, data?.yacht?.image8, data?.yacht?.image9,
      data?.yacht?.image10, data?.yacht?.image11, data?.yacht?.image12,
      data?.yacht?.image13, data?.yacht?.image14, data?.yacht?.image15,
      data?.yacht?.image16, data?.yacht?.image17, data?.yacht?.image18,
      data?.yacht?.image19, data?.yacht?.image20,
    ].filter(url => typeof url === "string" && url.trim() !== "");
  
    updates.additionalImages = carouselImages.map(url => {
      const objectURL = `${url.startsWith('http') ? '' : S3URL}${url}`;
      return {
        id: objectURL,
        file: { name: url, type: 'image/jpeg', size: url.length },
        name: url,
        size: formatFileSize(url.length),
        type: 'image/jpeg',
        isImage: true,
        url: objectURL,
        isFromApi: true,
      };
    });
  
    /// Main yacht image
    const mainImage = data?.yacht?.yacht_image;
    if (typeof mainImage === "string" && mainImage.trim() !== "") {
      const objectURL = `${mainImage.startsWith('http') ? '' : S3URL}${mainImage}`;
      updates.mainImage = {
        id: objectURL,
        file: { name: mainImage, type: 'image/jpeg', size: mainImage.length },
        name: mainImage,
        size: formatFileSize(mainImage.length),
        type: 'image/jpeg',
        isImage: true,
        url: objectURL,
        isFromApi: true,
      };
    }

    if (data?.yacht?.from_date) {
        updates.from_date = data.yacht.from_date;
      }
      if (data?.yacht?.to_date) {
        updates.to_date = data.yacht.to_date;
      }
  
    return updates;
  };
  