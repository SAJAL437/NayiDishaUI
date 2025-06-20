import { Button } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../../utils/Auth";
import { jwtDecode } from "jwt-decode";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const BaseURL =
      import.meta.env.MODE === "development"
        ? "http://localhost:2512"
        : "https://nayidishaserver-production.up.railway.app";

    try {
      const response = await axios.post(`${BaseURL}/auth/signin`, {
        email,
        password,
      });

      const token = response.data.jwt;
      saveToken(token);

      const decoded = jwtDecode(token);
      const roles = decoded.roles || decoded.authorities || [];

      const roleStrings = roles.map((role) =>
        typeof role === "string" ? role : role.authority
      );

      if (roleStrings.includes("ROLE_ADMIN")) {
        navigate("/admin");
      } else if (roleStrings.includes("ROLE_USER")) {
        navigate("/user");
      } else {
        navigate("/unauthorized");
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setErrorMessage(err.response.data.message || "Invalid credentials");
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="max-w-md w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] overflow-hidden">
      <div className="border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg">
        <div className="border-[10px] border-transparent rounded-[20px] p-6 sm:p-8 dark:bg-gray-900 bg-white shadow-lg">
          <h1 className="pb-6 font-bold dark:text-gray-400 text-3xl sm:text-4xl text-center">
            Login
          </h1>

          {errorMessage && (
            <div className="text-red-500 text-lg font-semibold text-center mb-4">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm sm:text-base dark:text-gray-400"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border p-3 w-full rounded-lg shadow-md dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 placeholder:text-base focus:scale-105 transition duration-300"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm sm:text-base dark:text-gray-400"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border p-3 w-full rounded-lg shadow-md dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 placeholder:text-base focus:scale-105 transition duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-white hover:text-white cursor-pointer"
                >
                  {showPass ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            <div className="flex justify-end text-sm">
              <a
                href="#"
                className="text-blue-400 hover:underline transition duration-300"
              >
                Forgot your password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full mt-4 p-2 text-white rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 shadow-lg transition duration-300"
            >
              LOG IN
            </button>
          </form>

          <div className="text-gray-500 text-xs sm:text-sm mt-4 text-center">
            <p>
              By signing in, you agree to our{" "}
              <a href="#" className="text-blue-400 hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-400 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
