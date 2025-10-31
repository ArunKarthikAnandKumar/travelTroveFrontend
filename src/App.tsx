import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './Components/Home'
import Navbar from './Components/Navbar'
import Concerts from './Components/Concerts'
import BookConcert from './Components/BookConcert'
import Login from './Components/Auth/Login'
import Register from './Components/Auth/Register'
import Purchases from './Components/Purchases'
import UserProfile from './Components/Profile'

function App() {

  return (
    <>
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/Home' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/purchases' element={<Purchases/>} />
        <Route path='/profile' element={<UserProfile/>} />
        <Route path='/view-concerts' element={<Concerts/>} />
        <Route path='/book-concerts/:id' element={<BookConcert/>} />

        

      </Routes>

    </BrowserRouter>
   
    </>
  )
}

export default App
