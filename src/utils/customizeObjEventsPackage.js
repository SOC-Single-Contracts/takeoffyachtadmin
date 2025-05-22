import { formatFileSize } from "./helper";
const S3URL = import.meta.env.VITE_S3_URL || 'https://images-yacht.s3.us-east-1.amazonaws.com';




export const eventData = (data) => {

    let obj = {
        user_id: 1,
        event_id: data?.id,
        event_type: data?.event_type,
        name: data?.name ?? "",
        location: data?.location ?? "",
        title: data?.title,
        // min_price: data?.min_price ?  String(data?.min_price) : "",
        // max_price:data?.max_price ?  String(data?.max_price) : "",
        // guest: String(data?.guest) ?? "",
        cancel_time_in_hours: String(data?.cancel_time_in_hours) ?? "",
        duration_hour: String(data?.duration_hour) ?? "",
        // duration_minutes: String(data?.duration_minutes),
        // number_of_cabin: String(data?.number_of_cabin) ?? "",
        // capacity: String(data?.capacity) ?? "",
        // sleep_capacity: String(data?.sleep_capacity) ?? "",
        per_day_price: data?.per_day_price ? String(data?.per_day_price) ?? "" : 0,
        // per_hour_price: String(data?.per_hour_price) ?? "",
        // power: data?.power ?? "",
        // engine_type: data?.type ?? "",
        // crew_member: data?.crew_member ?? "",
        description: data?.description ?? "",
        // from_date: data?.from_date,
        // to_date: data?.to_date,
        // length: data?.length ?? "",
        // ny_price: data?.ny_price ?? "",
        // ny_firework: data?.ny_firework ?? false,
        // ny_status: data?.ny_status ?? false,
        // ny_availability_from: data?.ny_availability?.from ?? "",
        // ny_availability_to: data?.ny_availability?.to ?? "", 
    }
    return obj
};

export const packageData = (data) => {


    let obj = {
        user_id: 1,
        package_id: data?.id,
        package_type: data?.package_type,
        quantity_available: data?.quantity_available,
        price: data?.price,
        description: data?.description ?? "",

        // name: data?.name ?? "",
        // title: data?.title,
        // location: data?.location ?? "",
        // min_price: data?.min_price ?  String(data?.min_price) : "",
        // max_price:data?.max_price ?  String(data?.max_price) : "",
        // guest: String(data?.guest) ?? "",
        // cancel_time_in_hour: String(data?.cancel_time_in_hour) ?? "",
        // duration_hour: String(data?.duration_hour) ?? "",,
        // duration_minutes: String(data?.duration_minutes),
        // number_of_cabin: String(data?.number_of_cabin) ?? "",
        // capacity: String(data?.capacity) ?? "",
        // sleep_capacity: String(data?.sleep_capacity) ?? "",
        // per_day_price: String(data?.per_day_price) ?? "",
        // power: data?.power ?? "",
        // engine_type: data?.type ?? "",
        // crew_member: data?.crew_member ?? "",
        // from_date: data?.from_date,
        // to_date: data?.to_date,
        // length: data?.length ?? "",

    }
    return obj
};


export const eventStatesUpdates = (data) => {
    const updates = {};

    if (data?.latitude && data?.longitude) {
        updates.locationLatLng = {
            lat: parseFloat(data?.latitude),
            lng: parseFloat(data?.longitude),
        };
    }
    if (data?.meeting_point_link) {
        updates.meetingPoint = data?.meeting_point_link;
    }
    if (data?.car_parking_link) {
        updates.carParking = data?.car_parking_link;
    }
    if (data?.taxi_drop_off_link) {
        updates.taxiDropOff = data?.taxi_drop_off_link;
    }
    if (data?.location_url) {
        updates.yachtLocationLink = data?.location_url;
    }



    // if (data?.crew_language) {
    //     updates.crewLanguage = data?.crew_language;
    // }

    // if (data?.flag) {
    //     updates.flag = data?.flag;
    // }

    // if (data?.features?.length > 0) {
    //     updates.selectedFeatures = data?.features.map(feature => feature.name);
    // }

    // if (data?.categories?.length > 0) {
    //     updates.selectedCategories = data.categories.map(cat => cat?.name);
    // }

    // if (data?.inclusion?.length > 0) {
    //     updates.selectedInclusion = data.inclusion.map(inclusion => inclusion?.name);
    // }
    // if (data?.ny_inclusion?.length > 0) {
    //     updates.selectednyInclusion = data.ny_inclusion.map(ny_inclusion => ny_inclusion?.name);
    // }

    // if (data?.food?.length > 0) {
    //     updates.selectedFoodOptions = data.food.map(food => food?.name);
    // }
    if (data?.packages_system?.length > 0) {
        updates.selectedPackages = data.packages_system.map(pack => pack);
    }


    /// Additional Images
    // const carouselImages = [
    //     data?.image1, data?.image2, data?.image3,
    //     data?.image4, data?.image5, data?.image6,
    //     data?.image7, data?.image8, data?.image9,
    //     data?.image10, data?.image11, data?.image12,
    //     data?.image13, data?.image14, data?.image15,
    //     data?.image16, data?.image17, data?.image18,
    //     data?.image19, data?.image20,
    // ].filter(url => typeof url === "string" && url.trim() !== "");

    // updates.additionalImages = carouselImages.map(url => {
    //     const objectURL = `${url.startsWith('http') ? '' : S3URL}${url}`;
    //     return {
    //         id: objectURL,
    //         file: { name: url, type: 'image/jpeg', size: url.length },
    //         name: url,
    //         size: formatFileSize(url.length),
    //         type: 'image/jpeg',
    //         isImage: true,
    //         url: objectURL,
    //         isFromApi: true,
    //     };
    // });

    /// Main yacht image
    const mainImage = data?.event_image;
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
    if (data?.from_date) {
        updates.from_date = data?.from_date;
    }
    if (data?.to_date) {
        updates.to_date = data?.to_date;
    }

    if (data?.start_time) {
        updates.start_time = data?.start_time;
    }
    if (data?.end_time) {
        updates.end_time = data?.end_time;
    }

    return updates;
};


export const packageStatesUpdates = (data) => {
    const updates = {};

    if (data?.latitude && data?.longitude) {
        updates.locationLatLng = {
            lat: parseFloat(data?.latitude),
            lng: parseFloat(data?.longitude),
        };
    }
    if (data?.meeting_point_link) {
        updates.meetingPoint = data?.meeting_point_link;
    }
    if (data?.car_parking_link) {
        updates.carParking = data?.car_parking_link;
    }
    if (data?.taxi_drop_off_link) {
        updates.taxiDropOff = data?.taxi_drop_off_link;
    }
    if (data?.location_url) {
        updates.yachtLocationLink = data?.location_url;
    }
    if (data?.crew_language) {
        updates.crewLanguage = data?.crew_language;
    }

    if (data?.flag) {
        updates.flag = data?.flag;
    }

    if (data?.features?.length > 0) {
        updates.selectedFeatures = data?.features.map(feature => feature.name);
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
        data?.image1, data?.image2, data?.image3,
        data?.image4, data?.image5, data?.image6,
        data?.image7, data?.image8, data?.image9,
        data?.image10, data?.image11, data?.image12,
        data?.image13, data?.image14, data?.image15,
        data?.image16, data?.image17, data?.image18,
        data?.image19, data?.image20,
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
    const mainImage = data?.event_image;
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
    if (data?.from_date) {
        updates.from_date = data?.from_date;
    }
    if (data?.to_date) {
        updates.to_date = data?.to_date;
    }

    return updates;
};
