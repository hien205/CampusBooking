import { create } from 'zustand';

import { auth } from '../config/firebase';

import {
  createBooking,
  getUserBookings,
  cancelBooking,
  FirestoreBooking,
} from '../services/bookingService';

export type Booking = FirestoreBooking;

type BookingState = {
  selectedDate: string;
  selectedArea: string;
  peopleCount: number;
  selectedTime: string;

  bookings: Booking[];

  setSelectedDate: (date: string) => void;

  setSelectedArea: (area: string) => void;

  setPeopleCount: (count: number) => void;

  setSelectedTime: (time: string) => void;

  loadBookings: () => Promise<void>;

  addBooking: (
    booking: Omit<
      Booking,
      'id' | 'userId' | 'createdAt'
    >
  ) => Promise<void>;

  cancelBooking: (
    bookingId: string
  ) => Promise<void>;

  clearBookings: () => void;

  resetBooking: () => void;
};

export const useBookingStore =
  create<BookingState>((set) => ({
    selectedDate: 'Hôm nay',

    selectedArea: 'Tất cả',

    peopleCount: 1,

    selectedTime: '',

    bookings: [],

    setSelectedDate: (date) =>
      set({
        selectedDate: date,
      }),

    setSelectedArea: (area) =>
      set({
        selectedArea: area,
      }),

    setPeopleCount: (count) =>
      set({
        peopleCount: count,
      }),

    setSelectedTime: (time) =>
      set({
        selectedTime: time,
      }),

    /**
     * Lấy booking của tài khoản hiện tại
     * từ Firestore.
     */
    loadBookings: async () => {
      const user = auth.currentUser;

      if (!user) {
        set({
          bookings: [],
        });

        return;
      }

      const bookings =
        await getUserBookings(
          user.uid
        );

      set({
        bookings,
      });
    },

    /**
     * Tạo booking trên Firestore.
     */
    addBooking: async (booking) => {
      const user = auth.currentUser;

      if (!user) {
        throw new Error(
          'USER_NOT_LOGGED_IN'
        );
      }

      const newBooking =
        await createBooking(
          user.uid,
          booking.roomId,
          booking.roomName,
          booking.date,
          booking.time
        );

      set((state) => ({
        bookings: [
          newBooking,
          ...state.bookings,
        ],
      }));
    },

    /**
     * Hủy booking trên Firestore.
     */
    cancelBooking: async (
      bookingId
    ) => {
      await cancelBooking(
        bookingId
      );

      set((state) => ({
        bookings:
          state.bookings.filter(
            (booking) =>
              booking.id !== bookingId
          ),
      }));
    },

    /**
     * Xóa danh sách booking trên UI.
     * Không xóa dữ liệu Firestore.
     */
    clearBookings: () =>
      set({
        bookings: [],
      }),

    /**
     * Reset lựa chọn khi bắt đầu
     * một lần đặt phòng mới.
     */
    resetBooking: () =>
      set({
        selectedTime: '',
      }),
  }));