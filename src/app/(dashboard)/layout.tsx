import AuthGuard from "@/utils/route-guard/AuthGuard";
import DashboardLayout from "@/layout/DashboardLayout";

export default function Layout({ children }: { children: React.ReactNode}) {
    return (
        <AuthGuard>
            <DashboardLayout>{children}</DashboardLayout>
        </AuthGuard>
    )
}