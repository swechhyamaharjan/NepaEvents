import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { Login } from './Components/login';
import {Signup} from './Components/Signup';


function App() {
  const [count, setCount] =useState(0)

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
