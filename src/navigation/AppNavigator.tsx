import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

import HomeScreen from '../screens/HomeScreen';
import BookingsScreen from '../screens/BookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RoomDetailScreen from '../screens/RoomDetailScreen';

import { useAuthStore } from '../store/authStore';
import { useAppTheme } from '../theme/useAppTheme';

export type MainTabParamList = {
  Home: undefined;
  Bookings: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Login: undefined;

  Register: undefined;

  MainTabs:
    | {
        screen?: keyof MainTabParamList;
      }
    | undefined;

  RoomDetail: {
    roomId: string;
  };
};

const Stack =
  createNativeStackNavigator<RootStackParamList>();

const Tab =
  createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  const { colors, isDark } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        // Màu icon/tab đang chọn
        tabBarActiveTintColor: colors.primary,

        // Màu icon/tab không chọn
        tabBarInactiveTintColor: colors.textSecondary,

        tabBarStyle: {
          height: 72,
          paddingTop: 8,
          paddingBottom: 9,

          backgroundColor: colors.white,

          borderTopWidth: 0,

          shadowColor: '#000000',

          shadowOffset: {
            width: 0,
            height: -3,
          },

          shadowOpacity: isDark ? 0.2 : 0.05,
          shadowRadius: 10,

          elevation: 10,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginTop: 2,
        },
      }}
    >
      {/* HOME */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Khám phá',

          tabBarIcon: ({
            focused,
            color,
            size,
          }) => (
            <Ionicons
              name={
                focused
                  ? 'home'
                  : 'home-outline'
              }
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* BOOKINGS */}
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{
          title: 'Lịch đặt',

          tabBarIcon: ({
            focused,
            color,
            size,
          }) => (
            <Ionicons
              name={
                focused
                  ? 'calendar'
                  : 'calendar-outline'
              }
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* PROFILE */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Tài khoản',

          tabBarIcon: ({
            focused,
            color,
            size,
          }) => (
            <Ionicons
              name={
                focused
                  ? 'person'
                  : 'person-outline'
              }
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainStack() {
  const { colors, isDark } = useAppTheme();

  return (
    <Stack.Navigator>
      {/* MAIN TABS */}
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{
          headerShown: false,
        }}
      />

      {/* ROOM DETAIL */}
      <Stack.Screen
        name="RoomDetail"
        component={RoomDetailScreen}
        options={{
          title: 'Chi tiết phòng',

          headerStyle: {
            backgroundColor: colors.background,
          },

          headerShadowVisible: false,

          headerTitleStyle: {
            fontSize: 17,
            fontWeight: '800',
            color: colors.text,
          },

          headerTintColor: colors.text,

          // Màu nền/status của header thay đổi theo theme
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const user = useAuthStore(
    (state) => state.user
  );

  const initialized = useAuthStore(
    (state) => state.initialized
  );

  const { colors } = useAppTheme();

  if (!initialized) {
    return null;
  }

  // CHƯA ĐĂNG NHẬP
  if (!user) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,

          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
        />
      </Stack.Navigator>
    );
  }

  // ĐÃ ĐĂNG NHẬP
  return <MainStack />;
}