import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  Switch,
  StyleSheet,
} from 'react-native';

const fontSFProTextRegular = 'SFProText-Regular';

const TidesAndSunsetsScreen = ({ setSelectedMindliSunsetBeachScreen, isNotificationEnabled, setNotificationEnabled, }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const styles = createMindliStyles(dimensions);
  const toggleNotificationSwitch = () => {
    const newValue = !isNotificationEnabled;
    setNotificationEnabled(newValue);
    saveNotificationsSettings('isNotificationEnabled', newValue);
  };

  const saveNotificationsSettings = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <SafeAreaView style={{
      flex: 1,
      width: dimensions.width,
      height: dimensions.height,
    }}>
      <View style={{
        width: dimensions.width * 0.9,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: dimensions.height * 0.01,
      }}>
        <Text
          style={{
            fontFamily: fontSFProTextRegular,
            color: 'white',
            fontSize: dimensions.width * 0.07,
            textAlign: 'left',
            alignSelf: 'flex-start',
            fontWeight: 400,
            maxWidth: dimensions.width * 0.75,
          }}>
          Information about tides and sunsets
        </Text>
        <TouchableOpacity
          onPress={() => setSelectedMindliSunsetBeachScreen('Settings')}
          style={{
            alignSelf: 'flex-start',
          }}>
          <Image
            source={require('../assets/icons/goldMindliSettingsIcon.png')}
            style={{
              width: dimensions.width * 0.07,
              height: dimensions.width * 0.07,
            }}
            resizeMode='contain'
          />
        </TouchableOpacity>
      </View>

      <Text
        style={{
          fontFamily: fontSFProTextRegular,
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: dimensions.width * 0.05,
          textAlign: 'left',
          alignSelf: 'flex-start',
          fontWeight: 400,
          maxWidth: dimensions.width * 0.75,
          paddingHorizontal: dimensions.width * 0.05,
          marginTop: dimensions.height * 0.014,
        }}>
        Tide times
      </Text>

      <Text
        style={{
          fontFamily: fontSFProTextRegular,
          color: 'white',
          fontSize: dimensions.width * 0.043,
          marginTop: dimensions.height * 0.01,
          textAlign: 'left',
          alignSelf: 'flex-start',
          paddingHorizontal: dimensions.width * 0.05,
          fontWeight: 400,
          maxWidth: dimensions.width * 0.75,
        }}>
        Tide
      </Text>

      <View style={{
        alignItems: 'center',
        marginTop: dimensions.height * 0.01,
        justifyContent: 'flex-start',
        width: dimensions.width * 0.9,
        flexDirection: 'row',
        alignSelf: 'center',
      }}>
        <View style={{
          width: dimensions.height * 0.057,
          height: dimensions.height * 0.057,
          alignSelf: 'flex-start',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: dimensions.width * 0.016,
        }}>
          <Text
            style={{
              fontFamily: fontSFProTextRegular,
              color: 'white',
              fontSize: dimensions.height * 0.023,
              textAlign: 'center',
              fontWeight: 400,
            }}>
            10
          </Text>
        </View>
        <Text
          style={{
            fontFamily: fontSFProTextRegular,
            fontSize: dimensions.height * 0.035,
            fontWeight: 700,
            paddingHorizontal: dimensions.width * 0.007,
            textAlign: 'center',
            color: '#595959',
          }}>
          :
        </Text>

        <View style={{
          alignSelf: 'flex-start',
          width: dimensions.height * 0.057,
          height: dimensions.height * 0.057,
          borderRadius: dimensions.width * 0.016,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }}>
          <Text
            style={{
              fontFamily: fontSFProTextRegular,
              color: 'white',
              fontSize: dimensions.height * 0.023,
              textAlign: 'center',
              fontWeight: 400,
            }}>
            00
          </Text>
        </View>

        <View style={{
          marginLeft: dimensions.width * 0.1,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: dimensions.width * 0.016,
          alignSelf: 'flex-start',
          height: dimensions.height * 0.057,
          width: dimensions.height * 0.057,
        }}>
          <Text
            style={{
              fontFamily: fontSFProTextRegular,
              textAlign: 'center',
              color: 'white',
              fontSize: dimensions.height * 0.023,
              fontWeight: 400,
            }}>
            22
          </Text>
        </View>
        <Text
          style={{
            textAlign: 'center',
            fontFamily: fontSFProTextRegular,
            fontSize: dimensions.height * 0.035,
            paddingHorizontal: dimensions.width * 0.007,
            fontWeight: 700,
            color: '#595959',
          }}>
          :
        </Text>

        <View style={{
          alignSelf: 'flex-start',
          height: dimensions.height * 0.057,
          width: dimensions.height * 0.057,
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          alignItems: 'center',
          borderRadius: dimensions.width * 0.016,
        }}>
          <Text
            style={{
              fontFamily: fontSFProTextRegular,
              color: 'white',
              textAlign: 'center',
              fontWeight: 400,
              fontSize: dimensions.height * 0.023,
            }}>
            00
          </Text>
        </View>
      </View>

      <Text
        style={{
          marginTop: dimensions.height * 0.016,
          fontWeight: 400,
          fontFamily: fontSFProTextRegular,
          fontSize: dimensions.width * 0.043,
          textAlign: 'left',
          alignSelf: 'flex-start',
          maxWidth: dimensions.width * 0.75,
          paddingHorizontal: dimensions.width * 0.05,
          color: 'white',
        }}>
        Ebb
      </Text>

      <View style={{
        width: dimensions.width * 0.9,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: dimensions.height * 0.01,
      }}>
        <View style={styles.tideTimeBox}>
          <Text style={styles.tideTimeText}>
            04
          </Text>
        </View>
        <Text style={styles.toDotsStyles}>
          :
        </Text>

        <View style={styles.tideTimeBox}>
          <Text style={styles.tideTimeText}>
            00
          </Text>
        </View>

        <View style={[styles.tideTimeBox, {
          marginLeft: dimensions.width * 0.1,
        }]}>
          <Text style={styles.tideTimeText}>
            16
          </Text>
        </View>
        <Text style={styles.toDotsStyles}>
          :
        </Text>

        <View style={styles.tideTimeBox}>
          <Text style={styles.tideTimeText}>
            00
          </Text>
        </View>
      </View>

      <Text
        style={{
          fontFamily: fontSFProTextRegular,
          paddingHorizontal: dimensions.width * 0.05,
          color: 'rgba(255, 255, 255, 0.5)',
          textAlign: 'left',
          marginTop: dimensions.height * 0.014,
          alignSelf: 'flex-start',
          fontWeight: 400,
          maxWidth: dimensions.width * 0.75,
          fontSize: dimensions.width * 0.05,
        }}>
        Sunrise and sunset times
      </Text>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: dimensions.width * 0.9,
        alignSelf: 'center',
        marginTop: dimensions.height * 0.016,
      }}>
        <View>
          <Text style={styles.sunriseSunsetText}>
            Sunrise
          </Text>

          <View style={styles.timeBoxRowStyle}>
            <View style={styles.tideTimeBox}>
              <Text style={styles.tideTimeText}>
                06
              </Text>
            </View>
            <Text style={styles.toDotsStyles}>
              :
            </Text>

            <View style={styles.tideTimeBox}>
              <Text style={styles.tideTimeText}>
                30
              </Text>
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.sunriseSunsetText}>
            Sunset
          </Text>

          <View style={styles.timeBoxRowStyle}>
            <View style={styles.tideTimeBox}>
              <Text style={styles.tideTimeText}>
                19
              </Text>
            </View>
            <Text style={styles.toDotsStyles}>
              :
            </Text>

            <View style={styles.tideTimeBox}>
              <Text style={styles.tideTimeText}>
                15
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{
        borderRadius: dimensions.width * 0.064,
        alignSelf: 'center',
        paddingHorizontal: dimensions.width * 0.05,
        marginTop: dimensions.height * 0.03,
        backgroundColor: '#2C2C2C',
        width: dimensions.width * 0.9,
        paddingVertical: dimensions.height * 0.01,
      }}>
        <Text
          style={{
            color: 'white',
            fontFamily: fontSFProTextRegular,
            fontSize: dimensions.height * 0.016,
            fontWeight: 400,
            textAlign: 'center',
          }}>
          The best time for photos
        </Text>
        <Text
          style={{
            fontFamily: fontSFProTextRegular,
            fontSize: dimensions.height * 0.025,
            color: 'white',
            marginTop: dimensions.height * 0.01,
            fontWeight: 600,
            textAlign: 'center',
          }}>
          6:30 PM - 7:00 PM
        </Text>

        <Text
          style={{
            textAlign: 'center',
            fontFamily: fontSFProTextRegular,
            fontSize: dimensions.height * 0.014,
            fontWeight: 400,
            marginTop: dimensions.height * 0.012,
            color: '#FFFFFF80',
          }}>
          Set notifications 30 minutes before sunset so you don't miss this magical moment.
        </Text>

        <View style={{
          alignItems: 'center',
          height: dimensions.height * 0.07,
          marginTop: dimensions.height * 0.019,
          justifyContent: 'space-between',
          borderRadius: dimensions.width * 0.1,
          paddingHorizontal: dimensions.width * 0.034,
          width: dimensions.width * 0.84,
          backgroundColor: '#595959',
          flexDirection: 'row',
          alignSelf: 'center',
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
            trackColor={{ false: '#2C2C2C', true: '#AC9958' }}
            thumbColor={'#FFF'}
            ios_backgroundColor="#3E3E3E"
            onValueChange={toggleNotificationSwitch}
            value={isNotificationEnabled}
          />
        </View>
      </View>
    </SafeAreaView >
  );
};

const createMindliStyles = (dimensions) => StyleSheet.create({
  tideTimeBox: {
    alignItems: 'center',
    width: dimensions.height * 0.057,
    height: dimensions.height * 0.057,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: dimensions.width * 0.016,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  tideTimeText: {
    fontFamily: fontSFProTextRegular,
    color: 'white',
    fontSize: dimensions.height * 0.023,
    textAlign: 'center',
    fontWeight: 400,
  },
  toDotsStyles: {
    paddingHorizontal: dimensions.width * 0.007,
    fontFamily: fontSFProTextRegular,
    color: '#595959',
    fontSize: dimensions.height * 0.035,
    textAlign: 'center',
    fontWeight: 700,
  },
  sunriseSunsetText: {
    fontFamily: fontSFProTextRegular,
    fontWeight: 400,
    color: 'white',
    textAlign: 'left',
    alignSelf: 'flex-start',
    maxWidth: dimensions.width * 0.75,
    fontSize: dimensions.width * 0.043,
  },
  timeBoxRowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    marginTop: dimensions.height * 0.01,
  }
});

export default TidesAndSunsetsScreen;