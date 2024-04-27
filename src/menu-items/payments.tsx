// third-party
import { FormattedMessage } from 'react-intl';

// project-imports

// assets
import {
    AppstoreAddOutlined,
    DollarOutlined,
} from '@ant-design/icons';

import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';

// type
import { NavActionType, NavItemType } from '@/types/menu';

// icons
const icons = {
    AppstoreAddOutlined,
    DollarOutlined
};

// ==============================|| MENU ITEMS - PAYMENTS ||============================== //

const applications: NavItemType = {
    id: 'group-payments',
    title: <FormattedMessage id="payments" />,
    icon: icons.AppstoreAddOutlined,
    type: 'group',
    children: [
        {
            id: 'pricing',
            title: <FormattedMessage id="pricing" />,
            type: 'item',
            url: '/pages/payments/pricing',
            icon: icons.DollarOutlined,
            breadcrumbs: false
        },

    ]
};

export default applications;
