import React, { use, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  Modal,
  Alert,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsScreen from './SettingsScreen';
import { ArrowLeftIcon, XMarkIcon } from 'react-native-heroicons/solid';
import * as ImagePicker from 'react-native-image-picker';
import MapView, { Marker } from 'react-native-maps';

import mindliPlacesData from '../components/mindliPlacesData';

import CollectionDetailsScreen from './CollectionDetailsScreen';
import TidesAndSunsetsScreen from './TidesAndSunsetsScreen';
import CleanCoinGameScreen from './CleanCoinGameScreen';

const fontSFProDisplayRegular = 'SF-Pro-Display-Regular';
const fontSFProTextRegular = 'SFProText-Regular';

const bottomBtns = [
  {
    id: 1,
    mindliScreen: 'Home',
    mindliScreenTitle: 'Place',
    mindliScreenIcon: require('../assets/icons/mindliBottomIcons/homeIcon.png'),
  },
  {
    id: 2,
    mindliScreen: 'Tides&Sunsets',
    mindliScreenTitle: 'Tides & sunsets',
    mindliScreenIcon: require('../assets/icons/mindliBottomIcons/tidesIcon.png'),
  },
  {
    id: 3,
    mindliScreen: 'Planner',
    mindliScreenTitle: 'Planner',
    mindliScreenIcon: require('../assets/icons/mindliBottomIcons/plannerIcon.png'),
  },
  {
    id: 4,
    mindliScreen: 'Settings',
    mindliScreenTitle: 'Quiz',
    mindliScreenIcon: require('../assets/icons/mindliBottomIcons/quizIcon.png'),
  },
]

const HomeScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedMindliSunsetBeachScreen, setSelectedMindliSunsetBeachScreen] = useState('Home');

  const [newMindliPlaceModalVisible, setNewMindliPlaceModalVisible] = useState(false);

  const [newMindliPlaceImage, setNewMindliPlaceImage] = useState('');
  const [newMindliPlaceTitle, setNewMindliPlaceTitle] = useState('');
  const [newMindliPlaceDescription, setNewMindliPlaceDescription] = useState('');
  const [isCoinGameStarted, setIsCoinGameStarted] = useState(false);

  const [mindliPlaces, setMindliPlaces] = useState([]);
  const [selectedPlacesCategory, setSelectedPlacesCategory] = useState('Places');
  const [selectedMindliPlace, setSelectedMindliPlace] = useState(null);
  const [isMindliPlaceDetailsModalVisible, setIsMindliPlaceDetailsModalVisible] = useState(false);
  const [isMindliLocationAdded, setIsMindliLocationAdded] = useState(false);
  const [isNotificationEnabled, setNotificationEnabled] = useState(true);
  const [temperatureValue, setTemperatureValue] = useState("°C");
  const [windSpeedValue, setWindSpeedValue] = useState("m/s");
  const scrollViewRef = useRef(null);

  const [newPlaceCoordinates, setNewPlaceCoordinates] = useState({
    latitude: -12.448279861436154,
    longitude: 130.82960082352463,
  });

  const loadMindliBeachSettings = async () => {
    try {
      const notificationMindliBeachValue = await AsyncStorage.getItem('isNotificationEnabled');
      if (notificationMindliBeachValue !== null) {
        setNotificationEnabled(JSON.parse(notificationMindliBeachValue));
      }

      let storedTemperature = await AsyncStorage.getItem('temperatureValue');
      if (storedTemperature === null) {
        storedTemperature = "°C";
        await AsyncStorage.setItem('temperatureValue', storedTemperature);
      }
      setTemperatureValue(storedTemperature);

      let storedWindSpeed = await AsyncStorage.getItem('windSpeedValue');
      if (storedWindSpeed === null) {
        storedWindSpeed = "m/s ";
        await AsyncStorage.setItem('windSpeedValue', storedWindSpeed);
      }
      setWindSpeedValue(storedWindSpeed);
    } catch (error) {
      console.error("Error loading mindli settings:", error);
    }
  };

  useEffect(() => {
    loadMindliBeachSettings();
  }, [isNotificationEnabled, selectedMindliSunsetBeachScreen]);

  const handleDeletemindliPlace = async (id) => {
    const updatedMindliPlaces = mindliPlaces.filter(item => item.id !== id);
    setMindliPlaces(updatedMindliPlaces);
    await AsyncStorage.setItem('mindliPlaces', JSON.stringify(updatedMindliPlaces));

  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [selectedPlacesCategory]);

  const getMindliDataByCategory = (categoriMindli) => {
    switch (categoriMindli) {
      case 'Places':
        return mindliPlacesData;
      case 'My Places':
        return mindliPlaces;
      default:
        return [];
    }
  };

  const mindliData = getMindliDataByCategory(selectedPlacesCategory);

  const loadCoinCollection = async () => {
    try {
      const storedMindliPlaces = await AsyncStorage.getItem('mindliPlaces');
      const parsedMindliPlaces = storedMindliPlaces ? JSON.parse(storedMindliPlaces) : [];
      setMindliPlaces(parsedMindliPlaces);
    } catch (error) {
      console.error('Error loading mindliPlaces:', error);
    }
  };

  useEffect(() => {
    loadCoinCollection();
  }, []);

  const saveMindliPlace = async () => {
    const minPlace = JSON.parse(await AsyncStorage.getItem('mindliPlaces')) || [];
    const newMindliPlaceId = minPlace.length > 0 ? Math.max(...minPlace.map(e => e.id)) + 1 : 1;
    const newMindliPlace = {
      id: newMindliPlaceId,
      image: newMindliPlaceImage,
      title: newMindliPlaceTitle,
      description: newMindliPlaceDescription !== '' ? newMindliPlaceDescription : 'No description',
      coordinates: newPlaceCoordinates,
    };

    try {
      const updatedMindliPlaces = [newMindliPlace, ...mindliPlaces];
      await AsyncStorage.setItem('mindliPlaces', JSON.stringify(updatedMindliPlaces));
      setMindliPlaces(updatedMindliPlaces);

      // setNewMindliPlaceModalVisible(false);
      setIsMindliLocationAdded(true);

      setNewMindliPlaceImage('');
      setNewMindliPlaceTitle('');
      setNewMindliPlaceDescription('');
      setNewPlaceCoordinates({
        latitude: -12.448279861436154,
        longitude: 130.82960082352463,
      });
    } catch (err) {
      console.error("Error saving collection:", err);
    }
  };

  const handleCoinCollectionImagePicker = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setNewMindliPlaceImage(response.assets[0].uri);
      }
    });
  };

  const handleDeleteMindliPlaceImage = () => {
    Alert.alert(
      "Delete place image",
      "Are you sure you want to delete image of place?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            setNewMindliPlaceImage('');
          },
          style: "destructive"
        }
      ]
    );
  };

  useEffect(() => {
    console.log('mindliPlaces:', mindliPlaces);
  }, [mindliPlaces])

  return (
    <View style={{
      backgroundColor: '#141414',
      flex: 1,
      height: dimensions.height,
      width: dimensions.width,
    }}>
      {selectedMindliSunsetBeachScreen === 'Home' ? (
        <SafeAreaView style={{
          flex: 1,
          paddingHorizontal: dimensions.width * 0.05,
          width: dimensions.width,
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
              Favorite spots on the beach
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
            paddingBottom: dimensions.height * 0.142
          }} ref={scrollViewRef} showsVerticalScrollIndicator={false}>
            <MapView
              style={{
                width: dimensions.width * 0.9,
                height: dimensions.height * 0.21,
                borderRadius: dimensions.width * 0.07,
                alignSelf: 'center',
                marginTop: dimensions.height * 0.01,
                zIndex: 50
              }}
              region={{
                latitude: selectedPlacesCategory === 'Places' ? mindliData[0]?.places[0]?.coordinates.latitude : selectedPlacesCategory === 'My Places' && mindliData.length > 0 ? mindliData[0].coordinates.latitude : -12.447716036965376,
                longitude: selectedPlacesCategory === 'Places' ? mindliData[0]?.places[0]?.coordinates.longitude : selectedPlacesCategory === 'My Places' && mindliData.length > 0 ? mindliData[0].coordinates.longitude : 130.82903921380762,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              {selectedPlacesCategory === 'Places' ? (
                mindliData.length !== 0 && (
                  mindliPlacesData
                    .flatMap(category => category.places)
                    .map((place, index) => (
                      <Marker
                        key={place.id || index}
                        coordinate={place.coordinates}
                        title={place.title}
                        description={place.description}
                        pinColor={"#FFFCDD"}
                      />
                    ))
                )
              ) : (
                mindliData.length !== 0 && (
                  mindliPlaces.map((place, index) => (
                    <Marker
                      key={place.id || index}
                      coordinate={place.coordinates}
                      title={place.title}
                      description={place.description}
                      pinColor={"#FFFCDD"}
                    />
                  ))
                )
              )}
            </MapView>

            <ScrollView style={{
              alignSelf: 'flex-start',
              marginTop: dimensions.height * 0.016,
            }} horizontal={true} contentContainerStyle={{
              paddingBottom: dimensions.height * 0.01
            }} showsHorizontalScrollIndicator={false}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: dimensions.width * 0.9,
              }}>
                {['Places', 'My Places'].map((placeCategory, index) => (
                  <TouchableOpacity
                    onPress={() => setSelectedPlacesCategory(placeCategory)}
                    key={index} style={{
                      width: dimensions.width * 0.28,
                      height: dimensions.height * 0.05,
                      backgroundColor: '#2C2C2C',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: dimensions.width * 0.05,
                      marginRight: dimensions.width * 0.025,
                      opacity: selectedPlacesCategory === placeCategory ? 1 : 0.5,
                    }}>
                    <Text
                      style={{
                        fontFamily: fontSFProTextRegular,
                        color: 'white',
                        fontSize: dimensions.width * 0.04,
                        textAlign: 'center',
                        alignSelf: 'center',
                        fontWeight: 400,
                        maxWidth: dimensions.width * 0.75,
                      }}>
                      {placeCategory}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {selectedPlacesCategory === 'My Places' && (
              <TouchableOpacity
                onPress={() => setNewMindliPlaceModalVisible(true)}
              >
                <Text
                  style={{
                    fontFamily: fontSFProTextRegular,
                    color: 'white',
                    fontSize: dimensions.width * 0.037,
                    textAlign: 'left',
                    alignSelf: 'flex-start',
                    fontWeight: 400,
                    marginVertical: dimensions.height * 0.01,
                    textDecorationLine: 'underline',
                  }}>
                  Add new place
                </Text>
              </TouchableOpacity>
            )}

            {mindliData.length === 0 ? (
              <Text
                style={{
                  fontFamily: fontSFProTextRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.061,
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontWeight: 400,
                  maxWidth: dimensions.width * 0.8,
                  marginTop: dimensions.height * 0.1,
                }}>
                There's nothing here yet..
              </Text>
            ) : mindliData.length !== 0 && selectedPlacesCategory === 'Places' ? (
              <>
                {mindliData.map((mindliCateg, index) => (
                  <View key={mindliCateg.id} style={{
                    width: dimensions.width * 0.9, alignSelf: 'center',
                  }}>
                    <Text
                      style={{
                        fontFamily: fontSFProTextRegular,
                        color: 'white',
                        fontSize: dimensions.width * 0.04,
                        textAlign: 'left',
                        alignSelf: 'flex-start',
                        fontWeight: 400,
                        marginTop: mindliCateg.id !== 1 ? dimensions.height * 0.025 : 0,
                      }}>
                      {mindliCateg.categotyTitle}
                    </Text>

                    <View style={{
                      width: dimensions.width * 0.9,
                      alignSelf: 'center',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                    }}>
                      {mindliCateg.places.map((mindliPlace, index) => (
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedMindliPlace(mindliPlace);
                            setIsMindliPlaceDetailsModalVisible(true);
                          }}
                          key={mindliPlace.id} style={{
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
                              source={mindliPlace.image}
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
                            {mindliPlace.title}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <View style={{
                width: dimensions.width * 0.9,
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}>
                {mindliPlaces.map((mindliStoragedPlace) => (
                  <TouchableOpacity key={mindliStoragedPlace.id}
                    onPress={() => {
                      setSelectedMindliPlace(mindliStoragedPlace);
                      setIsMindliPlaceDetailsModalVisible(true);
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
                        source={{ uri: mindliStoragedPlace.image }}
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
                      {mindliStoragedPlace.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

        </SafeAreaView>
      ) : selectedMindliSunsetBeachScreen === 'Settings' ? (
        <SettingsScreen setSelectedMindliSunsetBeachScreen={setSelectedMindliSunsetBeachScreen} selectedMindliSunsetBeachScreen={selectedMindliSunsetBeachScreen} setNotificationEnabled={setNotificationEnabled} isNotificationEnabled={isNotificationEnabled} 
        temperatureValue={temperatureValue} setTemperatureValue={setTemperatureValue} windSpeedValue={windSpeedValue} setWindSpeedValue={setWindSpeedValue}
        />
      ) : selectedMindliSunsetBeachScreen === 'CollectionDetails' ? (
        <CollectionDetailsScreen setSelectedMindliSunsetBeachScreen={setSelectedMindliSunsetBeachScreen} selectedMindliPlace={selectedMindliPlace} setSelectedMindliPlace={setSelectedMindliPlace} mindliPlaces={mindliPlaces} setMindliPlaces={setMindliPlaces} />
      ) : selectedMindliSunsetBeachScreen === 'Tides&Sunsets' ? (
        <TidesAndSunsetsScreen setSelectedMindliSunsetBeachScreen={setSelectedMindliSunsetBeachScreen} selectedMindliSunsetBeachScreen={selectedMindliSunsetBeachScreen} setNotificationEnabled={setNotificationEnabled} isNotificationEnabled={isNotificationEnabled} />
      ) : selectedMindliSunsetBeachScreen === 'CleanCoinGame' ? (
        <CleanCoinGameScreen setSelectedMindliSunsetBeachScreen={setSelectedMindliSunsetBeachScreen} isCoinGameStarted={isCoinGameStarted} setIsCoinGameStarted={setIsCoinGameStarted} />
      ) : null}

      {selectedMindliSunsetBeachScreen !== 'Settings' && !(selectedMindliSunsetBeachScreen === 'CleanCoinGame' && isCoinGameStarted) && (
        <View
          style={{
            position: 'absolute',
            bottom: dimensions.height * 0.05,
            height: dimensions.height * 0.088,
            backgroundColor: '#2C2C2C',
            width: dimensions.width * 0.93,
            borderRadius: dimensions.width * 0.1,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            alignSelf: 'center',
            paddingHorizontal: dimensions.width * 0.05,
            zIndex: 4000,
            height: dimensions.height * 0.1,
          }}
        >
          {bottomBtns.map((button, index) => (
            <TouchableOpacity
              key={button.id}
              onPress={() => setSelectedMindliSunsetBeachScreen(button.mindliScreen)}
              style={{
                padding: dimensions.height * 0.01,
                alignItems: 'center',
                opacity: selectedMindliSunsetBeachScreen === button.mindliScreen ? 1 : 0.5,
              }}
            >
              <Image
                source={button.mindliScreenIcon}
                style={{
                  width: dimensions.height * 0.028,
                  height: dimensions.height * 0.028,
                  textAlign: 'center'
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontFamily: fontSFProDisplayRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.03,
                  textAlign: 'center',
                  fontWeight: 500,
                  marginTop: dimensions.height * 0.01,
                }}>
                {button.mindliScreenTitle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={newMindliPlaceModalVisible}
        onRequestClose={() => {
          setNewMindliPlaceModalVisible(!newMindliPlaceModalVisible);
        }}
      >
        {!isMindliLocationAdded ? (

          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
                    setNewMindliPlaceModalVisible(false);
                    setNewMindliPlaceImage('');
                    setNewMindliPlaceTitle('');
                    setNewMindliPlaceDescription('');
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
                    fontSize: dimensions.width * 0.061,
                    textAlign: 'right',
                    alignSelf: 'center',
                    fontWeight: 400,
                  }}>
                  Add your spot
                </Text>
              </View>

              <MapView
                style={{
                  width: dimensions.width * 0.9,
                  height: dimensions.height * 0.21,
                  borderRadius: dimensions.width * 0.0777,
                  alignSelf: 'center',
                  marginTop: dimensions.height * 0.01,
                  zIndex: 50,
                }}
                initialRegion={{
                  latitude: newPlaceCoordinates.latitude,
                  longitude: newPlaceCoordinates.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                onPress={(e) => {
                  setNewPlaceCoordinates(e.nativeEvent.coordinate);
                }}
              >
                <Marker
                  pinColor={"#FFFCDD"}
                  draggable
                  coordinate={newPlaceCoordinates}
                  onDragEnd={(e) => {
                    setNewPlaceCoordinates(e.nativeEvent.coordinate);
                  }}
                />
              </MapView>

              {newMindliPlaceImage === '' || !newMindliPlaceImage ? (
                <TouchableOpacity
                  onPress={() => handleCoinCollectionImagePicker()}
                  style={{
                    borderRadius: dimensions.width * 0.088,
                    backgroundColor: '#2C2C2C',
                    width: dimensions.width * 0.4,
                    height: dimensions.width * 0.4,
                    alignSelf: 'flex-start',
                    marginLeft: dimensions.width * 0.05,
                    marginTop: dimensions.height * 0.014,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={require('../assets/icons/addMindliPlaceImageIcon.png')}
                    style={{
                      width: dimensions.width * 0.25,
                      height: dimensions.width * 0.25,
                      left: dimensions.width * 0.01,
                      bottom: dimensions.width * 0.01,
                      alignSelf: 'center',
                    }}
                    resizeMode='contain'
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    handleDeleteMindliPlaceImage();
                  }}
                  style={{
                    alignSelf: 'flex-start',
                    marginTop: dimensions.height * 0.01,
                    marginLeft: dimensions.width * 0.05,
                  }}>
                  <Image
                    source={{ uri: newMindliPlaceImage }}
                    style={{
                      width: dimensions.width * 0.4,
                      height: dimensions.width * 0.4,
                      borderRadius: dimensions.width * 0.088,
                    }}
                    resizeMode='stretch'
                  />
                  <Image
                    source={require('../assets/icons/deleteMindliPlaceImageIcon.png')}
                    style={{
                      width: dimensions.width * 0.25,
                      height: dimensions.width * 0.25,
                      alignSelf: 'center',
                      position: 'absolute',
                      top: '19%',
                      marginRight: -dimensions.width * 0.03,
                    }}
                    resizeMode='contain'
                  />
                </TouchableOpacity>
              )}

              <TextInput
                placeholder="Title"
                value={newMindliPlaceTitle}
                maxLength={55}
                onChangeText={setNewMindliPlaceTitle}
                placeholderTextColor="rgba(210, 210, 210, 0.91)"
                placeholderTextSize={dimensions.width * 0.03}
                style={{
                  backgroundColor: '#2C2C2C',
                  fontWeight: newMindliPlaceTitle.length === 0 ? 400 : 600,
                  alignSelf: 'center',
                  width: dimensions.width * 0.9,
                  padding: dimensions.width * 0.05,
                  fontSize: dimensions.width * 0.043,
                  color: '#fff',
                  height: dimensions.height * 0.07,
                  fontFamily: fontSFProTextRegular,
                  borderRadius: dimensions.width * 0.1,
                  marginTop: dimensions.height * 0.01,
                }}
              />

              <TextInput
                placeholder="Description (optional)"
                value={newMindliPlaceDescription}
                onChangeText={setNewMindliPlaceDescription}
                maxLength={250}
                placeholderTextColor="rgba(210, 210, 210, 0.91)"
                placeholderTextSize={dimensions.width * 0.03}
                multiline={true}
                textAlignVertical="top"
                style={{
                  backgroundColor: '#2C2C2C',
                  fontWeight: newMindliPlaceDescription.length === 0 ? 400 : 600,
                  alignSelf: 'center',
                  width: dimensions.width * 0.9,
                  padding: dimensions.width * 0.05,
                  fontSize: dimensions.width * 0.043,
                  color: '#fff',
                  height: dimensions.height * 0.16,
                  fontFamily: fontSFProTextRegular,
                  borderRadius: dimensions.width * 0.1,
                  marginTop: dimensions.height * 0.01,
                }}
              />

              <TouchableOpacity
                onPress={() => saveMindliPlace()}
                disabled={newMindliPlaceTitle.replace(/\s/g, '').length === 0 || !newMindliPlaceImage || newMindliPlaceImage === ''}
                style={{
                  width: dimensions.width * 0.9,
                  height: dimensions.height * 0.07,
                  backgroundColor: newMindliPlaceTitle.replace(/\s/g, '').length === 0 || !newMindliPlaceImage || newMindliPlaceImage === '' ? '#939393' : '#DEC05B',
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
                  Add a place
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        ) : (
          <SafeAreaView style={{
            flex: 1,
            backgroundColor: '#141414',
            width: dimensions.width,
            height: dimensions.height,
          }}>
            <TouchableOpacity
              onPress={() => {
                setNewMindliPlaceModalVisible(false);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-end',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                borderRadius: dimensions.width * 0.1,
                padding: dimensions.width * 0.016,
                marginRight: dimensions.width * 0.05,
              }}>
              <XMarkIcon size={dimensions.height * 0.04} color='white' />
            </TouchableOpacity>

            <Image
              source={require('../assets/images/mindliLocationAddedImage.png')}
              style={{
                width: dimensions.width * 0.75,
                height: dimensions.height * 0.34,
                alignSelf: 'center',
                marginTop: dimensions.height * 0.16,
              }}
              resizeMode='contain'
            />
          </SafeAreaView>
        )}
      </Modal>


      <Modal
        animationType="slide"
        transparent={true}
        visible={isMindliPlaceDetailsModalVisible}
        onRequestClose={() => {
          setIsMindliPlaceDetailsModalVisible(!isMindliPlaceDetailsModalVisible);
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
                setIsMindliPlaceDetailsModalVisible(false);
                setSelectedMindliPlace(null);
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
            {selectedMindliPlace?.title}
          </Text>

          <Image
            source={selectedPlacesCategory === 'Places' ? selectedMindliPlace?.image : { uri: selectedMindliPlace?.image }}
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
            {selectedMindliPlace?.coordinates.latitude.toFixed(4)}° N, {selectedMindliPlace?.coordinates.longitude.toFixed(4)}° E
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
            {selectedMindliPlace?.description}
          </Text>

          {selectedPlacesCategory === 'My Places' && (
            <TouchableOpacity
              onPress={() => {
                handleDeletemindliPlace(selectedMindliPlace.id);
                setIsMindliPlaceDetailsModalVisible(false);
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
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default HomeScreen;
