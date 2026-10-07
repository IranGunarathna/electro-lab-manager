import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // Show a loading state while checking the user's authentication status
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there's no logged-in user, redirect them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, render the protected component (e.g., <Dashboard />)
  return children;
};

export default ProtectedRoute;