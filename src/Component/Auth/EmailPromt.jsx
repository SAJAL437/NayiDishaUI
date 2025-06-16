import React from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmailPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
      <p className="mb-4">
        A verification email has been sent to your inbox or <span className="text-red-900 font-bold"> SPAM FOLDER </span>. Please click the link
        in the email to verify your account.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg p-2 text-white rounded-lg w-full hover:scale-105 transition duration-300 ease-in-out"
      >
        Go to Login
      </button>
    </div>
  );
};

export default VerifyEmailPrompt;
