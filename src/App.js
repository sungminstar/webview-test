import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    // 메시지를 수신하여 위치 정보를 업데이트하는 함수
    const handleMessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "LOCATION_UPDATE") {
          const { latitude, longitude } = message.data;
          setLocation({ latitude, longitude });
        }
      } catch (error) {
        console.error("Error parsing message data:", error);
      }
    };

    // 메시지 이벤트 리스너 추가
    window.addEventListener("message", handleMessage);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Location Information</h1>
        {location.latitude !== null && location.longitude !== null ? (
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
