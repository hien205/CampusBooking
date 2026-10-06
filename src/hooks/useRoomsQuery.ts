import {
  useQuery,
} from '@tanstack/react-query';

import {
  getRooms,
} from '../api/roomsApi';

export function useRoomsQuery() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: getRooms,
    staleTime: 30 * 1000,
  });
}