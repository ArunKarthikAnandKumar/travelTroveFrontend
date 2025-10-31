import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RegisterFormData,
  RegisterFormErrors,
  RegisterFormValid,
} from "../../models/forms";
import { registerUser } from "../../api/userApi";
import AlertMessage from "../../Components/Common/AlertMessage";
import { COUNTRY_DATA } from "../../utils/constants";
import regBanner from "../../assets/Destinations/travel/Banner/GettyImages-170975358-master.avif";

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    userName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({
    userName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
  });

  const [formValid, setFormValid] = useState<RegisterFormValid>({
    userName: false,
    phoneNumber: false,
    email: false,
    password: false,
    confirmPassword: false,
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

  const messages = {
    required: "is required",
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name as keyof RegisterFormData, value);
  };

  const validateField = (
    fieldName: keyof RegisterFormData,
    fieldValue: string | number | null
  ) => {
    const newErrors: RegisterFormErrors = { ...errors };
    const newFormValid: RegisterFormValid = { ...formValid };

    switch (fieldName) {
      case "userName": {
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
      }

      case "phoneNumber": {
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
      }

      case "email": {
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
      }

      case "password": {
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
      }

      case "confirmPassword": {
        if (!fieldValue) {
          newErrors.confirmPassword = `Confirm Password ${messages.required}`;
          newFormValid.confirmPassword = false;
        } else if (fieldValue !== formData.password) {
          newErrors.confirmPassword = "Passwords do not match";
          newFormValid.confirmPassword = false;
        } else {
          newErrors.confirmPassword = "";
          newFormValid.confirmPassword = true;
        }
        break;
      }

      case "country": {
        if (!fieldValue) {
          newErrors.country = `Country ${messages.required}`;
          newFormValid.country = false;
        } else {
          newErrors.country = "";
          newFormValid.country = true;
        }
        break;
      }

      default:
        break;
    }

    newFormValid.buttonActive = Object.values(newFormValid).every(
      (v) => v === true
    );

    setErrors(newErrors);
    setFormValid(newFormValid);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await registerUser(formData);
      if (response.success) {
        setSuccessMessage("Registration successful! Redirecting...");
        setErrorMessage("");
      } else {
        setErrorMessage(response.message || "Registration failed");
        setSuccessMessage("");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="register-page">
      <img src={regBanner} alt="Register Banner" className="register-banner" />

      <div className="register-form-container">
        <h2>Create an Account</h2>

        {showSuccess && <AlertMessage type="success" message={successMessage} />}
        {showError && <AlertMessage type="error" message={errorMessage} />}

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
          />
          {errors.userName && <p className="error">{errors.userName}</p>}

          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}

          <label>Country</label>
          <select
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
          {errors.country && <p className="error">{errors.country}</p>}

          <button type="submit" disabled={!formValid.buttonActive}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
