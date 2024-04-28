import { useMemo } from 'react';

// material-ui
import { Theme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';

// project import
import Profile from './Profile';
import Localization from './Localization';
import MegaMenuSection from './MegaMenuSection';

import useConfig from '@/hooks/useConfig';
import DrawerHeader from '@/layout/DashboardLayout/Drawer/DrawerHeader';

// type
import { MenuOrientation } from '@/types/config';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const { i18n, menuOrientation } = useConfig();

  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const localization = useMemo(() => <Localization />, [i18n]);

  const megaMenu = useMemo(() => <MegaMenuSection />, []);

  return (
    <>
        {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open={true} />}
        {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
        {!downLG && <Profile />}
    </>
  );
};

export default HeaderContent;
