'use client';

import React, { useState, FocusEvent, SyntheticEvent } from 'react';

// next
import Image from 'next/legacy/image';
import NextLink from 'next/link';
import { signIn } from 'next-auth/react';

// material-ui
import { Theme } from '@mui/material/styles';
import {
  Box,
  useMediaQuery,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { preload } from 'swr';
import { Formik } from 'formik';

// project import
import IconButton from '@/components/@extended/IconButton';
import AnimateButton from '@/components/@extended/AnimateButton';

import { APP_DEFAULT_PATH } from '@/config';
import { fetcher } from '@/utils/axios';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const Auth0 = '/assets/images/icons/auth0.svg';
const Cognito = '/assets/images/icons/aws-cognito.svg';
const Google = '/assets/images/icons/google.svg';

// ============================|| AWS CONNITO - LOGIN ||============================ //

const AuthLogin = ({ providers, csrfToken }: any) => {
  const matchDownSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [checked, setChecked] = useState(false);
  const [capsWarning, setCapsWarning] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const onKeyDown = (keyEvent: any) => {
    if (keyEvent.getModifierState('CapsLock')) {
      setCapsWarning(true);
    } else {
      setCapsWarning(false);
    }
  };

  return (
      <>
        <Formik
            initialValues={{
              email: 'amazingSLP@gmail.com',
              password: 'pass123',
              submit: null
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={(values, { setErrors, setSubmitting }) => {
              signIn('login', {
                redirect: true,
                email: values.email,
                password: values.password,
                callbackUrl: APP_DEFAULT_PATH
              }).then(
                  (res: any) => {
                    if (res?.error) {
                      setErrors({ submit: res.error });
                      setSubmitting(false);
                    } else {
                      // preload('api/menu/dashboard', fetcher); // load menu on login success
                      setSubmitting(false);
                    }
                  },
                  (res) => {
                    setErrors({ submit: res.error });
                    setSubmitting(false);
                  }
              );
            }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="email-login">Email Address</InputLabel>
                      <OutlinedInput
                          id="email-login"
                          type="email"
                          value={values.email}
                          name="email"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder="Enter email address"
                          fullWidth
                          error={Boolean(touched.email && errors.email)}
                      />
                    </Stack>
                    {touched.email && errors.email && (
                        <FormHelperText error id="standard-weight-helper-text-email-login">
                          {errors.email}
                        </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="password-login">Password</InputLabel>
                      <OutlinedInput
                          fullWidth
                          color={capsWarning ? 'warning' : 'primary'}
                          error={Boolean(touched.password && errors.password)}
                          id="-password-login"
                          type={showPassword ? 'text' : 'password'}
                          value={values.password}
                          name="password"
                          onBlur={(event: FocusEvent<any, Element>) => {
                            setCapsWarning(false);
                            handleBlur(event);
                          }}
                          onKeyDown={onKeyDown}
                          onChange={handleChange}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                  color="secondary"
                              >
                                {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                              </IconButton>
                            </InputAdornment>
                          }
                          placeholder="Enter password"
                      />
                      {capsWarning && (
                          <Typography variant="caption" sx={{ color: 'warning.main' }} id="warning-helper-text-password-login">
                            Caps lock on!
                          </Typography>
                      )}
                    </Stack>
                    {touched.password && errors.password && (
                        <FormHelperText error id="standard-weight-helper-text-password-login">
                          {errors.password}
                        </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} sx={{ mt: -1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                      <FormControlLabel
                          control={
                            <Checkbox
                                checked={checked}
                                onChange={(event) => setChecked(event.target.checked)}
                                name="checked"
                                color="primary"
                                size="small"
                            />
                          }
                          label={<Typography variant="h6">Keep me sign in</Typography>}
                      />
                      <NextLink href={'/forget-pass'} passHref legacyBehavior>
                        <Link variant="h6" color="text.primary">
                          Forgot Password?
                        </Link>
                      </NextLink>
                    </Stack>
                  </Grid>
                  {errors.submit && (
                      <Grid item xs={12}>
                        <FormHelperText error>{errors.submit}</FormHelperText>
                      </Grid>
                  )}
                  <Grid item xs={12}>
                    <AnimateButton>
                      <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                        Login
                      </Button>
                    </AnimateButton>
                  </Grid>
                </Grid>
              </form>
          )}
        </Formik>
        <Divider sx={{ mt: 2 }}>
          <Typography variant="caption"> Login with</Typography>
        </Divider>
        {providers && (
            <Stack
                direction="row"
                spacing={matchDownSM ? 1 : 2}
                justifyContent={matchDownSM ? 'space-around' : 'space-between'}
                sx={{ mt: 3, '& .MuiButton-startIcon': { mr: matchDownSM ? 0 : 1, ml: matchDownSM ? 0 : -0.5 } }}
            >
              {Object.values(providers).map((provider: any) => {
                if (provider.id === 'login' || provider.id === 'register') {
                  return;
                }
                return (
                    <Box key={provider.name} sx={{ width: '100%' }}>

                      {provider.id === 'cognito' && (
                          <Button
                              variant="outlined"
                              color="secondary"
                              fullWidth={!matchDownSM}
                              startIcon={<Image src={Cognito} alt="Twitter" width={16} height={16} />}
                              onClick={() => signIn(provider.id, { callbackUrl: APP_DEFAULT_PATH })}
                          >
                            {!matchDownSM && 'Cognito'}
                          </Button>
                      )}
                    </Box>
                );
              })}
            </Stack>
        )}
      </>
  );
};

export default AuthLogin;
