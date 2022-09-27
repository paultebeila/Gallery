import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Camera } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

export default function App() {

  let cameraRef = useRef();
  const [hasCamPermission, setHasCamPermission] = useState();
  const [hasMedLabPermission, setHasMedLabPermission] = useState();

  useEffect(() => {
    (async() =>{
      const camPerm = await Camera.requestCameraPermissionsAsync();
      const medLabPerm = await MediaLibrary.requestPermissionsAsync();
      setHasCamPermission(camPerm.status === "Granted");
      setHasMedLabPermission(medLabPerm.status === "Granted");
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
