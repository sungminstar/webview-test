import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // 위치 정보를 수신하여 상태를 업데이트하는 함수
    const handleMessage = (event) => {
      console.log("Received message:", event.data);

      try {
        const data = JSON.parse(event.data);

        if (data && data.type === "LOCATION_UPDATE") {
          const { latitude, longitude } = data.data;
          setLocation({ latitude, longitude });
        }
      } catch (error) {
        console.error("Error parsing message data:", error);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (mapContainerRef.current && window.kakao) {
      // Kakao Maps API가 로드된 후 실행될 코드
      const { kakao } = window;

      // 지도 생성 시 필요한 기본 옵션 설정
      const options = {
        center: new kakao.maps.LatLng(37.495697921511, 126.77484741503), // 기본 중심좌표
        level: 3, // 확대/축소 레벨
      };

      mapRef.current = new kakao.maps.Map(mapContainerRef.current, options);
    }
  }, []);

  useEffect(() => {
    if (
      mapRef.current &&
      location.latitude !== null &&
      location.longitude !== null
    ) {
      const { kakao } = window;

      // 기존 마커가 있으면 제거
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      // 새로운 마커 생성
      const markerPosition = new kakao.maps.LatLng(
        location.latitude,
        location.longitude
      );
      const marker = new kakao.maps.Marker({
        position: markerPosition,
      });

      marker.setMap(mapRef.current);
      markerRef.current = marker;

      // 지도의 중심좌표를 현재 위치로 변경
      mapRef.current.setCenter(markerPosition);
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
        <div
          ref={mapContainerRef}
          style={{ width: "100%", height: "500px" }}
        ></div>
      </header>
    </div>
  );
}

export default App;
