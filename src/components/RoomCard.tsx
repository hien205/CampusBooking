import React, { useRef } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Animated,
} from 'react-native';

import { Room } from '../data/rooms';

type Props = {
  room: Room;
  onPress: () => void;
};

export default function RoomCard({
  room,
  onPress,
}: Props) {
  const scale = useRef(
    new Animated.Value(1)
  ).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.975,
      useNativeDriver: true,
      speed: 25,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 25,
      bounciness: 5,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.animatedContainer,
        {
          transform: [{ scale }],
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.card}
      >
        {/* ẢNH PHÒNG */}

        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: room.image,
            }}
            style={styles.roomImage}
          />

          <View style={styles.imageOverlay} />

          <View
            style={[
              styles.status,
              room.available
                ? styles.available
                : styles.unavailable,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                room.available
                  ? styles.availableDot
                  : styles.unavailableDot,
              ]}
            />

            <Text
              style={[
                styles.statusText,
                room.available
                  ? styles.availableText
                  : styles.unavailableText,
              ]}
            >
              {room.available
                ? 'Đang trống'
                : 'Đã đầy'}
            </Text>
          </View>
        </View>

        {/* THÔNG TIN PHÒNG */}

        <View style={styles.content}>
          <View style={styles.top}>
            <View style={styles.titleArea}>
              <Text
                style={styles.name}
                numberOfLines={1}
              >
                {room.name}
              </Text>

              <Text style={styles.location}>
                {room.building} • Tầng {room.floor}
              </Text>
            </View>

            <View style={styles.arrow}>
              <Text style={styles.arrowText}>
                ›
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* THÔNG TIN */}

          <View style={styles.info}>
            <View style={styles.infoItem}>
              <View style={styles.iconBox}>
                <Text style={styles.infoIcon}>
                  👥
                </Text>
              </View>

              <View>
                <Text style={styles.infoLabel}>
                  Sức chứa
                </Text>

                <Text style={styles.infoValue}>
                  {room.capacity} người
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.iconBox}>
                <Text style={styles.infoIcon}>
                  📍
                </Text>
              </View>

              <View>
                <Text style={styles.infoLabel}>
                  Khu vực
                </Text>

                <Text style={styles.infoValue}>
                  {room.area}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    marginBottom: 14,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,

    overflow: 'hidden',

    shadowColor: '#000000',

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.07,
    shadowRadius: 12,

    elevation: 3,
  },

  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 145,
    backgroundColor: '#EEEEF5',
  },

  roomImage: {
    width: '100%',
    height: '100%',
  },

  imageOverlay: {
    position: 'absolute',

    left: 0,
    right: 0,
    bottom: 0,

    height: 55,

    backgroundColor: 'rgba(0, 0, 0, 0.10)',
  },

  status: {
    position: 'absolute',

    top: 12,
    right: 12,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 10,
    paddingVertical: 6,

    borderRadius: 20,
  },

  available: {
    backgroundColor: '#ECFDF5',
  },

  unavailable: {
    backgroundColor: '#FEF2F2',
  },

  statusDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    marginRight: 6,
  },

  availableDot: {
    backgroundColor: '#22C55E',
  },

  unavailableDot: {
    backgroundColor: '#EF4444',
  },

  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },

  availableText: {
    color: '#15803D',
  },

  unavailableText: {
    color: '#B91C1C',
  },

  content: {
    padding: 14,
  },

  top: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  titleArea: {
    flex: 1,
    paddingRight: 10,
  },

  name: {
    fontSize: 17,
    fontWeight: '800',
    color: '#18181B',
  },

  location: {
    fontSize: 11,
    color: '#71717A',
    marginTop: 4,
  },

  arrow: {
    width: 32,
    height: 32,

    borderRadius: 10,

    backgroundColor: '#F4F4F5',

    alignItems: 'center',
    justifyContent: 'center',
  },

  arrowText: {
    fontSize: 22,
    color: '#52525B',

    marginTop: -2,
  },

  divider: {
    height: 1,

    backgroundColor: '#F1F1F3',

    marginVertical: 12,
  },

  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoItem: {
    flex: 1,

    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBox: {
    width: 32,
    height: 32,

    borderRadius: 10,

    backgroundColor: '#F7F7F8',

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 8,
  },

  infoIcon: {
    fontSize: 15,
  },

  infoLabel: {
    color: '#A1A1AA',

    fontSize: 9,

    marginBottom: 2,
  },

  infoValue: {
    color: '#3F3F46',

    fontSize: 11,

    fontWeight: '700',
  },
});