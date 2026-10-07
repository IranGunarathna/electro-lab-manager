import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'; 
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The new public face of the website */}
        <Route path="/" element={<Landing />} />
        
        {/* The authentication portal */}
        <Route path="/login" element={<Login />} />
        
        {/* The protected internal system */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;