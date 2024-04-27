// project import
import applications from './applications';
import payments from "@/menu-items/payments";

// types
import { NavItemType } from '@/types/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [applications, payments]
};

export default menuItems;
