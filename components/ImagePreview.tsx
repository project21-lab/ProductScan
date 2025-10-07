import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface ImagePreviewProps {
  imageUri: string;
  onRetake: () => void;
  onProcess: () => void;
  isProcessing?: boolean;
}

export function ImagePreview({ 
  imageUri, 
  onRetake, 
  onProcess, 
  isProcessing = false 
}: ImagePreviewProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={[styles.header, { paddingTop: insets.top }]}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <MaterialIcons name="preview" size={28} color="white" />
            <Text style={styles.headerTitle}>Preview</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            contentFit="contain"
            transition={200}
          />
          <View style={styles.imageOverlay}>
            <View style={styles.imageBorder} />
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Ionicons name="scan" size={24} color="#2196F3" />
            <Text style={styles.infoTitle}>Ready for Analysis</Text>
            <Text style={styles.infoText}>
              Your product image is captured and ready for AI-powered analysis.
              Tap "Process" to get detailed information about ingredients, chemicals, and nutritional facts.
            </Text>
          </View>
        </View>
      </View>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.1)']}
        style={[styles.controls, { paddingBottom: insets.bottom }]}
      >
        <View style={styles.controlsContent}>
          <TouchableOpacity
            style={[styles.button, styles.retakeButton]}
            onPress={onRetake}
            disabled={isProcessing}
          >
            <MaterialIcons name="camera-alt" size={24} color="#666" />
            <Text style={styles.retakeButtonText}>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.processButton,
              isProcessing && styles.processButtonDisabled
            ]}
            onPress={onProcess}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <MaterialIcons name="hourglass-empty" size={24} color="white" />
                <Text style={styles.processButtonText}>Analyzing...</Text>
              </>
            ) : (
              <>
                <MaterialIcons name="auto-awesome" size={24} color="white" />
                <Text style={styles.processButtonText}>Process</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  imageContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    borderRadius: 12,
  },
  imageBorder: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  infoSection: {
    marginTop: 20,
    flex: 1,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  controls: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  controlsContent: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  retakeButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  processButton: {
    backgroundColor: '#2196F3',
  },
  processButtonDisabled: {
    opacity: 0.7,
  },
  processButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});