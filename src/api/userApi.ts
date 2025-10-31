import { LoginFormData, RegisterFormData } from "../models/forms";
import axiosInstance from "./axiosInstance";



export const registerUser=async(registerFormdata:RegisterFormData)=>{
    return await axiosInstance.post("/register",registerFormdata)
}

export const loginUser=async(loginFormdata:LoginFormData)=>{
    return await axiosInstance.post("/login",loginFormdata)
}

export const loginAdmin=async(adminFormdata:LoginFormData)=>{
    return await axiosInstance.post("/admin/login",adminFormdata)
}