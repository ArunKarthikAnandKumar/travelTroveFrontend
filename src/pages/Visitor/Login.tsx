import { type FormEvent, useEffect, useState } from "react"
import type { LoginFormData, LoginFormErrors, LoginFormValid } from "../../models/froms";
import { loginUser, registerUser } from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import { COUNTRY_DATA } from "../../utils/constatnts";
import { setRole, setToken, setUserData, setUserId } from "../../utils/token";
import AlertMessage from "../../components/Common/AlertMessage";




const Login:React.FC=()=>{

const [formData, setFormData] = useState<LoginFormData>({

    email:"",
    password:"",

  });

  const [errors, setErrors] = useState<LoginFormErrors>({

    email:"",
    password:"",


  });

  const [formValid, setFormValid] = useState<LoginFormValid>({

    email:false,
    password:false,
      buttonActive: false


  });

  const [countryData, _] = useState<string[]>(COUNTRY_DATA)

   const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  const navigate=useNavigate()

  useEffect(()=>{
    if(successMessage){
      setShowSuccess(true)
    }
     if(errorMessage){
      console.log("Setting Erro to true")
      setShowError(true)
    }

  },[successMessage,errorMessage])
  

  const messages = {
    required: "is required",
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    validateField(name as keyof LoginFormData, value);
  };

  const validateField = (fieldName: keyof LoginFormData, fieldValue: string | number | null) => {
    const newErrors: LoginFormErrors = { ...errors };
    const newFormValid: LoginFormValid = { ...formValid };

    switch (fieldName) {
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!fieldValue) {
          newErrors.email = "email " +messages.required;
          newFormValid.email = false;
        } else if (typeof fieldValue === "string" && !emailRegex.test(fieldValue)) {
          newErrors.email = "Invalid email format";
          newFormValid.email = false;
        } else {
          newErrors.email = "";
          newFormValid.email = true;
        }
        break;
      }
      case "password": {
        console.log(fieldValue)
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!fieldValue) {
          newErrors.password = "password " +messages.required;
          newFormValid.password = false;
        } else if (typeof fieldValue === "string" && !passwordRegex.test(fieldValue)) {
          newErrors.password =
            "Password must be 8+ characters, include uppercase, lowercase, number, and special character";
          newFormValid.password = false;
        } else {
          newErrors.password = "";
          newFormValid.password = true;
        }
        break;
      }
   
 
      default:
        break;
    }

    newFormValid.buttonActive =

      newFormValid.email &&
      newFormValid.password ;

    setErrors(newErrors);
    setFormValid(newFormValid);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("")
    setSuccessMessage("")
    setShowError(false)
    setShowSuccess(false)
    try {
      let resposne=await loginUser(formData)
      let responseData=resposne.data
      console.log(responseData)
      setSuccessMessage(responseData.message)
      setUserId(responseData.data.id)
      setRole(responseData.data.role)
      setUserData(JSON.stringify(responseData.data))
      setToken(responseData.data.token)
      setTimeout(()=>{
navigate("/user/profile")

      },1000)
    } catch (error:any) {
      let erroStack=error.response.data
      setErrorMessage(erroStack.message);
      setSuccessMessage("");
    }
  };
    return (
        <>
   {
          showSuccess &&(
            <AlertMessage
            type="success"
            title="Sucess"
            message={successMessage}
            onclose={()=>setShowSuccess(false)}
            />
          )
        }
        {
          showError &&(
            <>
              <AlertMessage
            type="danger"
            title="Error"
            message={errorMessage}
            onclose={()=>setShowSuccess(false)}
            />
          
          </>)
        }
       <div className="account-content-login">
       
   <div className="d-flex flex-wrap w-100 vh-100 overflow-hidden">
    
     <div
       className="d-flex align-items-center justify-content-center flex-wrap vh-100 overflow-auto p-4 w-50 bg-backdrop"
     >
       <form className="flex-fill" id="registerForm" onSubmit={handleSubmit}>
         <div className="mx-auto" style={{"maxWidth": "450px"}}>
           

           <div className="mb-4 text-center">
             <h4 className="mb-2 fs-5">Login</h4>
             <p>Are you ready to explore the World</p>
           </div>


        <div className="form-group">
          <label htmlFor="email" className="form-label">
           Email <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
        Password <span className="text-danger">*</span>
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <div className="text-danger">{errors.password}</div>}
        </div>



                 <button
          type="submit"
          className="btn btn-primary mt-3"
          disabled={!formValid.buttonActive}
        >
          Login
        </button>
           <div className="mb-3 text-center">
             <h6>
               Don't have an account? 
               <a href="/register" className="text-purple link-hover">
                 Register Now!
               </a>
             </h6>
           </div>


         </div>
       </form>
     </div>
   </div>
 </div>
        </>
    )
}
export default Login