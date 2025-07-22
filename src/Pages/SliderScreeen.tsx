import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, FlatList, SafeAreaView, StyleSheet,
  Image, TouchableOpacity, Dimensions, ScrollView
} from 'react-native';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

// JSON Import
import data from '../components/assets/data/sliderAssets.json';

type AssetType = {
  id: string;
  title: string;
  description: string;
  assetType: string;
  assetUrl: string;
  joyText?: string;
  feedbackType?: 'button' | 'swipe' | 'form';
};

const SliderScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { assets } = data;

  const handleNext = () => {
    if (currentIndex < assets.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    }
  };

  const renderAsset = (item: AssetType) => {
    switch (item.assetType) {
      case 'image':
      case 'text':
      case 'video':
      case 'presentation':
        return (
          <Image
            source={{ uri: item.assetUrl }}
            style={styles.assetImage}
            resizeMode="cover"
          />
        );
      case 'lottie':
        return (
          <LottieView
            source={{ uri: item.assetUrl }}
            autoPlay
            loop
            style={styles.assetLottie}
          />
        );
      default:
        return <Text>No Preview Available</Text>;
    }
  };

  const renderItem = ({ item }: { item: AssetType }) => (
    <View style={styles.slide}>
      {/* Part2: Title & Description */}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>

      {/* Part3: Asset */}
      <View style={styles.assetBox}>{renderAsset(item)}</View>

      {/* Joy Text (Optional) */}
      {item.joyText && <Text style={styles.joyText}>💡 {item.joyText}</Text>}

      {/* Part4: Feedback */}
      {item.feedbackType === 'button' && (
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>I did this ✅</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* FlatList - Main Slider */}
      <FlatList
        data={assets}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        renderItem={renderItem}
        ref={flatListRef}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {/* Dot Pagination (Part of Feedback Loop) */}
      <View style={styles.dotsContainer}>
        {assets.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default SliderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffef8',
  },
  slide: {
    width,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 26,
    color: '#FF6B00',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 10,
  },
  assetBox: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  assetImage: {
    width: width - 40,
    height: 220,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  assetLottie: {
    width: 220,
    height: 220,
  },
  joyText: {
    fontSize: 15,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF6B00',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 28,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: 'transparent',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
    backgroundColor: '#ccc',
  },
  activeDot: {
    backgroundColor: '#FF6B00',
    width: 12,
    height: 12,
  }
});
