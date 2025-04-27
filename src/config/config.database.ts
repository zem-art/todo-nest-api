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
    }
})