import { Outlet, useLocation } from "react-router-dom";
import { Suspense } from "react";
import SideBar from "../../components/sidebar/Sidebar";
import Loader from "../../components/loader";
import { routes } from "../../lib/routes";
import { Header } from "../../components/pageHeader";

export default function MainLayout() {
    const location = useLocation();

    if (
        [
            routes.auth.login,
            routes.auth.register.index,
            routes.index,
            routes.auth.forgotPassword
        ].includes(location.pathname)) {
        return (
            <Suspense fallback={<Loader />}>
                <Outlet />
            </Suspense>
        );
    }

    return (
        <SideBar>
            <Header />
            <Suspense fallback={<Loader />}>
                <Outlet />
            </Suspense>
        </SideBar>
    );
}