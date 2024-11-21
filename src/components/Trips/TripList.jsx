import React from 'react';
import { Link } from 'react-router-dom';
import './css/TripList.css';

const TripList = ({ trips }) => {
    return (
        <div className="trip-list">
            {trips.map((trip) => (
                <div key={trip._id} className="trip-card">
                    <h3>{trip.title}</h3>
                    <p>{trip.description}</p>
                    <Link to={`/trips/${trip._id}`} className="btn-secondary">
                        Ver Itinerario
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default TripList;