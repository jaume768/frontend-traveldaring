import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ViewportProvider from './context/ViewportContext';
import Navbar from './components/Layout/Navbar';
import ScrollToTop from './components/Layout/ScrollToTop';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
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

const App = () => {
  return (
    <AuthProvider>
      <ViewportProvider>
        <Router>
          <ScrollToTop />
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
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
          </main>
        </Router>
      </ViewportProvider>
    </AuthProvider>
  );
};

export default App;
