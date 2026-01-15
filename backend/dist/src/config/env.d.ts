export declare const config: {
    port: string | number;
    nodeEnv: string;
    database: {
        url: string;
    };
    redis: {
        host: string;
        port: number;
    };
    jwt: {
        secret: string;
        refreshSecret: string;
        expiresIn: string;
        refreshExpiresIn: string;
    };
};
