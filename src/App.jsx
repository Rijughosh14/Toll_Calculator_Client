import axios from "axios";
import { Routes, Route } from "react-router-dom";
import './App.css'
import Index from './Pages/Index'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL




function App() {

  return (
    <>
    <Routes>
      <Route index element={<Index />} />
    </Routes>
    </>
  )
}

export default App
