import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import "../styles/navbarLight.css";
import "../styles/navbarDark.css";

const NavBar = ({theme}) => {
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

  // Update body class for global styling (optional)
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

 
  return (
    <>
      <div className={`navbar-block-${theme}`}></div>
      <div className={`navbar navbar-${theme}`}>
        <div className={`navbar-left navbar-left-${theme}`}>
          <div className={`navbar-left-name navbar-left-name-${theme}`} style={{ display: "flex", gap: "7px" }}>
            IIT (ISM) <p>DHANBAD </p>
          </div>
        </div>

        {isMobile ? (
          <button className={`hamburger-menu hamburger-menu-${theme}`} onClick={toggleMenu}>
            {isMenuOpen ? (
              <IoClose className={`hamburger-menu-close hamburger-menu-close-${theme}`} />
            ) : (
              <GiHamburgerMenu className={`hamburger-menu-ham hamburger-menu-ham-${theme}`} />
            )}
          </button>
        ) : (
          <div className={`navbar-right navbar-right-${theme}`}>
            <div
              className={`navbar-right-link-properties navbar-right-link-properties-${theme} ${
                location.pathname === "/" ? "active" : ""
              }`}
            >
              CHAT BOT
            </div>
            <div
              className={`navbar-right-link-properties navbar-right-link-properties-${theme}`}
              onClick={() => (window.location.href = "https://www.iitism.ac.in/")}
            >
              MAIN PAGE
            </div>
            <div
              className={`navbar-right-link-properties navbar-right-link-properties-${theme}`}
              onClick={() => (window.location.href = "https://www.iitism.ac.in/contact-ma")}
            >
              CONTACT US
            </div>
          </div>
        )}

      </div>

      {isMenuOpen && (
        <div className={`mobile-side-menu mobile-side-menu-${theme} open`}>
          <div
            className={`mobile-menu-link mobile-menu-link-${theme} ${
              location.pathname === "/" ? "active" : ""
            }`}
            onClick={handleLinkClick}
          >
            CHAT BOT
          </div>
          <div
            className={`mobile-menu-link mobile-menu-link-${theme}`}
            onClick={() => (window.location.href = "https://www.iitism.ac.in/")}
          >
            MAIN PAGE
          </div>
          <div
            className={`mobile-menu-link mobile-menu-link-${theme}`}
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
