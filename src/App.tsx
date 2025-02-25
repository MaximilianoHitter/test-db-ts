import { useState } from 'react'
import './App.css'

import { Route, Routes, useNavigate } from 'react-router-dom'
import Index from './components';
import PermisosIndex from './components/permisosIndex';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path='/permisos/:id' element={<PermisosIndex />} />
      </Routes>

      {/* Modal de permisos */}

    </>
  )
}

export default App
