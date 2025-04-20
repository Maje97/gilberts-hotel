import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './AuthContext.tsx'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import socket from "./socket";

socket.on("login", (data) => {
  console.log("Login:", data);
});

socket.on("booking-created", (data) => {
  console.log(data);
});

socket.on("booking-updated", (data) => {
  console.log(data);
});

socket.on("booking-deleted", (data) => {
  console.log(data);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LocalizationProvider>  
    </AuthProvider>
  </StrictMode>,
)
