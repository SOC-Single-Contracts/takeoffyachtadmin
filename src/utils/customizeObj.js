import { formatFileSize } from "./helper";
const S3URL = "https://images-yacht.s3.us-east-1.amazonaws.com"




export const yachtData = (data) => {

    let obj = {
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
        // duration_minutes: String(data?.yacht?.duration_minutes),
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
        length: data?.yacht?.length,
        ny_price: data?.yacht?.ny_price,
        ny_firework: data?.yacht?.ny_firework,
        ny_status: data?.yacht?.ny_status,
        ny_availability_from: data?.yacht?.ny_availability?.from,
        ny_availability_to: data?.yacht?.ny_availability?.to,
    }
    return obj
};

export const f1yachtData = (data) => {


    let obj = {
        user_id: 1,
        yacht: data?.yacht?.id,
        name: data?.yacht?.name,
        title: data?.yacht?.title,
        location: data?.yacht?.location,
        min_price: String(data?.yacht?.min_price),
        max_price: String(data?.yacht?.max_price),
        guest: String(data?.yacht?.guest),
        cancel_time_in_hour: String(data?.yacht?.cancel_time_in_hour),
        // duration_hour: String(data?.yacht?.duration_hour),
        // duration_minutes: String(data?.yacht?.duration_minutes),
        number_of_cabin: String(data?.yacht?.number_of_cabin),
        capacity: String(data?.yacht?.capacity),
        sleep_capacity: String(data?.yacht?.sleep_capacity),
        per_day_price: String(data?.yacht?.per_day_price),
        power: data?.yacht?.power,
        engine_type: data?.yacht?.type,
        crew_member: data?.yacht?.crew_member,
        description: data?.yacht?.description,
        // from_date: data?.yacht?.from_date,
        // to_date: data?.yacht?.to_date,
        length: data?.yacht?.length,
       
    }
    return obj
};


export const regularYachtsStatesUpdates = (data) => {
    const updates = {};

    if (data?.yacht?.latitude && data?.yacht?.longitude) {
        updates.location = {
            lat: parseFloat(data?.yacht?.latitude),
            lng: parseFloat(data?.yacht?.longitude),
        };
    }
    if (data?.yacht?.meeting_point_link) {
        updates.meetingPoint = data?.yacht?.meeting_point_link ;
    }
    if (data?.yacht?.car_parking_link) {
        updates.carParking = data?.yacht?.car_parking_link ;
    }
    if (data?.yacht?.taxi_drop_off_link) {
        updates.taxiDropOff = data?.yacht?.taxi_drop_off_link ;
    }
    if (data?.yacht?.location_url) {
        updates.yachtLocationLink = data?.yacht?.location_url ;
    }
    


    if (data?.yacht?.crew_language) {
        updates.crewLanguage = data?.yacht?.crew_language;
    }

    if (data?.yacht?.flag) {
        updates.flag = data?.yacht?.flag;
    }

    if (data?.yacht?.features?.length > 0) {
        updates.selectedFeatures = data?.yacht?.features.map(feature => feature.name);
    }

    if (data?.categories?.length > 0) {
        updates.selectedCategories = data.categories.map(cat => cat);
    }

    if (data?.inclusion?.length > 0) {
        updates.selectedInclusion = data.inclusion.map(inclusion => inclusion?.name);
    }
    if (data?.ny_inclusion?.length > 0) {
        updates.selectednyInclusion = data.ny_inclusion.map(ny_inclusion => ny_inclusion?.name);
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
        updates.from_date = data?.yacht?.from_date;
    }
    if (data?.yacht?.to_date) {
        updates.to_date = data?.yacht?.to_date;
    }

    return updates;
};


export const f1YachtsStatesUpdates = (data) => {
    const updates = {};

    if (data?.yacht?.latitude && data?.yacht?.longitude) {
        updates.location = {
            lat: parseFloat(data?.yacht?.latitude),
            lng: parseFloat(data?.yacht?.longitude),
        };
    }
    if (data?.yacht?.meeting_point_link) {
        updates.meetingPoint = data?.yacht?.meeting_point_link ;
    }
    if (data?.yacht?.car_parking_link) {
        updates.carParking = data?.yacht?.car_parking_link ;
    }
    if (data?.yacht?.taxi_drop_off_link) {
        updates.taxiDropOff = data?.yacht?.taxi_drop_off_link ;
    }
    if (data?.yacht?.location_url) {
        updates.yachtLocationLink = data?.yacht?.location_url ;
    }
    if (data?.yacht?.crew_language) {
        updates.crewLanguage = data?.yacht?.crew_language;
    }

    if (data?.yacht?.flag) {
        updates.flag = data?.yacht?.flag;
    }

    if (data?.yacht?.features?.length > 0) {
        updates.selectedFeatures = data?.yacht?.features.map(feature => feature.name);
    }

    if (data?.categories?.length > 0) {
        updates.selectedCategories = data.categories.map(cat => cat?.name);
    }

    if (data?.inclusion?.length > 0) {
        updates.selectedInclusion = data.inclusion.map(inclusion => inclusion?.name);
    }
    if (data?.ny_inclusion?.length > 0) {
        updates.selectednyInclusion = data.ny_inclusion.map(ny_inclusion => ny_inclusion?.name);
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
        updates.from_date = data?.yacht?.from_date;
    }
    if (data?.yacht?.to_date) {
        updates.to_date = data?.yacht?.to_date;
    }

    return updates;
};
