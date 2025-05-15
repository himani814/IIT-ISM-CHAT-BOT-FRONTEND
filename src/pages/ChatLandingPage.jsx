
import { useNavigate } from "react-router-dom";

import NavBar from '../components/Navbar.jsx';
import "../styles/home.css";
import logo from "../assets/cyan.png";

import TypeAnimation from "../utils/typeAnimation.jsx";
import {
  FaLinkedin,
  FaFacebookSquare,
  FaInstagramSquare,
  FaTwitterSquare,
} from "react-icons/fa";

function Home() {
  const sequence = [
  "ISM Buddy 🤖",
  "Your Personal Assistant at IIT Dhanbad",
  "Guiding You Through Campus Life",
  "Ask Me About Academics & Clubs",
  "Ready to Answer All Your ISM Questions",
  "Helping You Stay on Top of Deadlines 📅",
  "Your Go-To for Course and Hostel Info",
  "Bringing You the Latest Campus Updates",
  "Your Smart, Friendly Chat Companion",
  "Always Ready. Always Helpful.",
  "Making ISM Life Easier for You 💙",
  "ISM Buddy 🤖",
  "Your Personal Assistant at IIT Dhanbad",
  "Guiding You Through Campus Life",
  "Ask Me About Academics & Clubs",
  "Ready to Answer All Your ISM Questions",
  "Helping You Stay on Top of Deadlines 📅",
  "Your Go-To for Course and Hostel Info",
  "Bringing You the Latest Campus Updates",
  "Your Smart, Friendly Chat Companion",
  "Always Ready. Always Helpful.",
  "Making ISM Life Easier for You 💙",
  "ISM Buddy 🤖",
  "Your Personal Assistant at IIT Dhanbad",
  "Guiding You Through Campus Life",
  "Ask Me About Academics & Clubs",
  "Ready to Answer All Your ISM Questions",
  "Helping You Stay on Top of Deadlines 📅",
  "Your Go-To for Course and Hostel Info",
  "Bringing You the Latest Campus Updates",
  "Your Smart, Friendly Chat Companion",
  "Always Ready. Always Helpful.",
  "Making ISM Life Easier for You 💙",
  "ISM Buddy 🤖",
  "Your Personal Assistant at IIT Dhanbad",
  "Guiding You Through Campus Life",
  "Ask Me About Academics & Clubs",
  "Ready to Answer All Your ISM Questions",
  "Helping You Stay on Top of Deadlines 📅",
  "Your Go-To for Course and Hostel Info",
  "Bringing You the Latest Campus Updates",
  "Your Smart, Friendly Chat Companion",
  "Always Ready. Always Helpful.",
  "Making ISM Life Easier for You 💙",
  "ISM Buddy 🤖",
  "Your Personal Assistant at IIT Dhanbad",
  "Guiding You Through Campus Life",
  "Ask Me About Academics & Clubs",
  "Ready to Answer All Your ISM Questions",
  "Helping You Stay on Top of Deadlines 📅",
  "Your Go-To for Course and Hostel Info",
  "Bringing You the Latest Campus Updates",
  "Your Smart, Friendly Chat Companion",
  "Always Ready. Always Helpful.",
  "Making ISM Life Easier for You 💙",
  "ISM Buddy 🤖",
  "Your Personal Assistant at IIT Dhanbad",
  "Guiding You Through Campus Life",
  "Ask Me About Academics & Clubs",
  "Ready to Answer All Your ISM Questions",
  "Helping You Stay on Top of Deadlines 📅",
  "Your Go-To for Course and Hostel Info",
  "Bringing You the Latest Campus Updates",
  "Your Smart, Friendly Chat Companion",
  "Always Ready. Always Helpful.",
  "Making ISM Life Easier for You 💙",
];


  const navigate = useNavigate();
 const handleChatClick = () => {
    navigate('/chat');
  };
  const handleContactClick = () => {
    window.open("https://www.iitism.ac.in/contact-ma", "_blank");
  };
  const handleLinkedInClick = () => {
    window.open("https://www.linkedin.com/in/shubham-das-22je0936", "_blank");
  };

  const handleInstaClick = () => {
    window.open("https://www.instagram.com/shubhdasham", "_blank");
  };

  const handleTwitterClick = () => {
    window.open("https://twitter.com/IITISM_Dhanbad", "_blank");
  };

  const handleIITISMFacebookClick = () => {
    window.open("https://www.facebook.com/IITISM.Dhanbad", "_blank");
  };

  const handleIITISMYoutubeClick = () => {
    window.open("https://www.youtube.com/@iitismofficial", "_blank");
  };

  return (
    <>
    <NavBar/>
    <div className="home">
      <div className="home-left">
        <div className="home-left-1">
          Hi, it's <p>ISM BUDDY</p>
        </div>
        <div className="home-left-2">
          I'm a{" "}
          <div className="home-left-2-title">
            <TypeAnimation
              sequence={sequence}
              wrapper="div"
              repeat={Infinity}
            />
          </div>
        </div>
        <p className="home-left-3">
          Meet ISM Buddy – your friendly chat assistant from IIT Dhanbad!
          Whether you're a student navigating college life, curious about
          academics, or just looking for quick answers, ISM Buddy is here to
          help 24/7. Designed to make your campus journey smoother, this chatbot
          combines smart tech with student-friendly support to guide you every
          step of the way.
        </p>

        <div className="home-left-4">
          <FaLinkedin
            className="footer-icons-div"
            onClick={handleLinkedInClick}
          />
          <FaFacebookSquare
            className="footer-icons-div"
            onClick={() => alert("This feature is coming soon!")}
          />
          <FaInstagramSquare
            className="footer-icons-div"
            onClick={handleInstaClick}
          />
          <FaTwitterSquare
            className="footer-icons-div"
            onClick={handleTwitterClick}
          />
        </div>
        <div className="home-left-5">
          <div className="home-left-5-1" onClick={handleChatClick}>
            CHAT WITH ME
          </div>
          <div className="home-left-5-2" onClick={handleContactClick}>
            CONTACT US
          </div>
        </div>
      </div>

      <div className="home-right">
        <img src={logo} alt="Logo" />
      </div>
    </div>
    </>
  );
}

export default Home;
