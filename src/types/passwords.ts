export type UserPassword = {
    name: string;
    password: string;
};

export type UserPasswords = {
    userId: string;
    masterPassword?: string;
    passwords: UserPassword[],
};

export type MasterPassword = {
    userId: string;
    salt: string;
    password: string;
}