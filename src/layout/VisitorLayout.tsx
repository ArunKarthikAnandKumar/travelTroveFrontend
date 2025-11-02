import { Outlet } from "react-router-dom"
import VisitorNavbar from "../components/NavBar/VisitorNavbar"
import Footer from "../components/Footer/Footer"
import "../components/NavBar/Navbar.css"

const VisitorLayout:React.FC=()=>{
    return (
        <>
        <div className="d-flex flex-column min-vh-100">
            <VisitorNavbar/>
            <main className="content-with-navbar flex-grow-1">
                <Outlet/>
            </main>
            <Footer/>
        </div>

        </>
    )
}
export default VisitorLayout