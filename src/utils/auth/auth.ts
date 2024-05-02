// src/services/auth.ts

import {router} from "next/client";
import {config} from "aws-sdk";
import {CognitoIdentityProviderClient, InitiateAuthCommand} from "@aws-sdk/client-cognito-identity-provider";
import {useRouter} from "next/navigation";

interface SignUpData {
    email: string;
    name: string;
    password: string;
}

interface SignInData {
    email: string,
    password: string
}

interface SignInResponse {
    success: boolean;
    message: string;
    data?: any;
    error?: string;
    AccessToken: string;
}

interface SignUpResponse {
    success: boolean;
    message: string;
    data?: any; // Define based on what data you expect in return
    error?: string;
}

export const cognitoClient = new CognitoIdentityProviderClient({
    region: config.region,
});

export const signIn = async (email: string, password: string) => {
    const res = await fetch('/api/auth/signin/cognito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (res.ok) {
        // Redirect or handle the authenticated state
        router.push('/apps/lsa');
    } else {
        // Handle errors, e.g., display error message to the user
        console.error('Failed to sign in');
    }
}

export const signUp = async (email: string, name: string, password: string): Promise<SignUpResponse> => {
    try {
        const response = await fetch('/api/auth/signUp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, name, password })
        });
        const raw = await response.text();
        // console.log(raw);
        const data: SignUpResponse = JSON.parse(raw)
        if (!response.ok) {
            throw new Error(data.message || 'Failed to sign up');
        }
        return data;
    } catch (error: any) {
        console.error('Signup error:', error);
        return { success: false, message: error.message };
    }
};

export const confirmSignUp = async (username: string, code: string) => {
    try {
        const response = await fetch('/api/auth/confirmSignup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, code })
        });
        const data = await response.json();
        if (response.ok) {
            console.log('Confirmation successful:', data.message);
            // Redirect user or update UI accordingly

        } else {
            throw new Error(data.message);
        }
    } catch (error: any) {
        console.error('Confirmation error:', error.message);

    }
};

