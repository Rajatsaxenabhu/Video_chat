import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../redux/slice/authslice";

type FormType = "login" | "signup";

interface FormData {
  username?: string; // Username is optional for login
  email: string;
  password: string;
}

const AuthForm: React.FC = () => {
  const [formType, setFormType] = useState<FormType>("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initialize React Hook Form
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  // Toggle between login and signup
  const toggleForm = () => {
    setFormType((prevType) => (prevType === "login" ? "signup" : "login"));
    setError(null); // Reset error when toggling forms
  };

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setError(null); // Reset error on each submit
    setLoading(true); // Start loading

    const apiUrl = formType === "login" ? "http://localhost:8000/auth/login" : "http://localhost:8000/auth/signup";

    const payload = formType === "login"
      ? { email: data.email, password: data.password } // login uses email and password
      : { username: data.username, email: data.email, password: data.password }; // signup uses username, email, and password

    try {
      const response = await axios.post(apiUrl, payload);
      console.log(response)
      if (response.status === 200 || response.status === 201) {
        dispatch(setCredentials({
          sender_name: response.data.user.username,
          sender_id: response.data.user.id,
        }));
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {formType === "login" ? "Login" : "Sign Up"}
        </h2>

        {error && (
          <div className="text-red-500 text-center mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field for Both Login and Signup */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Please enter a valid email",
                },
              })}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          {/* Username Field (Only Visible for Signup) */}
          {formType === "signup" && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-600">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("username", { required: "Username is required" })}
              />
              {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
            </div>
          )}

          {/* Password Field for Both Login and Signup */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white font-bold rounded-md focus:outline-none focus:ring-2 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : formType === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="text-center">
          <span className="text-sm text-gray-600">
            {formType === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>
          <button
            onClick={toggleForm}
            className="ml-2 text-blue-600 hover:underline"
          >
            {formType === "login" ? "Sign Up" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
