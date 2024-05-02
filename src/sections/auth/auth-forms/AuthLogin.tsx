'use client';

import React, {useState, FocusEvent, SyntheticEvent, ReactElement} from 'react';

// next
import Image from 'next/legacy/image';
import NextLink from 'next/link';

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
import {signIn} from 'next-auth/react';
// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

import {router} from "next/client";
import {useRouter} from "next/navigation";

const Auth0 = '/assets/images/icons/auth0.svg';
const Cognito = '/assets/images/icons/aws-cognito.svg';
const Google = '/assets/images/icons/google.svg';

// ============================|| AWS CONNITO - LOGIN ||============================ //

const AuthLogin = () => {
  const matchDownSM = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [checked, setChecked] = useState(false);
  const [capsWarning, setCapsWarning] = useState(false);
  const router = useRouter();

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
              email: '',
              password: '',
              submit: null
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={async (values, {setErrors, setSubmitting}) => {
                const {email, password} = values;
                const result = await signIn('credentials', {
                    redirect: false,
                    email: email,
                    password: password
                });

                if (result?.error) {
                    // Handle errors, perhaps update state to show in the UI
                    console.error('Login failed:', result.error);
                } else {
                    router.push('/apps/lsa');
                }

                setSubmitting(false);
            }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
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
      </>
  );
};

export default AuthLogin;
