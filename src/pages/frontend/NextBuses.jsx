import React, { useState, useEffect } from 'react';

const NextBuses = ({ stopId }) => {
  const [departures, setDepartures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartures = async () => {
      try {
        // CALL YOUR PYTHON BACKEND ENDPOINT
        const response = await fetch(`/api/departures/${stopId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const stopData = await response.json();
        
        // Assuming your Python backend sends back a 'stoptimesWithoutPatterns' array
        setDepartures(stopData.stoptimesWithoutPatterns || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartures();
    // Refresh data every 60 seconds (common for real-time data)
    const intervalId = setInterval(fetchDepartures, 60000); 

    // Cleanup function
    return () => clearInterval(intervalId);
  }, [stopId]);

  if (loading) return <div>Loading real-time data...</div>;
  if (error) return <div>Error fetching departures: {error}</div>;

  return (
    <div>
      <h2>Next Departures for Stop {stopId}</h2>
      {departures.length === 0 ? (
        <p>No upcoming departures found.</p>
      ) : (
        <ul>
          {departures.map((time, index) => {
            // Logic to calculate minutes until departure
            const scheduledTime = time.scheduledDeparture; // in seconds since midnight
            const realtimeTime = time.realtimeDeparture; // in seconds since midnight
            // ... conversion and display logic here ...

            return (
              <li key={index}>
                **Line {time.trip.route.shortName}** to {time.headsign} - 
                {/* Simple display example */}
                *Scheduled: {new Date(scheduledTime * 1000).toISOString().substr(11, 8)}* {time.realtime ? ' (REAL-TIME)' : ''}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default NextBuses;