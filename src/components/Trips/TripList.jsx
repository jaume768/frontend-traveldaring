import React from 'react';
import { Link } from 'react-router-dom';
import './css/TripList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faLock, faArrowRight, faPlane, faCalendarDays } from '@fortawesome/free-solid-svg-icons';

const formatDates = (travelDates) => {
    if (!travelDates?.startDate || !travelDates?.endDate) return null;
    const options = { day: 'numeric', month: 'short' };
    const start = new Date(travelDates.startDate).toLocaleDateString('es-ES', options);
    const end = new Date(travelDates.endDate).toLocaleDateString('es-ES', options);
    return `${start} - ${end}`;
};

const TripList = ({ trips }) => {
    return (
        <div className="trip-list">
            {trips.map((trip, index) => {
                const image = trip.link || trip.imageUrl;
                const dates = formatDates(trip.travelDates);
                const country = trip.destinationPreferences?.countryName;

                return (
                    <Link
                        key={trip._id}
                        to={`/trips/${trip._id}`}
                        className="trip-card"
                        style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
                    >
                        <div className="trip-image-container">
                            {image ? (
                                <img
                                    src={image}
                                    alt={`Imagen del itinerario ${trip.title}`}
                                    className="trip-image"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="no-image-placeholder" aria-hidden="true">
                                    <FontAwesomeIcon icon={faPlane} />
                                </div>
                            )}
                            <span className={`trip-public ${trip.public ? 'public' : 'private'}`}>
                                <FontAwesomeIcon icon={trip.public ? faGlobe : faLock} />
                                {trip.public ? 'Público' : 'Privado'}
                            </span>
                            {country && <span className="trip-country">{country}</span>}
                        </div>

                        <div className="trip-card-body">
                            <h3>{trip.title}</h3>
                            <p>{trip.description}</p>
                            <div className="trip-card-footer">
                                {dates ? (
                                    <span className="trip-dates">
                                        <FontAwesomeIcon icon={faCalendarDays} /> {dates}
                                    </span>
                                ) : <span />}
                                <span className="trip-card-link">
                                    Ver Itinerario <FontAwesomeIcon icon={faArrowRight} />
                                </span>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default TripList;
