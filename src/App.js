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
        // event.data가 JSON 문자열일 경우, 파싱하여 객체로 변환
        const data = JSON.parse(event.data);

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

  useEffect(() => {
    if (location.latitude !== null && location.longitude !== null) {
      // Kakao Maps API를 사용하여 지도를 생성합니다
      const { kakao } = window;
      const mapContainer = document.getElementById("map");
      const mapOption = {
        center: new kakao.maps.LatLng(location.latitude, location.longitude),
        level: 3,
      };

      const map = new kakao.maps.Map(mapContainer, mapOption);

      const markerPosition = new kakao.maps.LatLng(
        location.latitude,
        location.longitude
      );
      const marker = new kakao.maps.Marker({
        position: markerPosition,
      });

      marker.setMap(map);
    }
  }, [location]);

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
        <div id="map" style={{ width: "100%", height: "500px" }}></div>
      </header>
    </div>
  );
}

export default App;
