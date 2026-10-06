import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
} from 'react';

import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import type {
  RootStackParamList,
} from '../navigation/AppNavigator';

import { useBookingStore } from '../store/bookingStore';

import RoomCard from '../components/RoomCard';

import { useRoomsQuery } from '../hooks/useRoomsQuery';

import { useAppTheme } from '../theme/useAppTheme';

const areas = [
  'Tất cả',
  'Cơ sở 1',
  'Cơ sở 2',
  'Cơ sở 3',
];

const statuses = [
  'Tất cả',
  'Đang trống',
  'Đã đầy',
];

const timeFilters = [
  'Tất cả',
  '08:00 - 10:00',
  '10:00 - 12:00',
  '13:00 - 15:00',
  '15:00 - 17:00',
];

const bookedSlots: Record<string, string[]> = {
  R01: ['10:00 - 12:00'],
  R02: ['08:00 - 10:00'],
  R03: ['13:00 - 15:00'],
  R04: [
    '08:00 - 10:00',
    '15:00 - 17:00',
  ],
  R05: [],
  R06: ['10:00 - 12:00'],
};

export default function HomeScreen() {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList>
    >();

  const { colors, isDark } = useAppTheme();

  const styles = createStyles(colors, isDark);

  const {
    data: rooms = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useRoomsQuery();

  const {
    selectedArea,
    peopleCount,
    setSelectedArea,
    setPeopleCount,
  } = useBookingStore();

  const [
    searchText,
    setSearchText,
  ] = useState('');

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState('Tất cả');

  const [
    selectedTimeFilter,
    setSelectedTimeFilter,
  ] = useState('Tất cả');

  const [
    showFilters,
    setShowFilters,
  ] = useState(false);

  /*
   * ==============================
   * HEADER ANIMATION
   * ==============================
   */

  const headerOpacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const headerTranslateY =
    useRef(
      new Animated.Value(20)
    ).current;

  /*
   * ==============================
   * FILTER ANIMATION
   * ==============================
   */

  const filterAnimation =
    useRef(
      new Animated.Value(0)
    ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(
        headerOpacity,
        {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }
      ),

      Animated.spring(
        headerTranslateY,
        {
          toValue: 0,
          speed: 12,
          bounciness: 5,
          useNativeDriver: true,
        }
      ),
    ]).start();
  }, [
    headerOpacity,
    headerTranslateY,
  ]);

  useEffect(() => {
    Animated.spring(
      filterAnimation,
      {
        toValue: showFilters ? 1 : 0,
        speed: 18,
        bounciness: 4,
        useNativeDriver: true,
      }
    ).start();
  }, [
    showFilters,
    filterAnimation,
  ]);

  /*
   * ==============================
   * LỌC DANH SÁCH PHÒNG
   * ==============================
   */

  const filteredRooms = useMemo(() => {
    const keyword =
      searchText
        .trim()
        .toLowerCase();

    return rooms.filter((room) => {
      const matchSearch =
        keyword === '' ||
        room.name
          .toLowerCase()
          .includes(keyword) ||
        room.area
          .toLowerCase()
          .includes(keyword) ||
        room.building
          .toLowerCase()
          .includes(keyword);

      const matchArea =
        selectedArea === 'Tất cả' ||
        room.area === selectedArea;

      const matchCapacity =
        room.capacity >= peopleCount;

      const matchStatus =
        selectedStatus === 'Tất cả' ||
        (
          selectedStatus === 'Đang trống' &&
          room.available
        ) ||
        (
          selectedStatus === 'Đã đầy' &&
          !room.available
        );

      const matchTime =
        selectedTimeFilter === 'Tất cả' ||
        (
          room.available &&
          !(
            bookedSlots[room.id]?.includes(
              selectedTimeFilter
            )
          )
        );

      return (
        matchSearch &&
        matchArea &&
        matchCapacity &&
        matchStatus &&
        matchTime
      );
    });
  }, [
    rooms,
    searchText,
    selectedArea,
    peopleCount,
    selectedStatus,
    selectedTimeFilter,
  ]);

  /*
   * ==============================
   * RESET BỘ LỌC
   * ==============================
   */

  const resetFilters = () => {
    setSearchText('');

    setSelectedArea(
      'Tất cả'
    );

    setPeopleCount(1);

    setSelectedStatus(
      'Tất cả'
    );

    setSelectedTimeFilter(
      'Tất cả'
    );
  };

  const hasActiveFilter =
    selectedArea !== 'Tất cả' ||
    peopleCount !== 1 ||
    selectedStatus !== 'Tất cả' ||
    selectedTimeFilter !== 'Tất cả';

  /*
   * ==============================
   * LOADING
   * ==============================
   */

  if (isLoading) {
    return (
      <SafeAreaView
        style={styles.loadingContainer}
      >
        <View
          style={styles.loadingIcon}
        >
          <ActivityIndicator
            size="large"
            color={colors.primary}
          />
        </View>

        <Text
          style={styles.loadingTitle}
        >
          Đang tải danh sách phòng...
        </Text>

        <Text
          style={styles.loadingText}
        >
          Đang lấy dữ liệu từ Firebase
        </Text>
      </SafeAreaView>
    );
  }

  /*
   * ==============================
   * ERROR
   * ==============================
   */

  if (isError) {
    return (
      <SafeAreaView
        style={styles.errorContainer}
      >
        <View
          style={styles.errorCircle}
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
          Không thể tải danh sách phòng
        </Text>

        <Text
          style={styles.errorText}
        >
          Vui lòng kiểm tra kết nối mạng
          và dữ liệu Firestore.
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            pressed &&
              styles.buttonPressed,
          ]}
          onPress={() => refetch()}
        >
          <Text
            style={styles.retryButtonText}
          >
            Thử lại
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <FlatList
        data={filteredRooms}
        keyExtractor={(item) =>
          item.id
        }
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={7}
        removeClippedSubviews={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.list
        }
        refreshing={isFetching}
        onRefresh={refetch}
        renderItem={({
          item,
        }) => (
          <RoomCard
            room={item}
            onPress={() => {
              navigation.navigate(
                'RoomDetail',
                {
                  roomId: item.id,
                }
              );
            }}
          />
        )}
        ListHeaderComponent={
          <View>
            {/* HEADER */}

            <Animated.View
              style={[
                styles.header,
                {
                  opacity:
                    headerOpacity,
                  transform: [
                    {
                      translateY:
                        headerTranslateY,
                    },
                  ],
                },
              ]}
            >
              <View
                style={styles.headerText}
              >
                <Text
                  style={styles.greeting}
                >
                  Xin chào 👋
                </Text>

                <Text
                  style={styles.title}
                >
                  Tìm phòng học
                </Text>

                <Text
                  style={styles.subtitle}
                >
                  Chọn không gian phù hợp
                  cho việc học
                </Text>
              </View>

              <View
                style={styles.logoWrapper}
              >
                <View
                  style={styles.logo}
                >
                  <Text
                    style={styles.logoText}
                  >
                    CB
                  </Text>
                </View>

                <View
                  style={styles.logoDot}
                />
              </View>
            </Animated.View>

            {/* SEARCH */}

            <View
              style={styles.searchRow}
            >
              <View
                style={styles.searchBox}
              >
                <Text
                  style={styles.searchIcon}
                >
                  ⌕
                </Text>

                <TextInput
                  value={searchText}
                  onChangeText={
                    setSearchText
                  }
                  placeholder="Tìm phòng, cơ sở..."
                  placeholderTextColor={
                    colors.textLight
                  }
                  style={
                    styles.searchInput
                  }
                  autoCapitalize="none"
                />

                {searchText.length >
                  0 && (
                  <Pressable
                    onPress={() =>
                      setSearchText('')
                    }
                    hitSlop={8}
                  >
                    <Text
                      style={styles.clear}
                    >
                      ×
                    </Text>
                  </Pressable>
                )}
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.filterButton,
                  showFilters &&
                    styles.filterButtonActive,
                  pressed &&
                    styles.buttonPressed,
                ]}
                onPress={() =>
                  setShowFilters(
                    !showFilters
                  )
                }
              >
                <Text
                  style={[
                    styles.filterIcon,
                    showFilters &&
                      styles.filterIconActive,
                  ]}
                >
                  ☷
                </Text>
              </Pressable>
            </View>

            {/* AREA */}

            <View
              style={styles.sectionHeader}
            >
              <Text
                style={styles.sectionTitle}
              >
                Cơ sở
              </Text>

              {selectedArea !==
                'Tất cả' && (
                <Pressable
                  onPress={() =>
                    setSelectedArea(
                      'Tất cả'
                    )
                  }
                >
                  <Text
                    style={
                      styles.clearFilter
                    }
                  >
                    Xóa
                  </Text>
                </Pressable>
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.horizontalChips
              }
            >
              {areas.map((area) => {
                const selected =
                  selectedArea ===
                  area;

                return (
                  <Pressable
                    key={area}
                    onPress={() =>
                      setSelectedArea(
                        area
                      )
                    }
                    style={({ pressed }) => [
                      styles.areaChip,
                      selected &&
                        styles.areaChipSelected,
                      pressed &&
                        styles.chipPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.areaText,
                        selected &&
                          styles.areaTextSelected,
                      ]}
                    >
                      {area}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* FILTER PANEL */}

            {showFilters && (
              <Animated.View
                style={[
                  styles.filterPanel,
                  {
                    opacity:
                      filterAnimation,
                    transform: [
                      {
                        translateY:
                          filterAnimation.interpolate(
                            {
                              inputRange: [
                                0,
                                1,
                              ],
                              outputRange: [
                                -12,
                                0,
                              ],
                            }
                          ),
                      },
                      {
                        scale:
                          filterAnimation.interpolate(
                            {
                              inputRange: [
                                0,
                                1,
                              ],
                              outputRange: [
                                0.97,
                                1,
                              ],
                            }
                          ),
                      },
                    ],
                  },
                ]}
              >
                {/* PEOPLE */}

                <View
                  style={
                    styles.filterHeader
                  }
                >
                  <Text
                    style={
                      styles.filterTitle
                    }
                  >
                    Số người
                  </Text>

                  <View
                    style={
                      styles.filterValueBadge
                    }
                  >
                    <Text
                      style={
                        styles.filterValue
                      }
                    >
                      {peopleCount} người
                    </Text>
                  </View>
                </View>

                <View
                  style={
                    styles.peopleControl
                  }
                >
                  <Pressable
                    style={({ pressed }) => [
                      styles.circleButton,
                      pressed &&
                        styles.circleButtonPressed,
                    ]}
                    onPress={() =>
                      setPeopleCount(
                        Math.max(
                          1,
                          peopleCount - 1
                        )
                      )
                    }
                  >
                    <Text
                      style={
                        styles.circleText
                      }
                    >
                      −
                    </Text>
                  </Pressable>

                  <View
                    style={
                      styles.peopleNumberBox
                    }
                  >
                    <Text
                      style={
                        styles.peopleNumber
                      }
                    >
                      {peopleCount}
                    </Text>

                    <Text
                      style={
                        styles.peopleLabel
                      }
                    >
                      người
                    </Text>
                  </View>

                  <Pressable
                    style={({ pressed }) => [
                      styles.circleButton,
                      pressed &&
                        styles.circleButtonPressed,
                    ]}
                    onPress={() =>
                      setPeopleCount(
                        Math.min(
                          20,
                          peopleCount + 1
                        )
                      )
                    }
                  >
                    <Text
                      style={
                        styles.circleText
                      }
                    >
                      +
                    </Text>
                  </Pressable>
                </View>

                {/* STATUS */}

                <Text
                  style={
                    styles.filterTitle
                  }
                >
                  Trạng thái
                </Text>

                <View
                  style={
                    styles.smallChips
                  }
                >
                  {statuses.map(
                    (status) => {
                      const selected =
                        selectedStatus ===
                        status;

                      return (
                        <Pressable
                          key={status}
                          onPress={() =>
                            setSelectedStatus(
                              status
                            )
                          }
                          style={({ pressed }) => [
                            styles.smallChip,
                            selected &&
                              styles.smallChipSelected,
                            pressed &&
                              styles.chipPressed,
                          ]}
                        >
                          <Text
                            style={[
                              styles.smallChipText,
                              selected &&
                                styles.smallChipTextSelected,
                            ]}
                          >
                            {status}
                          </Text>
                        </Pressable>
                      );
                    }
                  )}
                </View>

                {/* TIME */}

                <Text
                  style={
                    styles.filterTitle
                  }
                >
                  Khung giờ
                </Text>

                <View
                  style={
                    styles.smallChips
                  }
                >
                  {timeFilters.map(
                    (time) => {
                      const selected =
                        selectedTimeFilter ===
                        time;

                      return (
                        <Pressable
                          key={time}
                          onPress={() =>
                            setSelectedTimeFilter(
                              time
                            )
                          }
                          style={({ pressed }) => [
                            styles.smallChip,
                            selected &&
                              styles.smallChipSelected,
                            pressed &&
                              styles.chipPressed,
                          ]}
                        >
                          <Text
                            style={[
                              styles.smallChipText,
                              selected &&
                                styles.smallChipTextSelected,
                            ]}
                          >
                            {time ===
                            'Tất cả'
                              ? 'Tất cả'
                              : time.replace(
                                  ' - ',
                                  '–'
                                )}
                          </Text>
                        </Pressable>
                      );
                    }
                  )}
                </View>

                {hasActiveFilter && (
                  <Pressable
                    style={({ pressed }) => [
                      styles.resetButton,
                      pressed &&
                        styles.buttonPressed,
                    ]}
                    onPress={
                      resetFilters
                    }
                  >
                    <Text
                      style={
                        styles.resetText
                      }
                    >
                      Đặt lại bộ lọc
                    </Text>
                  </Pressable>
                )}
              </Animated.View>
            )}

            {/* RESULT */}

            <View
              style={
                styles.resultHeader
              }
            >
              <View>
                <Text
                  style={
                    styles.resultTitle
                  }
                >
                  Phòng học
                </Text>

                <Text
                  style={
                    styles.resultCount
                  }
                >
                  {filteredRooms.length}{' '}
                  phòng phù hợp
                </Text>
              </View>

              <View
                style={
                  styles.availableBadge
                }
              >
                <View
                  style={
                    styles.availableDot
                  }
                />

                <Text
                  style={
                    styles.availableText
                  }
                >
                  Có thể đặt
                </Text>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View
            style={styles.empty}
          >
            <View
              style={styles.emptyCircle}
            >
              <Text
                style={styles.emptyIcon}
              >
                ⌕
              </Text>
            </View>

            <Text
              style={styles.emptyTitle}
            >
              Không tìm thấy phòng
            </Text>

            <Text
              style={styles.emptyText}
            >
              Thử thay đổi điều kiện tìm
              kiếm hoặc bộ lọc của bạn.
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.emptyButton,
                pressed &&
                  styles.buttonPressed,
              ]}
              onPress={resetFilters}
            >
              <Text
                style={
                  styles.emptyButtonText
                }
              >
                Xóa bộ lọc
              </Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

/*
 * =====================================================
 * DYNAMIC STYLES
 * =====================================================
 */

function createStyles(
  colors: ReturnType<
    typeof import('../theme/useAppTheme')['useAppTheme']
  >['colors'],
  isDark: boolean
) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    list: {
      paddingHorizontal: 18,
      paddingBottom: 30,
    },

    /*
     * LOADING
     */

    loadingContainer: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 30,
    },

    loadingIcon: {
      width: 72,
      height: 72,
      borderRadius: 24,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },

    loadingTitle: {
      marginTop: 14,
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
    },

    loadingText: {
      marginTop: 6,
      fontSize: 13,
      color: colors.textSecondary,
    },

    /*
     * ERROR
     */

    errorContainer: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 30,
    },

    errorCircle: {
      width: 70,
      height: 70,
      borderRadius: 25,
      backgroundColor: colors.errorLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 18,
    },

    errorIcon: {
      fontSize: 34,
      fontWeight: '900',
      color: colors.error,
    },

    errorTitle: {
      fontSize: 19,
      fontWeight: '800',
      color: colors.text,
      textAlign: 'center',
    },

    errorText: {
      marginTop: 8,
      fontSize: 13,
      lineHeight: 20,
      color: colors.textSecondary,
      textAlign: 'center',
    },

    retryButton: {
      marginTop: 20,
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 13,
      borderRadius: 13,

      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: isDark ? 0.35 : 0.2,
      shadowRadius: 9,
      elevation: 4,
    },

    retryButtonText: {
      color: colors.white,
      fontSize: 13,
      fontWeight: '800',
    },

    /*
     * HEADER
     */

    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 18,
      marginBottom: 22,
    },

    headerText: {
      flex: 1,
      paddingRight: 15,
    },

    greeting: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 5,
    },

    title: {
      fontSize: 29,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -0.7,
    },

    subtitle: {
      color: colors.textSecondary,
      fontSize: 13,
      marginTop: 6,
    },

    logoWrapper: {
      position: 'relative',
    },

    logo: {
      width: 52,
      height: 52,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',

      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: isDark ? 0.35 : 0.22,
      shadowRadius: 10,
      elevation: 5,
    },

    logoText: {
      color: colors.white,
      fontSize: 17,
      fontWeight: '900',
      letterSpacing: 1,
    },

    logoDot: {
      position: 'absolute',
      width: 11,
      height: 11,
      borderRadius: 6,
      backgroundColor: colors.secondary,
      right: -2,
      bottom: -2,
      borderWidth: 2,
      borderColor: colors.background,
    },

    /*
     * SEARCH
     */

    searchRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 24,
    },

    searchBox: {
      flex: 1,
      height: 54,
      backgroundColor: colors.white,
      borderRadius: 17,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,

      borderWidth: 1,
      borderColor: colors.border,

      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: isDark ? 0.12 : 0.04,
      shadowRadius: 8,
      elevation: 2,
    },

    searchIcon: {
      fontSize: 27,
      color: colors.primary,
      marginRight: 8,
      marginTop: -3,
    },

    searchInput: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
    },

    clear: {
      fontSize: 25,
      color: colors.textLight,
      paddingLeft: 5,
    },

    filterButton: {
      width: 54,
      height: 54,
      borderRadius: 17,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',

      borderWidth: 1,
      borderColor: colors.border,

      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: isDark ? 0.12 : 0.04,
      shadowRadius: 8,
      elevation: 2,
    },

    filterButtonActive: {
      backgroundColor: colors.secondary,
      borderColor: colors.secondary,
    },

    filterIcon: {
      fontSize: 26,
      color: colors.primary,
    },

    filterIconActive: {
      color: colors.white,
    },

    /*
     * AREA
     */

    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 11,
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
    },

    clearFilter: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: '700',
    },

    horizontalChips: {
      gap: 9,
      paddingBottom: 22,
    },

    areaChip: {
      backgroundColor: colors.white,
      paddingHorizontal: 17,
      paddingVertical: 11,
      borderRadius: 13,
      borderWidth: 1,
      borderColor: colors.border,
    },

    areaChipSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    areaText: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '600',
    },

    areaTextSelected: {
      color: colors.white,
      fontWeight: '700',
    },

    /*
     * FILTER
     */

    filterPanel: {
      backgroundColor: colors.white,
      borderRadius: 20,
      padding: 17,
      marginBottom: 22,

      borderWidth: 1,
      borderColor: colors.border,

      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: isDark ? 0.15 : 0.06,
      shadowRadius: 12,
      elevation: 2,
    },

    filterHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 13,
    },

    filterTitle: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 11,
    },

    filterValueBadge: {
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
    },

    filterValue: {
      fontSize: 12,
      color: colors.primaryDark,
      fontWeight: '800',
    },

    peopleControl: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },

    circleButton: {
      width: 43,
      height: 43,
      borderRadius: 14,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },

    circleButtonPressed: {
      backgroundColor: colors.secondaryLight,
    },

    circleText: {
      fontSize: 23,
      color: colors.primaryDark,
    },

    peopleNumberBox: {
      alignItems: 'center',
      marginHorizontal: 30,
    },

    peopleNumber: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.text,
    },

    peopleLabel: {
      color: colors.textLight,
      fontSize: 11,
    },

    smallChips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 7,
      marginBottom: 18,
    },

    smallChip: {
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 11,
      paddingVertical: 9,
      borderRadius: 11,
      borderWidth: 1,
      borderColor: colors.border,
    },

    smallChipSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    smallChipText: {
      color: colors.primaryDark,
      fontSize: 12,
      fontWeight: '600',
    },

    smallChipTextSelected: {
      color: colors.white,
      fontWeight: '700',
    },

    resetButton: {
      backgroundColor: colors.secondaryLight,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.borderPurple,
    },

    resetText: {
      color: colors.secondaryDark,
      fontSize: 13,
      fontWeight: '700',
    },

    /*
     * RESULT
     */

    resultHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 13,
    },

    resultTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.text,
    },

    resultCount: {
      fontSize: 12,
      color: colors.textLight,
      marginTop: 3,
    },

    availableBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.successLight,
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 20,
    },

    availableDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: colors.success,
      marginRight: 6,
    },

    availableText: {
      fontSize: 11,
      color: isDark ? '#86EFAC' : '#15803D',
      fontWeight: '700',
    },

    /*
     * EMPTY
     */

    empty: {
      alignItems: 'center',
      paddingTop: 55,
      paddingHorizontal: 25,
    },

    emptyCircle: {
      width: 76,
      height: 76,
      borderRadius: 28,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 18,
    },

    emptyIcon: {
      fontSize: 34,
      color: colors.primary,
    },

    emptyTitle: {
      fontSize: 19,
      fontWeight: '800',
      color: colors.text,
    },

    emptyText: {
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 21,
      fontSize: 13,
      marginTop: 8,
    },

    emptyButton: {
      marginTop: 18,
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 13,

      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: isDark ? 0.3 : 0.18,
      shadowRadius: 8,
      elevation: 3,
    },

    emptyButtonText: {
      color: colors.white,
      fontSize: 13,
      fontWeight: '700',
    },

    /*
     * PRESS EFFECT
     */

    buttonPressed: {
      opacity: 0.82,
      transform: [
        {
          scale: 0.97,
        },
      ],
    },

    chipPressed: {
      opacity: 0.75,
      transform: [
        {
          scale: 0.97,
        },
      ],
    },
  });
}