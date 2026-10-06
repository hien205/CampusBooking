import React, { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useFocusEffect } from '@react-navigation/native';

import { useBookingStore } from '../store/bookingStore';

import { useAppTheme } from '../theme/useAppTheme';
import { lightColors } from '../theme/colors';

type AppColors = typeof lightColors;

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    /* =========================
       CONTAINER
    ========================= */

    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    /* =========================
       HEADER
    ========================= */

    header: {
      paddingHorizontal: 20,
      paddingTop: 5,
      paddingBottom: 10,

      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    headerText: {
      flex: 1,
    },

    title: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.text,
      lineHeight: 30,
    },

    subtitle: {
      marginTop: 1,
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 19,
    },

    countText: {
      color: colors.primary,
      fontWeight: '800',
    },

    headerIcon: {
      width: 42,
      height: 42,
      borderRadius: 13,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor: colors.primaryLight,

      borderWidth: 1,
      borderColor: colors.border,

      marginLeft: 12,
    },

    /* =========================
       LIST
    ========================= */

    list: {
      paddingHorizontal: 20,
      paddingTop: 5,
      paddingBottom: 30,
    },

    /* =========================
       CARD
    ========================= */

    card: {
      backgroundColor: colors.white,

      borderRadius: 20,

      padding: 17,

      marginBottom: 15,

      borderWidth: 1,
      borderColor: colors.border,

      shadowColor: '#000',

      shadowOffset: {
        width: 0,
        height: 3,
      },

      shadowOpacity: 0.05,

      shadowRadius: 8,

      elevation: 2,
    },

    /* =========================
       CARD TOP
    ========================= */

    cardTop: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    roomIcon: {
      width: 48,
      height: 48,

      borderRadius: 15,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor: colors.primaryLight,

      marginRight: 12,
    },

    roomInfo: {
      flex: 1,
      paddingRight: 7,
    },

    roomName: {
      fontSize: 17,
      fontWeight: '800',
      color: colors.text,
    },

    bookingId: {
      marginTop: 4,
      fontSize: 11,
      color: colors.textLight,
    },

    /* =========================
       STATUS
    ========================= */

    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',

      paddingHorizontal: 9,
      paddingVertical: 6,

      borderRadius: 12,

      backgroundColor: colors.successLight,
    },

    statusDot: {
      width: 6,
      height: 6,

      borderRadius: 3,

      backgroundColor: colors.success,

      marginRight: 5,
    },

    statusText: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.success,
    },

    /* =========================
       DIVIDER
    ========================= */

    divider: {
      height: 1,

      backgroundColor: colors.border,

      marginVertical: 14,
    },

    /* =========================
       DETAIL BOX
    ========================= */

    detailBox: {
      flexDirection: 'row',
      alignItems: 'center',

      backgroundColor: colors.background,

      borderRadius: 13,

      padding: 10,

      marginBottom: 9,
    },

    detailIcon: {
      width: 36,
      height: 36,

      borderRadius: 11,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor: colors.primaryLight,

      marginRight: 10,
    },

    timeIcon: {
      backgroundColor: colors.secondaryLight,
    },

    detailContent: {
      flex: 1,
    },

    detailLabel: {
      fontSize: 11,

      color: colors.textLight,

      marginBottom: 2,
    },

    detailValue: {
      fontSize: 14,

      fontWeight: '700',

      color: colors.text,
    },

    /* =========================
       CANCEL BUTTON
    ========================= */

    cancelButton: {
      height: 45,

      borderRadius: 13,

      marginTop: 4,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent: 'center',

      backgroundColor: colors.primaryLight,

      borderWidth: 1,

      borderColor: colors.border,
    },

    cancelButtonText: {
      marginLeft: 7,

      fontSize: 13,

      fontWeight: '800',

      color: colors.primary,
    },

    buttonPressed: {
      opacity: 0.7,

      transform: [
        {
          scale: 0.98,
        },
      ],
    },

    cancelButtonDisabled: {
      opacity: 0.5,
    },

    /* =========================
       EMPTY
    ========================= */

    emptyContainer: {
      flexGrow: 1,

      paddingHorizontal: 20,
    },

    empty: {
      flex: 1,

      alignItems: 'center',

      justifyContent: 'center',

      paddingHorizontal: 30,

      paddingBottom: 70,
    },

    emptyIconContainer: {
      width: 100,
      height: 100,

      borderRadius: 30,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor: colors.primaryLight,

      borderWidth: 1,

      borderColor: colors.border,

      marginBottom: 18,
    },

    emptyTitle: {
      fontSize: 21,

      fontWeight: '800',

      color: colors.text,
    },

    emptyText: {
      marginTop: 8,

      textAlign: 'center',

      fontSize: 14,

      lineHeight: 22,

      color: colors.textSecondary,
    },
  });

export default function BookingsScreen() {
  /* =====================================================
     THEME
  ===================================================== */

  const { colors, isDark } = useAppTheme();

  const styles = createStyles(colors);

  /* =====================================================
     BOOKING STORE
  ===================================================== */

  const bookings = useBookingStore(
    (state) => state.bookings
  );

  const loadBookings = useBookingStore(
    (state) => state.loadBookings
  );

  const cancelBooking = useBookingStore(
    (state) => state.cancelBooking
  );

  /* =====================================================
     LOCAL STATE
  ===================================================== */

  const [refreshing, setRefreshing] = useState(false);

  const [cancellingId, setCancellingId] =
    useState<string | null>(null);

  /* =====================================================
     LOAD BOOKINGS
  ===================================================== */

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [loadBookings])
  );

  /* =====================================================
     REFRESH
  ===================================================== */

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      await loadBookings();
    } finally {
      setRefreshing(false);
    }
  };

  /* =====================================================
     CANCEL BOOKING
  ===================================================== */

  const handleCancel = (
    bookingId: string,
    roomName: string
  ) => {
    Alert.alert(
      'Hủy lịch đặt',
      `Bạn có chắc muốn hủy lịch đặt ${roomName}?`,
      [
        {
          text: 'Không',
          style: 'cancel',
        },

        {
          text: 'Hủy lịch',
          style: 'destructive',

          onPress: async () => {
            try {
              setCancellingId(bookingId);

              await cancelBooking(bookingId);

              Alert.alert(
                'Đã hủy',
                'Lịch đặt đã được hủy thành công.'
              );
            } catch (error) {
              console.log(
                'Cancel booking error:',
                error
              );

              Alert.alert(
                'Lỗi',
                'Không thể hủy lịch đặt. Vui lòng thử lại.'
              );
            } finally {
              setCancellingId(null);
            }
          },
        },
      ]
    );
  };

  /* =====================================================
     BOOKING CARD
  ===================================================== */

  const renderBooking = ({
    item,
  }: {
    item: (typeof bookings)[number];
  }) => {
    const cancelling =
      cancellingId === item.id;

    return (
      <View style={styles.card}>
        {/* =========================
            CARD HEADER
        ========================= */}

        <View style={styles.cardTop}>
          <View style={styles.roomIcon}>
            <Ionicons
              name="business-outline"
              size={23}
              color={colors.primary}
            />
          </View>

          <View style={styles.roomInfo}>
            <Text
              style={styles.roomName}
              numberOfLines={1}
            >
              {item.roomName}
            </Text>

            <Text
              style={styles.bookingId}
              numberOfLines={1}
            >
              Mã đặt: {item.id}
            </Text>
          </View>

          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />

            <Text style={styles.statusText}>
              Đã đặt
            </Text>
          </View>
        </View>

        {/* =========================
            DIVIDER
        ========================= */}

        <View style={styles.divider} />

        {/* =========================
            DATE
        ========================= */}

        <View style={styles.detailBox}>
          <View style={styles.detailIcon}>
            <Ionicons
              name="calendar-outline"
              size={19}
              color={colors.primary}
            />
          </View>

          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>
              Ngày đặt
            </Text>

            <Text style={styles.detailValue}>
              {item.date}
            </Text>
          </View>
        </View>

        {/* =========================
            TIME
        ========================= */}

        <View style={styles.detailBox}>
          <View
            style={[
              styles.detailIcon,
              styles.timeIcon,
            ]}
          >
            <Ionicons
              name="time-outline"
              size={19}
              color={colors.secondary}
            />
          </View>

          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>
              Thời gian
            </Text>

            <Text style={styles.detailValue}>
              {item.time}
            </Text>
          </View>
        </View>

        {/* =========================
            CANCEL BUTTON
        ========================= */}

        <Pressable
          disabled={cancelling}
          onPress={() =>
            handleCancel(
              item.id,
              item.roomName
            )
          }
          style={({ pressed }) => [
            styles.cancelButton,

            pressed &&
              !cancelling &&
              styles.buttonPressed,

            cancelling &&
              styles.cancelButtonDisabled,
          ]}
        >
          {cancelling ? (
            <ActivityIndicator
              size="small"
              color={colors.primary}
            />
          ) : (
            <>
              <Ionicons
                name="close-circle-outline"
                size={19}
                color={colors.primary}
              />

              <Text
                style={styles.cancelButtonText}
              >
                Hủy lịch đặt
              </Text>
            </>
          )}
        </Pressable>
      </View>
    );
  };

  /* =====================================================
     EMPTY STATE
  ===================================================== */

  if (bookings.length === 0) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top']}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>
              Lịch đặt phòng
            </Text>

            <Text style={styles.subtitle}>
              Các phòng bạn đã đăng ký
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="calendar"
              size={21}
              color={colors.primary}
            />
          </View>
        </View>

        {/* EMPTY */}

        <FlatList
          data={[]}
          renderItem={null}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          contentContainerStyle={
            styles.emptyContainer
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <View
                style={
                  styles.emptyIconContainer
                }
              >
                <Ionicons
                  name="calendar-outline"
                  size={48}
                  color={colors.primary}
                />
              </View>

              <Text style={styles.emptyTitle}>
                Chưa có lịch đặt
              </Text>

              <Text style={styles.emptyText}>
                Bạn chưa đặt phòng nào.
                {'\n'}
                Hãy quay lại trang chủ để
                chọn phòng phù hợp.
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    );
  }

  /* =====================================================
     BOOKING LIST
  ===================================================== */

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      {/* =========================
          HEADER
      ========================= */}

      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>
            Lịch đặt phòng
          </Text>

          <Text style={styles.subtitle}>
            Bạn đang có{' '}
            <Text style={styles.countText}>
              {bookings.length}
            </Text>{' '}
            lịch đặt
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons
            name="calendar"
            size={21}
            color={colors.primary}
          />
        </View>
      </View>

      {/* =========================
          BOOKING LIST
      ========================= */}

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBooking}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </SafeAreaView>
  );
}