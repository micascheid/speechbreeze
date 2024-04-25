// material-ui
import { useTheme } from '@mui/material/styles';
import {Box, useMediaQuery} from '@mui/material';

// project import
import NavUser from './NavUser';
import NavCard from './NavCard';
import Navigation from './Navigation';
import SimpleBar from '@/components/third-party/SimpleBar';
import { useGetMenuMaster } from '@/api/menu';
import FreeTrialLeft from "@/layout/DashboardLayout/Drawer/DrawerContent/FreeTrialLeft";

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => {
  const theme = useTheme();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <>
      <SimpleBar
        sx={{
          '& .simplebar-content': {
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <Navigation />
      </SimpleBar>
        <Box>
            <FreeTrialLeft />
            {drawerOpen && !matchDownMD && <NavCard />}
            <NavUser />
        </Box>

    </>
  );
};

export default DrawerContent;
