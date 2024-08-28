import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <div className="footer">
            <div className="footer__links">
                <a href="#">Conditions of Use</a>
                <a href="#">Privacy Notice</a>
                <a href="#">Help</a>
            </div>
            <p className="footer__copy">&copy; 2024, Leu Manuel, Inc. or its portifolio</p>
        </div>
    );
}

export default Footer;
