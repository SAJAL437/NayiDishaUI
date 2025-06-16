import { Button } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "ROLE_USER",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const BaseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:2512"
    : "https://nayidishaserver-production.up.railway.app";



  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${BaseURL}/auth/signup`, {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        roles: [formData.role],
      });
      console.log("Response:", response);
      setMessage(
        response.data || "Registration successful. Please verify your email."
      );
      setTimeout(() => navigate("/verify-email-prompt"), 2000);
    } catch (err) {
      let errorMsg = "Registration failed";
      if (err.code === "ERR_NETWORK") {
        errorMsg =
          "Cannot connect to the server. Please ensure the backend is running.";
      } else if (err.response) {
        errorMsg = err.response.data?.message || err.response.statusText;
      } else {
        errorMsg = err.message;
      }
      setError(errorMsg);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] overflow-hidden">
      <div className="border-[10px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-xl">
        <div className="border-[10px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg p-6 sm:p-8">
          <h1 className="pb-6 font-bold dark:text-gray-400 text-3xl sm:text-4xl text-center cursor-default">
            Sign Up
          </h1>
          {message && <p className="mb-4 text-green-500">{message}</p>}
          {error && <p className="mb-4 text-red-500">{error}</p>}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-2 dark:text-gray-400 text-sm sm:text-base block"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                className="border p-3 dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-2 dark:text-gray-400 text-sm sm:text-base block"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="border p-3 dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 dark:text-gray-400 text-sm sm:text-base block"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
              />
            </div>
            {/* <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              className="border mt-2 dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 p-2 rounded-md w-full"
            >
              <option value="ROLE_USER">User</option>
            </select> */}
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r dark:text-gray-300 from-blue-500 to-purple-500 shadow-lg mt-4 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out disabled:opacity-50"
            >
              {loading ? "Signing Up..." : "SIGN UP"}
            </button>
          </form>
          <div className="text-gray-500 flex text-center flex-col mt-4 items-center text-xs sm:text-sm">
            <p className="cursor-default">
              By signing in, you agree to our{" "}
              <a
                href="#"
                className="group text-blue-400 transition-all duration-100 ease-in-out"
              >
                <span className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                  Terms
                </span>
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="group text-blue-400 transition-all duration-100 ease-in-out"
              >
                <span className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                  Privacy Policy
                </span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
