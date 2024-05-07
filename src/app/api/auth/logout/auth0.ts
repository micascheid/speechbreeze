// next
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const returnTo = encodeURI(`${process.env.NEXT_API_BASE_URL}/login`);
  res.redirect(
    `https://${process.env.REACT_APP_AUTH0_DOMAIN}/v2/logout?client_id=${process.env.REACT_APP_AUTH0_CLIENT_ID}&returnTo=${returnTo}`
  );
}
