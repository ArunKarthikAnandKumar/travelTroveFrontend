import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white mt-auto">
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-globe2 me-2"></i>
              TravelTrove
            </h5>
            <p className="text-muted">
              Your trusted companion for discovering amazing destinations around the world. 
              Plan your next adventure with curated travel guides and expert recommendations.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-white" aria-label="Facebook">
                <i className="bi bi-facebook" style={{ fontSize: '1.5rem' }}></i>
              </a>
              <a href="#" className="text-white" aria-label="Twitter">
                <i className="bi bi-twitter" style={{ fontSize: '1.5rem' }}></i>
              </a>
              <a href="#" className="text-white" aria-label="Instagram">
                <i className="bi bi-instagram" style={{ fontSize: '1.5rem' }}></i>
              </a>
              <a href="#" className="text-white" aria-label="LinkedIn">
                <i className="bi bi-linkedin" style={{ fontSize: '1.5rem' }}></i>
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-muted text-decoration-none">
                  <i className="bi bi-chevron-right me-1"></i>Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/destinations" className="text-muted text-decoration-none">
                  <i className="bi bi-chevron-right me-1"></i>Destinations
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/user/my-itineraries" className="text-muted text-decoration-none">
                  <i className="bi bi-chevron-right me-1"></i>Itineraries
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/user/travel-groups" className="text-muted text-decoration-none">
                  <i className="bi bi-chevron-right me-1"></i>Travel Groups
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="fw-bold mb-3">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/contact" className="text-muted text-decoration-none">
                  <i className="bi bi-chevron-right me-1"></i>Contact Us
                </Link>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  <i className="bi bi-chevron-right me-1"></i>FAQ
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  <i className="bi bi-chevron-right me-1"></i>Privacy Policy
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  <i className="bi bi-chevron-right me-1"></i>Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="fw-bold mb-3">Contact Info</h6>
            <ul className="list-unstyled text-muted">
              <li className="mb-2">
                <i className="bi bi-geo-alt-fill me-2"></i>
                123 Travel Street, Adventure City, AC 12345
              </li>
              <li className="mb-2">
                <i className="bi bi-envelope-fill me-2"></i>
                support@traveltrove.com
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone-fill me-2"></i>
                +1 (555) 123-4567
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 bg-secondary" />

        <div className="row">
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
            <p className="text-muted mb-0">
              &copy; {new Date().getFullYear()} TravelTrove. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="text-muted mb-0">
              Made with <i className="bi bi-heart-fill text-danger"></i> for travelers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

