import { Link, useNavigate } from "react-router-dom";
import { clearSession } from "../../utils/token";
import "./Navbar.css";

const UserNavbar: React.FC = () => {
  const navigate = useNavigate();

  const logout = () => {
    clearSession();
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-globe2 me-2" style={{ color: "#fff", fontSize: "1.5rem" }}></i>
          <span className="fw-bold">Travel</span>Trove
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="bi bi-house-door d-lg-none me-1"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/user/profile">
                <i className="bi bi-person d-lg-none me-1"></i> Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/user/my-favorites">
                <i className="bi bi-heart d-lg-none me-1"></i> My Favorites
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/user/my-itineraries">
                <i className="bi bi-calendar d-lg-none me-1"></i> My Itineraries
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/user/travel-groups">
                <i className="bi bi-people d-lg-none me-1"></i> Travel Groups
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center ms-auto">
            <button
              className="btn btn-outline-light"
              onClick={logout}
              type="button"
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              <span className="d-none d-lg-inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
