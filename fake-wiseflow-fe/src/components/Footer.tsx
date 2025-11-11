import React from 'react';
import '../stylesheets/components/Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <p>© {new Date().getFullYear()} FakeWiseflow</p>
        </footer>
    );
};

export default Footer;