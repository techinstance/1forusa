import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  StatusBar,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ImageBackground,
  TextInput,
  Pressable,
} from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

const { width, height } = Dimensions.get('window');

type ContentItem = {
  data: string;
  img: string;
};

type Props = {
  goToNextComponent?: () => void;
  navigation: NativeStackNavigationProp<RootStackParamList, 'SocialPost'>;
};

const SliderComponent = ({ goToNextComponent, navigation }: Props) => {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userReflection, setUserReflection] = useState('');
  const [postPublicly, setPostPublicly] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const mockData: ContentItem[] = [
      { data: 'Budgeting', img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba' },
      { data: 'Debt', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e' },
      { data: 'Spending', img: 'https://images.unsplash.com/photo-1533055640609-24b498cdfd24' },
      { data: 'Discipline', img: 'https://images.unsplash.com/photo-1610878180933-d4351f6e1d03' },
      { data: 'Investing', img: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf' },
      { data: 'Growth', img: 'https://images.unsplash.com/photo-1549887534-274234f3c48b' },
      { data: 'Reflection', img: '' },
    ];
    setContents(mockData);
  }, []);

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const layoutWidth = e.nativeEvent.layoutMeasurement.width;
    const contentWidth = e.nativeEvent.contentSize.width;

    const index = Math.round(offsetX / width);
    setCurrentIndex(index);

    const isLastSlide = index === contents.length - 1;
    const isAtEnd = offsetX + layoutWidth >= contentWidth - 1;

    if (isLastSlide && isAtEnd && userReflection.trim().length > 0) {
      goToNextComponent?.();
    }
  };

  const renderItem = ({ item, index }: { item: ContentItem; index: number }) => {
    const isLast = index === contents.length - 1;

    if (isLast) {
      return (
        <View style={[styles.fullscreenImage, styles.feedbackSlide]}>
          <Text style={styles.feedbackTitle}>What are your next steps?</Text>
          <Text style={styles.feedbackSubtitle}>
            Write down what matters to you after going through these.
          </Text>

          <TextInput
            value={userReflection}
            onChangeText={setUserReflection}
            placeholder="E.g. Start saving weekly, set a budget..."
            placeholderTextColor="#777"
            multiline
            numberOfLines={5}
            style={styles.feedbackInput}
          />

          {userReflection.trim().length > 0 && (
            <>
              <Pressable
                style={styles.checkboxRow}
                onPress={() => setPostPublicly(!postPublicly)}
              >
                <View style={[styles.checkbox, postPublicly && styles.checkedBox]} />
                <Text style={styles.checkboxLabel}>I want to post this reflection</Text>
              </Pressable>

              {postPublicly && (
                <Text
                  style={styles.postBtn}
                  onPress={() => {
                    navigation.navigate('SocialPost', {
                      reflection: userReflection,
                    });
                  }}
                >
                  Post
                </Text>
              )}

              <Text style={styles.continueBtn} onPress={goToNextComponent}>
                Continue →
              </Text>
            </>
          )}
        </View>
      );
    }

    return (
      <ImageBackground
        source={{ uri: item.img }}
        style={styles.fullscreenImage}
        resizeMode="cover"
      >
        <View style={styles.topLeftLabel}>
          <Text style={styles.labelText}>{item.data}</Text>
        </View>
      </ImageBackground>
    );
  };

  if (contents.length === 0) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff9900" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden />
      <View style={styles.cardContainer}>
        <Animated.FlatList
          data={contents}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onMomentumScrollEnd={onMomentumScrollEnd}
          scrollEventThrottle={16}
          snapToInterval={width}
          decelerationRate="fast"
          bounces={false}
        />

        <View style={styles.pagination}>
          {contents.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, currentIndex === i && styles.activeDot]}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  cardContainer: { width, height },
  fullscreenImage: { width, height, justifyContent: 'flex-start' },
  topLeftLabel: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  labelText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  pagination: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: { backgroundColor: '#007bff', width: 10, height: 10 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  feedbackSlide: {
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  feedbackTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  feedbackSubtitle: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  feedbackInput: {
    width: '85%',
    height: 140,
    backgroundColor: '#111',
    color: '#fff',
    borderRadius: 12,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#999',
    marginRight: 10,
    borderRadius: 4,
  },
  checkedBox: {
    backgroundColor: '#00cc88',
    borderColor: '#00cc88',
  },
  checkboxLabel: {
    color: '#ccc',
    fontSize: 15,
  },
  postBtn: {
    marginTop: 16,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  continueBtn: {
    marginTop: 24,
    color: '#00ffcc',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SliderComponent;