import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password) return "";
    if (strongRegex.test(password)) return "Strong ✅";
    return "Weak ❌ (Min 8 chars, Uppercase, Lowercase, Number & Special Char)";
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
      newErrors.password = "Password must be at least 8 characters long with Uppercase, Lowercase, Number & Special Char.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    try {
      const response = await axios.post("https://inventory-management-for-buisness.onrender.com/api/auth/signup", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        navigate("/login");
      } else {
        setApiError(response.data.message);
      }
    } catch (error) {
      setApiError(error.response?.data?.message || "Server error. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center">Register</h1>

        {apiError && <p className="text-red-500 text-center">{apiError}</p>}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mt-4">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="mt-4">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {formData.password && (
              <p className={`text-sm mt-1 ${passwordStrength.includes("Strong") ? "text-green-500" : "text-red-500"}`}>
                {passwordStrength}
              </p>
            )}
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="mt-4">
            <label className="block text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full px-3 py-2 border rounded-lg"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="w-full bg-black text-white p-2 rounded-lg mt-4 cursor-pointer">
            Register
          </button>
        </form>

        <div className="mt-4 text-center">
          <span className="text-gray-600 text-sm">Already have an account? </span>
          <Link to="/login" className="text-black hover:text-gray-700 text-sm">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

                                                                                                                    