import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PokeAPI from './assets/components/PokeAPI'
import SinglePokeAPI from './assets/components/SinglePokeAPI'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<PokeAPI/>}/>
        <Route path="/pokemon/*" element={<SinglePokeAPI/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
