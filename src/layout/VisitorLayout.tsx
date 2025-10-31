import { Outlet } from "react-router-dom"
import VisitorNavbar from "../Components/NavBar/VisitorNavbar"


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