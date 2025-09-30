import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomeScreen from './components/HomeScreen'
import ApprovalsBuilderV1 from './components/ApprovalsBuilderV1'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/approvals/v1" element={<ApprovalsBuilderV1 />} />
      </Routes>
    </Router>
  )
}

export default App