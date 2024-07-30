import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    // URL 쿼리 매개변수에서 위치 정보를 가져오는 함수
    const getQueryParam = (param) => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    };

    // 위치 정보를 상태에 설정
    const latitude = getQueryParam("lat");
    const longitude = getQueryParam("lng");

    if (latitude && longitude) {
      setLocation({ latitude, longitude });
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Location Information</h1>
        {location.latitude && location.longitude ? (
          <p>
            Latitude: {location.latitude}, Longitude: {location.longitude}
          </p>
        ) : (
          <p>Location information not available</p>
        )}
      </header>
    </div>
  );
}

export default App;
