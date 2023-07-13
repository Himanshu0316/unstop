import React from 'react'
import Navbar from './Navbar'
import { Route, Routes } from 'react-router'
import Home from './Home'

const Main = () => {
  return (
    <div>
    <Navbar/>
    <Routes>
        <Route path='/' element={<Home/>}/>
    </Routes>
    </div>
  )
}

export default Main