import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomeScreen from './components/HomeScreen'
import ApprovalsBuilderV1 from './components/ApprovalsBuilderV1'
import ApprovalsBuilderV2 from './components/ApprovalsBuilderV2'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/approvals/v1" element={<ApprovalsBuilderV1 />} />
        <Route path="/approvals/v2" element={<ApprovalsBuilderV2 />} />
      </Routes>
    </Router>
  )
}

export default App