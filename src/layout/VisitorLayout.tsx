import { Outlet } from "react-router-dom"
import VisitorNavbar from "../components/NavBar/VisitorNavbar"


const VisitorLayout:React.FC=()=>{
    return (
        <>
        <div className="d-flex flex-column min-vh-100">
            <VisitorNavbar/>
            <Outlet/>

        </div>

        </>
    )
}
export default VisitorLayout