import { Navigate, Outlet } from "react-router-dom"
import AdminNavbar from "../components/NavBar/AdminNavbar"


const AdminLayout:React.FC=()=>{
    
    console.log("Inside AdminLayout")
    const isAuthenticated=sessionStorage.getItem("token")
    const role=sessionStorage.getItem("role")

    if(role!="admin"){
        return <Navigate to="/admin/login" replace/>
    }

    return (
        <>
        <div className="d-flex flex-column min-vh-100">
            <AdminNavbar/>

        </div>

        </>
    )
}
export default AdminLayout