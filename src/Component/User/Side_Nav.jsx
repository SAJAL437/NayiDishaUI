import React from "react";
import {
  RiDashboardHorizontalFill,
  RiShieldUserLine,
  RiFileList3Fill,
} from "react-icons/ri";
import { SiHomebridge, SiGoogleforms, SiFormstack } from "react-icons/si";
import { TbLogout } from "react-icons/tb";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaUserEdit } from "react-icons/fa";
import { logout } from "../../utils/Auth";

const adminLinks = [
  { icon: <FaUser />, name: "Profile", to: "/user" },
  { icon: <SiHomebridge />, name: "Home", to: "/" },
  { icon: <FaUserEdit /> , name: "Edit Profile", to: "/user/update" },
  {
    icon: <SiGoogleforms />,
    name: "Register Complain",
    to: "/user/complain-form",
  },
  { icon: <SiFormstack />, name: "Complains", to: "/user/myIssue" },
];

const Side_Nav = ({ isBottomNav = false }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home
  };

  if (isBottomNav) {
    return (
      <nav className="flex justify-around items-center h-14 bg-white/10 backdrop-blur-lg">
        {adminLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full text-gray-300 text-xs transition-all duration-300 ${
                isActive
                  ? "bg-blue-500/20 text-blue-300"
                  : "hover:bg-white/10 hover:text-blue-200 active:bg-blue-500/30"
              }`
            }
          >
            <span className=" text-2xl">{link.icon}</span>
            {/* <span className="mt-1 truncate">{link.name}</span> */}
          </NavLink>
        ))}
        
      </nav>
    );
  }

  return (
    <div className="w-20 sm:w-24 h-screen fixed">
      <div className="p-3 sm:p-4 flex flex-col justify-between h-full">
        {/* Company Logo */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full border-4 border-gray-300/30 bg-white/10 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:scale-105">
          <img
            src="https://st.depositphotos.com/1364916/1400/v/450/depositphotos_14006320-stock-illustration-teamwork-union-logo-vector.jpg"
            alt="Company Logo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Navbar */}
        <div className="flex flex-col items-center py-4 sm:py-6 bg-white/5 backdrop-blur-lg rounded-2xl shadow-inner relative top-3 lg:top-0">
          <ul className="space-y-4 sm:space-y-6">
            {adminLinks.map((link, index) => (
              <li
                key={index}
                className="group relative cursor-pointer transition-all duration-300"
              >
                <NavLink
                  to={link.to}
                  title={link.name}
                  className={({ isActive }) =>
                    `flex items-center justify-center p-2 sm:p-3 text-xl sm:text-2xl rounded-full text-gray-300 hover:text-white hover:bg-white/10 hover:scale-110 transition-all duration-300 ${
                      isActive
                        ? "bg-white/20 text-white shadow-lg shadow-blue-500/50"
                        : ""
                    }`
                  }
                >
                  {link.icon}
                  <span className="absolute left-16 sm:left-20 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    {link.name}
                  </span>
                </NavLink>
              </li>
            ))}

            {/* Logout Button */}
            <li className="group relative cursor-pointer transition-all duration-300">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center p-2 sm:p-3 text-xl sm:text-2xl rounded-full text-gray-300 hover:text-white hover:bg-white/10 hover:scale-110 transition-all duration-300"
              >
                <TbLogout />
                <span className="absolute left-16 sm:left-20 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  Logout
                </span>
              </button>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="flex justify-center items-center mb-3 sm:mb-4 relative top-5 lg:top-0 ">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full border-4 border-gray-300/30 bg-white/10 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:scale-105">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk2F9qWvoWdN621VFxuVPMxypnoQDLFNxzTPB7v_4-77Nw2KiuRx2T0m9Lnnq2jaG8W2s&usqp=CAU"
              alt="Country Flag"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Side_Nav;
