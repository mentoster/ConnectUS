// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    name: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    const RtcTokenBuilder = require('../src/RtcTokenBuilder').RtcTokenBuilder;
    const RtcRole = require('../src/RtcTokenBuilder').Role;

    const appID = 'aa6a5cb4cf69415da44bee880df16203';
    const appCertificate = '0bfceb82ca0142eebd7e5f270271ad6b';
    const channelName = 'RadioIT';
    const uid = 2882341273;
    const account = "2882341273";
    const role = RtcRole.PUBLISHER;

    const expirationTimeInSeconds = 3600

    const currentTimestamp = Math.floor(Date.now() / 1000)

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

    // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.

    // Build token with uid
    const tokenA = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs);
    console.log("Token With Integer Number Uid: " + tokenA);

    // Build token with user account
    const tokenB = RtcTokenBuilder.buildTokenWithAccount(appID, appCertificate, channelName, account, role, privilegeExpiredTs);
    console.log("Token With UserAccount: " + tokenB);

    res.status(200).json({ name: 'John Doe' })
}
