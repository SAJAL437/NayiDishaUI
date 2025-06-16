import { Button } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../../utils/Auth";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    const BaseURL =
      import.meta.env.MODE === "development"
        ? "http://localhost:2512"
        : "https://nayidishaserver-production.up.railway.app";

    try {
      const response = await axios.post(`${BaseURL}/auth/signin`, {
        email,
        password,
      });
      console.log("data :", response.data);

      const token = response.data.jwt;
      console.log("Received token:", token);
      saveToken(token);

      // Decode roles directly from the token you just got
      const decoded = jwtDecode(token);
      const roles = decoded.roles || decoded.authorities || [];

      // If roles are objects, map them to strings
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
      alert("Login failed");
    }
  };

  return (
    <div className="max-w-md w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-[26px] overflow-hidden">
      <div className=" border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg">
        <div className="border-[10px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg p-6 sm:p-8">
          <h1 className="pb-6 font-bold dark:text-gray-400 text-3xl sm:text-4xl text-center cursor-default">
            Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
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
                onChange={(e) => setEmail(e.target.value)}
                required
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
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
              />
            </div>
            <a
              href="#"
              className="group text-blue-400 transition-all duration-100 ease-in-out text-sm"
            >
              <span className="bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                Forget your password?
              </span>
            </a>
            <button
              type="submit"
              className="bg-gradient-to-r dark:text-gray-300 from-blue-500 to-purple-500 shadow-lg mt-4 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-purple-500 hover:to-blue-500 transition duration-300 ease-in-out"
            >
              LOG IN
            </button>
          </form>

          {/* <div className="flex flex-col mt-4 items-center justify-center text-sm">
            <h3 className="dark:text-gray-300">
              Don't have an account?{" "}
              <Button
                onClick={() => navigate("/register")}
                className="text-blue-400 normal-case text-sm group"
              >
                <span className="bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                  SignUp
                </span>
              </Button>
            </h3>
          </div> */}

          {/* <div
            className="flex items-center justify-center mt-5 flex-wrap"
            id="third-party-auth"
          >
            {[
              {
                src: "https://ucarecdn.com/8f25a2ba-bdcf-4ff1-b596-088f330416ef/",
                alt: "Google",
              },
              {
                src: "https://ucarecdn.com/95eebb9c-85cf-4d12-942f-3c40d7044dc6/",
                alt: "LinkedIn",
              },
              {
                src: "https://ucarecdn.com/6f56c0f1-c9c0-4d72-b44d-51a79ff38ea9/",
                alt: "Facebook",
              },
            ].map((btn, i) => (
              <button
                key={i}
                className="hover:scale-105 ease-in-out duration-300 shadow-lg p-2 rounded-lg m-1"
              >
                <img
                  className={`max-w-[25px] ${
                    btn.dark ? "filter dark:invert" : ""
                  }`}
                  src={btn.src}
                  alt={btn.alt}
                />
              </button>
            ))}
          </div> */}

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

export default Login;
