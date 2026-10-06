import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';

import { auth } from '../config/firebase';


/* =====================================================
   REGISTER
===================================================== */

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

  await updateProfile(
    userCredential.user,
    {
      displayName: name.trim(),
    }
  );

  await signOut(auth);

  return userCredential.user;
}


/* =====================================================
   LOGIN
===================================================== */

export async function loginUser(
  email: string,
  password: string
) {
  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

  return userCredential.user;
}


/* =====================================================
   LOGOUT
===================================================== */

export async function logoutUser() {
  await signOut(auth);
}


/* =====================================================
   UPDATE PROFILE
===================================================== */

export async function updateUserProfile(
  name: string
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('USER_NOT_LOGGED_IN');
  }

  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error('NAME_REQUIRED');
  }

  await updateProfile(user, {
    displayName: trimmedName,
  });

  return user;
}


/* =====================================================
   CHANGE PASSWORD
===================================================== */

export async function changeUserPassword(
  currentPassword: string,
  newPassword: string
) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('USER_NOT_LOGGED_IN');
  }

  if (!user.email) {
    throw new Error('EMAIL_NOT_FOUND');
  }

  /* =========================
     XÁC THỰC MẬT KHẨU CŨ
  ========================= */

  const credential =
    EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

  await reauthenticateWithCredential(
    user,
    credential
  );

  /* =========================
     ĐỔI MẬT KHẨU MỚI
  ========================= */

  await updatePassword(
    user,
    newPassword
  );
}