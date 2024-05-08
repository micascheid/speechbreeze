import type { NextAuthOptions } from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';
import axios from '@/utils/axios';

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET_KEY,
    providers: [
        Auth0Provider({
            id: "auth0",
            name: "Auth0",
            clientId: process.env.AUTH0_CLIENT_ID as string,
            clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
            issuer: process.env.AUTH0_ISSUER
        }),
    ],
    callbacks: {
        jwt: async ({token, user, account}) => {
            if (user) {
                // @ts-ignore
                token.accessToken = user.accessToken;
                token.id = user.id;
                token.provider = account?.provider;
            }
            return token;
        },
        session: ({session, token}) => {
            if (token) {
                session.id = token.id;
                session.provider = token.provider;
                session.token = token;
            }
            return session;
        },
        signIn: async ({user, profile, account}) => {
            try {
                console.log("signin, user:", user);
                const response = await axios.get(`http://127.0.0.1:5000/slp/${user.id}/check`);
                const userExists = response.data.exists;

                if (!userExists) {
                    await axios.post(`http://127.0.0.1:5000/slp/add`, {
                            slp_id: user.id,
                            name: user?.name,
                            email: user.email
                        }
                    );
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
};