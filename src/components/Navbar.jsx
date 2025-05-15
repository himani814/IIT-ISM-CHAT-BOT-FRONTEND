import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import "../styles/Navbar.css";

const NavBar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu on link click for mobile
  const handleLinkClick = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <div className="navbar-block"></div>
      <div className="navbar">
        <div className="navbar-left">
          <div
            className="navbar-left-name"
            style={{ display: "flex", gap: "7px" }}
          >
            IIT (ISM) <p>DHANBAD.</p>
          </div>
        </div>
        {isMobile ? (
          <>
            <button className="hamburger-menu" onClick={toggleMenu}>
              {isMenuOpen ? (
                <IoClose className="hamburger-menu-close" />
              ) : (
                <GiHamburgerMenu className="hamburger-menu-ham" />
              )}
            </button>
          </>
        ) : (
          <>
            <div className={`navbar-right`}>
              <div
                className={`navbar-right-link-properties ${
                  location.pathname === "/" ? "active" : ""
                }`}
                to="/"
              >
                CHAT BOT
              </div>
              <div
                className={`navbar-right-link-properties`}
                onClick={() =>
                  (window.location.href = "https://www.iitism.ac.in/")
                }
              >
                MAIN PAGE
              </div>
              <div
                className={`navbar-right-link-properties`}
                onClick={() =>
                  (window.location.href = "https://www.iitism.ac.in/contact-ma")
                }
              >
                CONTACT US
              </div>
            </div>
          </>
        )}
      </div>
      {isMenuOpen && (
        <div className={`mobile-side-menu ${isMenuOpen ? "open" : ""}`}>
          <div
            className={`mobile-menu-link ${
              location.pathname === "/" ? "active" : ""
            }`}
            to="/"
            onClick={handleLinkClick}
          >
            CHAT BOT
          </div>
          <div
            className={`mobile-menu-link ${
              location.pathname === "/service" ? "active" : ""
            }`}
            onClick={() => (window.location.href = "https://www.iitism.ac.in/")}
          >
            MAIN PAGE
          </div>
          <div
            className={`mobile-menu-link ${
              location.pathname === "/service" ? "active" : ""
            }`}
            onClick={() => (window.location.href = "https://www.iitism.ac.in/contact-ma")}
          >
            CONTACT US
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
