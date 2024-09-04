import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { authRouter, dashboardRouter } from "./index";
import { RouteType } from "../typescript/routes";
import SingleLayout from "components/layouts/SingleLayout";
import NotFound from "pages/404NotFound";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import { UserStateProvider } from "contexts/LoginProvider";
import DashboardLayout from "components/layouts/DashboardLayout";

/**
 * 
 * @param Layout A layout is the wrapper around the child ( e.g a header that renders the routes underneath)
 * @param routes 
 * @returns an array of routes
 */
const createRoutes = (Layout: React.ElementType, routes: Array<RouteType>) =>
    routes.map(({ component: Page, children, path, guard }, i) => {
        const Guard = guard || React.Fragment;
        return children ? (
            children.map((child, i) => {
                const Guard = child.guard || React.Fragment;
                const Page = child.component || React.Fragment // fragment should never be the case
                return <Route
                    key={i}
                    path={child.path}
                    exact
                    render={props => (
                        <Layout>
                            <Guard>
                                <Page {...props} />
                            </Guard>
                        </Layout>
                    )}
                />
            })
        ) : Page ? (
            <Route
                key={i}
                path={path}
                exact
                render={props => (
                    <Layout>
                        <Guard>
                            <Page {...props} />
                        </Guard>
                    </Layout>
                )}
            />
        ) : null
    })

export default function Routes() {
    return <BrowserRouter>
        <FirebaseAuthConsumer>
            {({ user, providerId }) => {
                return <UserStateProvider providerId={providerId} user={user} >
                    <Switch>
                        {createRoutes(SingleLayout, authRouter)}
                        {createRoutes(DashboardLayout, dashboardRouter)}
                        <Route>
                            <NotFound />
                        </Route>
                    </Switch>
                </UserStateProvider>
            }}
        </FirebaseAuthConsumer>
    </BrowserRouter>
}