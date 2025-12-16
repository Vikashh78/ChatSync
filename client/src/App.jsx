import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import {Toaster} from 'react-hot-toast'; /*React Hot Toast is used to show non-blocking notifications in React applications to improve user experience
--With toasts:
“Login successful”
“Message sent”
“Error occurred”
👉 User instantly understands what happened ✅*/
import { AuthContext } from '../context/AuthContext';


const App = () => {

  const {authUser} = useContext(AuthContext)

  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">

      <Toaster position='top-right'/>
      <Routes>
        <Route path='/' element={ authUser? <Homepage /> : <Navigate to="/login" /> } />

        <Route path='/login' element={ !authUser? <LoginPage /> : <Navigate to="/" /> } />

        <Route path='/profile' element={authUser? <ProfilePage /> : <Navigate to="/login" /> } />
        
      </Routes>
    </div>
  )
}

export default App