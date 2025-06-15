import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      axios
        .get(`${import.meta.env.REACT_APP_API_URL}/auth/verify?token=${token}`)
        .then((response) => {
          setMessage(response.data);
          if (response.data.includes("successfully")) {
            setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3s
          }
        })
        .catch((error) =>
          setMessage(error.response?.data || "Verification failed")
        );
    } else {
      setMessage("No verification token provided");
    }
  }, [searchParams, navigate]);

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
      <p
        className={`mb-4 ${
          message.includes("successfully") ? "text-green-500" : "text-red-500"
        }`}
      >
        {message}
      </p>
      {message.includes("successfully") && <p>Redirecting to login page...</p>}
      <button
        onClick={() => navigate("/login")}
        className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg p-2 text-white rounded-lg w-full hover:scale-105 transition duration-300 ease-in-out"
      >
        Go to Login
      </button>
    </div>
  );
};

export default VerifyEmail;
