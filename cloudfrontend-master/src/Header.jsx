import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify"

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getLogIn()
  }, [window.location.pathname]);

  const getLogIn = async () => {
    let userId = "";
    try {
      let data = await Auth.currentAuthenticatedUser().catch(err => ({}))
      userId = data?.attributes?.sub;
      setUserData(data?.attributes || {});
    } catch (err) {
      console.log(err);
    }
    setIsLoggedIn(!!userId);
    if(!userId && !window.location.pathname.includes("login") && !window.location.pathname.includes("signup")) {
      navigate("/login")
    }
  }

  const logout = () => {
    Auth.signOut()
    setIsLoggedIn(false);
    navigate("/login");
  };

  const redirectToBase = () => {
    let homeLink = userData["custom:userType"] === "ServiceProvider" ? "/provider_home" : "/client_home";
    let goToLinks = isLoggedIn ? homeLink : "/login"
    navigate(goToLinks)
  }

  if(window.location.pathname.includes("login") || window.location.pathname.includes("signup")) {
    return ""
  } else {
  return (
    <div className="main-site-header d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center">

      <div className="logo-text cursor-pointer mr-2" onClick={redirectToBase}>
        Halifax Services
      </div>
      
      </div>
      {isLoggedIn && (
        <div>
          <a className="header-links" href="#" onClick={logout}>
            Logout
          </a>
        </div>
      )}
    </div>
  );}
};

export default Header;
