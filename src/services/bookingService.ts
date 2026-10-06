import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from 'firebase/firestore';

import { db } from '../config/firebase';

export type FirestoreBooking = {
  id: string;
  userId: string;
  roomId: string;
  roomName: string;
  date: string;
  time: string;
  slotId: string;
  createdAt?: unknown;
};

function createSlotId(
  roomId: string,
  date: string,
  time: string
) {
  return `${roomId}_${date}_${time}`.replace(
    /[^a-zA-Z0-9_-]/g,
    '_'
  );
}

// ========================================
// KIỂM TRA SLOT ĐÃ ĐƯỢC ĐẶT CHƯA
// ========================================

export async function isTimeSlotBooked(
  roomId: string,
  date: string,
  time: string
): Promise<boolean> {
  const slotId = createSlotId(
    roomId,
    date,
    time
  );

  const slotRef = doc(
    db,
    'roomSlots',
    slotId
  );

  try {
    const snapshot =
      await import('firebase/firestore').then(
        async ({ getDoc }) => {
          return await getDoc(slotRef);
        }
      );

    return snapshot.exists();
  } catch (error) {
    console.log(
      'Không thể kiểm tra lịch:',
      error
    );

    return false;
  }
}

// ========================================
// LẤY LỊCH ĐẶT CỦA USER HIỆN TẠI
// ========================================

export async function getUserBookings(
  userId: string
): Promise<FirestoreBooking[]> {
  const bookingsRef =
    collection(db, 'bookings');

  const q = query(
    bookingsRef,
    where('userId', '==', userId)
  );

  const snapshot =
    await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<
      FirestoreBooking,
      'id'
    >),
  }));
}

// ========================================
// TẠO BOOKING
// ========================================

export async function createBooking(
  userId: string,
  roomId: string,
  roomName: string,
  date: string,
  time: string
): Promise<FirestoreBooking> {

  const slotId = createSlotId(
    roomId,
    date,
    time
  );

  const bookingRef = doc(
    collection(db, 'bookings')
  );

  const slotRef = doc(
    db,
    'roomSlots',
    slotId
  );

  try {
    await runTransaction(
      db,
      async (transaction) => {

        const slotSnapshot =
          await transaction.get(
            slotRef
          );

        if (slotSnapshot.exists()) {
          throw new Error(
            'TIME_SLOT_ALREADY_BOOKED'
          );
        }

        transaction.set(
          slotRef,
          {
            roomId,
            roomName,
            date,
            time,
            userId,
            bookingId:
              bookingRef.id,
            createdAt:
              serverTimestamp(),
          }
        );

        transaction.set(
          bookingRef,
          {
            userId,
            roomId,
            roomName,
            date,
            time,
            slotId,
            createdAt:
              serverTimestamp(),
          }
        );
      }
    );

    return {
      id: bookingRef.id,
      userId,
      roomId,
      roomName,
      date,
      time,
      slotId,
    };

  } catch (error) {

    console.log(
      'Booking error:',
      error
    );

    throw error;
  }
}

// ========================================
// HỦY BOOKING
// ========================================

export async function cancelBooking(
  bookingId: string
): Promise<void> {

  const bookingRef = doc(
    db,
    'bookings',
    bookingId
  );

  const bookingsSnapshot =
    await getDocs(
      query(
        collection(db, 'bookings'),
        where('__name__', '==', bookingId)
      )
    );

  if (bookingsSnapshot.empty) {
    throw new Error(
      'BOOKING_NOT_FOUND'
    );
  }

  const booking =
    bookingsSnapshot.docs[0].data() as Omit<
      FirestoreBooking,
      'id'
    >;

  const slotRef = doc(
    db,
    'roomSlots',
    booking.slotId
  );

  await runTransaction(
    db,
    async (transaction) => {

      transaction.delete(
        bookingRef
      );

      transaction.delete(
        slotRef
      );
    }
  );
}