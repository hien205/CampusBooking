import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  RootStackParamList,
} from '../navigation/AppNavigator';

import {
  useRoomsQuery,
} from '../hooks/useRoomsQuery';

import {
  isTimeSlotBooked,
} from '../services/bookingService';

import {
  useBookingStore,
} from '../store/bookingStore';

type Props =
  NativeStackScreenProps<
    RootStackParamList,
    'RoomDetail'
  >;

const TIME_SLOTS = [
  '08:00 - 10:00',
  '10:00 - 12:00',
  '13:00 - 15:00',
  '15:00 - 17:00',
];

const DATE_OPTIONS = [
  'Hôm nay',
  'Ngày mai',
  'Ngày kia',
];

export default function RoomDetailScreen({
  route,
}: Props) {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<
        RootStackParamList
      >
    >();

  const { roomId } =
    route.params;

  const {
    data: rooms = [],
    isLoading,
  } = useRoomsQuery();

  const room = rooms.find(
    (item) =>
      item.id === roomId
  );

  const addBooking =
    useBookingStore(
      (state) =>
        state.addBooking
    );

  const resetBooking =
    useBookingStore(
      (state) =>
        state.resetBooking
    );

  const [
    selectedDate,
    setSelectedDate,
  ] = useState('Hôm nay');

  const [
    selectedTime,
    setSelectedTime,
  ] = useState('');

  const [
    bookedSlots,
    setBookedSlots,
  ] = useState<string[]>([]);

  const [
    checkingSlots,
    setCheckingSlots,
  ] = useState(false);

  const [
    booking,
    setBooking,
  ] = useState(false);

  /*
   * ==============================
   * ANIMATION
   * ==============================
   */

  const imageOpacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const imageScale =
    useRef(
      new Animated.Value(1.05)
    ).current;

  const bodyOpacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const bodyTranslateY =
    useRef(
      new Animated.Value(25)
    ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(
        imageOpacity,
        {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }
      ),

      Animated.timing(
        imageScale,
        {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }
      ),

      Animated.timing(
        bodyOpacity,
        {
          toValue: 1,
          duration: 500,
          delay: 150,
          useNativeDriver: true,
        }
      ),

      Animated.spring(
        bodyTranslateY,
        {
          toValue: 0,
          speed: 12,
          bounciness: 4,
          useNativeDriver: true,
        }
      ),
    ]).start();
  }, [
    imageOpacity,
    imageScale,
    bodyOpacity,
    bodyTranslateY,
  ]);

  /*
   * ==============================
   * KIỂM TRA SLOT
   * ==============================
   */

  useEffect(() => {
    let cancelled = false;

    async function checkSlots() {
      if (!room) {
        return;
      }

      setCheckingSlots(true);

      try {
        const results =
          await Promise.all(
            TIME_SLOTS.map(
              async (time) => {
                const booked =
                  await isTimeSlotBooked(
                    room.id,
                    selectedDate,
                    time
                  );

                return {
                  time,
                  booked,
                };
              }
            )
          );

        if (cancelled) {
          return;
        }

        setBookedSlots(
          results
            .filter(
              (item) =>
                item.booked
            )
            .map(
              (item) =>
                item.time
            )
        );
      } catch (error) {
        console.log(
          'Không thể kiểm tra lịch:',
          error
        );

        if (!cancelled) {
          setBookedSlots([]);
        }
      } finally {
        if (!cancelled) {
          setCheckingSlots(false);
        }
      }
    }

    checkSlots();

    return () => {
      cancelled = true;
    };
  }, [
    room,
    selectedDate,
  ]);

  /*
   * ==============================
   * LOADING
   * ==============================
   */

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#D65A82"
        />

        <Text
          style={styles.loadingText}
        >
          Đang tải thông tin phòng...
        </Text>
      </View>
    );
  }

  /*
   * ==============================
   * ROOM NOT FOUND
   * ==============================
   */

  if (!room) {
    return (
      <View style={styles.center}>
        <View
          style={styles.errorIconCircle}
        >
          <Text
            style={styles.errorIcon}
          >
            !
          </Text>
        </View>

        <Text
          style={styles.errorTitle}
        >
          Không tìm thấy phòng
        </Text>

        <Text
          style={styles.errorText}
        >
          Phòng có thể đã bị xóa
          hoặc không còn tồn tại.
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }
        >
          <Text
            style={
              styles.backButtonText
            }
          >
            Quay lại
          </Text>
        </Pressable>
      </View>
    );
  }

  /*
   * ==============================
   * CHỌN NGÀY
   * ==============================
   */

  const handleDateChange = (
    date: string
  ) => {
    setSelectedDate(date);
    setSelectedTime('');
    resetBooking();
  };

  /*
   * ==============================
   * CHỌN GIỜ
   * ==============================
   */

  const handleTimeSelect = (
    time: string
  ) => {
    if (
      bookedSlots.includes(time)
    ) {
      return;
    }

    setSelectedTime(time);
  };

  /*
   * ==============================
   * ĐẶT PHÒNG
   * ==============================
   */

  const handleBooking = async () => {
    if (!selectedTime) {
      Alert.alert(
        'Chưa chọn thời gian',
        'Vui lòng chọn một khung giờ.'
      );

      return;
    }

    if (
      bookedSlots.includes(
        selectedTime
      )
    ) {
      Alert.alert(
        'Khung giờ đã được đặt',
        'Vui lòng chọn khung giờ khác.'
      );

      return;
    }

    try {
      setBooking(true);

      await addBooking({
        roomId: room.id,
        roomName: room.name,
        date: selectedDate,
        time: selectedTime,
        slotId: `${room.id}_${selectedDate}_${selectedTime}`,
      });

      Alert.alert(
        'Đặt phòng thành công 🎉',
        `${room.name}\n${selectedDate}\n${selectedTime}`,
        [
          {
            text: 'Ở lại',
            style: 'cancel',
            onPress: () => {
              setSelectedTime('');
            },
          },
          {
            text: 'Xem lịch đặt',
            onPress: () => {
              navigation.navigate(
                'MainTabs',
                {
                  screen: 'Bookings',
                }
              );
            },
          },
        ]
      );
    } catch (error: any) {
      console.log(
        'Booking error:',
        error
      );

      /*
       * Người khác vừa đặt trước.
       */

      if (
        error?.message ===
        'TIME_SLOT_ALREADY_BOOKED'
      ) {
        Alert.alert(
          'Khung giờ vừa được đặt',
          'Người khác đã đặt khung giờ này. Vui lòng chọn giờ khác.'
        );

        setBookedSlots(
          (current) =>
            current.includes(
              selectedTime
            )
              ? current
              : [
                  ...current,
                  selectedTime,
                ]
        );

        setSelectedTime('');
      }

      /*
       * Chưa đăng nhập.
       */

      else if (
        error?.message ===
        'USER_NOT_LOGGED_IN'
      ) {
        Alert.alert(
          'Chưa đăng nhập',
          'Vui lòng đăng nhập lại.'
        );
      }

      /*
       * Lỗi khác.
       */

      else {
        Alert.alert(
          'Không thể đặt phòng',
          'Đã xảy ra lỗi. Vui lòng thử lại.'
        );
      }
    } finally {
      setBooking(false);
    }
  };

  /*
   * ==============================
   * UI
   * ==============================
   */

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      {/* ========================= */}
      {/* ROOM IMAGE */}
      {/* ========================= */}

      <Animated.View
        style={[
          styles.imageContainer,
          {
            opacity:
              imageOpacity,

            transform: [
              {
                scale:
                  imageScale,
              },
            ],
          },
        ]}
      >
        <Image
          source={{
            uri: room.image,
          }}
          style={styles.image}
        />

        <View
          style={styles.imageOverlay}
        >
          <Pressable
            style={styles.backIconButton}
            onPress={() =>
              navigation.goBack()
            }
          >
            <Text
              style={
                styles.backIconText
              }
            >
              ‹
            </Text>
          </Pressable>

          <View
            style={[
              styles.roomStatus,
              room.available
                ? styles.roomStatusAvailable
                : styles.roomStatusFull,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                room.available
                  ? styles.statusDotAvailable
                  : styles.statusDotFull,
              ]}
            />

            <Text
              style={[
                styles.roomStatusText,
                room.available
                  ? styles.roomStatusTextAvailable
                  : styles.roomStatusTextFull,
              ]}
            >
              {room.available
                ? 'Đang trống'
                : 'Đã đầy'}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* ========================= */}
      {/* BODY */}
      {/* ========================= */}

      <Animated.View
        style={[
          styles.body,
          {
            opacity:
              bodyOpacity,

            transform: [
              {
                translateY:
                  bodyTranslateY,
              },
            ],
          },
        ]}
      >
        {/* ROOM TITLE */}

        <View
          style={styles.titleRow}
        >
          <View
            style={
              styles.titleContent
            }
          >
            <Text
              style={styles.title}
            >
              {room.name}
            </Text>

            <Text
              style={styles.location}
            >
              📍 {room.building} •{' '}
              {room.area}
            </Text>
          </View>
        </View>

        {/* INFO */}

        <View style={styles.infoRow}>
          <View
            style={styles.infoCard}
          >
            <View
              style={styles.infoIconBox}
            >
              <Text
                style={styles.infoIcon}
              >
                👥
              </Text>
            </View>

            <View>
              <Text
                style={
                  styles.infoLabel
                }
              >
                Sức chứa
              </Text>

              <Text
                style={
                  styles.infoValue
                }
              >
                {room.capacity} người
              </Text>
            </View>
          </View>

          <View
            style={styles.infoCard}
          >
            <View
              style={styles.infoIconBox}
            >
              <Text
                style={styles.infoIcon}
              >
                🏢
              </Text>
            </View>

            <View>
              <Text
                style={
                  styles.infoLabel
                }
              >
                Vị trí
              </Text>

              <Text
                style={
                  styles.infoValue
                }
              >
                Tầng {room.floor}
              </Text>
            </View>
          </View>
        </View>

        {/* ========================= */}
        {/* DATE */}
        {/* ========================= */}

        <Text
          style={styles.sectionTitle}
        >
          Chọn ngày
        </Text>

        <View
          style={styles.dateGrid}
        >
          {DATE_OPTIONS.map(
            (date) => {
              const active =
                selectedDate ===
                date;

              return (
                <Pressable
                  key={date}
                  onPress={() =>
                    handleDateChange(
                      date
                    )
                  }
                  style={({ pressed }) => [
                    styles.dateCard,

                    active &&
                      styles.dateCardActive,

                    pressed &&
                      !active &&
                      styles.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateIcon,
                      active &&
                        styles.dateIconActive,
                    ]}
                  >
                    📅
                  </Text>

                  <Text
                    style={[
                      styles.dateText,
                      active &&
                        styles.dateTextActive,
                    ]}
                  >
                    {date}
                  </Text>

                  {active && (
                    <View
                      style={
                        styles.checkCircle
                      }
                    >
                      <Text
                        style={
                          styles.checkText
                        }
                      >
                        ✓
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            }
          )}
        </View>

        {/* ========================= */}
        {/* TIME */}
        {/* ========================= */}

        <View
          style={styles.timeTitleRow}
        >
          <View>
            <Text
              style={
                styles.sectionTitle
              }
            >
              Chọn khung giờ
            </Text>

            <Text
              style={
                styles.timeSubtitle
              }
            >
              Chọn một khung giờ để đặt
            </Text>
          </View>

          <View
            style={
              styles.availableSmallBadge
            }
          >
            <View
              style={
                styles.availableSmallDot
              }
            />

            <Text
              style={
                styles.availableSmallText
              }
            >
              Còn trống
            </Text>
          </View>
        </View>

        {checkingSlots ? (
          <View
            style={styles.checking}
          >
            <ActivityIndicator
              color="#D65A82"
            />

            <Text
              style={styles.checkingText}
            >
              Đang kiểm tra lịch...
            </Text>
          </View>
        ) : (
          <View
            style={styles.timeGrid}
          >
            {TIME_SLOTS.map(
              (time) => {
                const booked =
                  bookedSlots.includes(
                    time
                  );

                const selected =
                  selectedTime ===
                  time;

                return (
                  <Pressable
                    key={time}
                    disabled={booked}
                    onPress={() =>
                      handleTimeSelect(
                        time
                      )
                    }
                    style={({ pressed }) => [
                      styles.timeCard,

                      selected &&
                        styles.timeCardSelected,

                      booked &&
                        styles.timeCardBooked,

                      pressed &&
                        !booked &&
                        styles.timeCardPressed,
                    ]}
                  >
                    <View
                      style={
                        styles.timeLeft
                      }
                    >
                      <View
                        style={[
                          styles.clockIconBox,
                          selected &&
                            styles.clockIconBoxSelected,
                          booked &&
                            styles.clockIconBoxBooked,
                        ]}
                      >
                        <Text
                          style={
                            styles.clockIcon
                          }
                        >
                          🕐
                        </Text>
                      </View>

                      <View>
                        <Text
                          style={[
                            styles.timeText,
                            selected &&
                              styles.timeTextSelected,
                            booked &&
                              styles.timeTextBooked,
                          ]}
                        >
                          {time}
                        </Text>

                        <Text
                          style={[
                            styles.statusText,
                            booked &&
                              styles.statusBooked,
                            selected &&
                              styles.statusSelected,
                          ]}
                        >
                          {booked
                            ? 'Đã được đặt'
                            : selected
                            ? 'Đã chọn'
                            : 'Còn trống'}
                        </Text>
                      </View>
                    </View>

                    {selected && (
                      <View
                        style={
                          styles.selectedCircle
                        }
                      >
                        <Text
                          style={
                            styles.selectedCheck
                          }
                        >
                          ✓
                        </Text>
                      </View>
                    )}

                    {booked && (
                      <View
                        style={
                          styles.bookedBadge
                        }
                      >
                        <Text
                          style={
                            styles.bookedBadgeText
                          }
                        >
                          ĐÃ ĐẶT
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              }
            )}
          </View>
        )}

        {/* ========================= */}
        {/* BOOKING SUMMARY */}
        {/* ========================= */}

        {selectedTime && (
          <View
            style={
              styles.summaryCard
            }
          >
            <View
              style={
                styles.summaryIcon
              }
            >
              <Text>
                ✓
              </Text>
            </View>

            <View
              style={
                styles.summaryContent
              }
            >
              <Text
                style={
                  styles.summaryTitle
                }
              >
                Thông tin đặt phòng
              </Text>

              <Text
                style={
                  styles.summaryText
                }
              >
                {selectedDate} •{' '}
                {selectedTime}
              </Text>
            </View>
          </View>
        )}

        {/* ========================= */}
        {/* BOOKING BUTTON */}
        {/* ========================= */}

        <Pressable
          disabled={
            booking ||
            !selectedTime
          }
          onPress={handleBooking}
          style={({ pressed }) => [
            styles.bookingButton,

            (!selectedTime ||
              booking) &&
              styles.bookingButtonDisabled,

            pressed &&
              selectedTime &&
              !booking &&
              styles.bookingButtonPressed,
          ]}
        >
          {booking ? (
            <>
              <ActivityIndicator
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.bookingButtonText
                }
              >
                Đang đặt phòng...
              </Text>
            </>
          ) : (
            <>
              <Text
                style={
                  styles.bookingButtonIcon
                }
              >
                ✓
              </Text>

              <Text
                style={
                  styles.bookingButtonText
                }
              >
                {selectedTime
                  ? 'Xác nhận đặt phòng'
                  : 'Chọn khung giờ'}
              </Text>
            </>
          )}
        </Pressable>

        <Text
          style={
            styles.bottomNote
          }
        >
          🔒 Lịch đặt được kiểm tra
          trực tiếp trên hệ thống
        </Text>
      </Animated.View>
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF9FB',
    },

    content: {
      paddingBottom: 45,
    },

    /*
     * ==========================
     * IMAGE
     * ==========================
     */

    imageContainer: {
      width: '100%',
      height: 250,
      overflow: 'hidden',
      backgroundColor: '#E5E7EB',
    },

    image: {
      width: '100%',
      height: '100%',
    },

    imageOverlay: {
      position: 'absolute',
      top: 18,
      left: 18,
      right: 18,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    backIconButton: {
      width: 43,
      height: 43,
      borderRadius: 14,

      backgroundColor:
        'rgba(255,255,255,0.94)',

      alignItems: 'center',
      justifyContent: 'center',

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },

    backIconText: {
      fontSize: 34,
      lineHeight: 37,
      color: '#29232A',
      marginTop: -3,
    },

    roomStatus: {
      flexDirection: 'row',
      alignItems: 'center',

      paddingHorizontal: 12,
      paddingVertical: 8,

      borderRadius: 20,

      backgroundColor: '#FFFFFF',
    },

    roomStatusAvailable: {
      backgroundColor: '#ECFDF5',
    },

    roomStatusFull: {
      backgroundColor: '#FEF2F2',
    },

    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6,
    },

    statusDotAvailable: {
      backgroundColor: '#22C55E',
    },

    statusDotFull: {
      backgroundColor: '#EF4444',
    },

    roomStatusText: {
      fontSize: 11,
      fontWeight: '800',
    },

    roomStatusTextAvailable: {
      color: '#15803D',
    },

    roomStatusTextFull: {
      color: '#DC2626',
    },

    /*
     * ==========================
     * BODY
     * ==========================
     */

    body: {
      paddingHorizontal: 20,
      paddingTop: 22,
    },

    titleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },

    titleContent: {
      flex: 1,
    },

    title: {
      fontSize: 27,
      fontWeight: '900',
      color: '#29232A',
      letterSpacing: -0.5,
    },

    location: {
      marginTop: 7,
      fontSize: 13,
      color: '#777',
    },

    /*
     * ==========================
     * INFO
     * ==========================
     */

    infoRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 20,
    },

    infoCard: {
      flex: 1,

      minHeight: 75,

      flexDirection: 'row',
      alignItems: 'center',

      backgroundColor: '#FFFFFF',

      borderRadius: 17,

      paddingHorizontal: 13,

      borderWidth: 1,
      borderColor: '#F1E8EC',
    },

    infoIconBox: {
      width: 40,
      height: 40,
      borderRadius: 13,

      backgroundColor: '#FFF0F5',

      alignItems: 'center',
      justifyContent: 'center',

      marginRight: 9,
    },

    infoIcon: {
      fontSize: 17,
    },

    infoLabel: {
      fontSize: 10,
      color: '#999',
      marginBottom: 3,
    },

    infoValue: {
      fontSize: 13,
      fontWeight: '800',
      color: '#29232A',
    },

    /*
     * ==========================
     * SECTION
     * ==========================
     */

    sectionTitle: {
      marginTop: 26,
      marginBottom: 5,

      fontSize: 18,
      fontWeight: '900',

      color: '#29232A',
    },

    /*
     * ==========================
     * DATE
     * ==========================
     */

    dateGrid: {
      flexDirection: 'row',
      gap: 9,
      marginTop: 8,
    },

    dateCard: {
      flex: 1,

      minHeight: 67,

      backgroundColor: '#FFFFFF',

      borderRadius: 15,

      borderWidth: 1,
      borderColor: '#EEE7EA',

      alignItems: 'center',
      justifyContent: 'center',

      position: 'relative',
    },

    dateCardActive: {
      backgroundColor: '#D65A82',
      borderColor: '#D65A82',
    },

    dateIcon: {
      fontSize: 17,
      marginBottom: 5,
    },

    dateIconActive: {
      opacity: 1,
    },

    dateText: {
      color: '#555',
      fontSize: 11,
      fontWeight: '700',
    },

    dateTextActive: {
      color: '#FFFFFF',
    },

    checkCircle: {
      position: 'absolute',

      top: 6,
      right: 6,

      width: 17,
      height: 17,

      borderRadius: 9,

      backgroundColor:
        'rgba(255,255,255,0.28)',

      alignItems: 'center',
      justifyContent: 'center',
    },

    checkText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: '900',
    },

    pressed: {
      opacity: 0.75,
    },

    /*
     * ==========================
     * TIME
     * ==========================
     */

    timeTitleRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },

    timeSubtitle: {
      fontSize: 11,
      color: '#999',
      marginBottom: 10,
    },

    availableSmallBadge: {
      flexDirection: 'row',
      alignItems: 'center',

      backgroundColor: '#ECFDF5',

      paddingHorizontal: 8,
      paddingVertical: 5,

      borderRadius: 15,

      marginBottom: 8,
    },

    availableSmallDot: {
      width: 6,
      height: 6,
      borderRadius: 3,

      backgroundColor: '#22C55E',

      marginRight: 5,
    },

    availableSmallText: {
      fontSize: 9,
      fontWeight: '800',
      color: '#15803D',
    },

    checking: {
      minHeight: 100,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',

      gap: 10,
    },

    checkingText: {
      color: '#777',
      fontSize: 12,
    },

    timeGrid: {
      gap: 10,
      marginTop: 8,
    },

    timeCard: {
      minHeight: 72,

      backgroundColor: '#FFFFFF',

      borderRadius: 17,

      borderWidth: 1,
      borderColor: '#EEE7EA',

      paddingHorizontal: 13,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    timeCardSelected: {
      borderColor: '#D65A82',
      backgroundColor: '#FFF0F5',
    },

    timeCardBooked: {
      opacity: 0.55,
      backgroundColor: '#F3F3F3',
    },

    timeCardPressed: {
      transform: [
        {
          scale: 0.985,
        },
      ],
    },

    timeLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    clockIconBox: {
      width: 43,
      height: 43,

      borderRadius: 13,

      backgroundColor: '#F8F4F5',

      alignItems: 'center',
      justifyContent: 'center',

      marginRight: 10,
    },

    clockIconBoxSelected: {
      backgroundColor: '#FFE0EA',
    },

    clockIconBoxBooked: {
      backgroundColor: '#E5E5E5',
    },

    clockIcon: {
      fontSize: 18,
    },

    timeText: {
      fontSize: 14,
      fontWeight: '800',
      color: '#29232A',
    },

    timeTextSelected: {
      color: '#D65A82',
    },

    timeTextBooked: {
      color: '#888',
    },

    statusText: {
      marginTop: 4,
      fontSize: 10,
      color: '#22A447',
      fontWeight: '600',
    },

    statusBooked: {
      color: '#999',
    },

    statusSelected: {
      color: '#D65A82',
    },

    selectedCircle: {
      width: 27,
      height: 27,

      borderRadius: 14,

      backgroundColor: '#D65A82',

      alignItems: 'center',
      justifyContent: 'center',
    },

    selectedCheck: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '900',
    },

    bookedBadge: {
      backgroundColor: '#E4E4E7',

      paddingHorizontal: 8,
      paddingVertical: 5,

      borderRadius: 8,
    },

    bookedBadgeText: {
      fontSize: 8,
      fontWeight: '900',
      color: '#71717A',
    },

    /*
     * ==========================
     * SUMMARY
     * ==========================
     */

    summaryCard: {
      flexDirection: 'row',
      alignItems: 'center',

      backgroundColor: '#FFF0F5',

      borderRadius: 15,

      padding: 12,

      marginTop: 16,

      borderWidth: 1,
      borderColor: '#FFD6E3',
    },

    summaryIcon: {
      width: 34,
      height: 34,

      borderRadius: 11,

      backgroundColor: '#D65A82',

      alignItems: 'center',
      justifyContent: 'center',

      marginRight: 10,
    },

    summaryContent: {
      flex: 1,
    },

    summaryTitle: {
      fontSize: 11,
      fontWeight: '800',
      color: '#9F3158',
    },

    summaryText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#29232A',
      marginTop: 3,
    },

    /*
     * ==========================
     * BOOKING BUTTON
     * ==========================
     */

    bookingButton: {
      marginTop: 22,

      height: 56,

      borderRadius: 17,

      backgroundColor: '#D65A82',

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',

      gap: 9,

      shadowColor: '#D65A82',
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.22,
      shadowRadius: 10,
      elevation: 5,
    },

    bookingButtonDisabled: {
      backgroundColor: '#D6C8CD',
      shadowOpacity: 0,
      elevation: 0,
    },

    bookingButtonPressed: {
      transform: [
        {
          scale: 0.98,
        },
      ],
    },

    bookingButtonIcon: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '900',
    },

    bookingButtonText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '900',
    },

    bottomNote: {
      textAlign: 'center',
      marginTop: 11,

      color: '#A1A1AA',
      fontSize: 10,
    },

    /*
     * ==========================
     * CENTER / ERROR
     * ==========================
     */

    center: {
      flex: 1,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor: '#FFF9FB',

      padding: 25,
    },

    loadingText: {
      marginTop: 12,
      color: '#777',
      fontSize: 13,
    },

    errorIconCircle: {
      width: 65,
      height: 65,

      borderRadius: 22,

      backgroundColor: '#FFF0F0',

      alignItems: 'center',
      justifyContent: 'center',

      marginBottom: 15,
    },

    errorIcon: {
      fontSize: 30,
      fontWeight: '900',
      color: '#EF4444',
    },

    errorTitle: {
      fontSize: 19,
      fontWeight: '900',
      color: '#29232A',
    },

    errorText: {
      marginTop: 7,

      fontSize: 12,
      color: '#888',

      textAlign: 'center',

      lineHeight: 19,
    },

    backButton: {
      marginTop: 20,

      paddingHorizontal: 25,
      paddingVertical: 12,

      borderRadius: 13,

      backgroundColor: '#D65A82',
    },

    backButtonText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '800',
    },
  });