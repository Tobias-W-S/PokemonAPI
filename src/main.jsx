import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import PokeAPI from './assets/components/PokeAPI'
import SinglePokeAPI from './assets/components/SinglePokeAPI'
import ComparePokeAPI from './assets/components/ComparePokeAPI'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<PokeAPI/>}/>
        <Route path="/pokemon/*" element={<SinglePokeAPI/>}/>
        <Route path="/compare/*" element={<ComparePokeAPI/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
