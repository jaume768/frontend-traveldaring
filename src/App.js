import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import TripDetail from './components/Trips/TripDetail';
import ProfilePage from './pages/ProfilePage';
import TripPage from './pages/TripPage';
import PrivateRoute from './components/Auth/PrivateRoute';
import './styles/App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <PrivateRoute path="/trips/create" component={() => <div>Crear Itinerario</div>} />
            <PrivateRoute path="/trips/:tripId" component={TripDetail} />
            <PrivateRoute path="/profile" component={ProfilePage} />
            <PrivateRoute path="/users/:friendId/trips" component={TripPage} />
            <Route path="*" component={() => <div>404 Not Found</div>} />
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;