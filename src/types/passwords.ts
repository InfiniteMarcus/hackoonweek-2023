export type UserPassword = {
    name: string;
    password: string;
};

export type UserPasswords = {
    userId: string;
    masterPassword?: string;
    passwords: UserPassword[],
};