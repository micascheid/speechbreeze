// third-party
import { FormattedMessage } from 'react-intl';

// project-imports

// assets
import {
  BuildOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  PlusOutlined,
  LinkOutlined
} from '@ant-design/icons';

// type
import { NavActionType, NavItemType } from '@/types/menu';

// icons
const icons = {
  BuildOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  FileTextOutlined,
  PlusOutlined,
  LinkOutlined
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const applications: NavItemType = {
  id: 'group-applications',
  title: <FormattedMessage id="applications" />,
  icon: icons.AppstoreAddOutlined,
  type: 'group',
  children: [
    {
      id: 'lsa',
      title: <FormattedMessage id="lsa" />,
      type: 'item',
      url: '/apps/lsa',
      icon: icons.MessageOutlined,
      breadcrumbs: false
    },
    {
      id: 'clients',
      title: <FormattedMessage id="clients" />,
      type: 'item',
      url: '/apps/clients',
      icon: icons.CalendarOutlined,
      breadcrumbs: false
    }
  ]
};

export default applications;
