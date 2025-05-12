// import { registerAs } from "@nestjs/config";

// export default registerAs('mongodb', () => ({
//     url : process.env.MONGODB_URL,
//     port : process.env.MONGODB_PORT,
//     user : process.env.MONGODB_USER,
//     pass : process.env.MONGODB_PASSWORD,
//     name : process.env.MONGODB_NAME || 'db-nest-js',
//     direct : process.env.MONGODB_DIRECT || false,
//     auth : process.env.MONGODB_AUTH,
// }))

export default () => ({
    mongodb: {
        url : process.env.MONGODB_URL,
        port : process.env.MONGODB_PORT,
        user : process.env.MONGODB_USER,
        pass : process.env.MONGODB_PASS,
        name : process.env.MONGODB_NAME || 'db-nest-js',
        direct : process.env.MONGODB_DIRECT || false,
        auth : process.env.MONGODB_AUTH,
    },
    postgres: {
        host : process.env.POSTGRES_HOST,
        port : process.env.POSTGRES_PORT,
        user : process.env.POSTGRES_USER,
        pass : process.env.POSTGRES_PASS,
        name : process.env.POSTGRES_NAME || 'db-nest-js',
    },
    redis: {
        host : process.env.REDIS_HOST,
        port : process.env.REDIS_PORT,
        pass : process.env.REDIS_PASS,
        db : process.env.REDIS_DB || 0,
    },
})