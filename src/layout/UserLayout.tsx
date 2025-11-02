import { Navigate, Outlet } from "react-router-dom"
import UserNavbar from "../components/NavBar/UserNavbar"
import Footer from "../components/Footer/Footer"
import "../components/NavBar/Navbar.css"

const UserLayout:React.FC=()=>{
    
    const isAuthenticated=sessionStorage.getItem("token")
    console.log('The token is',isAuthenticated)

    if(!isAuthenticated){
        return <Navigate to="/login" replace/>
    }


    return (
        <>
        <div className="d-flex flex-column min-vh-100">
            <UserNavbar/>
            <main className="content-with-navbar flex-grow-1">
                <Outlet/>
            </main>
            <Footer/>
        </div>

        </>
    )
}
export default UserLayout