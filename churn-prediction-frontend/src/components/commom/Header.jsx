import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from "./../../assets/logo.png";


function Header() {
    return (
        <div className="header">
            <Link to="/">
                {/** <img className="header__logo" src={logo} alt="Logo" />  */}
            </Link>
            <div className="header__title">
                Churn Prediction
            </div>
            <div className="header__nav">
                <Link to="/" className="header__option">Home</Link>
                <Link to="/predict-churn" className="header__option">Predict Churn</Link>
                <Link to="/customers" className="header__option">Customers</Link>
                <Link to="/logout" className="header__option">Logout</Link>
            </div>
        </div>
    );
}

export default Header;

