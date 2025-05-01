import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  Modal,
} from 'react-native';
import { ArrowLeftIcon, } from 'react-native-heroicons/solid';
import { ScrollView } from 'react-native-gesture-handler';
import availableActivitiesData from '../components/availableActivitiesData';
import whatCanBeFoundData from '../components/whatCanBeFoundData';
import restaurantsAndCafesData from '../components/restaurantsAndCafesData';

const fontSFProTextRegular = 'SFProText-Regular';
const fontSFProTextHeavy = 'SFProText-Heavy';

const hoursOfOperation = [
  {
    id: 1,
    dayTitle: 'Monday',
    hours: '4:00 PM - 9:00 PM',
  },
  {
    id: 2,
    dayTitle: 'Wednesday',
    hours: '4:00 PM - 9:00 PM',
  },
  {
    id: 3,
    dayTitle: 'Sunday',
    hours: '4:00 PM - 9:00 PM',
  }
];

const MindliActivitiesScreen = ({ setSelectedMindliSunsetBeachScreen, }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedMindliActivity, setSelectedMindliActivity] = useState(null);
  const [isMindliEventDetailsVisible, setIsMindliEventDetailsVisible] = useState(false);


  return (
    <SafeAreaView style={{
      alignSelf: 'center',
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
          Beach entertainment and activities
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

      <ScrollView style={{
        width: dimensions.width * 0.9,
        alignSelf: 'center',
      }} contentContainerStyle={{
        paddingTop: dimensions.height * 0.01,
        paddingBottom: dimensions.height * 0.163,
      }} showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontFamily: fontSFProTextRegular,
            color: 'white',
            fontSize: dimensions.width * 0.04,
            textAlign: 'left',
            alignSelf: 'flex-start',
            fontWeight: 400,
          }}>
          Available Activities
        </Text>

        <View style={{
          width: dimensions.width * 0.9,
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}>
          {availableActivitiesData.map((mindliActivity, index) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedMindliActivity(mindliActivity);
                setIsMindliEventDetailsVisible(true);
              }}
              key={mindliActivity.id} style={{
                width: dimensions.width * 0.44,
                backgroundColor: '#2C2C2C',
                borderRadius: dimensions.width * 0.04,
                paddingHorizontal: dimensions.width * 0.023,
                paddingVertical: dimensions.height * 0.014,
                marginTop: dimensions.height * 0.014,
              }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}>
                <Image
                  source={mindliActivity.image}
                  style={{
                    width: dimensions.width * 0.25,
                    height: dimensions.height * 0.088,
                    borderRadius: dimensions.width * 0.03,
                  }}
                  resizeMode='stretch'
                />
                <Image
                  source={require('../assets/icons/arrowUpRightIcon.png')}
                  style={{
                    width: dimensions.width * 0.055,
                    height: dimensions.width * 0.055,
                  }}
                  resizeMode='contain'
                />
              </View>

              <Text
                style={{
                  fontFamily: fontSFProTextRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.035,
                  textAlign: 'left',
                  alignSelf: 'flex-start',
                  marginTop: dimensions.height * 0.025,
                  fontWeight: 400,
                  maxWidth: dimensions.width * 0.4,
                }}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {mindliActivity.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text
          style={{
            fontFamily: fontSFProTextRegular,
            color: 'white',
            fontSize: dimensions.width * 0.037,
            textAlign: 'left',
            alignSelf: 'flex-start',
            fontWeight: 400,
            marginTop: dimensions.height * 0.019,
          }}>
          Schedule of the Mindil Sunset Beach Market
        </Text>

        <View style={{
          width: dimensions.width * 0.9,
          alignSelf: 'center',
          backgroundColor: '#2C2C2C',
          borderRadius: dimensions.width * 0.07,
          paddingHorizontal: dimensions.width * 0.04,
          paddingVertical: dimensions.height * 0.021,
          marginTop: dimensions.height * 0.005,
        }}>
          <Text
            style={{
              fontFamily: fontSFProTextRegular,
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: dimensions.width * 0.046,
              textAlign: 'left',
              alignSelf: 'flex-start',
              fontWeight: 400,
            }}>
            Hours of Operation
          </Text>

          {hoursOfOperation.map((day, index) => (
            <View key={day.id} style={{
              width: dimensions.width * 0.82,
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: dimensions.height * 0.016,
            }}>
              <Text
                style={{
                  fontFamily: fontSFProTextRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.043,
                  textAlign: 'left',
                  alignSelf: 'flex-start',
                  fontWeight: 400,
                }}>
                {day.dayTitle}
              </Text>

              <Text
                style={{
                  fontFamily: fontSFProTextHeavy,
                  color: 'white',
                  fontSize: dimensions.width * 0.04,
                  textAlign: 'left',
                  alignSelf: 'flex-start',
                }}>
                {day.hours}
              </Text>
            </View>
          ))}
        </View>

        <View style={{
          width: dimensions.width * 0.9,
          alignSelf: 'center',
          backgroundColor: '#2C2C2C',
          borderRadius: dimensions.width * 0.07,
          paddingHorizontal: dimensions.width * 0.04,
          paddingVertical: dimensions.height * 0.021,
          marginTop: dimensions.height * 0.005,
        }}>
          <Text
            style={{
              fontFamily: fontSFProTextRegular,
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: dimensions.width * 0.046,
              textAlign: 'left',
              alignSelf: 'flex-start',
              fontWeight: 400,
            }}>
            What can be found?
          </Text>

          {whatCanBeFoundData.map((item, index) => (
            <View key={item.id} style={{
              width: dimensions.width * 0.82,
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: dimensions.height * 0.01,
            }}>
              <Text
                style={{
                  fontFamily: fontSFProTextHeavy,
                  color: 'white',
                  fontSize: dimensions.width * 0.04,
                  textAlign: 'left',
                  alignSelf: 'flex-start',
                  marginRight: dimensions.width * 0.021,
                }}>
                •
              </Text>
              <Text
                style={{
                  fontFamily: fontSFProTextRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.043,
                  textAlign: 'left',
                  alignSelf: 'flex-start',
                  maxWidth: dimensions.width * 0.75,
                  fontWeight: 400,
                }}>
                {item.text}
              </Text>
            </View>
          ))}
        </View>

        <Text
          style={{
            fontFamily: fontSFProTextRegular,
            color: 'white',
            fontSize: dimensions.width * 0.037,
            textAlign: 'left',
            alignSelf: 'flex-start',
            fontWeight: 400,
            marginTop: dimensions.height * 0.025,
          }}>
          List of restaurants and cafes
        </Text>

        <View style={{
          width: dimensions.width * 0.9,
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}>
          {restaurantsAndCafesData.map((mindliRestOrCafe, index) => (

            <TouchableOpacity
              onPress={() => {
                setSelectedMindliActivity(mindliRestOrCafe);
                setIsMindliEventDetailsVisible(true);
              }}
              key={mindliRestOrCafe.id} style={{
                width: dimensions.width * 0.44,
                backgroundColor: '#2C2C2C',
                borderRadius: dimensions.width * 0.04,
                paddingHorizontal: dimensions.width * 0.023,
                paddingVertical: dimensions.height * 0.014,
                marginTop: dimensions.height * 0.014,
              }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}>
                <Image
                  source={mindliRestOrCafe.image}
                  style={{
                    width: dimensions.width * 0.25,
                    height: dimensions.height * 0.088,
                    borderRadius: dimensions.width * 0.03,
                  }}
                  resizeMode='stretch'
                />
                <Image
                  source={require('../assets/icons/arrowUpRightIcon.png')}
                  style={{
                    width: dimensions.width * 0.055,
                    height: dimensions.width * 0.055,
                  }}
                  resizeMode='contain'
                />
              </View>

              <Text
                style={{
                  fontFamily: fontSFProTextRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.035,
                  textAlign: 'left',
                  alignSelf: 'flex-start',
                  marginTop: dimensions.height * 0.025,
                  fontWeight: 400,
                  maxWidth: dimensions.width * 0.4,
                }}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {mindliRestOrCafe.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isMindliEventDetailsVisible}
        onRequestClose={() => {
          setIsMindliEventDetailsVisible(!isMindliEventDetailsVisible);
        }}
      >
        <SafeAreaView style={{
          flex: 1,
          backgroundColor: '#141414',
          width: dimensions.width,
          height: dimensions.height,
        }}>
          <View style={{
            width: dimensions.width * 0.9,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: dimensions.height * 0.01,
          }}>
            <TouchableOpacity
              onPress={() => {
                setIsMindliEventDetailsVisible(false);
                setSelectedMindliActivity(null);
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
          </View>

          <Text
            style={{
              fontFamily: fontSFProTextRegular,
              color: 'white',
              fontSize: dimensions.width * 0.07,
              textAlign: 'left',
              alignSelf: 'flex-start',
              fontWeight: 400,
              paddingHorizontal: dimensions.width * 0.05,
              marginTop: dimensions.height * 0.016,
            }}>
            {selectedMindliActivity?.title}
          </Text>

          <Image
            source={selectedMindliActivity?.image}
            style={{
              width: dimensions.width * 0.9,
              height: dimensions.height * 0.21,
              borderRadius: dimensions.width * 0.04,
              alignSelf: 'center',
              marginTop: dimensions.height * 0.02,
            }}
            resizeMode='stretch'
          />

          <Text
            style={{
              fontFamily: fontSFProTextRegular,
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: dimensions.width * 0.037,
              textAlign: 'left',
              alignSelf: 'flex-start',
              fontWeight: 400,
              paddingHorizontal: dimensions.width * 0.05,
              marginTop: dimensions.height * 0.025,
            }}>
            Description
          </Text>

          <Text
            style={{
              fontFamily: fontSFProTextRegular,
              color: 'white',
              fontSize: dimensions.width * 0.04,
              textAlign: 'left',
              alignSelf: 'flex-start',
              fontWeight: 400,
              paddingHorizontal: dimensions.width * 0.05,
              marginTop: dimensions.height * 0.01,
            }}>
            {selectedMindliActivity?.description}
          </Text>

          <Text
            style={{
              fontFamily: fontSFProTextRegular,
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: dimensions.width * 0.037,
              textAlign: 'left',
              alignSelf: 'flex-start',
              fontWeight: 400,
              paddingHorizontal: dimensions.width * 0.05,
              marginTop: dimensions.height * 0.025,
            }}>
            {selectedMindliActivity?.additionalTextTitle}
          </Text>

          <Text
            style={{
              fontFamily: fontSFProTextRegular,
              color: 'white',
              fontSize: dimensions.width * 0.04,
              textAlign: 'left',
              alignSelf: 'flex-start',
              fontWeight: 400,
              paddingHorizontal: dimensions.width * 0.05,
              marginTop: dimensions.height * 0.01,
            }}>
            {selectedMindliActivity?.additionalText}
          </Text>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default MindliActivitiesScreen;
