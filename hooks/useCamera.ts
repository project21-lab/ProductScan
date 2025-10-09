import { useState, useRef, useCallback, useEffect } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Platform, Alert } from 'react-native';
import { CapturedImage } from '../types';

export function useCamera() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const showAlert = useCallback((title: string, message: string) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  }, []);

  const takePicture = useCallback(async (): Promise<string | null> => {
    if (!cameraRef.current || isCapturing || !permission?.granted || !isCameraReady) {
      if (!isCameraReady) {
        showAlert('Camera Not Ready', 'Please wait for the camera to initialize.');
      }
      return null;
    }

    try {
      setIsCapturing(true);
      
      // Add a small delay to ensure camera is fully ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });

      if (photo && photo.uri) {
        const imageData: CapturedImage = {
          uri: photo.uri,
          timestamp: Date.now(),
        };
        setCapturedImage(imageData);
        return photo.uri;
      }
      
      showAlert('Camera Error', 'Failed to capture image. Please try again.');
      return null;
    } catch (error) {
      console.error('Error taking picture:', error);
      showAlert('Camera Error', 'Failed to take picture. Please try again.');
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, permission?.granted, isCameraReady, showAlert]);

  const selectFromGallery = useCallback(async (): Promise<string | null> => {
    try {
      // Request permission first
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        showAlert('Permission Required', 'Please grant photo library access to select images.');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const selectedImage = result.assets[0];
        const imageData: CapturedImage = {
          uri: selectedImage.uri,
          timestamp: Date.now(),
        };
        setCapturedImage(imageData);
        return selectedImage.uri;
      }
      return null;
    } catch (error) {
      console.error('Error selecting from gallery:', error);
      showAlert('Gallery Error', 'Failed to select image from gallery. Please try again.');
      return null;
    }
  }, [showAlert]);

  const retakePicture = useCallback((): void => {
    setCapturedImage(null);
  }, []);

  const toggleCameraFacing = useCallback((): void => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }, []);

  const onCameraReady = useCallback(() => {
    setIsCameraReady(true);
  }, []);

  const onCameraError = useCallback((error: any) => {
    console.error('Camera error:', error);
    setIsCameraReady(false);
    showAlert('Camera Error', 'Camera initialization failed. Please try restarting the app.');
  }, [showAlert]);

  return {
    permission,
    requestPermission,
    facing,
    capturedImage,
    isCapturing,
    isCameraReady,
    cameraRef,
    takePicture,
    selectFromGallery,
    retakePicture,
    toggleCameraFacing,
    onCameraReady,
    onCameraError,
  };
}