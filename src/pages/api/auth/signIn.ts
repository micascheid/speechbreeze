import {
    AuthFlowType,
    CognitoIdentityProviderClient,
    InitiateAuthCommand
} from "@aws-sdk/client-cognito-identity-provider";
import type {NextApiRequest, NextApiResponse} from "next";
import {createHmac} from "crypto";


const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID || '';
const COGNITO_CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET || '';
const REGION = process.env.COGNITO_REGION || 'us-east-2';

const calculateSecretHash = (username: string, clientId: string, clientSecret: string) => {
    const message = username + clientId;
    const hmac = createHmac('sha256', clientSecret);
    hmac.update(message);
    return hmac.digest('base64');
};

const cognitoClient = new CognitoIdentityProviderClient({
    region: REGION
});

interface SignInData {
    email: string;
    password: string;
    AccessToken: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {email, password} = req.body as SignInData;
    const secretHash = calculateSecretHash('micascheid@gmail.com', COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET);
    const params = {
        AuthFlow: "USER_PASSWORD_AUTH" as AuthFlowType,
        ClientId: COGNITO_CLIENT_ID,
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
            SecretHash: secretHash,
        },
    };
    try {
        console.log("TYRING HERE?");
        const command = new InitiateAuthCommand(params);
        const { AuthenticationResult } = await cognitoClient.send(command);
        if (AuthenticationResult) {
            res.status(200).json({ accessToken: AuthenticationResult.AccessToken });
        } else {
            res.status(400).json({ error: 'Something went wrong' });
        }
    } catch (error) {
        console.error("Error signing in: ", error);
        res.status(500).json({ error: 'Error signing in' });
    }
};