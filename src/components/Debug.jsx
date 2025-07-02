import React from 'react';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';

export default function Debug() {
  const { patients, incidents } = useAppData();
  const { user } = useAuth();

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'black', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h3>Debug Info:</h3>
      <p><strong>User:</strong> {JSON.stringify(user, null, 2)}</p>
      <p><strong>Patients:</strong> {JSON.stringify(patients, null, 2)}</p>
      <p><strong>Incidents:</strong> {JSON.stringify(incidents, null, 2)}</p>
    </div>
  );
}
