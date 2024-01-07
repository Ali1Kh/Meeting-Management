import React from "react";
import "./login.css";
import logo from "../../image/Logo.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Login() {
  const [t] = useTranslation();
  return (
    <>
      <div className="main d-flex justify-content-center align-items-center">
        <div className="container ">
          <div className="login-logo m-auto d-flex justify-content-center align-items-center mb-4">
            <img className="w-100" src={logo} alt="" />
          </div>
          <div className="row">
            <div className="col-md-5 m-auto">
              <div className="ineer">
                <div className="form mb-4">
                  <input
                    type="text"
                    className="user-name mt-3 d-flex justify-content-center form-control"
                    placeholder={t("Login.username")}
                  />
                  <input
                    type="text"
                    className="user-name mt-3 d-flex justify-content-center form-control"
                    placeholder={t("Login.password")}
                  />
                </div>
                <p className="mt-2 px-3">
                  Don't Have An Acount ? <Link to={"/signup"}>Sign Up</Link>
                </p>
                <div className="login-btn d-flex justify-content-center align-items-center mt-3">
                  <Link to={"/#"} className="">
                    {t("Login.button")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
