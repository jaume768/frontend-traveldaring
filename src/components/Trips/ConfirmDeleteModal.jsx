import React from 'react';
import './css/Modal.css';
import './css/ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({ onClose, onConfirm }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Confirmar Eliminación</h3>
                <p>¿Estás seguro de que deseas eliminar este itinerario? Esta acción no se puede deshacer.</p>
                <div className="modal-actions">
                    <button className="btn btn-delete" onClick={onConfirm}>Eliminar</button>
                    <button className="btn btn-cancel" onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;