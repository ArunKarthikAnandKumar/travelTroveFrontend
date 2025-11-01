import { Navigate, Outlet } from "react-router-dom"
import UserNavbar from "../components/NavBar/UserNavbar"

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
            <Outlet/>

        </div>

        </>
    )
}
export default UserLayout