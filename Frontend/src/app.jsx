import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdvancedSearch from './pages/Hostels/AdvancedSearch';
import Wishlist from './pages/Wishlist/Wishlist';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <RoleBasedDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/search" element={<ProtectedRoute><AdvancedSearch /></ProtectedRoute>} />
          <Route path="/hostels/:id" element={<ProtectedRoute><HostelDetail /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;