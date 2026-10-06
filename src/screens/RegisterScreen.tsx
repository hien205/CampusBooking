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
  registerUser,
} from '../services/authService';

import {
  RootStackParamList,
} from '../navigation/AppNavigator';

type Props =
  NativeStackScreenProps<
    RootStackParamList,
    'Register'
  >;

export default function RegisterScreen({
  navigation,
}: Props) {
  const [name, setName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const handleRegister = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert(
        'Thiếu thông tin',
        'Vui lòng nhập đầy đủ thông tin.'
      );

      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Mật khẩu quá ngắn',
        'Mật khẩu phải có ít nhất 6 ký tự.'
      );

      return;
    }

    if (
      password !== confirmPassword
    ) {
      Alert.alert(
        'Mật khẩu không khớp',
        'Vui lòng nhập lại mật khẩu xác nhận.'
      );

      return;
    }

    try {
      setLoading(true);

      await registerUser(
  name,
  email,
  password
);

Alert.alert(
  'Đăng ký thành công',
  'Tài khoản đã được tạo. Vui lòng đăng nhập để tiếp tục.',
  [
    {
      text: 'Đăng nhập',
      onPress: () => {
        navigation.navigate('Login');
      },
    },
  ]
);

      // Firebase tự cập nhật auth state.
      // AppNavigator sẽ tự chuyển vào app.
    } catch (error: any) {
      let message =
        'Không thể tạo tài khoản.';

      if (
        error?.code ===
        'auth/email-already-in-use'
      ) {
        message =
          'Email này đã được sử dụng.';
      }

      if (
        error?.code ===
        'auth/invalid-email'
      ) {
        message =
          'Email không hợp lệ.';
      }

      if (
        error?.code ===
        'auth/weak-password'
      ) {
        message =
          'Mật khẩu quá yếu.';
      }

      Alert.alert(
        'Đăng ký thất bại',
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
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() =>
            navigation.goBack()
          }
          style={styles.backButton}
        >
          <Text style={styles.backText}>
            ‹
          </Text>

          <Text style={styles.backLabel}>
            Đăng nhập
          </Text>
        </Pressable>

        <View style={styles.logo}>
          <Text style={styles.logoText}>
            C
          </Text>
        </View>

        <Text style={styles.title}>
          Tạo tài khoản
        </Text>

        <Text style={styles.subtitle}>
          Đăng ký để bắt đầu đặt phòng
          học tại VKU.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>
            Họ và tên
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Nhập họ và tên"
            placeholderTextColor="#A1A1AA"
            style={styles.input}
          />

          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Nhập email"
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
            placeholder="Ít nhất 6 ký tự"
            placeholderTextColor="#A1A1AA"
            secureTextEntry
            style={styles.input}
          />

          <Text style={styles.label}>
            Xác nhận mật khẩu
          </Text>

          <TextInput
            value={confirmPassword}
            onChangeText={
              setConfirmPassword
            }
            placeholder="Nhập lại mật khẩu"
            placeholderTextColor="#A1A1AA"
            secureTextEntry
            style={styles.input}
          />

          <Pressable
            onPress={handleRegister}
            disabled={loading}
            style={({ pressed }) => [
              styles.registerButton,

              pressed &&
                styles.buttonPressed,

              loading &&
                styles.buttonDisabled,
            ]}
          >
            <Text
              style={
                styles.registerButtonText
              }
            >
              {loading
                ? 'Đang tạo tài khoản...'
                : 'Đăng ký'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>
            Đã có tài khoản?
          </Text>

          <Pressable
            onPress={() =>
              navigation.navigate(
                'Login'
              )
            }
          >
            <Text style={styles.loginLink}>
              Đăng nhập
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
    paddingHorizontal: 24,
    paddingVertical: 30,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },

  backText: {
    color: '#18181B',
    fontSize: 30,
    lineHeight: 30,
  },

  backLabel: {
    color: '#52525B',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 3,
  },

  logo: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: '#5B5BD6',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 17,
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '900',
  },

  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '800',
    color: '#18181B',
  },

  subtitle: {
    textAlign: 'center',
    color: '#71717A',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
    paddingHorizontal: 20,
  },

  form: {
    marginTop: 20,
  },

  label: {
    color: '#3F3F46',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 7,
    marginTop: 11,
  },

  input: {
    height: 49,
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    paddingHorizontal: 15,
    color: '#18181B',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },

  registerButton: {
    height: 51,
    borderRadius: 14,
    backgroundColor: '#5B5BD6',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 23,
  },

  buttonPressed: {
    opacity: 0.75,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },

  loginText: {
    color: '#71717A',
    fontSize: 12,
  },

  loginLink: {
    color: '#5B5BD6',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 5,
  },
});