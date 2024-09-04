export interface BaseUser {
    email: string;
    firstName: string;
    lastName: string;
}
export type UserContextType = BaseUser | null

export type User = BaseUser & {
    password: string;
}