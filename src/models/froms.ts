 export type RegisterFormData={
    userName:string,
    phoneNumber:string,
    email:string,
    password:string,
    confirmpassword:string,
    country:string
}
export type  RegisterFormErrors={
    [key in keyof RegisterFormData]:string;
}
export type  RegisterFormValid={
    buttonActive: boolean
     userName:boolean,
    phoneNumber:boolean,
    email:boolean,
    password:boolean,
    confirmpassword:boolean,
    country:boolean
}


 export type LoginFormData={
    email:string,
    password:string,

}
export type  LoginFormErrors={
    [key in keyof LoginFormData]:string;
}
export type  LoginFormValid={
    buttonActive: boolean
    email:boolean,
    password:boolean,

}


