import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthModel from "../Auth/AuthModel";
import { getUserRoles, isAuthenticated, logout } from "../../utils/Auth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [openAuthModal, setOpenAuthModal] = React.useState(false);
  const navigate = useNavigate();

  const isAuth = isAuthenticated();
  const roles = getUserRoles();

  const navLinks = [{ name: "Home", href: "/" }];

  if (isAuth && roles.includes("ROLE_USER")) {
    navLinks.push({ name: "User Dashboard", href: "/user" });
  }

  if (isAuth && roles.includes("ROLE_ADMIN")) {
    navLinks.push({ name: "Admin Dashboard", href: "/admin" });
  }

  const handleOpen = () => setOpenAuthModal(true);
  const handleClose = () => setOpenAuthModal(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <nav className="border-b-2 border-gray-50 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-950 fixed w-full z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 py-2">
            <Link
              to="/"
              className="flex items-center space-x-3 text-xl font-semibold text-white  drop-shadow-md hover:scale-105 transition-transform duration-300"
            >
              <img
                src="https://st.depositphotos.com/1364916/1400/v/450/depositphotos_14006320-stock-illustration-teamwork-union-logo-vector.jpg"
                alt="Logo"
                className="h-10 w-10 rounded-full border-2 border-white/50 shadow-md"
              />
              <span className="relative">
                NayiDisha
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white/70 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="relative text-white font-medium text-lg hover:text-blue-300 transition-all duration-300 group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                </Link>
              ))}

              {isAuth ? (
                <button
                  onClick={handleLogout}
                  className="relative bg-transparent border-2 border-red-300 text-red-200 px-5 py-1.5 rounded-full hover:bg-red-500/30 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg group"
                >
                  Logout
                  <span className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-red-200/50 transition-all duration-300"></span>
                </button>
              ) : (
                <button
                  onClick={handleOpen}
                  className="relative bg-transparent border-2 border-white/70 text-white px-5 py-1.5 rounded-full hover:bg-white/20 hover:text-yellow-200 transition-all duration-300 shadow-md hover:shadow-lg group"
                >
                  Register/Login
                  <span className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-yellow-200/50 transition-all duration-300"></span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-white focus:outline-none focus:ring-2 focus:ring-yellow-200 rounded-md p-1 transition-all duration-300"
                aria-label="Toggle navigation"
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-gray-50 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-950 px-4 pt-4 pb-6 space-y-4 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block text-white font-medium text-lg hover:blue-300 transition-all duration-300 relative group"
                onClick={toggleMenu}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            ))}

            {isAuth ? (
              <button
                onClick={handleLogout}
                className="w-full bg-transparent border-2 border-red-300 text-red-200 py-2 rounded-lg hover:bg-red-500/30 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleOpen}
                className="w-full bg-transparent border-2 border-white/70 text-white py-2 rounded-lg hover:bg-white/20 hover:text-yellow-200 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Login
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Authentication Modal */}
      <AuthModel handleClose={handleClose} open={openAuthModal} />
    </>
  );
};

export default Navbar;
