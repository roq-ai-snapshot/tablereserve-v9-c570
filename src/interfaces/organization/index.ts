import { RestaurantInterface } from 'interfaces/restaurant';
import { UserInterface } from 'interfaces/user';

export interface OrganizationInterface {
  id?: string;
  name: string;
  user_id: string;
  created_at?: Date;
  updated_at?: Date;
  restaurant?: RestaurantInterface[];
  user?: UserInterface;
  _count?: {
    restaurant?: number;
  };
}
