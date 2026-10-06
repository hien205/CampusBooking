import React, { useState } from 'react';

import {
  Alert,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  useNavigation,
} from '@react-navigation/native';

import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useAuthStore,
} from '../store/authStore';

import {
  useThemeStore,
} from '../store/themeStore';

import {
  useAppTheme,
} from '../theme/useAppTheme';

import {
  lightColors,
} from '../theme/colors';

import {
  updateUserProfile,
  changeUserPassword,
} from '../services/authService';

import type {
  RootStackParamList,
} from '../navigation/AppNavigator';


/* =====================================================
   TYPES
===================================================== */

type AppColors = typeof lightColors;

type ProfileNavigationProp =
  NativeStackNavigationProp<
    RootStackParamList
  >;


/* =====================================================
   STYLES
===================================================== */

const createStyles = (
  colors: AppColors
) =>
  StyleSheet.create({

    /* =========================
       SCREEN
    ========================= */

    safeArea: {
      flex: 1,
      backgroundColor:
        colors.background,
    },

    container: {
      flex: 1,
      paddingHorizontal: 20,
    },

    scrollContent: {
      paddingTop: 20,
      paddingBottom: 30,
    },


    /* =========================
       HEADER
    ========================= */

   header: {
  marginBottom: 20,
  alignItems: 'center',
},

headerTitle: {
  fontSize: 28,
  fontWeight: '800',
  color: colors.text,
  textAlign: 'center',
},

headerSubtitle: {
  marginTop: 5,
  fontSize: 14,
  color: colors.textSecondary,
  textAlign: 'center',
},

    /* =========================
       PROFILE CARD
    ========================= */

    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',

      padding: 18,

      borderRadius: 22,

      backgroundColor:
        colors.white,

      borderWidth: 1,
      borderColor:
        colors.border,

      marginBottom: 20,

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.06,
      shadowRadius: 10,

      elevation: 2,
    },

    avatar: {
      width: 62,
      height: 62,

      borderRadius: 31,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        colors.primaryLight,
    },

    avatarText: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.primary,
    },

    profileInfo: {
      flex: 1,
      marginLeft: 15,
    },

    profileName: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.text,
    },

    profileEmail: {
      marginTop: 4,
      fontSize: 13,
      color: colors.textSecondary,
    },

    studentBadge: {
      alignSelf: 'flex-start',

      marginTop: 8,

      paddingHorizontal: 9,
      paddingVertical: 4,

      borderRadius: 8,

      backgroundColor:
        colors.secondaryLight,
    },

    studentBadgeText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.secondary,
    },


    /* =========================
       SECTION
    ========================= */

    sectionTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,

      marginBottom: 10,
    },


    /* =========================
       MENU
    ========================= */

    menu: {
      backgroundColor:
        colors.white,

      borderRadius: 20,

      borderWidth: 1,
      borderColor:
        colors.border,

      overflow: 'hidden',

      marginBottom: 22,
    },

    menuItem: {
      minHeight: 76,

      flexDirection: 'row',
      alignItems: 'center',

      paddingHorizontal: 16,
    },

    menuItemPressed: {
      opacity: 0.7,
    },

    menuIcon: {
      width: 42,
      height: 42,

      borderRadius: 13,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        colors.primaryLight,
    },

    menuIconPurple: {
      backgroundColor:
        colors.secondaryLight,
    },

    menuIconBlue: {
      backgroundColor:
        colors.primaryLight,
    },

    menuTextContainer: {
      flex: 1,
      marginLeft: 13,
    },

    menuTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.text,
    },

    menuSubtitle: {
      marginTop: 3,
      fontSize: 12,
      color: colors.textSecondary,
    },

    menuArrow: {
      marginLeft: 8,
    },

    divider: {
      height: 1,
      backgroundColor:
        colors.border,
      marginLeft: 70,
    },


    /* =========================
       DARK MODE
    ========================= */

    themeItem: {
      flexDirection: 'row',
      alignItems: 'center',

      paddingHorizontal: 16,
      paddingVertical: 15,

      backgroundColor:
        colors.white,

      borderRadius: 18,

      borderWidth: 1,
      borderColor:
        colors.border,

      marginBottom: 18,
    },

    themeIcon: {
      width: 42,
      height: 42,

      borderRadius: 13,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        colors.secondaryLight,
    },

    themeInfo: {
      flex: 1,
      marginLeft: 13,
    },

    themeTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.text,
    },

    themeSubtitle: {
      marginTop: 3,
      fontSize: 12,
      color: colors.textSecondary,
    },


    /* =========================
       LOGOUT
    ========================= */

    logoutButton: {
      height: 52,

      flexDirection: 'row',

      alignItems: 'center',
      justifyContent: 'center',

      borderRadius: 16,

      backgroundColor:
        colors.errorLight,

      borderWidth: 1,
      borderColor:
        colors.error,

      marginBottom: 15,
    },

    logoutText: {
      marginLeft: 8,

      fontSize: 15,
      fontWeight: '800',

      color: colors.error,
    },


    /* =========================
       FOOTER
    ========================= */

    footer: {
      alignItems: 'center',
      paddingTop: 5,
    },

    footerText: {
      fontSize: 12,
      color: colors.textLight,
    },


    /* =========================
       MODAL OVERLAY
    ========================= */

    editOverlay: {
      position: 'absolute',

      top: 0,
      left: 0,
      right: 0,
      bottom: 0,

      backgroundColor:
        'rgba(0,0,0,0.55)',

      justifyContent: 'center',

      paddingHorizontal: 20,

      zIndex: 100,
    },

    editBox: {
      backgroundColor:
        colors.white,

      borderRadius: 24,

      padding: 20,

      borderWidth: 1,
      borderColor:
        colors.border,

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.2,
      shadowRadius: 20,

      elevation: 10,
    },

    editHeader: {
      flexDirection: 'row',
      alignItems: 'center',

      justifyContent: 'space-between',

      marginBottom: 20,
    },

    editTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.text,
    },

    closeButton: {
      width: 38,
      height: 38,

      borderRadius: 12,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        colors.background,
    },


    /* =========================
       INPUT
    ========================= */

    inputLabel: {
      fontSize: 13,
      fontWeight: '700',

      color: colors.text,

      marginBottom: 7,
    },

    input: {
      height: 48,

      borderWidth: 1,
      borderColor:
        colors.border,

      borderRadius: 13,

      paddingHorizontal: 14,

      fontSize: 14,

      color: colors.text,

      backgroundColor:
        colors.background,

      marginBottom: 16,
    },

    disabledInput: {
      opacity: 0.6,
    },


    /* =========================
       PASSWORD
    ========================= */

    passwordInputContainer: {
      position: 'relative',
      marginBottom: 16,
    },

    passwordInput: {
      marginBottom: 0,
      paddingRight: 50,
    },

    passwordEye: {
      position: 'absolute',

      right: 7,
      top: 6,

      width: 36,
      height: 36,

      alignItems: 'center',
      justifyContent: 'center',
    },


    /* =========================
       BUTTON
    ========================= */

    saveButton: {
      height: 48,

      borderRadius: 14,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        colors.primary,

      marginTop: 4,
    },

    passwordSaveButton: {
      height: 48,

      borderRadius: 14,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor:
        colors.secondary,

      marginTop: 3,
    },

    saveButtonDisabled: {
      opacity: 0.5,
    },

    passwordSaveButtonDisabled: {
      opacity: 0.5,
    },

    saveButtonText: {
      fontSize: 14,
      fontWeight: '800',
      color: '#FFFFFF',
    },

  });


/* =====================================================
   COMPONENT
===================================================== */

export default function ProfileScreen() {

  /* =========================
     THEME
  ========================= */

  const {
    colors,
    isDark,
  } = useAppTheme();

  const styles =
    createStyles(colors);


  /* =========================
     STORES
  ========================= */

  const toggleTheme =
    useThemeStore(
      (state) => state.toggleTheme
    );

  const user =
    useAuthStore(
      (state) => state.user
    );

  const logout =
    useAuthStore(
      (state) => state.logout
    );

  const setUser =
    useAuthStore(
      (state) => state.setUser
    );


  /* =========================
     NAVIGATION
  ========================= */

  const navigation =
    useNavigation<ProfileNavigationProp>();


  /* =========================
     PROFILE STATE
  ========================= */

  const [
    editVisible,
    setEditVisible,
  ] = useState(false);

  const [
    name,
    setName,
  ] = useState(
    user?.displayName || ''
  );

  const [
    saving,
    setSaving,
  ] = useState(false);


  /* =========================
     PASSWORD STATE
  ========================= */

  const [
    changePasswordVisible,
    setChangePasswordVisible,
  ] = useState(false);

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState('');

  const [
    newPassword,
    setNewPassword,
  ] = useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [
    passwordVisible,
    setPasswordVisible,
  ] = useState(false);

  const [
    changingPassword,
    setChangingPassword,
  ] = useState(false);


  /* =====================================================
     PROFILE
  ===================================================== */

  const handleOpenEdit = () => {

    setName(
      user?.displayName || ''
    );

    setEditVisible(true);
  };


  const handleSaveProfile =
    async () => {

      const trimmedName =
        name.trim();

      if (!trimmedName) {
        Alert.alert(
          'Thiếu thông tin',
          'Vui lòng nhập họ và tên.'
        );

        return;
      }

      if (trimmedName.length < 2) {
        Alert.alert(
          'Tên không hợp lệ',
          'Họ và tên phải có ít nhất 2 ký tự.'
        );

        return;
      }

      try {

        setSaving(true);

        const updatedUser =
          await updateUserProfile(
            trimmedName
          );

        /*
         * Cập nhật lại Zustand
         * để giao diện hiển thị tên mới ngay.
         */

        setUser(
          updatedUser
        );

        setEditVisible(false);

        Alert.alert(
          'Thành công',
          'Thông tin cá nhân đã được cập nhật.'
        );

      } catch (error) {

        console.log(
          'Update profile error:',
          error
        );

        Alert.alert(
          'Lỗi',
          'Không thể cập nhật thông tin cá nhân.'
        );

      } finally {

        setSaving(false);
      }
    };


  /* =====================================================
     PASSWORD
  ===================================================== */

  const handleOpenChangePassword =
    () => {

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordVisible(false);

      setChangePasswordVisible(
        true
      );
    };


  const handleChangePassword =
    async () => {

      /* =========================
         PASSWORD CŨ
      ========================= */

      if (!currentPassword) {

        Alert.alert(
          'Thiếu thông tin',
          'Vui lòng nhập mật khẩu hiện tại.'
        );

        return;
      }


      /* =========================
         PASSWORD MỚI
      ========================= */

      if (!newPassword) {

        Alert.alert(
          'Thiếu thông tin',
          'Vui lòng nhập mật khẩu mới.'
        );

        return;
      }


      /* =========================
         MIN 6 CHAR
      ========================= */

      if (newPassword.length < 6) {

        Alert.alert(
          'Mật khẩu không hợp lệ',
          'Mật khẩu mới phải có ít nhất 6 ký tự.'
        );

        return;
      }


      /* =========================
         CONFIRM
      ========================= */

      if (!confirmPassword) {

        Alert.alert(
          'Thiếu thông tin',
          'Vui lòng nhập lại mật khẩu mới.'
        );

        return;
      }


      if (
        newPassword !==
        confirmPassword
      ) {

        Alert.alert(
          'Mật khẩu không khớp',
          'Mật khẩu nhập lại không giống mật khẩu mới.'
        );

        return;
      }


      /* =========================
         SAME PASSWORD
      ========================= */

      if (
        currentPassword ===
        newPassword
      ) {

        Alert.alert(
          'Mật khẩu không hợp lệ',
          'Mật khẩu mới phải khác mật khẩu hiện tại.'
        );

        return;
      }


      /* =========================
         CHANGE
      ========================= */

      try {

        setChangingPassword(true);

        await changeUserPassword(
          currentPassword,
          newPassword
        );

        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordVisible(false);

        setChangePasswordVisible(
          false
        );

        Alert.alert(
          'Đổi mật khẩu thành công',
          'Mật khẩu của bạn đã được cập nhật.'
        );

      } catch (error: any) {

        console.log(
          'Change password error:',
          error
        );


        if (
          error?.code ===
          'auth/invalid-credential'
        ) {

          Alert.alert(
            'Mật khẩu hiện tại không đúng',
            'Vui lòng kiểm tra lại mật khẩu hiện tại.'
          );

        } else if (
          error?.code ===
          'auth/wrong-password'
        ) {

          Alert.alert(
            'Mật khẩu hiện tại không đúng',
            'Vui lòng kiểm tra lại mật khẩu hiện tại.'
          );

        } else if (
          error?.code ===
          'auth/weak-password'
        ) {

          Alert.alert(
            'Mật khẩu quá yếu',
            'Mật khẩu mới phải có ít nhất 6 ký tự.'
          );

        } else if (
          error?.code ===
          'auth/requires-recent-login'
        ) {

          Alert.alert(
            'Cần đăng nhập lại',
            'Vui lòng đăng xuất và đăng nhập lại trước khi đổi mật khẩu.'
          );

        } else if (
          error?.code ===
          'auth/too-many-requests'
        ) {

          Alert.alert(
            'Quá nhiều lần thử',
            'Vui lòng thử lại sau.'
          );

        } else {

          Alert.alert(
            'Lỗi',
            'Không thể đổi mật khẩu. Vui lòng thử lại.'
          );
        }

      } finally {

        setChangingPassword(false);
      }
    };


  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {

    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc muốn đăng xuất không?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },

        {
          text: 'Đăng xuất',
          style: 'destructive',

          onPress: async () => {

            try {

              await logout();

            } catch (error) {

              console.log(
                'Logout error:',
                error
              );

              Alert.alert(
                'Lỗi',
                'Không thể đăng xuất.'
              );
            }
          },
        },
      ]
    );
  };


  /* =====================================================
     AVATAR
  ===================================================== */

  const getInitial =
    () => {

      const displayName =
        user?.displayName?.trim();

      if (displayName) {
        return displayName
          .charAt(0)
          .toUpperCase();
      }

      const email =
        user?.email?.trim();

      if (email) {
        return email
          .charAt(0)
          .toUpperCase();
      }

      return 'U';
    };


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top']}
    >

      <View style={styles.container}>

        <View style={styles.scrollContent}>

          {/* =================================================
              HEADER
          ================================================= */}

          <View style={styles.header}>

            <Text
              style={styles.headerTitle}
            >
              Hồ sơ
            </Text>

            <Text
              style={styles.headerSubtitle}
            >
              Quản lý tài khoản CampusBooking
            </Text>

          </View>


          {/* =================================================
              PROFILE CARD
          ================================================= */}

          <View
            style={styles.profileCard}
          >

            <View
              style={styles.avatar}
            >

              <Text
                style={styles.avatarText}
              >
                {getInitial()}
              </Text>

            </View>


            <View
              style={styles.profileInfo}
            >

              <Text
                style={styles.profileName}
                numberOfLines={1}
              >
                {user?.displayName ||
                  'Sinh viên'}
              </Text>

              <Text
                style={styles.profileEmail}
                numberOfLines={1}
              >
                {user?.email ||
                  'Chưa có email'}
              </Text>

              <View
                style={styles.studentBadge}
              >

                <Text
                  style={
                    styles.studentBadgeText
                  }
                >
                  SINH VIÊN
                </Text>

              </View>

            </View>

          </View>


          {/* =================================================
              ACCOUNT
          ================================================= */}

          <Text
            style={styles.sectionTitle}
          >
            Tài khoản
          </Text>


          <View style={styles.menu}>

            {/* =========================
                THÔNG TIN CÁ NHÂN
            ========================= */}

            <Pressable
              onPress={
                handleOpenEdit
              }
              style={({ pressed }) => [
                styles.menuItem,

                pressed &&
                  styles.menuItemPressed,
              ]}
            >

              <View
                style={styles.menuIcon}
              >

                <Ionicons
                  name="person-outline"
                  size={20}
                  color={colors.primary}
                />

              </View>


              <View
                style={
                  styles.menuTextContainer
                }
              >

                <Text
                  style={styles.menuTitle}
                >
                  Thông tin cá nhân
                </Text>

                <Text
                  style={styles.menuSubtitle}
                >
                  Xem và chỉnh sửa thông tin
                </Text>

              </View>


              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textLight}
              />

            </Pressable>


            <View
              style={styles.divider}
            />


            {/* =========================
                ĐỔI MẬT KHẨU
            ========================= */}

            <Pressable
              onPress={
                handleOpenChangePassword
              }
              style={({ pressed }) => [
                styles.menuItem,

                pressed &&
                  styles.menuItemPressed,
              ]}
            >

              <View
                style={[
                  styles.menuIcon,
                  styles.menuIconPurple,
                ]}
              >

                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.secondary}
                />

              </View>


              <View
                style={
                  styles.menuTextContainer
                }
              >

                <Text
                  style={styles.menuTitle}
                >
                  Đổi mật khẩu
                </Text>

                <Text
                  style={styles.menuSubtitle}
                >
                  Thay đổi mật khẩu đăng nhập
                </Text>

              </View>


              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textLight}
              />

            </Pressable>


            <View
              style={styles.divider}
            />


            {/* =========================
                BOOKING
            ========================= */}

            <Pressable
              onPress={() =>
                navigation.navigate(
                  'MainTabs',
                  {
                    screen: 'Bookings',
                  }
                )
              }
              style={({ pressed }) => [
                styles.menuItem,

                pressed &&
                  styles.menuItemPressed,
              ]}
            >

              <View
                style={styles.menuIcon}
              >

                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={colors.primary}
                />

              </View>


              <View
                style={
                  styles.menuTextContainer
                }
              >

                <Text
                  style={styles.menuTitle}
                >
                  Lịch đặt phòng
                </Text>

                <Text
                  style={styles.menuSubtitle}
                >
                  Xem các phòng đã đặt
                </Text>

              </View>


              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textLight}
              />

            </Pressable>


            <View
              style={styles.divider}
            />


            {/* =========================
                HELP
            ========================= */}

            <Pressable
              onPress={() => {

                Alert.alert(
                  'Trợ giúp',
                  'Nếu bạn gặp vấn đề khi đặt phòng, vui lòng kiểm tra ngày, thời gian và phòng đã chọn.'
                );

              }}
              style={({ pressed }) => [
                styles.menuItem,

                pressed &&
                  styles.menuItemPressed,
              ]}
            >

              <View
                style={[
                  styles.menuIcon,
                  styles.menuIconPurple,
                ]}
              >

                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color={colors.secondary}
                />

              </View>


              <View
                style={
                  styles.menuTextContainer
                }
              >

                <Text
                  style={styles.menuTitle}
                >
                  Trợ giúp
                </Text>

                <Text
                  style={styles.menuSubtitle}
                >
                  Hướng dẫn sử dụng ứng dụng
                </Text>

              </View>


              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textLight}
              />

            </Pressable>

          </View>


          {/* =================================================
              THEME
          ================================================= */}

          <Text
            style={styles.sectionTitle}
          >
            Giao diện
          </Text>


          <View
            style={styles.themeItem}
          >

            <View
              style={styles.themeIcon}
            >

              <Ionicons
                name={
                  isDark
                    ? 'moon'
                    : 'sunny-outline'
                }
                size={20}
                color={colors.secondary}
              />

            </View>


            <View
              style={styles.themeInfo}
            >

              <Text
                style={styles.themeTitle}
              >
                Chế độ tối
              </Text>

              <Text
                style={styles.themeSubtitle}
              >
                {isDark
                  ? 'Đang bật'
                  : 'Đang tắt'}
              </Text>

            </View>


            <Switch
              value={isDark}
              onValueChange={
                toggleTheme
              }
              trackColor={{
                false:
                  colors.disabled,
                true:
                  colors.primary,
              }}
              thumbColor={
                '#FFFFFF'
              }
            />

          </View>


          {/* =================================================
              LOGOUT
          ================================================= */}

          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              styles.logoutButton,

              pressed && {
                opacity: 0.7,
              },
            ]}
          >

            <Ionicons
              name="log-out-outline"
              size={20}
              color={colors.error}
            />

            <Text
              style={styles.logoutText}
            >
              Đăng xuất
            </Text>

          </Pressable>


          {/* =================================================
              FOOTER
          ================================================= */}

          <View
            style={styles.footer}
          >

            <Text
              style={styles.footerText}
            >
              CampusBooking • VKU
            </Text>

          </View>

        </View>

      </View>


      {/* =====================================================
          EDIT PROFILE MODAL
      ===================================================== */}

      {editVisible && (

        <View
          style={styles.editOverlay}
        >

          <View
            style={styles.editBox}
          >

            <View
              style={styles.editHeader}
            >

              <Text
                style={styles.editTitle}
              >
                Thông tin cá nhân
              </Text>


              <Pressable
                disabled={saving}
                onPress={() =>
                  setEditVisible(false)
                }
                style={styles.closeButton}
              >

                <Ionicons
                  name="close"
                  size={20}
                  color={colors.text}
                />

              </Pressable>

            </View>


            {/* NAME */}

            <Text
              style={styles.inputLabel}
            >
              Họ và tên
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nhập họ và tên"
              placeholderTextColor={
                colors.textLight
              }
              style={styles.input}
              editable={!saving}
              autoCapitalize="words"
            />


            {/* EMAIL */}

            <Text
              style={styles.inputLabel}
            >
              Email
            </Text>

            <TextInput
              value={
                user?.email || ''
              }
              editable={false}
              style={[
                styles.input,
                styles.disabledInput,
              ]}
            />


            {/* SAVE */}

            <Pressable
              disabled={saving}
              onPress={
                handleSaveProfile
              }
              style={[
                styles.saveButton,

                saving &&
                  styles.saveButtonDisabled,
              ]}
            >

              <Text
                style={styles.saveButtonText}
              >
                {saving
                  ? 'Đang lưu...'
                  : 'Lưu thay đổi'}
              </Text>

            </Pressable>

          </View>

        </View>
      )}


      {/* =====================================================
          CHANGE PASSWORD MODAL
      ===================================================== */}

      {changePasswordVisible && (

        <View
          style={styles.editOverlay}
        >

          <View
            style={styles.editBox}
          >

            <View
              style={styles.editHeader}
            >

              <Text
                style={styles.editTitle}
              >
                Đổi mật khẩu
              </Text>


              <Pressable
                disabled={
                  changingPassword
                }
                onPress={() =>
                  setChangePasswordVisible(
                    false
                  )
                }
                style={styles.closeButton}
              >

                <Ionicons
                  name="close"
                  size={20}
                  color={colors.text}
                />

              </Pressable>

            </View>


            {/* =================================================
                CURRENT PASSWORD
            ================================================= */}

            <Text
              style={styles.inputLabel}
            >
              Mật khẩu hiện tại
            </Text>


            <View
              style={
                styles.passwordInputContainer
              }
            >

              <TextInput
                value={
                  currentPassword
                }
                onChangeText={
                  setCurrentPassword
                }
                placeholder="Nhập mật khẩu hiện tại"
                placeholderTextColor={
                  colors.textLight
                }
                style={[
                  styles.input,
                  styles.passwordInput,
                ]}
                secureTextEntry={
                  !passwordVisible
                }
                editable={
                  !changingPassword
                }
                autoCapitalize="none"
              />


              <Pressable
                onPress={() =>
                  setPasswordVisible(
                    !passwordVisible
                  )
                }
                style={
                  styles.passwordEye
                }
              >

                <Ionicons
                  name={
                    passwordVisible
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={20}
                  color={
                    colors.textSecondary
                  }
                />

              </Pressable>

            </View>


            {/* =================================================
                NEW PASSWORD
            ================================================= */}

            <Text
              style={styles.inputLabel}
            >
              Mật khẩu mới
            </Text>


            <View
              style={
                styles.passwordInputContainer
              }
            >

              <TextInput
                value={newPassword}
                onChangeText={
                  setNewPassword
                }
                placeholder="Nhập mật khẩu mới"
                placeholderTextColor={
                  colors.textLight
                }
                style={[
                  styles.input,
                  styles.passwordInput,
                ]}
                secureTextEntry={
                  !passwordVisible
                }
                editable={
                  !changingPassword
                }
                autoCapitalize="none"
              />

            </View>


            {/* =================================================
                CONFIRM PASSWORD
            ================================================= */}

            <Text
              style={styles.inputLabel}
            >
              Nhập lại mật khẩu mới
            </Text>


            <View
              style={
                styles.passwordInputContainer
              }
            >

              <TextInput
                value={
                  confirmPassword
                }
                onChangeText={
                  setConfirmPassword
                }
                placeholder="Nhập lại mật khẩu mới"
                placeholderTextColor={
                  colors.textLight
                }
                style={[
                  styles.input,
                  styles.passwordInput,
                ]}
                secureTextEntry={
                  !passwordVisible
                }
                editable={
                  !changingPassword
                }
                autoCapitalize="none"
              />

            </View>


            {/* =================================================
                CHANGE BUTTON
            ================================================= */}

            <Pressable
              disabled={
                changingPassword
              }
              onPress={
                handleChangePassword
              }
              style={[
                styles.passwordSaveButton,

                changingPassword &&
                  styles.passwordSaveButtonDisabled,
              ]}
            >

              <Text
                style={
                  styles.saveButtonText
                }
              >
                {changingPassword
                  ? 'Đang cập nhật...'
                  : 'Đổi mật khẩu'}
              </Text>

            </Pressable>

          </View>

        </View>
      )}

    </SafeAreaView>
  );
}