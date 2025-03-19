import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
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
import NothingHereComponent from '../components/NothingHereComponent';
import { ScrollView } from 'react-native-gesture-handler';

const fontSFProTextRegular = 'SFProText-Regular';

const MindliPlannerScreen = ({ setSelectedMindliSunsetBeachScreen, }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [listOfItems, setListOfItems] = useState([1]);
  const [events, setEvents] = useState([1]);
  const [favoriteSpots, setFavoriteSpots] = useState([1]);
  const [selectedMindliEvent, setSelectedMindliEvent] = useState(null);
  const [isMindliEventDetailsVisible, setIsMindliEventDetailsVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const mindliScrollViewRef = useRef(null);

  useEffect(() => {
    if (mindliScrollViewRef.current) {
      mindliScrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [modalVisible]);

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
          Beach Planner
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
        paddingBottom: dimensions.height * 0.16,
      }} showsVerticalScrollIndicator={false}
        ref={mindliScrollViewRef}
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
          List of items
        </Text>
        {listOfItems.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <NothingHereComponent />
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}
              style={{
                width: dimensions.width * 0.9,
                height: dimensions.height * 0.07,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: dimensions.height * 0.01,
                backgroundColor: '#AC9958',
                borderRadius: dimensions.width * 0.1,
              }}>
              <Text
                style={{
                  fontFamily: fontSFProTextRegular,
                  color: '#181A29',
                  fontSize: dimensions.width * 0.055,
                  textAlign: 'center',
                  fontWeight: 400,
                }}>
                Add
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={{
              width: dimensions.width * 0.9,
              alignSelf: 'center',
              paddingHorizontal: dimensions.width * 0.05,
              paddingVertical: dimensions.height * 0.016,
              backgroundColor: '#2C2C2C',
              borderRadius: dimensions.width * 0.07,
              marginTop: dimensions.height * 0.01,
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                alignSelf: 'center',
                width: dimensions.width * 0.8,
              }}>
                <Text
                  style={{
                    fontFamily: fontSFProTextRegular,
                    color: '#181A29',
                    fontSize: dimensions.width * 0.048,
                    textAlign: 'left',
                    alignSelf: 'flex-start',
                    fontWeight: 400,
                    maxWidth: dimensions.width * 0.61,
                    color: 'white',
                  }}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                >
                  Towel
                </Text>

                <View style={{
                  width: dimensions.width * 0.21,
                  height: dimensions.height * 0.04,
                  backgroundColor: '#AC9958',
                  borderRadius: dimensions.width * 0.1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text
                    style={{
                      fontFamily: fontSFProTextRegular,
                      color: '#181A29',
                      fontSize: dimensions.width * 0.043,
                      textAlign: 'center',
                      fontWeight: 400,
                      color: 'white',
                    }}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                  >
                    Tall
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  fontFamily: fontSFProTextRegular,
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: dimensions.width * 0.04,
                  textAlign: 'left',
                  alignSelf: 'flex-start',
                  fontWeight: 400,
                  maxWidth: dimensions.width * 0.75,
                  marginTop: dimensions.height * 0.005,
                }}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                1 piece
              </Text>

            </View>
          </>
        )}
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
          style={{
            width: dimensions.width * 0.9,
            height: dimensions.height * 0.07,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: dimensions.height * 0.01,
            backgroundColor: '#AC9958',
            borderRadius: dimensions.width * 0.1,
          }}>
          <Text
            style={{
              fontFamily: fontSFProTextRegular,
              color: '#181A29',
              fontSize: dimensions.width * 0.055,
              textAlign: 'center',
              fontWeight: 400,
            }}>
            Add
          </Text>
        </TouchableOpacity>


        <Text
          style={{
            fontFamily: fontSFProTextRegular,
            color: 'white',
            fontSize: dimensions.width * 0.04,
            textAlign: 'left',
            alignSelf: 'flex-start',
            fontWeight: 400,
            marginTop: dimensions.height * 0.03,
          }}>
          Events
        </Text>
        {events.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <NothingHereComponent />
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}
              style={{
                width: dimensions.width * 0.9,
                height: dimensions.height * 0.07,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: dimensions.height * 0.01,
                backgroundColor: '#AC9958',
                borderRadius: dimensions.width * 0.1,
              }}>
              <Text
                style={{
                  fontFamily: fontSFProTextRegular,
                  color: '#181A29',
                  fontSize: dimensions.width * 0.055,
                  textAlign: 'center',
                  fontWeight: 400,
                }}>
                Add
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={{
              width: dimensions.width * 0.9,
              alignSelf: 'center',
              paddingHorizontal: dimensions.width * 0.05,
              paddingVertical: dimensions.height * 0.016,
              backgroundColor: '#2C2C2C',
              borderRadius: dimensions.width * 0.07,
              marginTop: dimensions.height * 0.01,
            }}>
              <Text
                style={{
                  fontFamily: fontSFProTextRegular,
                  color: '#181A29',
                  fontSize: dimensions.width * 0.043,
                  textAlign: 'left',
                  alignSelf: 'flex-start',
                  fontWeight: 400,
                  maxWidth: dimensions.width * 0.8,
                  color: 'white',
                }}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                Reserve a spot at the beach market
              </Text>

              <Text
                style={{
                  fontFamily: fontSFProTextRegular,
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: dimensions.width * 0.04,
                  textAlign: 'left',
                  alignSelf: 'flex-start',
                  fontWeight: 400,
                  maxWidth: dimensions.width * 0.75,
                  marginTop: dimensions.height * 0.01,
                }}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                14.03.2024 {'   '} 13:00
              </Text>

              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginTop: dimensions.height * 0.014,
              }}>
                <View style={{
                  paddingHorizontal: dimensions.width * 0.04,
                  height: dimensions.height * 0.04,
                  backgroundColor: '#595959',
                  borderRadius: dimensions.width * 0.1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: dimensions.width * 0.01,
                }}>
                  <Text
                    style={{
                      fontFamily: fontSFProTextRegular,
                      color: '#181A29',
                      fontSize: dimensions.width * 0.043,
                      textAlign: 'center',
                      fontWeight: 400,
                      color: 'white',
                    }}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                  >
                    Weekly
                  </Text>
                </View>

                <View style={{
                  width: dimensions.width * 0.21,
                  height: dimensions.height * 0.04,
                  backgroundColor: '#595959',
                  borderRadius: dimensions.width * 0.1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text
                    style={{
                      fontFamily: fontSFProTextRegular,
                      color: '#181A29',
                      fontSize: dimensions.width * 0.043,
                      textAlign: 'center',
                      fontWeight: 400,
                      color: 'white',
                    }}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                  >
                    Tall
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
          style={{
            width: dimensions.width * 0.9,
            height: dimensions.height * 0.07,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: dimensions.height * 0.01,
            backgroundColor: '#AC9958',
            borderRadius: dimensions.width * 0.1,
          }}>
          <Text
            style={{
              fontFamily: fontSFProTextRegular,
              color: '#181A29',
              fontSize: dimensions.width * 0.055,
              textAlign: 'center',
              fontWeight: 400,
            }}>
            Add
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            fontFamily: fontSFProTextRegular,
            color: 'white',
            fontSize: dimensions.width * 0.04,
            textAlign: 'left',
            alignSelf: 'flex-start',
            fontWeight: 400,
            marginTop: dimensions.height * 0.03,
          }}>
          Favorite spots on the beach
        </Text>
        {favoriteSpots.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <NothingHereComponent />
          </View>
        ) : (
          <View style={{
            width: dimensions.width * 0.9,
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}>
            <TouchableOpacity
              onPress={() => {
                setSelectedMindliEvent({ title: 'Secret Nook', description: 'fdsfsfsdf', coordinates: { latitude: -12.4255, longitude: 130.8405 }, image: require('../assets/images/mindliPlacesImages/place1.png') });
                setIsMindliEventDetailsVisible(true);
              }}
              style={{
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
                  source={require('../assets/images/mindliPlacesImages/place1.png')}
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
                Secret Nook
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
          style={{
            width: dimensions.width * 0.9,
            height: dimensions.height * 0.07,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: dimensions.height * 0.01,
            backgroundColor: '#AC9958',
            borderRadius: dimensions.width * 0.1,
          }}>
          <Text
            style={{
              fontFamily: fontSFProTextRegular,
              color: '#181A29',
              fontSize: dimensions.width * 0.055,
              textAlign: 'center',
              fontWeight: 400,
            }}>
            Add
          </Text>
        </TouchableOpacity>
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
                setSelectedMindliEvent(null);
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
            {selectedMindliEvent?.title}
          </Text>

          <Image
            source={selectedMindliEvent?.image}
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
            Coordinates
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
            {selectedMindliEvent?.coordinates.latitude.toFixed(4)}° N, {selectedMindliEvent?.coordinates.longitude.toFixed(4)}° E
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
            {selectedMindliEvent?.description}
          </Text>

          <TouchableOpacity
            onPress={() => {
              handleDeletemindliPlace(selectedMindliEvent.id);
              setIsMindliEventDetailsVisible(false);
            }}
            style={{
              width: dimensions.width * 0.9,
              height: dimensions.height * 0.07,
              backgroundColor: '#FF382B',
              borderRadius: dimensions.width * 0.1,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              position: 'absolute',
              bottom: dimensions.height * 0.05,
            }}>
            <Text
              style={{
                fontFamily: fontSFProTextRegular,
                color: 'white',
                fontSize: dimensions.width * 0.055,
                textAlign: 'right',
                alignSelf: 'center',
                fontWeight: 400,
              }}>
              Delete Place
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default MindliPlannerScreen;
