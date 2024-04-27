// material-ui
import { Button, Link, CardMedia, Stack, Typography } from '@mui/material';

// project import
import MainCard from '@/components/MainCard';
import AnimateButton from '@/components/@extended/AnimateButton';

const avatar = '/assets/images/users/avatar-group.png';

// ==============================|| DRAWER CONTENT - NAVIGATION CARD ||============================== //

const NavCard = () => (
    <MainCard sx={{ bgcolor: 'grey.50', m: 3 }}>
      <Stack alignItems="center" spacing={1}>
        <Stack alignItems="center">
          <Typography variant="h5">Help?</Typography>
        </Stack>
        <Typography>support@speechbreeze.com</Typography>
      </Stack>
    </MainCard>
);

export default NavCard;
