
import React from 'react';
import ParkingMap from './ParkingMap';
import AdminPanel from './AdminPanel';
import GPSAutoDetection from './GPSAutoDetection';

function App() {
  return (
    <div>
      <h1>EasyPark - Carte et Admin</h1>
      <GPSAutoDetection onDetected={(lat, lng) => console.log(lat, lng)} />
      <ParkingMap />
      <AdminPanel />
    </div>
  );
}

export default App;
