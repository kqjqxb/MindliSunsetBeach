import React, { useEffect, useRef, useState } from 'react';
import { View, ImageBackground, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoadingMindilSunsetBeachScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const navigation = useNavigation();
  const [percentage, setPercentage] = useState(0);

  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, [animatedOpacity]);

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Home');
    }, [3000]);
  }, [percentage]);

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#141414',
    }}>
      <Animated.Image
        source={require('../assets/images/mindliLoadingImage.png')}
        resizeMode='contain'
        style={{
          width: dimensions.width * 0.7,
          height: dimensions.width * 0.7,
          opacity: animatedOpacity,
        }}
      />
    </View>
  );
};

export default LoadingMindilSunsetBeachScreen;