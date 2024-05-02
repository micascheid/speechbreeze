'use client';

import React, {useState, useEffect} from 'react';

// next
import Image from 'next/legacy/image';
import NextLink from 'next/link';
import {signIn} from 'next-auth/react';

// material-ui
import {Theme} from '@mui/material/styles';
import {
    Box,
    useMediaQuery,
    Button,
    Divider,
    FormHelperText,
    FormControl,
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
import {Formik, FormikHelpers} from 'formik';

// project import
import IconButton from '@/components/@extended/IconButton';
import AnimateButton from '@/components/@extended/AnimateButton';

import {APP_DEFAULT_PATH} from '@/config';
import {strengthColor, strengthIndicator} from '@/utils/password-strength';
// assets
import {EyeOutlined, EyeInvisibleOutlined} from '@ant-design/icons';

// types
import {StringColorProps} from '@/types/password';
import ConfirmationForm from "@/sections/auth/auth-forms/ConfirmForm";
import SignUpForm from "@/sections/auth/auth-forms/SignUpForm";

const Auth0 = '/assets/images/icons/auth0.svg';
const Cognito = '/assets/images/icons/aws-cognito.svg';
const Google = '/assets/images/icons/google.svg';

// ============================|| AWS COGNITO - REGISTER ||============================ //


const AuthRegister = () => {
    const [successfulSignUp, setSuccessfulSignUp] = useState(false);
    const [emailConf, setEmailConf] = useState('');
    const [signUpResponse, setSignUpResponse] = useState(null);

    return (
        <>
            {!successfulSignUp ? (
                <SignUpForm setSuccessfulSignUp={setSuccessfulSignUp} setSignUpRes={setSignUpResponse}/>
            ) : (
                <ConfirmationForm res={signUpResponse}/>
            )}
        </>
    );
};

export default AuthRegister;
