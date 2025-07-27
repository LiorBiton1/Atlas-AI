declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string;
            email: string;
            name?: string;
            image?: string;
        };
    }

    interface User {
        id: string;
        username: string;
        email: string;
        name?: string;
    }
}