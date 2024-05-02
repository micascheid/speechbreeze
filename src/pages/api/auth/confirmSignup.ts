import type { NextApiRequest, NextApiResponse } from 'next';
import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { createHmac } from 'crypto';
import axios from "@/utils/axios";

// Assuming these are defined elsewhere or hard-coded appropriately
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID || '';
const COGNITO_CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET || '';
const REGION = process.env.COGNITO_REGION || 'us-east-1';

interface ConfirmSignUpData {
    username: string;
    code: string;
}

interface ResponseData {
    success: boolean;
    message: string;
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

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    const { username, code } = req.body as ConfirmSignUpData;

    const secretHash = calculateSecretHash(username, COGNITO_CLIENT_ID, COGNITO_CLIENT_SECRET);
    const params = {
        ClientId: COGNITO_CLIENT_ID,
        Username: username,
        ConfirmationCode: code,
        SecretHash: secretHash
    };

    try {
        const command = new ConfirmSignUpCommand(params);
        const response =  await cognitoClient.send(command);
        res.status(200).json({ success: true, message: "User confirmed successfully." });
        console.log("resSignup:", res);
        console.log("resSignup2:", response);
        // const response = await axios.get(`http://127.0.0.1:5000/slp/${user.id}/check`);
        // const userExists = response.data.exists;
        // console.log("response:", user);
        // if (!userExists) {
        //     await axios.post(`http://127.0.0.1:5000/slp/add`, {
        //         slp_id: user.id,
        //         name: (profile as any)?.name,
        //         email: user.email}
        //     );
        // }
    } catch (error: any) {
        console.error("Error confirming sign up: ", error);
        res.status(500).json({ success: false, message: error.message });
    }
}
