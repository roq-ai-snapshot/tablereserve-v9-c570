import { ReservationInterface } from 'interfaces/reservation';
import { RestaurantInterface } from 'interfaces/restaurant';

export interface TableInterface {
  id?: string;
  capacity: number;
  availability: boolean;
  restaurant_id: string;
  created_at?: Date;
  updated_at?: Date;
  reservation?: ReservationInterface[];
  restaurant?: RestaurantInterface;
  _count?: {
    reservation?: number;
  };
}
