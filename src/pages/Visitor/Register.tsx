import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { RegisterFormData, RegisterFormErrors, RegisterFormValid } from "../../models/froms";
import { registerUser } from "../../api/userApi";
import AlertMessage from "../../components/Common/AlertMessage";
import { COUNTRY_DATA } from "../../utils/constatnts";

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    userName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmpassword: "",
    country: "",
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({
    userName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmpassword: "",
    country: "",
  });

  const [formValid, setFormValid] = useState<RegisterFormValid>({
    userName: false,
    phoneNumber: false,
    email: false,
    password: false,
    confirmpassword: false,
    country: false,
    buttonActive: false,
  });

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (successMessage) {
      setShowSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    }
    if (errorMessage) {
      setShowError(true);
    }
  }, [successMessage, errorMessage, navigate]);

  const messages = { required: "is required" };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name as keyof RegisterFormData, value);
  };

  const validateField = (fieldName: keyof RegisterFormData, fieldValue: string | number | null) => {
    const newErrors: RegisterFormErrors = { ...errors };
    const newFormValid: RegisterFormValid = { ...formValid };

    switch (fieldName) {
      case "userName":
        if (!fieldValue) {
          newErrors.userName = `Username ${messages.required}`;
          newFormValid.userName = false;
        } else if (typeof fieldValue === "string" && fieldValue.length < 3) {
          newErrors.userName = "Username must be at least 3 characters long";
          newFormValid.userName = false;
        } else {
          newErrors.userName = "";
          newFormValid.userName = true;
        }
        break;

      case "phoneNumber":
        const phoneRegex = /^[0-9]{10}$/;
        if (!fieldValue) {
          newErrors.phoneNumber = `Phone number ${messages.required}`;
          newFormValid.phoneNumber = false;
        } else if (!phoneRegex.test(fieldValue.toString())) {
          newErrors.phoneNumber = "Phone number must be 10 digits";
          newFormValid.phoneNumber = false;
        } else {
          newErrors.phoneNumber = "";
          newFormValid.phoneNumber = true;
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!fieldValue) {
          newErrors.email = `Email ${messages.required}`;
          newFormValid.email = false;
        } else if (!emailRegex.test(fieldValue.toString())) {
          newErrors.email = "Invalid email format";
          newFormValid.email = false;
        } else {
          newErrors.email = "";
          newFormValid.email = true;
        }
        break;

      case "password":
        if (!fieldValue) {
          newErrors.password = `Password ${messages.required}`;
          newFormValid.password = false;
        } else if (typeof fieldValue === "string" && fieldValue.length < 6) {
          newErrors.password = "Password must be at least 6 characters long";
          newFormValid.password = false;
        } else {
          newErrors.password = "";
          newFormValid.password = true;
        }
        break;

      case "confirmpassword":
        if (!fieldValue) {
          newErrors.confirmpassword = `Confirm Password ${messages.required}`;
          newFormValid.confirmpassword = false;
        } else if (fieldValue !== formData.password) {
          newErrors.confirmpassword = "Passwords do not match";
          newFormValid.confirmpassword = false;
        } else {
          newErrors.confirmpassword = "";
          newFormValid.confirmpassword = true;
        }
        break;

      case "country":
        if (!fieldValue) {
          newErrors.country = `Country ${messages.required}`;
          newFormValid.country = false;
        } else {
          newErrors.country = "";
          newFormValid.country = true;
        }
        break;

      default:
        break;
    }

    newFormValid.buttonActive = Object.values(newFormValid).every((v) => v === true);
    setErrors(newErrors);
    setFormValid(newFormValid);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      if (response) {
        setSuccessMessage("Registration successful! Redirecting...");
        setErrorMessage("");
      } else {
        setErrorMessage(response || "Registration failed");
        setSuccessMessage("");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      {showSuccess && (
        <AlertMessage
          type="success"
          title="Success"
          message={successMessage}
          onclose={() => setShowSuccess(false)}
        />
      )}
      {showError && (
        <AlertMessage
          type="danger"
          title="Error"
          message={errorMessage}
          onclose={() => setShowError(false)}
        />
      )}

      <div className="account-content-reg">
        <div className="d-flex flex-wrap w-100 vh-100 overflow-hidden">
          <div className="d-flex align-items-center justify-content-center flex-wrap vh-100 overflow-auto p-4 w-50 bg-backdrop">
            <form className="flex-fill" id="registerForm" onSubmit={handleSubmit}>
              <div className="mx-auto" style={{ maxWidth: "450px" }}>
                <div className="mb-4 text-center">
                  <h4 className="mb-2 fs-5">Create Account</h4>
                  <p>Join us and start exploring the world!</p>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">
                    Username <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                  />
                  {errors.userName && <div className="text-danger">{errors.userName}</div>}
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">
                    Phone Number <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                  {errors.phoneNumber && <div className="text-danger">{errors.phoneNumber}</div>}
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="text-danger">{errors.email}</div>}
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && <div className="text-danger">{errors.password}</div>}
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">
                    Confirm Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmpassword"
                    value={formData.confirmpassword}
                    onChange={handleChange}
                  />
                  {errors.confirmpassword && (
                    <div className="text-danger">{errors.confirmpassword}</div>
                  )}
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">
                    Country <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="">Select Country</option>
                    {COUNTRY_DATA.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.country && <div className="text-danger">{errors.country}</div>}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary mt-3 w-100"
                  // disabled={!formValid.buttonActive}
                >
                  Register
                </button>

                <div className="mb-3 text-center mt-3">
                  <h6>
                    Already have an account?{" "}
                    <a href="/login" className="text-purple link-hover">
                      Login Now!
                    </a>
                  </h6>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
