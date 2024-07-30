import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

// View를 사용하여 웹 기반 React Native의 스타일을 설정
const App = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
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
    if (location.latitude && location.longitude) {
      // Kakao Maps API를 사용하여 지도를 생성
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
    <View style={styles.container}>
      <Text style={styles.header}>Location Information</Text>
      {location.latitude !== null && location.longitude !== null ? (
        <Text>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </Text>
      ) : (
        <Text>Location information not available</Text>
      )}
      <div id="map" style={{ width: "100%", height: "400px" }}></div>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default App;
