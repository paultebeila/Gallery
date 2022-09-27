import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, SafeAreaView, Image } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Camera } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

export default function App() {

  let cameraRef = useRef();
  const [hasCamPermission, setHasCamPermission] = useState();
  const [hasMedLabPermission, setHasMedLabPermission] = useState();
  const [photo, setPhoto] = useState();

  /*useRef(() => {
    (async() =>{
      const camPerm = await Camera.requestCameraPermissionsAsync();
      setHasCamPermission(camPerm.status === "Granted");
      });
    },[]);*/

  useEffect(() => {
    (async () => {
      const camPerm = await Camera.requestCameraPermissionsAsync();
      const medLabPerm = await MediaLibrary.requestPermissionsAsync();
      setHasCamPermission(camPerm.status==="granted")
      setHasCamPermission(medLabPerm.status==="granted")
    })();
  }, []);

  if (hasCamPermission === undefined) {
    return <Text> Requesting permission...</Text>
  } else if(!hasCamPermission) {
    return <Text style={{marginTop: '25%'}}>Permission for the camera is not granted. Please allow access to camera in settings.</Text>
  }
  let takePhoto = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };
    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto)
  }

  if(photo) {
    let sharePic = () => {
      shareAsync(photo.uri).then(()=>{
        setPhoto(undefined);
      });
    };
    let savePhoto = () => {
      // MediaLibrary.saveToLibraryAsync(photo.uri).then(()=>{
      //   setPhoto(undefined);
      // });
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      })
    };
    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{uri: "data:image/jpg;base64,"+ photo.base64}} />
        <Button title="Share" onPress={sharePic} />
        {/* {hasMedLabPermission ? <Button title="Save" onPress={savePhoto} /> : undefined} */}
        <Button title='Save' onPress={savePhoto} />
        <Button title="Discard" onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    )
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <Button title='Take photo' onPress={takePhoto} />
      </View>
      <StatusBar style="auto" />
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1,
  },
});
