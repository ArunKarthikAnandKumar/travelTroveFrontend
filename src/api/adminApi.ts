import axios from "axios";
import axiosAdminInstance from "./axiosAdminInstance";
import { BASE_URL } from "../utils/constatnts";
import axiosAdminMultipartInstance from "./axiosAdminInstanceMultipart";



export const fetchAllContinents=async()=>{
    return await axiosAdminInstance.get("/allContinents")
}

export const addContinent=async(formData:any)=>{
    return await axiosAdminMultipartInstance.post("/addContinent",formData)
}
export const updateContinent=async(formData:any,id:any)=>{
    return await axiosAdminMultipartInstance.post(`/updateContinent/${id}`,formData)
}

export const deleteContinent=async(id:any)=>{
    return await axiosAdminMultipartInstance.delete(`/deleteContinent/${id}`)
}

export const fetchAllCountrys=async()=>{
    return await axiosAdminInstance.get("/allCountrys")
}

export const addCountry=async(formData:any)=>{
    return await axiosAdminMultipartInstance.post("/addCountry",formData)
}
export const updateCountry=async(formData:any,id:any)=>{
    return await axiosAdminMultipartInstance.post(`/updateCountry/${id}`,formData)
}

export const deleteCountry=async(id:any)=>{
    return await axiosAdminMultipartInstance.delete(`/deleteCountry/${id}`)
}


export const fetchAllStates=async()=>{
    return await axiosAdminInstance.get("/allStates")
}

export const addState=async(formData:any)=>{
    return await axiosAdminMultipartInstance.post("/addState",formData)
}
export const updateState=async(formData:any,id:any)=>{
    return await axiosAdminMultipartInstance.post(`/updateState/${id}`,formData)
}

export const deleteState=async(id:any)=>{
    return await axiosAdminMultipartInstance.delete(`/deleteState/${id}`)
}

export const fetchAllCities = async () => {
  return await axiosAdminInstance.get("/allCities");
};


export const addCity = async (formData: FormData) => {
  return await axiosAdminMultipartInstance.post("/addCity", formData);
};


export const updateCity = async (formData: FormData, id: string) => {
  return await axiosAdminMultipartInstance.post(`/updateCity/${id}`, formData);
};


export const deleteCity = async (id: string) => {
  return await axiosAdminMultipartInstance.delete(`/deleteCity/${id}`);
};

export const fetchAllAttractions = async () => {
  return await axiosAdminInstance.get("/allAttractions");
};


export const addAttraction = async (formData: FormData) => {
  return await axiosAdminMultipartInstance.post("/addAttraction", formData);
};


export const updateAttraction = async (formData: FormData, id: string) => {
  return await axiosAdminMultipartInstance.post(`/updateAttraction/${id}`, formData);
};


export const deleteAttraction = async (id: string) => {
  return await axiosAdminMultipartInstance.delete(`/deleteAttraction/${id}`);
};


export const fetchAllRestaurants = async () => {
  return await axiosAdminInstance.get("/allRestaurants");
};


export const addRestaurant = async (formData: FormData) => {
  return await axiosAdminMultipartInstance.post("/addRestaurant", formData);
};


export const updateRestaurant = async (formData: FormData, id: string) => {
  return await axiosAdminMultipartInstance.post(`/updateRestaurant/${id}`, formData);
};


export const deleteRestaurant = async (id: string) => {
  return await axiosAdminMultipartInstance.delete(`/deleteRestaurant/${id}`);
};

export const fetchAllHotels = async () => {
  return await axiosAdminInstance.get("/allHotels");
};


export const addHotel = async (formData: FormData) => {
  return await axiosAdminMultipartInstance.post("/addHotel", formData);
};


export const updateHotel = async (formData: FormData, id: string) => {
  return await axiosAdminMultipartInstance.post(`/updateHotel/${id}`, formData);
};


export const deleteHotel = async (id: string) => {
  return await axiosAdminMultipartInstance.delete(`/deleteHotel/${id}`);
};

export const fetchAllDestinationGuides = async () => {
  return await axiosAdminInstance.get("/allDestinationGuides");
};


export const addDestinationGuide = async (formData: FormData) => {
  return await axiosAdminMultipartInstance.post("/addDestinationGuide", formData);
};


export const updateDestinationGuide = async (formData: FormData, id: string) => {
  return await axiosAdminMultipartInstance.post(`/updateDestinationGuide/${id}`, formData);
};


export const deleteDestinationGuide = async (id: string) => {
  return await axiosAdminMultipartInstance.delete(`/deleteDestinationGuide/${id}`);
};


export const fetchAllItineraries = async () => {
  return await axiosAdminInstance.get("/allItineraries");
};


export const addItinerary = async (formData: FormData) => {
  return await axiosAdminMultipartInstance.post("/addItenary", formData);
};


export const updateItinerary = async (formData: FormData, id: string) => {
  return await axiosAdminMultipartInstance.post(`/updateItenary/${id}`, formData);
};


export const deleteItinerary = async (id: string) => {
  return await axiosAdminMultipartInstance.delete(`/deleteItenary/${id}`);
};