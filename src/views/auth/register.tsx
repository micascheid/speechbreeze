// next
import NextLink from 'next/link';
import { getProviders, getCsrfToken } from 'next-auth/react';

// material-ui
import { Grid, Link, Stack, Typography } from '@mui/material';

// project import
import AuthWrapper from '@/sections/auth/AuthWrapper';
import AuthRegister from '@/sections/auth/auth-forms/AuthRegister';

// ================================|| REGISTER ||================================ //

export default async function Register() {
  return (
    <AuthWrapper>
        <Grid item xs={12}>
          <AuthRegister />
        </Grid>
    </AuthWrapper>
  );
}
