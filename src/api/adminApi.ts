import axios from "axios";
import axiosAdminInstance from "./axiosAdminInstance";
import { BASE_URL } from "../utils/constatnts";
import axiosAdminMultipartInstance from "./axiosAdminInstanceMultipart";



export const fetchAllContinents=async()=>{
    return await axiosAdminInstance.get("/allContinents")
}

export const addContinent=async(data:any)=>{
    return await axiosAdminInstance.post("/addContinent",data)
}
export const updateContinent=async(data:any,id:any)=>{
    return await axiosAdminInstance.post(`/updateContinent/${id}`,data)
}

export const deleteContinent=async(id:any)=>{
    return await axiosAdminMultipartInstance.delete(`/deleteContinent/${id}`)
}

export const fetchAllCountrys=async()=>{
    return await axiosAdminInstance.get("/allCountrys")
}

export const addCountry=async(data:any)=>{
    return await axiosAdminInstance.post("/addCountry",data)
}
export const updateCountry=async(data:any,id:any)=>{
    return await axiosAdminInstance.post(`/updateCountry/${id}`,data)
}

export const deleteCountry=async(id:any)=>{
    return await axiosAdminMultipartInstance.delete(`/deleteCountry/${id}`)
}


export const fetchAllStates=async()=>{
    return await axiosAdminInstance.get("/allStates")
}

export const addState=async(data:any)=>{
    return await axiosAdminInstance.post("/addState",data)
}
export const updateState=async(data:any,id:any)=>{
    return await axiosAdminInstance.post(`/updateState/${id}`,data)
}

export const deleteState=async(id:any)=>{
    return await axiosAdminMultipartInstance.delete(`/deleteState/${id}`)
}

export const fetchAllCities = async () => {
  return await axiosAdminInstance.get("/allCities");
};


export const addCity = async (data: any) => {
  return await axiosAdminInstance.post("/addCity", data);
};


export const updateCity = async (data: any, id: string) => {
  return await axiosAdminInstance.post(`/updateCity/${id}`, data);
};


export const deleteCity = async (id: string) => {
  return await axiosAdminMultipartInstance.delete(`/deleteCity/${id}`);
};

export const fetchAllAttractions = async () => {
  return await axiosAdminInstance.get("/allAttractions");
};


export const addAttraction = async (data: any) => {
  return await axiosAdminInstance.post("/addAttraction", data);
};


export const updateAttraction = async (data: any, id: string) => {
  return await axiosAdminInstance.post(`/updateAttraction/${id}`, data);
};


export const deleteAttraction = async (id: string) => {
  return await axiosAdminMultipartInstance.delete(`/deleteAttraction/${id}`);
};


export const fetchAllRestaurants = async () => {
  return await axiosAdminInstance.get("/allRestaurants");
};


export const addRestaurant = async (data: any) => {
  return await axiosAdminInstance.post("/addRestaurant", data);
};


export const updateRestaurant = async (data: any, id: string) => {
  return await axiosAdminInstance.post(`/updateRestaurant/${id}`, data);
};


export const deleteRestaurant = async (id: string) => {
  return await axiosAdminMultipartInstance.delete(`/deleteRestaurant/${id}`);
};

export const fetchAllHotels = async () => {
  return await axiosAdminInstance.get("/allHotels");
};


export const addHotel = async (data: any) => {
  return await axiosAdminInstance.post("/addHotel", data);
};


export const updateHotel = async (data: any, id: string) => {
  return await axiosAdminInstance.post(`/updateHotel/${id}`, data);
};


export const deleteHotel = async (id: string) => {
  return await axiosAdminMultipartInstance.delete(`/deleteHotel/${id}`);
};

export const fetchAllDestinationGuides = async () => {
  return await axiosAdminInstance.get("/destinationGuides/allDestinationGuides");
};


export const addDestinationGuide = async (data: any) => {
  return await axiosAdminInstance.post("/destinationGuides/addDestinationGuide", data);
};


export const updateDestinationGuide = async (data: any, id: string) => {
  return await axiosAdminInstance.post(`/destinationGuides/updateDestinationGuide/${id}`, data);
};


export const deleteDestinationGuide = async (id: string) => {
  return await axiosAdminMultipartInstance.delete(`/destinationGuides/deleteDestinationGuide/${id}`);
};


export const fetchAllItineraries = async () => {
  return await axiosAdminInstance.get("/allItineraries");
};


export const addItinerary = async (data: any) => {
  return await axiosAdminInstance.post("/addItenary", data);
};


export const updateItinerary = async (data: any, id: string) => {
  return await axiosAdminInstance.post(`/updateItenary/${id}`, data);
};


export const deleteItinerary = async (id: string) => {
  return await axiosAdminMultipartInstance.delete(`/deleteItenary/${id}`);
};


export const fetchAllTravelGroups = async () => {
  return await axiosAdminInstance.get("/getAllTravelGroups");
};


export const addTravelGroup = async (data: any) => {
  return await axiosAdminInstance.post("/addTravelGroup", data);
};


export const updateTravelGroup = async (data: any, id: string) => {
  return await axiosAdminInstance.post(`/updateTravelGroup/${id}`, data);
};


export const deleteTravelGroup = async (id: string) => {
  return await axiosAdminMultipartInstance.delete(`/deleteTravelGroup/${id}`);
};

export const fetchAllUsers = async () => {
  return await axiosAdminInstance.get("/user/fetchAllUsers");
};

export const inviteUserToTravelGroup = async (groupId: string, userId: string) => {
  return await axiosAdminInstance.post(`/${groupId}/invite`, { userId });
};  