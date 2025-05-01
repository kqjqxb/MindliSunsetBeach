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
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Alert,
} from 'react-native';
import { ArrowLeftIcon,  XMarkIcon } from 'react-native-heroicons/solid';
import NothingHereComponent from '../components/NothingHereComponent';
import { ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'react-native-image-picker';
import MapView, { Marker } from 'react-native-maps';
import DateTimePicker from '@react-native-community/datetimepicker';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const fontSFProTextRegular = 'SFProText-Regular';

const MindliPlannerScreen = ({ setSelectedMindliSunsetBeachScreen, }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [listOfItems, setListOfItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [favoriteSpots, setFavoriteSpots] = useState([]);
  const [selectedMindliSpot, setSelectedMindliSpot] = useState(null);
  const [isMindliSpotDetailsVisible, setIsMindliSpotDetailsVisible] = useState(false);
  const [activeSwipeableId, setActiveSwipeableId] = useState(null);

  const [addingItemType, setAddingItemType] = useState('');
  const [isItemAdded, setIsItemAdded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const mindliScrollViewRef = useRef(null);
  const swipeableRefs = useRef(new Map());

  const [newMindliSpotImage, setNewMindliSpotImage] = useState('');
  const [newMindliSpotTitle, setNewMindliPlaceTitle] = useState('');
  const [newMindliSpotDescription, setNewMindliSpotDescription] = useState('');
  const [eventName, setEventName] = useState('');

  const [itemName, setItemName] = useState('');
  const [numberOfPieces, setNumberOfPieces] = useState(1);
  const [itemPriority, setItemPriority] = useState('');

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [initialMinDate, setInitialMinDate] = useState(new Date(new Date().setHours(0, 0, 0, 0)));
  const [selectedRepeat, setSelectedRepeat] = useState('');
  const [selectedNotification, setSelectedNotification] = useState('');

  const saveMindliEvent = async () => {
    const maxEventId = JSON.parse(await AsyncStorage.getItem('events')) || [];
    const newMaxEventId = maxEventId.length > 0 ? Math.max(...maxEventId.map(e => e.id)) + 1 : 1;
    const newMindliPlace = {
      id: newMaxEventId,
      title: eventName,
      description: newMindliSpotDescription !== '' ? newMindliSpotDescription : 'No description',
      date: date,
      time: time,
      repeat: selectedRepeat,
      notification: selectedNotification,
    };

    try {
      const newMindliEvents = [newMindliPlace, ...events];
      await AsyncStorage.setItem('events', JSON.stringify(newMindliEvents));
      setEvents(newMindliEvents);

      setIsItemAdded(true);

      setEventName('');
      setNewMindliSpotDescription('');
      setDate(new Date());
      setTime(new Date());
      setSelectedRepeat('');
      setSelectedNotification('');
    } catch (err) {
      console.error("Error saving event:", err);
    }
  };

  const saveMindliItem = async () => {
    const maxItemId = JSON.parse(await AsyncStorage.getItem('listOfItems')) || [];
    const newMaxItemId = maxItemId.length > 0 ? Math.max(...maxItemId.map(e => e.id)) + 1 : 1;
    const newMindliPlace = {
      id: newMaxItemId,
      title: itemName,
      numberOfPieces: numberOfPieces,
      itemPriority: itemPriority,
    };

    try {
      const newMindliEvents = [newMindliPlace, ...listOfItems];
      await AsyncStorage.setItem('listOfItems', JSON.stringify(newMindliEvents));
      setListOfItems(newMindliEvents);

      setIsItemAdded(true);

      setEventName('');
      setNumberOfPieces(1);
      setItemPriority('');

    } catch (err) {
      console.error("Error saving event:", err);
    }
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = nextMidnight.getTime() - now.getTime();
    const timer = setTimeout(() => {
      setInitialMinDate(new Date(new Date().setHours(0, 0, 0, 0)));
    }, msUntilMidnight);
    return () => clearTimeout(timer);
  }, [initialMinDate]);

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate && selectedDate >= new Date().setHours(0, 0, 0, 0)) {
      setDate(selectedDate);
    } else {
    }
  };

  useEffect(() => {
    if (mindliScrollViewRef.current) {
      mindliScrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [modalVisible]);

  const [newPlaceCoordinates, setNewPlaceCoordinates] = useState({
    latitude: -12.448279861436154,
    longitude: 130.82960082352463,
  });

  useEffect(() => {
    const loadMindliData = async () => {
      try {
        const storedItems = await AsyncStorage.getItem('listOfItems');
        const parsedItems = storedItems ? JSON.parse(storedItems) : [];
        setListOfItems(parsedItems);
      } catch (error) {
        console.error('Error loading listOfItems:', error);
      }

      try {
        const storedEvents = await AsyncStorage.getItem('events');
        const parsedEvents = storedEvents ? JSON.parse(storedEvents) : [];
        setEvents(parsedEvents);
      } catch (error) {
        console.error('Error loading events:', error);
      }

      try {
        const storedFavoriteSpots = await AsyncStorage.getItem('favoriteSpots');
        const parsedFavoriteSpots = storedFavoriteSpots ? JSON.parse(storedFavoriteSpots) : [];
        setFavoriteSpots(parsedFavoriteSpots);
      } catch (error) {
        console.error('Error loading favoriteSpots:', error);
      }
    };

    loadMindliData();
  }, []);

  const saveMindliPlace = async () => {
    const minFavoriteSpotId = JSON.parse(await AsyncStorage.getItem('favoriteSpots')) || [];
    const newMinFavoriteSpotId = minFavoriteSpotId.length > 0 ? Math.max(...minFavoriteSpotId.map(e => e.id)) + 1 : 1;
    const newMindliPlace = {
      id: newMinFavoriteSpotId,
      image: newMindliSpotImage,
      title: newMindliSpotTitle,
      description: newMindliSpotDescription !== '' ? newMindliSpotDescription : 'No description',
      coordinates: newPlaceCoordinates,
    };

    try {
      const newMindliFavoriteSpots = [newMindliPlace, ...favoriteSpots];
      await AsyncStorage.setItem('favoriteSpots', JSON.stringify(newMindliFavoriteSpots));
      setFavoriteSpots(newMindliFavoriteSpots);
      setIsItemAdded(true);
      setNewMindliSpotImage('');
      setNewMindliPlaceTitle('');
      setNewMindliSpotDescription('');
      setNewPlaceCoordinates({
        latitude: -12.448279861436154,
        longitude: 130.82960082352463,
      });
    } catch (err) {
      console.error("Error saving collection:", err);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      const now = new Date();
      if (date.toDateString() === now.toDateString()) {
        if (selectedTime < now) {
          setTime(now);
          return;
        }
      }
      setTime(selectedTime);
    }
  };

  const handleMindliSunsetPlaceImagePicker = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else {
        setNewMindliSpotImage(response.assets[0].uri);
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
            setNewMindliSpotImage('');
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleDeleteMindliSpot = async (id) => {
    const updatedMindliFavoriteSpots = favoriteSpots.filter(spot => spot.id !== id);
    setFavoriteSpots(updatedMindliFavoriteSpots);
    await AsyncStorage.setItem('favoriteSpots', JSON.stringify(updatedMindliFavoriteSpots));
  };

  const handleDeleteMindliItem = async (id) => {
    const updatedMindliItems = listOfItems.filter(item => item.id !== id);
    setListOfItems(updatedMindliItems);
    await AsyncStorage.setItem('listOfItems', JSON.stringify(updatedMindliItems));
  };

  const handleDeleteMindliEvent = async (id) => {
    const updatedMindliEvents = events.filter(ev => ev.id !== id);
    setEvents(updatedMindliEvents);
    await AsyncStorage.setItem('events', JSON.stringify(updatedMindliEvents));
  };

  const renderRightMindliItemActions = (item) => (
    <TouchableOpacity
      onPress={() => handleDeleteMindliItem(item.id)}
      style={{
        justifyContent: 'center',
        backgroundColor: 'transparent',
        alignItems: 'center',
        height: '100%',
        width: 68,
      }}
    >
      <Image
        source={require('../assets/icons/redTrashMindliIcon.png')}
        style={{
          width: dimensions.width * 0.07,
          height: dimensions.width * 0.07,
          alignSelf: 'center',
        }}
        resizeMode='contain'
      />
    </TouchableOpacity>
  );

  const handleSwipeableMindliItemOpen = (id) => {
    swipeableRefs.current.forEach((ref, key) => {
      if (key !== id && ref) {
        ref.close();
      }
    });
    setActiveSwipeableId(id);
  };

  const handleSwipeableMindliItemClose = (id) => {
    if (activeSwipeableId === id) {
      setActiveSwipeableId(null);
    }
  };

  const renderRightMindliEventActions = (item) => (
    <TouchableOpacity
      onPress={() => handleDeleteMindliEvent(item.id)}
      style={{
        justifyContent: 'center',
        backgroundColor: 'transparent',
        alignItems: 'center',
        height: '100%',
        width: 68,
      }}
    >
      <Image
        source={require('../assets/icons/redTrashMindliIcon.png')}
        style={{
          width: dimensions.width * 0.07,
          height: dimensions.width * 0.07,
          alignSelf: 'center',
        }}
        resizeMode='contain'
      />
    </TouchableOpacity>
  );

  const handleSwipeableMindliEventOpen = (id) => {
    swipeableRefs.current.forEach((ref, key) => {
      if (key !== id && ref) {
        ref.close();
      }
    });
    setActiveSwipeableId(id);
  };

  const handleSwipeableMindliEventClose = (id) => {
    if (activeSwipeableId === id) {
      setActiveSwipeableId(null);
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
        paddingBottom: dimensions.height * 0.163,
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
          </View>
        ) : (
          <>
            {listOfItems.map((item) => (
              <Swipeable
                key={item.id}
                ref={(ref) => {
                  if (ref) {
                    swipeableRefs.current.set(item.id, ref);
                  } else {
                    swipeableRefs.current.delete(item.id);
                  }
                }}
                renderRightActions={() => renderRightMindliItemActions(item)}
                onSwipeableOpen={() => handleSwipeableMindliItemOpen(item.id)}
                onSwipeableClose={() => handleSwipeableMindliItemClose(item.id)}
              >
                <View key={item.id} style={{
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
                      {item.title}
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
                        {item.itemPriority}
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
                    {item.numberOfPieces} piece{item.numberOfPieces > 1 ? 's' : ''}
                  </Text>
                </View>
              </Swipeable>
            ))}
          </>
        )}
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
            setAddingItemType('Item');
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
          </View>
        ) : (
          <>
            {events.map((event) => (
              <Swipeable
                key={event.id}
                ref={(ref) => {
                  if (ref) {
                    swipeableRefs.current.set(event.id, ref);
                  } else {
                    swipeableRefs.current.delete(event.id);
                  }
                }}
                renderRightActions={() => renderRightMindliEventActions(event)}
                onSwipeableOpen={() => handleSwipeableMindliEventOpen(event.id)}
                onSwipeableClose={() => handleSwipeableMindliEventClose(event.id)}
              >
                <View key={event.id} style={{
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
                    {event.title}
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
                    {formatDate(event.date)} {'   '} {formatTime(event.time)}
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
                        {event.repeat}
                      </Text>
                    </View>

                    <View style={{
                      paddingHorizontal: dimensions.width * 0.04,
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
                        {event.notification}
                      </Text>
                    </View>
                  </View>
                </View>

              </Swipeable>
            ))}
          </>
        )}
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
            setAddingItemType('Event');
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
            {favoriteSpots.map((favoriteSpot) => (
              <TouchableOpacity
                key={favoriteSpot.id}
                onPress={() => {
                  setSelectedMindliSpot(favoriteSpot);
                  setIsMindliSpotDetailsVisible(true);
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
                    source={{ uri: favoriteSpot.image }}
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
                  {favoriteSpot.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
            setAddingItemType('Spot');
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
        visible={isMindliSpotDetailsVisible}
        onRequestClose={() => {
          setIsMindliSpotDetailsVisible(!isMindliSpotDetailsVisible);
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
                setIsMindliSpotDetailsVisible(false);
                setSelectedMindliSpot(null);
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
            {selectedMindliSpot?.title}
          </Text>

          <Image
            source={{ uri: selectedMindliSpot?.image }}
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
            {selectedMindliSpot?.coordinates.latitude.toFixed(4)}° N, {selectedMindliSpot?.coordinates.longitude.toFixed(4)}° E
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
            {selectedMindliSpot?.description}
          </Text>

          <TouchableOpacity
            onPress={() => {
              handleDeleteMindliSpot(selectedMindliSpot.id);
              setIsMindliSpotDetailsVisible(false);
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        {!isItemAdded ? (
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

                alignItems: 'center',
                alignSelf: 'center',
                marginTop: dimensions.height * 0.01,
              }}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    setNewMindliSpotImage('');
                    setNewMindliPlaceTitle('');
                    setNewMindliSpotDescription('');
                    setNewPlaceCoordinates({
                      latitude: -12.448279861436154,
                      longitude: 130.82960082352463,
                    });
                    setAddingItemType('');
                    setEventName('');
                    setDate(new Date());
                    setTime(new Date());
                    setSelectedRepeat('');
                    setSelectedNotification('');
                    setItemName('');
                    setNumberOfPieces(1);
                    setItemPriority('');
                    
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
                    marginLeft: dimensions.width * 0.03,
                  }}>
                  Add your {addingItemType.toLocaleLowerCase()}
                </Text>
              </View>

              {addingItemType === 'Spot' ? (
                <>
                  {newMindliSpotImage === '' || !newMindliSpotImage ? (
                    <TouchableOpacity
                      onPress={() => handleMindliSunsetPlaceImagePicker()}
                      style={{
                        borderRadius: dimensions.width * 0.088,
                        backgroundColor: '#2C2C2C',
                        width: dimensions.width * 0.35,
                        height: dimensions.width * 0.35,
                        alignSelf: 'flex-start',
                        marginLeft: dimensions.width * 0.05,
                        marginTop: dimensions.height * 0.014,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={require('../assets/icons/addMindliPlaceImageIcon.png')}
                        style={{
                          width: dimensions.width * 0.21,
                          height: dimensions.width * 0.21,
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
                        source={{ uri: newMindliSpotImage }}
                        style={{
                          width: dimensions.width * 0.35,
                          height: dimensions.width * 0.35,
                          borderRadius: dimensions.width * 0.088,
                        }}
                        resizeMode='stretch'
                      />
                      <Image
                        source={require('../assets/icons/deleteMindliPlaceImageIcon.png')}
                        style={{
                          width: dimensions.width * 0.21,
                          height: dimensions.width * 0.21,
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
                    value={newMindliSpotTitle}
                    maxLength={55}
                    onChangeText={setNewMindliPlaceTitle}
                    placeholderTextColor="rgba(210, 210, 210, 0.91)"
                    placeholderTextSize={dimensions.width * 0.03}
                    style={{
                      backgroundColor: '#2C2C2C',
                      fontWeight: newMindliSpotTitle.length === 0 ? 400 : 600,
                      alignSelf: 'center',
                      width: dimensions.width * 0.9,
                      paddingHorizontal: dimensions.width * 0.05,
                      fontSize: dimensions.width * 0.043,
                      color: '#fff',
                      height: dimensions.height * 0.07,
                      fontFamily: fontSFProTextRegular,
                      borderRadius: dimensions.width * 0.1,
                      marginTop: dimensions.height * 0.005,
                    }}
                  />

                  <TextInput
                    placeholder="Description (optional)"
                    value={newMindliSpotDescription}
                    onChangeText={setNewMindliSpotDescription}
                    maxLength={250}
                    placeholderTextColor="rgba(210, 210, 210, 0.91)"
                    placeholderTextSize={dimensions.width * 0.03}
                    multiline={true}
                    textAlignVertical="top"
                    style={{
                      backgroundColor: '#2C2C2C',
                      fontWeight: newMindliSpotDescription.length === 0 ? 400 : 600,
                      alignSelf: 'center',
                      width: dimensions.width * 0.9,
                      paddingHorizontal: dimensions.width * 0.05,
                      fontSize: dimensions.width * 0.043,
                      color: '#fff',
                      height: dimensions.height * 0.16,
                      fontFamily: fontSFProTextRegular,
                      borderRadius: dimensions.width * 0.1,
                      marginTop: dimensions.height * 0.005,
                    }}
                  />
                  <MapView
                    style={{
                      width: dimensions.width * 0.9,
                      height: dimensions.height * 0.21,
                      borderRadius: dimensions.width * 0.0777,
                      alignSelf: 'center',
                      marginTop: dimensions.height * 0.005,
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

                  <TouchableOpacity
                    onPress={() => saveMindliPlace()}
                    disabled={newMindliSpotTitle.replace(/\s/g, '').length === 0 || !newMindliSpotImage || newMindliSpotImage === ''}
                    style={{
                      width: dimensions.width * 0.9,
                      height: dimensions.height * 0.07,
                      backgroundColor: newMindliSpotTitle.replace(/\s/g, '').length === 0 || !newMindliSpotImage || newMindliSpotImage === '' ? '#939393' : '#DEC05B',
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
                        color: '#2C2C2C',
                        fontSize: dimensions.width * 0.055,
                        textAlign: 'right',
                        alignSelf: 'center',
                        fontWeight: 400,
                      }}>
                      Add new spot
                    </Text>
                  </TouchableOpacity>
                </>
              ) : addingItemType === 'Event' ? (
                <ScrollView style={{
                  width: dimensions.width * 0.9,
                  alignSelf: 'center',
                }} contentContainerStyle={{
                  paddingBottom: dimensions.height * 0.163,
                }} showsVerticalScrollIndicator={false}>
                  <Image
                    source={require('../assets/images/palmsSettingsImage.png')}
                    style={{
                      width: dimensions.width * 0.4,
                      height: dimensions.height * 0.21,
                      alignSelf: 'center',
                    }}
                    resizeMode='contain'
                  />

                  <TextInput
                    placeholder="Event name"
                    value={eventName}
                    maxLength={55}
                    onChangeText={setEventName}
                    placeholderTextColor="rgba(210, 210, 210, 0.91)"
                    placeholderTextSize={dimensions.width * 0.03}
                    style={{
                      backgroundColor: '#2C2C2C',
                      fontWeight: eventName.length === 0 ? 400 : 600,
                      alignSelf: 'center',
                      width: dimensions.width * 0.9,
                      paddingHorizontal: dimensions.width * 0.05,
                      fontSize: dimensions.width * 0.043,
                      color: '#fff',
                      height: dimensions.height * 0.07,
                      fontFamily: fontSFProTextRegular,
                      borderRadius: dimensions.width * 0.1,
                      marginTop: dimensions.height * 0.005,
                    }}
                  />

                  <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    display="inline"
                    minimumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      handleDateChange(event, selectedDate);
                    }}
                    textColor='white'
                    zIndex={1000}
                    dateColor='white'
                    style={{
                      width: dimensions.width * 0.9,
                      fontSize: dimensions.width * 0.03,
                      alignSelf: 'center',
                    }}
                    themeVariant='dark' //worked on ios only
                    accentColor='#AC9958' //worked on ios only
                  />

                  <View style={{
                    width: dimensions.width * 0.9,
                    alignSelf: 'center',
                    backgroundColor: '#2C2C2C',
                    borderRadius: dimensions.width * 0.1,
                  }}>
                    <DateTimePicker
                      value={time || new Date()}
                      mode="time"
                      display="spinner"
                      textColor='white'
                      zIndex={1000}
                      onChange={(event, selectedTime) => {
                        handleTimeChange(event, selectedTime);
                      }}
                      style={{
                        width: dimensions.width * 0.9,
                        fontSize: dimensions.width * 0.03,
                        alignSelf: 'center',
                      }}
                      themeVariant='dark' //worked on ios only
                    />
                  </View>

                  <Text
                    style={{
                      fontFamily: fontSFProTextRegular,
                      color: '#FFFFFF80',
                      fontSize: dimensions.width * 0.04,
                      textAlign: 'left',
                      alignSelf: 'flex-start',
                      fontWeight: 400,
                      marginTop: dimensions.height * 0.03,
                    }}>
                    Repeat
                  </Text>

                  {['Weekly', 'Monthly'].map((item, index) => (
                    <TouchableOpacity
                      onPress={() => setSelectedRepeat(item)}
                      key={index} style={{
                        width: dimensions.width * 0.9,
                        height: dimensions.height * 0.07,
                        alignSelf: 'center',
                        backgroundColor: '#2C2C2C',
                        borderRadius: dimensions.width * 0.1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: dimensions.height * 0.005,
                        borderColor: '#AC9958',
                        borderWidth: selectedRepeat === item ? dimensions.width * 0.00777 : 0,
                      }}>
                      <Text
                        style={{
                          fontFamily: fontSFProTextRegular,
                          color: 'white',
                          fontSize: dimensions.width * 0.046,
                          textAlign: 'center',
                          alignSelf: 'center',
                          fontWeight: 400,
                        }}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  <Text
                    style={{
                      fontFamily: fontSFProTextRegular,
                      color: '#FFFFFF80',
                      fontSize: dimensions.width * 0.04,
                      textAlign: 'left',
                      alignSelf: 'flex-start',
                      fontWeight: 400,
                      marginTop: dimensions.height * 0.03,
                    }}>
                    Notification
                  </Text>
                  {['In 1 hour', 'In 1 day'].map((item, index) => (
                    <TouchableOpacity
                      onPress={() => setSelectedNotification(item)}
                      key={index} style={{
                        width: dimensions.width * 0.9,
                        height: dimensions.height * 0.07,
                        alignSelf: 'center',
                        backgroundColor: '#2C2C2C',
                        borderRadius: dimensions.width * 0.1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: dimensions.height * 0.005,
                        borderColor: '#AC9958',
                        borderWidth: selectedNotification === item ? dimensions.width * 0.00777 : 0,
                      }}>
                      <Text
                        style={{
                          fontFamily: fontSFProTextRegular,
                          color: 'white',
                          fontSize: dimensions.width * 0.046,
                          textAlign: 'center',
                          alignSelf: 'center',
                          fontWeight: 400,
                        }}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity
                    onPress={() => saveMindliEvent()}
                    disabled={eventName.replace(/\s/g, '').length === 0 || selectedRepeat === '' || selectedNotification === ''}
                    style={{
                      width: dimensions.width * 0.9,
                      height: dimensions.height * 0.07,
                      backgroundColor: eventName.replace(/\s/g, '').length === 0 || selectedRepeat === '' || selectedNotification === '' ? '#939393' : '#DEC05B',
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
                        color: '#2C2C2C',
                        fontSize: dimensions.width * 0.055,
                        textAlign: 'right',
                        alignSelf: 'center',
                        fontWeight: 400,
                      }}>
                      Add new event
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              ) : (
                <ScrollView style={{
                  width: dimensions.width * 0.9,
                  alignSelf: 'center',
                }} contentContainerStyle={{
                  paddingBottom: dimensions.height * 0.16,
                }} showsVerticalScrollIndicator={false}>
                  <Image
                    source={require('../assets/images/palmsSettingsImage.png')}
                    style={{
                      width: dimensions.width * 0.4,
                      height: dimensions.height * 0.21,
                      alignSelf: 'center',
                    }}
                    resizeMode='contain'
                  />

                  <TextInput
                    placeholder="Item name"
                    value={itemName}
                    maxLength={55}
                    onChangeText={setItemName}
                    placeholderTextColor="rgba(210, 210, 210, 0.91)"
                    placeholderTextSize={dimensions.width * 0.03}
                    style={{
                      backgroundColor: '#2C2C2C',
                      fontWeight: itemName.length === 0 ? 400 : 600,
                      alignSelf: 'center',
                      width: dimensions.width * 0.9,
                      paddingHorizontal: dimensions.width * 0.05,
                      fontSize: dimensions.width * 0.043,
                      color: '#fff',
                      height: dimensions.height * 0.07,
                      fontFamily: fontSFProTextRegular,
                      borderRadius: dimensions.width * 0.1,
                      marginTop: dimensions.height * 0.005,
                    }}
                  />

                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    marginTop: dimensions.height * 0.014,
                  }}>
                    <TouchableOpacity
                      onPress={() => {
                        setNumberOfPieces((prev) => prev - 1);
                      }}
                      disabled={numberOfPieces === 1}
                      style={{
                        width: dimensions.width * 0.111,
                        height: dimensions.width * 0.111,
                        backgroundColor: '#595959',
                        borderRadius: dimensions.width * 0.034,
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: numberOfPieces === 1 ? 0.5 : 1,
                      }}>
                      <Image
                        source={require('../assets/icons/mindliMinusIcon.png')}
                        style={{
                          width: dimensions.width * 0.05,
                          height: dimensions.width * 0.05,
                          alignSelf: 'center',
                        }}
                        resizeMode='contain'
                      />
                    </TouchableOpacity>

                    <Text
                      style={{
                        fontFamily: fontSFProTextRegular,
                        color: 'white',
                        fontSize: dimensions.width * 0.05,
                        textAlign: 'center',
                        alignSelf: 'center',
                        fontWeight: 500,
                        width: dimensions.width * 0.08,
                      }}>
                      {numberOfPieces}
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        setNumberOfPieces((prev) => prev + 1);
                      }}
                      disabled={numberOfPieces === 50}
                      style={{
                        width: dimensions.width * 0.111,
                        height: dimensions.width * 0.111,
                        backgroundColor: '#595959',
                        borderRadius: dimensions.width * 0.034,
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: numberOfPieces === 50 ? 0.5 : 1,
                      }}>
                      <Image
                        source={require('../assets/icons/mindliPlusIcon.png')}
                        style={{
                          width: dimensions.width * 0.05,
                          height: dimensions.width * 0.05,
                          alignSelf: 'center',
                        }}
                        resizeMode='contain'
                      />
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={{
                      fontFamily: fontSFProTextRegular,
                      color: '#FFFFFF80',
                      fontSize: dimensions.width * 0.04,
                      textAlign: 'left',
                      alignSelf: 'flex-start',
                      fontWeight: 400,
                      marginTop: dimensions.height * 0.03,
                    }}>
                    Priority
                  </Text>
                  {['High', 'Medium', 'Low'].map((item, index) => (
                    <TouchableOpacity
                      onPress={() => setItemPriority(item)}
                      key={index} style={{
                        width: dimensions.width * 0.9,
                        height: dimensions.height * 0.07,
                        alignSelf: 'center',
                        backgroundColor: '#2C2C2C',
                        borderRadius: dimensions.width * 0.1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: dimensions.height * 0.005,
                        borderColor: '#AC9958',
                        borderWidth: itemPriority === item ? dimensions.width * 0.00777 : 0,
                      }}>
                      <Text
                        style={{
                          fontFamily: fontSFProTextRegular,
                          color: 'white',
                          fontSize: dimensions.width * 0.046,
                          textAlign: 'center',
                          alignSelf: 'center',
                          fontWeight: 400,
                        }}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity
                    onPress={() => saveMindliItem()}
                    disabled={itemName.replace(/\s/g, '').length === 0 || itemPriority === ''}
                    style={{
                      width: dimensions.width * 0.9,
                      height: dimensions.height * 0.07,
                      backgroundColor: itemName.replace(/\s/g, '').length === 0 || itemPriority === '' ? '#939393' : '#DEC05B',
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
                        color: '#2C2C2C',
                        fontSize: dimensions.width * 0.055,
                        textAlign: 'right',
                        alignSelf: 'center',
                        fontWeight: 400,
                      }}>
                      Add new item
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              )}

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
                setModalVisible(false);
                setIsItemAdded(false);
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
              source={require('../assets/images/palmsSettingsImage.png')}
              style={{
                width: dimensions.width * 0.75,
                height: dimensions.height * 0.34,
                alignSelf: 'center',
                marginTop: dimensions.height * 0.16,
              }}
              resizeMode='contain'
            />
            <Text
              style={{
                fontFamily: fontSFProTextRegular,
                color: 'white',
                fontSize: dimensions.width * 0.111,
                textAlign: 'right',
                alignSelf: 'center',
                fontWeight: 400,
                marginTop: -dimensions.height * 0.01,
              }}>
              {addingItemType} added
            </Text>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
};

export default MindliPlannerScreen;
