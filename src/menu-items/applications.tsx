// third-party
import { FormattedMessage } from 'react-intl';

// project-imports

// assets
import {
  ToolOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  PlusOutlined,
  LinkOutlined,
} from '@ant-design/icons';

import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';

// type
import { NavActionType, NavItemType } from '@/types/menu';

// icons
const icons = {
  ToolOutlined,
  GroupsOutlinedIcon,
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
      icon: icons.ToolOutlined,
      breadcrumbs: false
    },
  ]
};

export default applications;
