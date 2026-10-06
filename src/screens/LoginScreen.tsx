import React, {
  useState,
} from 'react';

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
  loginUser,
} from '../services/authService';

import {
  RootStackParamList,
} from '../navigation/AppNavigator';

type Props =
  NativeStackScreenProps<
    RootStackParamList,
    'Login'
  >;

export default function LoginScreen({
  navigation,
}: Props) {
  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        'Thiếu thông tin',
        'Vui lòng nhập email và mật khẩu.'
      );

      return;
    }

    try {
      setLoading(true);

      await loginUser(
        email,
        password
      );

      Alert.alert(
        'Đăng nhập thành công',
        'Chào mừng bạn quay lại CampusBooking!'
      );
    } catch (error: any) {
      let message =
        'Không thể đăng nhập.';

      if (
        error?.code ===
        'auth/invalid-credential'
      ) {
        message =
          'Email hoặc mật khẩu không đúng.';
      }

      if (
        error?.code ===
        'auth/user-not-found'
      ) {
        message =
          'Tài khoản chưa tồn tại.';
      }

      if (
        error?.code ===
        'auth/wrong-password'
      ) {
        message =
          'Mật khẩu không đúng.';
      }

      if (
        error?.code ===
        'auth/invalid-email'
      ) {
        message =
          'Email không hợp lệ.';
      }

      Alert.alert(
        'Đăng nhập thất bại',
        message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={
          styles.scroll
        }
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logo}>
          <Text style={styles.logoText}>
            C
          </Text>
        </View>

        <Text style={styles.title}>
          Chào mừng trở lại
        </Text>

        <Text style={styles.subtitle}>
          Đăng nhập để tiếp tục đặt phòng
          học tại VKU.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Nhập email của bạn"
            placeholderTextColor="#A1A1AA"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />

          <Text style={styles.label}>
            Mật khẩu
          </Text>

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Nhập mật khẩu"
            placeholderTextColor="#A1A1AA"
            secureTextEntry
            style={styles.input}
          />

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            style={({ pressed }) => [
              styles.loginButton,
              pressed &&
                styles.buttonPressed,
              loading &&
                styles.buttonDisabled,
            ]}
          >
            <Text style={styles.loginText}>
              {loading
                ? 'Đang đăng nhập...'
                : 'Đăng nhập'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>
            Chưa có tài khoản?
          </Text>

          <Pressable
            onPress={() =>
              navigation.navigate(
                'Register'
              )
            }
          >
            <Text style={styles.registerLink}>
              Đăng ký ngay
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FA',
  },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  logo: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: '#5B5BD6',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
  },

  title: {
    textAlign: 'center',
    fontSize: 27,
    fontWeight: '800',
    color: '#18181B',
  },

  subtitle: {
    textAlign: 'center',
    color: '#71717A',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
    paddingHorizontal: 25,
  },

  form: {
    marginTop: 30,
  },

  label: {
    color: '#3F3F46',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 7,
    marginTop: 14,
  },

  input: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    color: '#18181B',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },

  loginButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#5B5BD6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },

  buttonPressed: {
    opacity: 0.75,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  loginText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },

  registerText: {
    color: '#71717A',
    fontSize: 12,
  },

  registerLink: {
    color: '#5B5BD6',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 5,
  },
});