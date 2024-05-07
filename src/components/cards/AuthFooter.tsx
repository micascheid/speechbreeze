'use client';

// material-ui
import { Theme } from '@mui/material/styles';
import { useMediaQuery, Container, Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION ||============================== //

const AuthFooter = () => {
  const matchDownSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="xl">
      <Stack
        direction={matchDownSM ? 'column' : 'row'}
        justifyContent={matchDownSM ? 'center' : 'center'}
        spacing={2}
        textAlign={matchDownSM ? 'center' : 'inherit'}
      >
        <Typography variant="subtitle2" color="secondary" component="span">
          This site is protected by{' '}
          <Typography component={Link} variant="subtitle2" href="https://app.termly.io/document/privacy-policy/62ace8a2-09e8-4f3c-9cf3-52d731eea26f" target="_blank" underline="hover">
            Privacy Policy
          </Typography>
        </Typography>

        <Stack direction={matchDownSM ? 'column' : 'row'} spacing={matchDownSM ? 1 : 3} textAlign={matchDownSM ? 'center' : 'inherit'}>
          <Typography
            variant="subtitle2"
            color="primary"
            component={Link}
            href="https://app.termly.io/document/terms-of-service/1c4cda31-c8a0-4a6e-aee5-2c3e7e70491a"
            target="_blank"
            underline="hover"
          >
            Terms and Conditions
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
};

export default AuthFooter;
