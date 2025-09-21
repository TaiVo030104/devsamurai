import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthPage } from './components/AuthPage'
import { Dashboard } from './components/Dashboard'
import { PrivateRoute } from './components/PrivateRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    </Routes>
  )
}

export default App
