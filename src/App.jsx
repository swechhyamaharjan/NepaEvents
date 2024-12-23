import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { Login } from './Components/login';
import {Signup} from './Components/Signup';
import { HomePage } from './Components/HomePage';
import { NavBar } from './Components/navbar';


function App() {
  const [count, setCount] =useState(0)

  return (
    <>
    <BrowserRouter>
     {/* Render NavBar once for all routes */}
    <NavBar /> 
      <Routes>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/homepage" element={<HomePage/>}></Route>
        <Route path="/navbar" element={<NavBar/>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
