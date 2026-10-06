export type Room = {
  id: string;
  name: string;
  building: string;
  area: string;
  capacity: number;
  floor: number;
  available: boolean;
  image: string;
};

export const rooms: Room[] = [
  {
    id: 'R01',
    name: 'Phòng A101',
    building: 'Cơ sở 1',
    area: 'Cơ sở 1',
    capacity: 6,
    floor: 1,
    available: true,
    image:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
  },

  {
    id: 'R02',
    name: 'Phòng A203',
    building: 'Cơ sở 1',
    area: 'Cơ sở 1',
    capacity: 10,
    floor: 2,
    available: true,
    image:
      'https://images.shiksha.com/mediadata/images/1543918205php6TIF3E.jpeg',
  },

  {
    id: 'R03',
    name: 'Phòng B301',
    building: 'Cơ sở 2',
    area: 'Cơ sở 2',
    capacity: 12,
    floor: 3,
    available: true,
    image:
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
  },

  {
    id: 'R04',
    name: 'Phòng B105',
    building: 'Cơ sở 2',
    area: 'Cơ sở 2',
    capacity: 4,
    floor: 1,
    available: false,
    image:
      'https://www.hokudai.ac.jp/bureau/property/aas/img/a15-3.jpg',
  },

  {
    id: 'R05',
    name: 'Phòng C201',
    building: 'Cơ sở 3',
    area: 'Cơ sở 3',
    capacity: 8,
    floor: 2,
    available: true,
    image:
      'https://www.uwe.ac.uk/-/media/uwe/images/study/library/the-hive-gallery-4-850x480.jpg?db=web&hash=AF820E12CF20BDCF1D7A1AD8E2210649',
  },

  {
    id: 'R06',
    name: 'Phòng C302',
    building: 'Cơ sở 3',
    area: 'Cơ sở 3',
    capacity: 15,
    floor: 3,
    available: true,
    image:
      'https://www.leeds.ac.uk/images/resized/750x500-0-0-1-80-32771_1.jpg',
  },
];