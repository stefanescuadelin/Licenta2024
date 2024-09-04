export type RouteType = {
    path: string;
    children: null | Array<RouteChildType>;
    component: React.FunctionComponent<any> | React.ComponentClass<any> | null;
    guard?: any;
};
export type RouteChildType = {
    path: string;
    component: React.FunctionComponent<any> | React.ComponentClass<any>;
    guard?: any;
};