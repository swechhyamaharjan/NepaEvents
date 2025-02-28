import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from "react-hot-toast";
import { AuthProvider } from './Context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(

    <>
    <App />
    <Toaster
          position="bottom-right"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 1500,
            },
            error: {
              duration: 2500,
            },
            style: {
              fontSize: "14px",
              maxWidth: "500px",
              padding: "10px 20px",
            },
          }}
          />
          
      </>
)
