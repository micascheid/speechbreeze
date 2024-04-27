import AuthGuard from "@/utils/route-guard/AuthGuard";
import DashboardLayout from "@/layout/DashboardLayout";
import {ReactNode} from "react";
import {useSession} from "next-auth/react";
import useUser from "@/hooks/useUser";
import Loader from "@/components/Loader";
import Error500 from "@/views/maintenance/500";


export default function Layout({children}: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <DashboardLayout>{children}</DashboardLayout>
        </AuthGuard>
    )
}