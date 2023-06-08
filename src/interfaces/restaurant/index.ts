import { TableInterface } from 'interfaces/table';
import { OrganizationInterface } from 'interfaces/organization';

export interface RestaurantInterface {
  id?: string;
  name: string;
  organization_id: string;
  created_at?: Date;
  updated_at?: Date;
  table?: TableInterface[];
  organization?: OrganizationInterface;
  _count?: {
    table?: number;
  };
}
