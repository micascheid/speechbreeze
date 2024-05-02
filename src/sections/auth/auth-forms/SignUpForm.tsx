'use client'
import React, {useState} from 'react';
import {Formik, Form, Field, FieldProps, FormikHelpers, FormikErrors} from 'formik';
import * as Yup from 'yup';
import {
    Button,
    FormControl,
    FormHelperText,
    Link,
    OutlinedInput,
    InputLabel,
    Typography,
    Stack,
    InputAdornment, Box, Grid,
} from '@mui/material';
import {EyeOutlined, EyeInvisibleOutlined} from '@ant-design/icons';
import IconButton from '@/components/@extended/IconButton';
import AnimateButton from '@/components/@extended/AnimateButton';
import {strengthColor, strengthIndicator} from "@/utils/password-strength";
import NextLink from "next/link";
import {StringColorProps} from "@/types/password";
import {signUp} from "@/utils/auth/auth";

interface SignUpFormProps {
    setSuccessfulSignUp: (successfulSignUp: boolean) => void;
    setSignUpRes: (signUpRes: any) => void;
}

interface FormValues {
    name: string;
    email: string;
    password: string;
}

interface ExtendedFormErrors extends FormikErrors<FormValues> {
    submit?: string; // Custom error field for submission errors
}

const validationSchema = Yup.object({
    name: Yup.string().max(255).required('Name is required'),
    email: Yup.string().email().max(255).required('Email is required'),
    password: Yup.string().max(255).required('Password is required')
});

const SignUpForm = ({setSuccessfulSignUp, setSignUpRes}: SignUpFormProps) => {

    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({color: 'grey', label: ''});
    const [level, setLevel] = React.useState<StringColorProps>();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Must be a valid email').required('Email is required'),
        password: Yup.string().required('Password is required')
    });

    const changePassword = (value: string) => {
        const temp = strengthIndicator(value);
        setLevel(strengthColor(temp));
    };

    React.useEffect(() => {
        changePassword('');
    }, []);

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline"
                           sx={{mb: {xs: -0.5, sm: 0.5}}}>
                        <Typography variant="h3">Sign up</Typography>
                        <NextLink href="/login" passHref legacyBehavior>
                            <Link variant="body1" color="primary">
                                Already have an account?
                            </Link>
                        </NextLink>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <Formik
                        initialValues={{
                            name: '',
                            email: '',
                            password: '',
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                            name: Yup.string().max(255).required('Name is required'),
                            email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                            password: Yup.string().max(255).required('Password is required')
                        })}
                        onSubmit={(values, {setErrors, setSubmitting}) => {
                            const {email, name, password} = values;

                            signUp(email, name, password).then((res) => {
                                console.log("response:", res);
                                if (!res.success) {
                                    setErrors({submit: res.message});
                                    setSubmitting(false);
                                } else {
                                    // Handle success, e.g., redirecting the user or showing a success message
                                    console.log('Signup successful:', res);
                                    setSubmitting(false);
                                    setSuccessfulSignUp(true);
                                    setSignUpRes(res);
                                    // Optionally redirect the user or clear the form, etc.
                                }
                            }).catch((error) => {
                                console.error('An error occurred during sign up:', error);
                                setSubmitting(false);
                                setErrors({submit: 'An unexpected error occurred'});
                            });
                        }}
                    >
                        {({errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values}) => (
                            <form noValidate onSubmit={handleSubmit}>
                                {/*<input name="csrfToken" type="hidden" defaultValue={csrfToken} />*/}
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="name-login">Name</InputLabel>
                                            <OutlinedInput
                                                id="name-login"
                                                type="text"
                                                value={values.name}
                                                name="name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Enter your name"
                                                fullWidth
                                                error={Boolean(touched.name && errors.name)}
                                            />
                                        </Stack>
                                        {touched.name && errors.name && (
                                            <FormHelperText error id="standard-weight-helper-text-name-login">
                                                {errors.name}
                                            </FormHelperText>
                                        )}
                                    </Grid>
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
                                                error={Boolean(touched.password && errors.password)}
                                                id="-password-login"
                                                type={showPassword ? 'text' : 'password'}
                                                value={values.password}
                                                name="password"
                                                onBlur={handleBlur}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    changePassword(e.target.value);
                                                }}
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
                                        </Stack>
                                        {touched.password && errors.password && (
                                            <FormHelperText error id="standard-weight-helper-text-password-login">
                                                {errors.password}
                                            </FormHelperText>
                                        )}
                                        <FormControl fullWidth sx={{mt: 2}}>
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item>
                                                    <Box sx={{
                                                        bgcolor: level?.color,
                                                        width: 85,
                                                        height: 8,
                                                        borderRadius: '7px'
                                                    }}/>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="subtitle1" fontSize="0.75rem">
                                                        {level?.label}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sx={{mt: -1}}>
                                        <Typography variant="body2">
                                            By Signing up, you agree to our &nbsp;
                                            <NextLink href="/" passHref legacyBehavior>
                                                <Link variant="subtitle2">Terms of Service</Link>
                                            </NextLink>
                                            &nbsp; and &nbsp;
                                            <NextLink href="/" passHref legacyBehavior>
                                                <Link variant="subtitle2">Privacy Policy</Link>
                                            </NextLink>
                                        </Typography>
                                    </Grid>
                                    {errors.submit && (
                                        <Grid item xs={12}>
                                            <FormHelperText error>{errors.submit}</FormHelperText>
                                        </Grid>
                                    )}
                                    <Grid item xs={12}>
                                        <AnimateButton>
                                            <Button disableElevation disabled={isSubmitting} fullWidth size="large"
                                                    type="submit" variant="contained" color="primary">
                                                Create Account
                                            </Button>
                                        </AnimateButton>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    </Formik>
                </Grid>
            </Grid>
        </>
    );
};

export default SignUpForm;
