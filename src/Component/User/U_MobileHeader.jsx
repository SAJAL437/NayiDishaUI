import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../utils/Auth";
import { TbLogout } from "react-icons/tb";
import { SiHomebridge } from "react-icons/si";

const MobileHeader = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home
  };
  return (
    <div className="sm:hidden fixed top-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-b border-gray-300/30 z-50 p-2 flex justify-between items-center gap-2">
      <Link
        to="/"
        className="flex items-center space-x-2 text-base font-extrabold text-white drop-shadow-md hover:scale-105 transition-transform duration-300 group"
      >
        <img
          src="https://st.depositphotos.com/1364916/1400/v/450/depositphotos_14006320-stock-illustration-teamwork-union-logo-vector.jpg"
          alt="Logo"
          className="h-8 w-8 rounded-full border-2 border-white/50 shadow-md"
        />
        <span className="relative">
          <h1>NahiDisha</h1>
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white/70 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
        </span>
      </Link>
      
      <button
        onClick={handleLogout}
        className="flex items-center justify-center p-2 sm:p-3 text-xl sm:text-2xl rounded-full text-gray-300 hover:text-white hover:bg-white/10 hover:scale-110 transition-all duration-300"
      >
        <TbLogout />
        <span className="absolute left-16 sm:left-20 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Logout
        </span>
      </button>
    </div>
  );
};

export default MobileHeader;
