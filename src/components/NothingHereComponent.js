import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  Linking,
  Switch,
  Modal,
} from 'react-native';
import { ArrowLeftIcon, ChevronRightIcon, XCircleIcon } from 'react-native-heroicons/solid';

const fontSFProDisplayRegular = 'SF-Pro-Display-Regular';
const fontSFProTextRegular = 'SFProText-Regular';
const fontSFProTextHeavy = 'SFProText-Heavy';

const NothingHereComponent = ({ }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));



  return (
    <View style={{
      width: dimensions.width * 0.9,
      alignSelf: 'center',
      backgroundColor: '#2C2C2C',
      borderRadius: dimensions.width * 0.5,
      paddingVertical: dimensions.height * 0.016,
      marginTop: dimensions.height * 0.01,
    }}>
      <Image
        source={require('../assets/images/palmsSettingsImage.png')}
        style={{
          alignSelf: 'center',
          width: dimensions.width * 0.19,
          height: dimensions.height * 0.088,
        }}
        resizeMode='contain'
      />
      <Text
        style={{
          fontFamily: fontSFProTextRegular,
          color: 'white',
          fontSize: dimensions.width * 0.04,
          textAlign: 'center',
          alignSelf: 'center',
          marginTop: dimensions.height * 0.005,
          fontWeight: 400,
        }}>
        There's nothing here yet..
      </Text>
    </View>
  );
};

export default NothingHereComponent;
