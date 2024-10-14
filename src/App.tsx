import React from 'react';
import Dashboard from './components/Dashboard';
import './App.css'; 

const App: React.FC = () => {
    return (
        <div className="App">
            <h1>Hotel Booking Dashboard</h1>
            <Dashboard />
        </div>
    );
};

export default App;
