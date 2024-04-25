// next
import {useSession} from 'next-auth/react';
import {fetcher} from "@/utils/axios";
import useSWR, {mutate} from "swr";
import {checkboxClasses} from "@mui/material";

interface UserProps {
    uid: string;
    name: string;
    email: string;
    avatar: string;
    thumb: string;
    role: string;
    sub_type: number;
    stripe_id: string;
    sub_start: number;
    sub_end: number;
    org_id: number;
    block_user: boolean;
}

const useUser = () => {
    const {data: session} = useSession();
    const {data, error, mutate: mutateUser} = useSWR(session ? `/slp/${session.id}` : null, fetcher);

    const blockTool = (data: SLP) => {
        // first check if the user has a subscription.
        let blockUser: boolean;
        if (data.sub_type === 0) {
            const thirtyDaysAgoEpochSeconds = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);
            blockUser = data.account_creation_epoch < thirtyDaysAgoEpochSeconds;
        } else {
            const currentDate = Math.floor(Date.now() / 1000);
            blockUser = data.sub_end === null || currentDate > data.sub_end;
        }

        return blockUser;
    }

    if (session && data) {
        const user = {...session.user, ...data};
        const provider = session?.provider;
        const slpData = data as SLP;
        const blockUser = blockTool(slpData);

        let thumb = user?.image!;
        if (provider === 'cognito') {
            const email = user?.email?.split('@');
            user!.name = email ? email[0] : 'Jane Doe';
        }

        if (!user?.image) {
            user!.image = '/assets/images/users/avatar-1.png';
            thumb = '/assets/images/users/avatar-thumb-1.png';
        }

        const newUser: UserProps = {
            uid: session!.id!,
            name: user!.name!,
            email: user!.email!,
            avatar: user?.image!,
            thumb,
            role: 'SLP',
            sub_type: user.sub_type,
            stripe_id: user.stripe_id,
            sub_start: user.sub_start,
            sub_end: user.sub_end,
            org_id: user.org_id,
            block_user: blockUser,
        };

        return {user: newUser, mutateUser};
    }
    return {user: null, mutateUser};
};

export default useUser;
