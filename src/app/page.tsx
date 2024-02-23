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
import Landing from "@/views/landing";

export default function HomePage() {
    return (
        <Landing/>
    );
}