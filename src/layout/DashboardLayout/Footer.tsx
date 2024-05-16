// material-ui
import { Link, Stack, Typography } from '@mui/material';

const Footer = () => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: '24px 16px 0px', mt: 'auto' }}>
    <Typography variant="caption">&copy; All rights reserved</Typography>
    <Stack spacing={1.5} direction="row" justifyContent="space-between" alignItems="center">
      <Link href="https://app.termly.io/document/privacy-policy/62ace8a2-09e8-4f3c-9cf3-52d731eea26f" target="_blank" variant="caption" color="textPrimary">
        Privacy Policy
      </Link>
      <Link href="https://app.termly.io/document/terms-of-service/1c4cda31-c8a0-4a6e-aee5-2c3e7e70491a" target="_blank" variant="caption" color="textPrimary">
        Terms and Conditions
      </Link>
    </Stack>
  </Stack>
);

export default Footer;
