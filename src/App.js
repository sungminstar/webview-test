import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    // 메시지를 수신하여 위치 정보를 업데이트하는 함수
    const handleMessage = (event) => {
      // 데이터 확인을 위한 콘솔 로그
      console.log("Received message:", event.data);

      try {
        // event.data가 문자열일 경우, 파싱하여 객체로 변환
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        // JSON 데이터가 존재하고 'type'이 'LOCATION_UPDATE'일 경우 처리
        if (data && data.type === "LOCATION_UPDATE") {
          const { latitude, longitude } = data.data;
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
