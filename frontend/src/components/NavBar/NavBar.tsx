import { useState } from "react";
import { Image, Text, Button } from "@chakra-ui/react";
import logo from "../../assets/openart-raw.jpg";
import profileImage from "../../assets/profile_image.jpg";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div className="navbar-container">
      {/* Logo */}
      <div className="logo-container" onClick={() => navigate("/")}>
        <Image src={logo} className="logo-image" />
        <Text className="navbar-title">NavBar</Text>
      </div>

      {/* Profile & Dropdown */}
      <div className="profile-container" onClick={toggleDropdown}>
        <Image src={profileImage} className="profile-image" />
      </div>

      {isDropdownOpen && (
        <div className="dropdown-menu">
          <Button
            className="logout-button"
            onClick={() => setAccessToken(null)}
          >
            Log Out
          </Button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
