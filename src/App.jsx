import { useState } from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { Login } from './Components/login'
import { Signup } from './Components/signup'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path = "/login" element={<Login/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
