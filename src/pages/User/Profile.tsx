import { useEffect } from "react"


const Profile:React.FC=()=>{
    useEffect(()=>{
    const token=sessionStorage.getItem("token")
    const id=sessionStorage.getItem("id")
    const role=sessionStorage.getItem("role")
    const data=sessionStorage.getItem("userData")
    console.log('data is ',token,id,role,data?.toString())
},[])
    return (
        <>
This is UserProfile Page
        </>
    )
}
export default Profile