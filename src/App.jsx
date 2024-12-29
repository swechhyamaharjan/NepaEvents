import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { Login } from './Components/login';
import {Signup} from './Components/Signup';
import { HomePage } from './Components/HomePage';
import { NavBar } from './Components/navbar';
import { Footer } from './Components/Footer';
import { Event } from './Components/Event';
import { AboutUs } from './Components/AboutUs';
import { ContactUs } from './Components/ContactUs';

function App() {
  const [count, setCount] =useState(0)

  return (
    <>
    <BrowserRouter>
     {/* Render NavBar for all routes */}
    <NavBar /> 
      <Routes>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/homepage" element={<HomePage/>}></Route>
        <Route path="/navbar" element={<NavBar/>}></Route>
        <Route path="/event" element={<Event/>}></Route>
        <Route path="/aboutus" element={<AboutUs/>}></Route>
        <Route path="/contactus" element={<ContactUs/>}></Route>
      </Routes>
      {/* Footer will appear on all pages */}
      <Footer />
    </BrowserRouter>
    </>
  );
}

export default App;
