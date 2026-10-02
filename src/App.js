import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ViewportProvider from './context/ViewportContext'; // Importa el ViewportProvider
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SuggestedPage from './pages/SuggestedPage';
import Dashboard from './pages/Dashboard';
import CreateTrip from './components/Trips/CreateTrip';
import TripDetail from './components/Trips/TripDetail';
import ProfilePage from './pages/ProfilePage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import TripPage from './pages/TripPage';
import PrivateRoute from './components/Auth/PrivateRoute';
import NotFoundPage from './pages/NotFoundPage';
import SearchResultsPage from './pages/SearchResultsPage';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <ViewportProvider> {/* Envuelve con ViewportProvider */}
        <Router>
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/suggested" element={<SuggestedPage />} />
              <Route path="/verify" element={<VerifyEmailPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/trips/create"
                element={
                  <PrivateRoute>
                    <CreateTrip />
                  </PrivateRoute>
                }
              />
              <Route path="/trips/:tripId" element={<TripDetail />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/users/:userId/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/users/:friendId/trips"
                element={
                  <PrivateRoute>
                    <TripPage />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </Router>
      </ViewportProvider>
    </AuthProvider>
  );
};

export default App;