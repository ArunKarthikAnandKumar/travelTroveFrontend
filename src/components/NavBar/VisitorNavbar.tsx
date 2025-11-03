import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, type FormEvent } from "react";
import { getToken, clearSession } from "../../utils/token";
import "./Navbar.css";

const VisitorNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();
      setIsLoggedIn(!!token);
    };
    checkAuth();
    
    // Listen for storage changes (login/logout in other tabs)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check on focus (in case login happened in same tab)
    window.addEventListener('focus', checkAuth);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', checkAuth);
    };
  }, []);
  
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const input = document.getElementById('searchInput') as HTMLInputElement;
    if (input.value.trim()) {
      navigate(`/destinations?search=${encodeURIComponent(input.value.trim())}`);
    } else {
      navigate('/destinations');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isDropdownOpen && !target.closest('.dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handleLogout = () => {
    clearSession();
    setIsLoggedIn(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-globe2 me-2" style={{ color: "#3498db", fontSize: "1.5rem" }}></i>
          <span className="fw-bold">Travel</span>Trove
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={closeMenu}>
                <i className="bi bi-house-door d-lg-none me-1"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/destinations" onClick={closeMenu}>
                <i className="bi bi-geo-alt d-lg-none me-1"></i> Destinations
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/travel-groups" onClick={closeMenu}>
                <i className="bi bi-people d-lg-none me-1"></i> Travel Groups
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/itineraries" onClick={closeMenu}>
                <i className="bi bi-map d-lg-none me-1"></i> Itineraries
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <div className="search-bar me-3 d-none d-lg-block">
              <form className="d-flex" role="search" onSubmit={handleSearch}>
                <input
                  id="searchInput"
                  name="search"
                  className="form-control me-2"
                  type="search"
                  placeholder="Search destinations..."
                  aria-label="Search"
                  defaultValue={searchParams.get('search') || ''}
                />
                <button className="btn btn-primary" type="submit" style={{ backgroundColor: '#3498db', borderColor: '#3498db', color: '#fff' }}>
                  <i className="bi bi-search"></i>
                </button>
              </form>
            </div>

            {isLoggedIn ? (
              <div className="dropdown">
                <button
                  className={`btn btn-outline-primary dropdown-toggle d-flex align-items-center ${isDropdownOpen ? 'show' : ''}`}
                  type="button"
                  id="userDropdown"
                  onClick={toggleDropdown}
                  aria-expanded={isDropdownOpen}
                >
                  <i className="bi bi-person-circle me-1"></i>
                  <span className="d-none d-lg-inline">My Account</span>
                </button>
                <ul className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? 'show' : ''}`} aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" to="/user/profile" onClick={() => { closeMenu(); closeDropdown(); }}>
                      <i className="bi bi-person me-2"></i> My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/user/my-favorites" onClick={() => { closeMenu(); closeDropdown(); }}>
                      <i className="bi bi-heart me-2"></i> My Favorites
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/user/my-itineraries" onClick={() => { closeMenu(); closeDropdown(); }}>
                      <i className="bi bi-calendar me-2"></i> My Itineraries
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/user/travel-groups" onClick={() => { closeMenu(); closeDropdown(); }}>
                      <i className="bi bi-people me-2"></i> Travel Groups
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={() => { closeDropdown(); handleLogout(); }}>
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex">
                <Link to="/login" className="btn btn-outline-primary me-2" onClick={closeMenu}>
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  <span className="d-none d-lg-inline">Login</span>
                </Link>
                <Link to="/register" className="btn btn-primary" onClick={closeMenu}>
                  <i className="bi bi-person-plus me-1"></i>
                  <span className="d-none d-lg-inline">Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default VisitorNavbar;
