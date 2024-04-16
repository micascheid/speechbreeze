import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import CognitoProvider from "next-auth/providers/cognito";
import axios from '@/utils/axios';

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET_KEY,
    providers: [
        CognitoProvider({
            name: 'Cognito',
            clientId: process.env.COGNITO_CLIENT_ID as string,
            clientSecret: process.env.COGNITO_CLIENT_SECRET as string,
            issuer: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_POOL_ID}`,
        }),
        CredentialsProvider({
            id: 'login',
            name: 'login',
            credentials: {
                email: { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
                password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' }
            },
            async authorize(credentials) {
                try {
                    const user = await axios.post('/api/account/login', {
                        password: credentials?.password,
                        email: credentials?.email
                    });

                    if (user) {
                        user.data.user['accessToken'] = user.data.serviceToken;
                        return user.data.user;
                    }
                } catch (e: any) {
                    const errorMessage = e?.response.data.message;
                    throw new Error(errorMessage);
                }
            }
        }),
        CredentialsProvider({
            id: 'register',
            name: 'Register',
            credentials: {
                firstname: { name: 'firstname', label: 'Firstname', type: 'text', placeholder: 'Enter Firstname' },
                lastname: { name: 'lastname', label: 'Lastname', type: 'text', placeholder: 'Enter Lastname' },
                email: { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
                company: { name: 'company', label: 'Company', type: 'text', placeholder: 'Enter Company' },
                password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' }
            },
            async authorize(credentials) {
                try {
                    const user = await axios.post('/api/account/register', {
                        firstName: credentials?.firstname,
                        lastName: credentials?.lastname,
                        company: credentials?.company,
                        password: credentials?.password,
                        email: credentials?.email
                    });

                    if (user) {
                        // users.push(user.data);
                        return user.data;
                    }
                } catch (e: any) {
                    const errorMessage = e?.response.data.message;
                    throw new Error(errorMessage);
                }
            }
        }),

    ],
    callbacks: {
        jwt: async ({ token, user, account }) => {
            if (user) {
                // @ts-ignore
                token.accessToken = user.accessToken;
                token.id = user.id;
                token.provider = account?.provider;
            }
            return token;
        },
        session: ({ session, token }) => {
            if (token) {
                session.id = token.id;
                session.provider = token.provider;
                session.token = token;
            }
            return session;
        },
        signIn: async ({user, profile, account}) => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/slp/${user.id}/check`);
                const userExists = response.data.exists;

                if (!userExists) {
                    await axios.post(`http://127.0.0.1:5000/slp/add`, { slp_id: user.id, name: (profile as any)?.given_name, email: user.email });
                }
                return true;
            } catch (error) {
                console.error("Unable to handle user in db:", error);
                return false;
            }
        }
    },
    session: {
        strategy: 'jwt',
        maxAge: Number(process.env.NEXT_APP_JWT_TIMEOUT!)
    },
    jwt: {
        secret: process.env.NEXT_APP_JWT_SECRET
    },
    pages: {
        signIn: '/login',
        newUser: '/register'
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
