import {
  collection,
  getDocs,
} from 'firebase/firestore';

import { db } from '../config/firebase';
import { Room } from '../data/rooms';

export async function getRooms(): Promise<Room[]> {
  const roomsCollection = collection(db, 'rooms');

  const snapshot = await getDocs(
    roomsCollection
  );

  const rooms: Room[] = snapshot.docs.map(
    (doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data.name,
        building: data.building,
        area: data.area,
        capacity: data.capacity,
        floor: data.floor,
        available: data.available,
        image: data.image,
      };
    }
  );

  return rooms;
}