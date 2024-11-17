import React, { useState } from "react";
import axios from "axios";

type FormType = "login" | "signup";

const AuthForm: React.FC = () => {
  const [formType, setFormType] = useState<FormType>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Toggle between login and signup
  const toggleForm = () => {
    setFormType((prevType) => (prevType === "login" ? "signup" : "login"));
    setError(null); // Reset error on form switch
  };

  // Handle form submission (login or signup)
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError(null); // Reset error on each submit
    setLoading(true); // Set loading state to true

    const apiUrl = formType === "login" ? "/api/login" : "/api/signup";
    const payload = { email, password };

    if (formType === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(apiUrl, payload);
      console.log(response.data); // Handle success (e.g., store tokens, redirect)
      // Reset form fields or redirect user to a different page
    } catch (err: any) {
      setError(err?.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false); // Turn off loading state
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {formType === "signup" && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className={`w-full px-4 py-2 text-white font-bold rounded-md focus:outline-none focus:ring-2 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
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
