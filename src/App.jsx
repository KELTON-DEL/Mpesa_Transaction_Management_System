import { useState } from 'react'
import Mpesa from './components/Mpesa'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
//import './App.css'
import Signup from './components/Auth/Sigup'
import Login from './components/Auth/Login'
import Dashboard from './components/pages/Dashboard'
import Profile from './components/pages/Profile'
import TransactionHist from './components/pages/TransactionHist'
//import ProtectedRoute from './components/Auth/ProtectedRoute'


function App() {
 

  return (
    <>

  <BrowserRouter>
  <Routes>
   
    <Route path='/signup' element={ <Signup/>} />
    <Route path='/*' element={<Login />} />
     <Route path='/mpesa' element={<Mpesa />} />
     <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/profile' element={<Profile />} />
     <Route path='transactions' element={<TransactionHist/>}/>
  </Routes>
  </BrowserRouter>
    </>
  )
}

export default App
