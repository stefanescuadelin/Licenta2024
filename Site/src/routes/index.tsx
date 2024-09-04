import { useHistory } from "react-router-dom";
import { AuthGuard } from "../components/guards/AuthGuard";
import SignIn from "../pages/Auth/SignIn";
import Dashboard from "../pages/Dashboard/Dashboard";
import Landing from "../pages/Dashboard/Landing";
import { RouteType } from "../typescript/routes";

export const urls = {
    login: () => "/login",
    dashboard: () => "/dashboard"
}


export function useRouting() {
    const history = useHistory();

    function routeTo(fn: () => string): void
    function routeTo<T>(fn: (p: T) => string, params: T): void
    function routeTo<T>(fn: (p?: T) => string, params?: T) {
        history.push(fn(params));
    }
    return {
        routeTo,
        history
    }
}

export function route(fn: () => string): string
export function route<T>(fn: (p: T) => string, params: Array<keyof T>): string
export function route<T>(fn: (p: T) => string, params: Array<keyof T> = []) {
    const parameter = Object.fromEntries(params.map(p => [p, ":" + p]));
    return fn(parameter as any);
}

const authRoutes: RouteType = {
    path: "/",
    children: [{
        component: SignIn,
        path: route(urls.login),
    }],
    component: null
}
const dashboardRoutes: RouteType = {
    path: route(urls.dashboard),
    component: Dashboard,
    guard: AuthGuard,
    children: null
}
const landingRoute: RouteType = {
    path: "/",
    component: Landing,
    children: null,
}
export const authRouter = [authRoutes];

export const dashboardRouter = [landingRoute, dashboardRoutes];
