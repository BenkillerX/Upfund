import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import logo2 from "/logo2.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "How It Works", path: "/how-it-works" },
  ];

  const closeMenu = () => {
    setIsOpen(false);
  };


  return (
    <header className="w-full border-b border-gray-200 sticky top-0 z-50 bg-slate-800">
      <nav>
        {/* MOBILE NAVBAR */}
        <div className="px-4 py-3 flex items-center justify-between md:hidden">
          <Link to="/" onClick={closeMenu}>
            <h1 className="text-xl font-bold">
              UpF<span className="text-amber-200-500">u</span>nd
            </h1>
          </Link>

          {/* Hamburger / Close Icon */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl text-gray-700"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* MOBILE SIDEBAR */}
        <div
          className={`fixed top-0 right-0 h-screen w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 md:hidden ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="text-xl font-bold">
              Quick<span className="text-orange-500">Stay</span>
            </h2>

            <button
              onClick={closeMenu}
              className="text-2xl text-gray-700"
              aria-label="Close menu"
            >
              <FiX />
            </button>
          </div>

          {/* Sidebar Links */}
          <ul className="flex flex-col px-5 py-6 gap-5">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={closeMenu}
                  className="block text-gray-700 font-medium hover:text-orange-500 transition duration-300"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Sidebar Buttons */}
          <div className="px-5 flex flex-col gap-3">
            <Link
              to="/login"
              onClick={closeMenu}
              className="w-full text-center px-4 py-2 bg-orange-500 rounded-lg text-white"
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={closeMenu}
              className="w-full text-center px-4 py-2 border-2 border-orange-500 rounded-lg text-orange-500 hover:bg-orange-500 hover:text-white transition"
            >
              Sign Up
            </Link>

            <Link
              to="/list-property"
              onClick={closeMenu}
              className="w-full text-center bg-orange-500 px-4 py-2 rounded-lg text-white"
            >
              List Property
            </Link>
          </div>
        </div>

        {/* OVERLAY */}
        {isOpen && (
          <div
            onClick={closeMenu}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
          />
        )}

        {/* DESKTOP / TABLET NAVBAR */}
        <div className="hidden md:flex items-center px-8 lg:px-28 py-2 justify-between w-full">
          {/* Logo */}
         <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2"
        >
          <img
            src={logo2}
            alt="Logo"
            className="h-15 w-20 object-contain"
          />

          <h1 className="text-xl font-bold text-amber-200">
            UpFund
          </h1>
        </Link>

          {/* Navigation */}
          <ul className="flex gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="text-white font-medium hover:text-amber-200 transition duration-200"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex gap-3 items-center">
            <Link
              to="/login"
              className="px-4 py-1.5 bg-orange-500 rounded-lg text-white hover:bg-orange-600 transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-4 py-1.5 border-2 border-orange-500 text-white hover:bg-orange-500 hover:text-white text-sm rounded-lg transition"
            >
              Sign Up
            </Link>

          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;