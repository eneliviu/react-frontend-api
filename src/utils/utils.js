import { jwtDecode } from "jwt-decode";
import { axiosReq } from "../api/axiosDefaults";

export const fetchMoreData = async (resource, setResource) => {
    try {
        const { data } = await axiosReq.get(resource.next);
        setResource((prevResource) => ({
            ...prevResource,
            next: data.next,
            results: data.results.reduce((acc, curr) => {
                return acc.some((accResult) => accResult.id === curr.id)
                    ? acc
                    : [...acc, curr];
            }, prevResource.results),
        }));
    } catch (err) {
        console.error("Failed to fetch more data:", err);
    }
};

export const followHelper = (profile, clickedProfile, following_id) => {
    return profile.id === clickedProfile.id
        ? // This is the profile I clicked on,
          // update its followers count and set its following id
          {
              ...profile,
              followers_count: profile.followers_count + 1,
              following_id,
          }
        : profile.is_owner
        ? // This is the profile of the logged in user
          // update its following count
          { ...profile, following_count: profile.following_count + 1 }
        : // this is not the profile the user clicked on or the profile
          // the user owns, so just return it unchanged
          profile;
};

export const unfollowHelper = (profile, clickedProfile) => {
    return profile.id === clickedProfile.id
        ? // This is the profile I clicked on,
          // update its followers count and set its following id
          {
              ...profile,
              followers_count: profile.followers_count - 1,
              following_id: null,
          }
        : profile.is_owner
        ? // This is the profile of the logged in user
          // update its following count
          { ...profile, following_count: profile.following_count - 1 }
        : // this is not the profile the user clicked on or the profile
          // the user owns, so just return it unchanged
          profile;
};

export const setTokenTimestamp = (data) => {
    const refreshTokenTimestamp = jwtDecode(data?.refresh_token).exp;
    localStorage.setItem("refreshTokenTimestamp", refreshTokenTimestamp);
};


export const shouldRefreshToken = () => {
    return !!localStorage.getItem("refreshTokenTimestamp");
};

export const removeTOkenTimestamp = () => {
    localStorage.removeItem("refreshTokenTimestamp");
};




/**
 * Validates the consistency between trip dates and trip status
 * 
 * @param {string} startDate - Trip start date in YYYY-MM-DD format
 * @param {string} endDate - Trip end date in YYYY-MM-DD format
 * @param {string} tripStatus - Trip status (Planned, Ongoing, or Completed)
 * @returns {Object} - Object containing any validation errors
 */
export const validateDateStatusConsistency = (startDate, endDate, tripStatus) => {
  let consistencyErrors = {};
  
  if (!startDate || !endDate) {
    return consistencyErrors;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Case 1: Trip is marked as "Planned" but start date is in the past
  if (tripStatus === "Planned" && start < today) {
    consistencyErrors.status_date_mismatch = 
      "A 'Planned' trip cannot have a start date in the past. Please update either the status or the dates.";
  }
  
  // Case 2: Trip is marked as "Completed" but end date is in the future
  if (tripStatus === "Completed" && end > today) {
    consistencyErrors.status_date_mismatch = 
      "A 'Completed' trip cannot have an end date in the future. Please update either the status or the dates.";
  }
  
  // Case 3: Trip is marked as "Ongoing" but inconsistent with current date
  if (tripStatus === "Ongoing") {
    if (end < today) {
      consistencyErrors.status_date_mismatch = 
        "An 'Ongoing' trip cannot have already ended. Please update either the status to 'Completed' or the end date.";
    }
    
    if (start > today) {
      consistencyErrors.status_date_mismatch = 
        "An 'Ongoing' trip cannot start in the future. Please update either the status to 'Planned' or the start date.";
    }
  }
  
  return consistencyErrors;
};

/**
 * Determines the suggested trip status based on dates
 * 
 * @param {string} startDate - Trip start date in YYYY-MM-DD format
 * @param {string} endDate - Trip end date in YYYY-MM-DD format
 * @returns {string|null} - Suggested trip status or null if dates are invalid
 */
export const getSuggestedTripStatus = (startDate, endDate) => {
  if (!startDate || !endDate) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (end < today) return "Completed";
  if (start <= today && end >= today) return "Ongoing";
  if (start > today) return "Planned";
  
  return null;
};

/**
 * Validates that the start date is before the end date
 * 
 * @param {string} startDate - Trip start date in YYYY-MM-DD format
 * @param {string} endDate - Trip end date in YYYY-MM-DD format
 * @returns {Object} - Object containing any validation errors
 */
export const validateTripDates = (startDate, endDate) => {
  let dateErrors = {};
  
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      dateErrors.date = "Start date must be before end date.";
    }
  }
  
  return dateErrors;
};