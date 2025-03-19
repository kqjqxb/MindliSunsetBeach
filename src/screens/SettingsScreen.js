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

const SettingsScreen = ({ setSelectedMindliSunsetBeachScreen, isNotificationEnabled, setNotificationEnabled, temperatureValue, setTemperatureValue, windSpeedValue, setWindSpeedValue }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [temperatureModalVisible, setTemperatureModalVisible] = useState(false);
  const [windSpeedModalVisible, setWindSpeedModalVisible] = useState(false);

  const toggleNotificationSwitch = () => {
    const newValue = !isNotificationEnabled;
    setNotificationEnabled(newValue);
    saveSettings('isNotificationEnabled', newValue);
  };

  const saveSettings = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const saveTempAndWindSettings = async (key, value) => {
    try {
      const valueToSave = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, valueToSave);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <SafeAreaView style={{
      alignSelf: 'center',
      width: dimensions.width,
      height: dimensions.height,
    }}>
      <View style={{
        width: dimensions.width * 0.9,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: dimensions.height * 0.01,
      }}>
        <TouchableOpacity
          onPress={() => {
            setSelectedMindliSunsetBeachScreen('Home');
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            borderRadius: dimensions.width * 0.1,
            padding: dimensions.width * 0.016,
          }}>
          <ArrowLeftIcon size={dimensions.height * 0.04} color='white' />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: fontSFProTextRegular,
            color: 'white',
            fontSize: dimensions.width * 0.077,
            marginBottom: dimensions.height * 0.023,
            textAlign: 'left',
            alignSelf: 'center',
            fontWeight: 400,
            paddingHorizontal: dimensions.width * 0.03,
          }}>
          Settings
        </Text>
      </View>

      <Image
        source={require('../assets/images/palmsSettingsImage.png')}
        style={{
          alignSelf: 'center',
          width: dimensions.width * 0.7,
          height: dimensions.height * 0.205,
        }}
        resizeMode='contain'
      />

      <TouchableOpacity
        onPress={() => {
          setTemperatureModalVisible(true);
        }}
        style={{
          width: dimensions.width * 0.9,
          height: dimensions.height * 0.07,
          borderRadius: dimensions.width * 0.1,
          paddingHorizontal: dimensions.width * 0.034,
          backgroundColor: '#2C2C2C',
          alignSelf: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontFamily: fontSFProTextRegular,
            color: 'white',
            fontSize: dimensions.width * 0.046,
            textAlign: 'left',
            fontWeight: 400,
          }}>
          Temperature
        </Text>

        <View style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
          <Text
            style={{
              fontFamily: fontSFProTextRegular,
              color: 'rgba(235, 235, 245, 0.6)',
              fontSize: dimensions.width * 0.046,
              textAlign: 'left',
              fontWeight: 400,
              marginRight: dimensions.width * 0.07,
            }}>
            {temperatureValue}
          </Text>

          <Image
            source={require('../assets/icons/chevronRightMindliIcon.png')}
            style={{
              width: dimensions.height * 0.019,
              height: dimensions.height * 0.019,
            }}
            resizeMode='contain'
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => {
          setWindSpeedModalVisible(true);
        }}
      style={{
        width: dimensions.width * 0.9,
        height: dimensions.height * 0.07,
        borderRadius: dimensions.width * 0.1,
        paddingHorizontal: dimensions.width * 0.034,
        backgroundColor: '#2C2C2C',
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: dimensions.height * 0.005,
      }}>
        <Text
          style={{
            fontFamily: fontSFProTextRegular,
            color: 'white',
            fontSize: dimensions.width * 0.046,
            textAlign: 'left',
            fontWeight: 400,
          }}>
          Wind Speed
        </Text>

        <View style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
          <Text
            style={{
              fontFamily: fontSFProTextRegular,
              color: 'rgba(235, 235, 245, 0.6)',
              fontSize: dimensions.width * 0.046,
              textAlign: 'left',
              fontWeight: 400,
              marginRight: dimensions.width * 0.05,
            }}>
            {windSpeedValue}
          </Text>

          <Image
            source={require('../assets/icons/chevronRightMindliIcon.png')}
            style={{
              width: dimensions.height * 0.019,
              height: dimensions.height * 0.019,
            }}
            resizeMode='contain'
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={{
        width: dimensions.width * 0.9,
        height: dimensions.height * 0.07,
        borderRadius: dimensions.width * 0.1,
        paddingHorizontal: dimensions.width * 0.034,
        backgroundColor: '#2C2C2C',
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: dimensions.height * 0.019,
      }}>
        <Text
          style={{
            fontFamily: fontSFProTextRegular,
            color: 'white',
            fontSize: dimensions.width * 0.046,
            textAlign: 'left',
            fontWeight: 400,
          }}>
          Notifications
        </Text>

        <Switch
          trackColor={{ false: '#948ea0', true: '#AC9958' }}
          thumbColor={'#FFF'}
          ios_backgroundColor="#3E3E3E"
          onValueChange={toggleNotificationSwitch}
          value={isNotificationEnabled}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          Linking.openURL('');
        }}
        style={{
          width: dimensions.width * 0.9,
          height: dimensions.height * 0.07,
          borderRadius: dimensions.width * 0.1,
          paddingLeft: dimensions.width * 0.034,
          paddingRight: dimensions.width * 0.014,
          backgroundColor: '#2C2C2C',
          alignSelf: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: dimensions.height * 0.005,
        }}>
        <Text
          style={{
            fontFamily: fontSFProTextRegular,
            color: 'white',
            fontSize: dimensions.width * 0.046,
            textAlign: 'left',
            fontWeight: 400,
          }}>
          Terms of Use
        </Text>

        <View style={{
          backgroundColor: 'white',
          width: dimensions.height * 0.055,
          height: dimensions.height * 0.055,
          borderRadius: dimensions.width * 0.1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <ChevronRightIcon size={dimensions.height * 0.028} color='black' />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={temperatureModalVisible}
        onRequestClose={() => {
          setTemperatureModalVisible(!temperatureModalVisible);
        }}
      >
        <View style={{
          backgroundColor: 'rgba(7, 7, 7, 0.55)',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <View style={{
            backgroundColor: '#2C2C2C',
            borderRadius: dimensions.width * 0.061,
            paddingTop: dimensions.width * 0.073,
            width: dimensions.width * 0.9,
            alignItems: 'center',
            paddingHorizontal: dimensions.width * 0.05,
          }}>
            <TouchableOpacity style={{
              position: 'absolute',
              top: dimensions.height * 0.005,
              right: dimensions.width * 0.014,
              zIndex: 10,
            }}
              onPress={() => {
                setTemperatureModalVisible(false);
              }}
            >
              <Image
                source={require('../assets/images/closeModalImage.png')}
                style={{
                  width: dimensions.width * 0.1,
                  height: dimensions.width * 0.1,
                }}
              />
            </TouchableOpacity>
            <Text style={{
              fontSize: dimensions.width * 0.05,
              color: 'white',
              textAlign: 'left',
              fontFamily: fontSFProTextRegular,
              marginBottom: dimensions.height * 0.016,
              fontWeight: 400,
              alignSelf: 'flex-start',
              maxWidth: dimensions.width * 0.8,
            }}>
              Set the measurement units for greater convenience!
            </Text>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: dimensions.width * 0.73,
              marginTop: dimensions.height * 0.016,
              alignSelf: 'center',
              marginBottom: dimensions.height * 0.05,
            }}>
              {['°C', '°F'].map((item, index) => (
                <View key={index} style={{
                  width: dimensions.width * 0.35,
                  height: dimensions.height * 0.134,
                  borderRadius: dimensions.width * 0.025,
                  padding: dimensions.width * 0.021,
                  backgroundColor: '#595959',
                  justifyContent: 'space-between'
                }}>
                  <Text style={{
                    fontSize: dimensions.width * 0.05,
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: fontSFProTextRegular,
                    fontWeight: 400,
                    alignSelf: 'center',
                    marginTop: dimensions.height * 0.016,
                  }}>
                    {item}
                  </Text>

                  <TouchableOpacity
                    disabled={temperatureValue === item}
                    onPress={() => {
                      setTemperatureValue(item);
                      saveTempAndWindSettings('temperatureValue', item);
                    }}
                    style={{
                      width: dimensions.width * 0.32,
                      backgroundColor: temperatureValue !== item ? '#AC9958' : '#787878',
                      borderRadius: dimensions.width * 0.1,
                      height: dimensions.height * 0.05,
                      alignSelf: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{
                      fontSize: dimensions.width * 0.05,
                      color: 'white',
                      textAlign: 'center',
                      fontFamily: fontSFProTextRegular,
                      fontWeight: 400,
                      alignSelf: 'center',
                    }}>
                      Choose
                    </Text>
                  </TouchableOpacity>

                </View>
              ))}

            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={windSpeedModalVisible}
        onRequestClose={() => {
          setWindSpeedModalVisible(!windSpeedModalVisible);
        }}
      >
        <View style={{
          backgroundColor: 'rgba(7, 7, 7, 0.55)',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <View style={{
            backgroundColor: '#2C2C2C',
            borderRadius: dimensions.width * 0.061,
            paddingTop: dimensions.width * 0.073,
            width: dimensions.width * 0.9,
            alignItems: 'center',
            paddingHorizontal: dimensions.width * 0.05,
          }}>
            <TouchableOpacity style={{
              position: 'absolute',
              top: dimensions.height * 0.005,
              right: dimensions.width * 0.014,
              zIndex: 10,
            }}
              onPress={() => {
                setWindSpeedModalVisible(false);
              }}
            >
              <Image
                source={require('../assets/images/closeModalImage.png')}
                style={{
                  width: dimensions.width * 0.1,
                  height: dimensions.width * 0.1,
                }}
              />
            </TouchableOpacity>
            <Text style={{
              fontSize: dimensions.width * 0.05,
              color: 'white',
              textAlign: 'left',
              fontFamily: fontSFProTextRegular,
              marginBottom: dimensions.height * 0.016,
              fontWeight: 400,
              alignSelf: 'flex-start',
              maxWidth: dimensions.width * 0.8,
            }}>
              Set the measurement units for greater convenience!
            </Text>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: dimensions.width * 0.73,
              marginTop: dimensions.height * 0.016,
              alignSelf: 'center',
              marginBottom: dimensions.height * 0.05,
            }}>
              {['m/s', 'km/h'].map((item, index) => (
                <View key={index} style={{
                  width: dimensions.width * 0.35,
                  height: dimensions.height * 0.134,
                  borderRadius: dimensions.width * 0.025,
                  padding: dimensions.width * 0.021,
                  backgroundColor: '#595959',
                  justifyContent: 'space-between'
                }}>
                  <Text style={{
                    fontSize: dimensions.width * 0.05,
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: fontSFProTextRegular,
                    fontWeight: 400,
                    alignSelf: 'center',
                    marginTop: dimensions.height * 0.016,
                  }}>
                    {item}
                  </Text>

                  <TouchableOpacity
                    disabled={windSpeedValue === item}
                    onPress={() => {
                      setWindSpeedValue(item);
                      saveTempAndWindSettings('windSpeedValue', item);
                    }}
                    style={{
                      width: dimensions.width * 0.32,
                      backgroundColor: windSpeedValue !== item ? '#AC9958' : '#787878',
                      borderRadius: dimensions.width * 0.1,
                      height: dimensions.height * 0.05,
                      alignSelf: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{
                      fontSize: dimensions.width * 0.05,
                      color: 'white',
                      textAlign: 'center',
                      fontFamily: fontSFProTextRegular,
                      fontWeight: 400,
                      alignSelf: 'center',
                    }}>
                      Choose
                    </Text>
                  </TouchableOpacity>

                </View>
              ))}

            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingsScreen;
