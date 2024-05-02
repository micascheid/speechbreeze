import type { NextApiRequest, NextApiResponse } from 'next';
import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { createHmac } from 'crypto';

// Assuming these are defined elsewhere or hard-coded appropriately
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID || '';
const COGNITO_CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET || '';
const REGION = process.env.COGNITO_REGION || 'us-east-2';

interface SignUpData {
    email: string;
    name: string;
    password: string;
}

interface SignUpResponse {
    success: boolean;
    message: string;
    data?: any; // Define this based on what data you expect in return
    error?: string;
}

const cognitoClient = new CognitoIdentityProviderClient({
    region: REGION
});

const calculateSecretHash = (username: string, clientId: string, clientSecret: string) => {
    const message = username + clientId;
    const hmac = createHmac('sha256', clientSecret);
    hmac.update(message);
    return hmac.digest('base64');
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<SignUpResponse>) {
    const { email, name, password } = req.body as SignUpData;
    console.log("req", req);
    const secretHash = calculateSecretHash(email, COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET);
    const params = {
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
            {
                Name: "email",
                Value: email,
            },
            {
                Name: "name",
                Value: name,
            },
        ],
        SecretHash: secretHash
    };

    try {
        const command = new SignUpCommand(params);
        const response = await cognitoClient.send(command);
        console.log("Sign up success: ", response);
        res.status(200).json({ success: true, message: "Signup successful", data: response });
    } catch (error: any) {
        console.error("Error signing up: ", error);
        res.status(500).json({ success: false, message: error.message });
    }
}
