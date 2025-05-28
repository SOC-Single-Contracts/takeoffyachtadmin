import { formatFileSize } from "./helper";
const S3URL = import.meta.env.VITE_S3_URL || 'https://images-yacht.s3.us-east-1.amazonaws.com';




export const experienceData = (data) => {

    let obj = {
        user_id: 1,
        id: data?.experience?.id,
        name: data?.experience?.name ?? "",
        location: data?.experience?.location ?? "",
        // title: data?.experience?.title,
        min_price: data?.experience?.min_price ?  String(data?.experience?.min_price) : "",
        max_price:data?.experience?.max_price ?  String(data?.experience?.max_price) : "",
        guest: String(data?.experience?.guest) ?? "",
        cancel_time_in_hour: String(data?.experience?.cancel_time_in_hour) ?? "",
        min_duration_hour: String(data?.experience?.min_duration_hour) ?? "",
        // duration_minutes: String(data?.experience?.duration_minutes),
        number_of_cabin: String(data?.experience?.number_of_cabin) ?? "",
        capacity: String(data?.experience?.capacity) ?? "",
        sleep_capacity: String(data?.experience?.sleep_capacity) ?? "",
        per_day_price: String(data?.experience?.per_day_price) ?? "",
        per_hour_price: String(data?.experience?.per_hour_price) ?? "",
        power: data?.experience?.power ?? "",
        engine_type: data?.experience?.type ?? "",
        crew_member: data?.experience?.crew_member ?? "",
        description: data?.experience?.description ?? "",
        // from_date: data?.experience?.from_date,
        // to_date: data?.experience?.to_date,
        length: data?.experience?.length ?? "",
        ny_price: data?.experience?.ny_price ?? "",
        ny_firework: data?.experience?.ny_firework ?? false,
        ny_status: data?.experience?.ny_status ?? false,
        ny_availability_from: data?.experience?.ny_availability?.from ?? "",
        ny_availability_to: data?.experience?.ny_availability?.to ?? "", 
    }
    return obj
};

export const f1experienceData = (data) => {


    let obj = {
        user_id: 1,
        id: data?.experience?.id,
        name: data?.experience?.name ?? "",
        // title: data?.experience?.title,
        location: data?.experience?.location ?? "",
        min_price: data?.experience?.min_price ?  String(data?.experience?.min_price) : "",
        max_price:data?.experience?.max_price ?  String(data?.experience?.max_price) : "",
        guest: String(data?.experience?.guest) ?? "",
        cancel_time_in_hour: String(data?.experience?.cancel_time_in_hour) ?? "",
        // duration_hour: String(data?.experience?.duration_hour) ?? "",,
        // duration_minutes: String(data?.experience?.duration_minutes),
        number_of_cabin: String(data?.experience?.number_of_cabin) ?? "",
        capacity: String(data?.experience?.capacity) ?? "",
        sleep_capacity: String(data?.experience?.sleep_capacity) ?? "",
        per_day_price: String(data?.experience?.per_day_price) ?? "",
        power: data?.experience?.power ?? "",
        engine_type: data?.experience?.type ?? "",
        crew_member: data?.experience?.crew_member ?? "",
        description: data?.experience?.description ?? "",
        // from_date: data?.experience?.from_date,
        // to_date: data?.experience?.to_date,
        length: data?.experience?.length ?? "",
       
    }
    return obj
};


export const regularexperiencesStatesUpdates = (data) => {
    const updates = {};

    if (data?.experience?.latitude && data?.experience?.longitude) {
        updates.locationLatLng = {
            lat: parseFloat(data?.experience?.latitude),
            lng: parseFloat(data?.experience?.longitude),
        };
    }
    if (data?.experience?.meeting_point_link) {
        updates.meetingPoint = data?.experience?.meeting_point_link;

        const urlObj = new URL(data?.experience?.meeting_point_link);
        const query = urlObj.searchParams.get("query");

        if (query) {
            const [lat, lng] = query.split(',').map(Number);
            updates.meetPointLatLng = {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
            };
        }else{
            updates.meetPointLatLng = {
                lat: parseFloat(25.180775),
                lng: parseFloat(55.336947),
            };
        }
    }
    if (data?.experience?.car_parking_link) {
        updates.carParking = data?.experience?.car_parking_link;

        const urlObj = new URL(data?.experience?.car_parking_link);
        const query = urlObj.searchParams.get("query");

        if (query) {
            const [lat, lng] = query.split(',').map(Number);
            updates.carParkingLatLng = {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
            };
        }else{
            updates.carParkingLatLng = {
                lat: parseFloat(25.180775),
                lng: parseFloat(55.336947),
            };
        }
    }
    if (data?.experience?.taxi_drop_off_link) {
        updates.taxiDropOff = data?.experience?.taxi_drop_off_link;

        
        const urlObj = new URL(data?.experience?.taxi_drop_off_link);
        const query = urlObj.searchParams.get("query");

        if (query) {
            const [lat, lng] = query.split(',').map(Number);
            updates.taxiLatLng = {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
            };
        }else{
            updates.taxiLatLng = {
                lat: parseFloat(25.180775),
                lng: parseFloat(55.336947),
            };
        }
    }
    if (data?.experience?.location_url) {
        updates.yachtLocationLink = data?.experience?.location_url ;
    }
    


    if (data?.experience?.crew_language) {
        updates.crewLanguage = data?.experience?.crew_language;
    }

    if (data?.experience?.flag) {
        updates.flag = data?.experience?.flag;
    }

    if (data?.experience?.features?.length > 0) {
        updates.selectedFeatures = data?.experience?.features.map(feature => feature.name);
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
        data?.experience?.image1, data?.experience?.image2, data?.experience?.image3,
        data?.experience?.image4, data?.experience?.image5, data?.experience?.image6,
        data?.experience?.image7, data?.experience?.image8, data?.experience?.image9,
        data?.experience?.image10, data?.experience?.image11, data?.experience?.image12,
        data?.experience?.image13, data?.experience?.image14, data?.experience?.image15,
        data?.experience?.image16, data?.experience?.image17, data?.experience?.image18,
        data?.experience?.image19, data?.experience?.image20,
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
    const mainImage = data?.experience?.experience_image;
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
    if (data?.experience?.from_date) {
        updates.from_date = data?.experience?.from_date;
    }
    if (data?.experience?.to_date) {
        updates.to_date = data?.experience?.to_date;
    }

    return updates;
};


export const f1experiencesStatesUpdates = (data) => {
    const updates = {};

    if (data?.experience?.latitude && data?.experience?.longitude) {
        updates.locationLatLng = {
            lat: parseFloat(data?.experience?.latitude),
            lng: parseFloat(data?.experience?.longitude),
        };
    }
    if (data?.experience?.meeting_point_link) {
        updates.meetingPoint = data?.experience?.meeting_point_link;

        const urlObj = new URL(data?.experience?.meeting_point_link);
        const query = urlObj.searchParams.get("query");

        if (query) {
            const [lat, lng] = query.split(',').map(Number);
            updates.meetPointLatLng = {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
            };
        }else{
            updates.meetPointLatLng = {
                lat: parseFloat(25.180775),
                lng: parseFloat(55.336947),
            };
        }
    }
    if (data?.experience?.car_parking_link) {
        updates.carParking = data?.experience?.car_parking_link;

        const urlObj = new URL(data?.experience?.car_parking_link);
        const query = urlObj.searchParams.get("query");

        if (query) {
            const [lat, lng] = query.split(',').map(Number);
            updates.carParkingLatLng = {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
            };
        }else{
            updates.carParkingLatLng = {
                lat: parseFloat(25.180775),
                lng: parseFloat(55.336947),
            };
        }
    }
    if (data?.experience?.taxi_drop_off_link) {
        updates.taxiDropOff = data?.experience?.taxi_drop_off_link;

        
        const urlObj = new URL(data?.experience?.taxi_drop_off_link);
        const query = urlObj.searchParams.get("query");

        if (query) {
            const [lat, lng] = query.split(',').map(Number);
            updates.taxiLatLng = {
                lat: parseFloat(lat),
                lng: parseFloat(lng),
            };
        }else{
            updates.taxiLatLng = {
                lat: parseFloat(25.180775),
                lng: parseFloat(55.336947),
            };
        }
    }
    if (data?.experience?.location_url) {
        updates.yachtLocationLink = data?.experience?.location_url ;
    }
    if (data?.experience?.crew_language) {
        updates.crewLanguage = data?.experience?.crew_language;
    }

    if (data?.experience?.flag) {
        updates.flag = data?.experience?.flag;
    }

    if (data?.experience?.features?.length > 0) {
        updates.selectedFeatures = data?.experience?.features.map(feature => feature.name);
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
        data?.experience?.image1, data?.experience?.image2, data?.experience?.image3,
        data?.experience?.image4, data?.experience?.image5, data?.experience?.image6,
        data?.experience?.image7, data?.experience?.image8, data?.experience?.image9,
        data?.experience?.image10, data?.experience?.image11, data?.experience?.image12,
        data?.experience?.image13, data?.experience?.image14, data?.experience?.image15,
        data?.experience?.image16, data?.experience?.image17, data?.experience?.image18,
        data?.experience?.image19, data?.experience?.image20,
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
    const mainImage = data?.experience?.experience_image;
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
    if (data?.experience?.from_date) {
        updates.from_date = data?.experience?.from_date;
    }
    if (data?.experience?.to_date) {
        updates.to_date = data?.experience?.to_date;
    }

    return updates;
};
