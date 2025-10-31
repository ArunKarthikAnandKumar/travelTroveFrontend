import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { clearSession } from "../../utils/token";

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const logout = () => {
    clearSession();
    navigate("/admin/login");
  };

  const menuItems = [
    { name: "Continents", icon: "bi-globe", path: "/admin/continents" },
    { name: "Countries", icon: "bi-map", path: "/admin/countrys" },
    { name: "States", icon: "bi-geo-alt", path: "/admin/states" },
    { name: "Cities", icon: "bi-building", path: "/admin/citys" },
    { name: "Attractions", icon: "bi-signpost-split", path: "/admin/attractions" },
    { name: "Restaurants", icon: "bi-cup-straw", path: "/admin/restaurants" },
    { name: "Hotels", icon: "bi-house-door", path: "/admin/hotels" },
    { name: "Destination Guides", icon: "bi-book", path: "/admin/destinationGuides" },
    { name: "Itineraries", icon: "bi-calendar-week", path: "/admin/itenary" },
  ];

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div
        style={{
          width: collapsed ? "80px" : "250px",
          height: "100vh",
          background: "linear-gradient(180deg, #1e1e2f, #2a2a40)",
          color: "#fff",
          position: "fixed",
          left: 0,
          top: 0,
          transition: "width 0.3s ease",
          boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            padding: "20px 15px",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {!collapsed && (
            <h5
              style={{
                margin: 0,
                color: "#00d4ff",
                fontWeight: 700,
                letterSpacing: "1px",
              }}
            >
              Admin Panel
            </h5>
          )}
          <i
            className="bi bi-list"
            style={{
              cursor: "pointer",
              color: "#00d4ff",
              fontSize: "1.4rem",
            }}
            onClick={() => setCollapsed(!collapsed)}
          ></i>
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color:
                    location.pathname === item.path ? "#00d4ff" : "#ccc",
                  padding: "12px 20px",
                  transition: "background 0.3s",
                  background:
                    location.pathname === item.path
                      ? "rgba(0, 212, 255, 0.15)"
                      : "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(0, 212, 255, 0.08)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    location.pathname === item.path
                      ? "rgba(0, 212, 255, 0.15)"
                      : "transparent")
                }
              >
                <i
                  className={`bi ${item.icon}`}
                  style={{ fontSize: "1.2rem", width: "30px" }}
                ></i>
                {!collapsed && (
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "0.95rem",
                      fontWeight: 500,
                    }}
                  >
                    {item.name}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div
          style={{
            position: "absolute",
            bottom: "20px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <button
            onClick={logout}
            style={{
              border: "none",
              background: "#00d4ff",
              color: "#111",
              fontWeight: 600,
              borderRadius: "6px",
              padding: collapsed ? "8px" : "8px 16px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor = "#33e0ff")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor = "#00d4ff")
            }
          >
            <i
              className="bi bi-box-arrow-right"
              style={{ marginRight: collapsed ? 0 : "6px" }}
            ></i>
            {!collapsed && "Logout"}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          marginLeft: collapsed ? "80px" : "250px",
          transition: "margin-left 0.3s ease",
          background: "#f5f6fa",
          minHeight: "100vh",
          padding: "20px",
        }}
      >
        {/* Nested admin routes render here */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminSidebar;
