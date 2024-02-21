'use client'
// project import
import DashboardLayout from "@/layout/DashboardLayout";
import AuthGuard from "@/utils/route-guard/AuthGuard";
import {Switch} from "@mui/base";
import MainCard from "@/components/MainCard";
import {useEffect} from "react";
import {APP_DEFAULT_PATH} from "@/config";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

export default function HomePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/auth/protected');
            const json = await res?.json();
            if (json?.protected) {
                let redirectPath = APP_DEFAULT_PATH;
                router.push(redirectPath);
            } else {
                let redirectPath = '/login';
                router.push(redirectPath);
            }
        };
        fetchData();
    }, [session])
  return (
    <MainCard>
        Hello
    </MainCard>
  );
}