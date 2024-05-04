'use client'

// next
import NextLink from 'next/link';
import {getProviders, getCsrfToken, useSession, signIn} from 'next-auth/react';

// material-ui
import {CircularProgress, Grid, Link, Stack, Typography} from '@mui/material';

// project import
import AuthWrapper from '@/sections/auth/AuthWrapper';
import AuthLogin from '@/sections/auth/auth-forms/AuthLogin';
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {APP_DEFAULT_PATH} from "@/config";
import Loader from "@/components/Loader";

export default function SignIn() {
    const router = useRouter();
    const {data: session} = useSession();

    useEffect(() => {
        const handleLogin = async () => {
            if (session) {
                router.push(APP_DEFAULT_PATH);
            } else {
                await signIn('auth0', {callbackUrl: APP_DEFAULT_PATH})
            }
        }

        handleLogin();

    }, [router, session]);

    return (
        <Loader />
    );
};
