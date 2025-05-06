import { registerAs } from "@nestjs/config";

const defaultJWT = "Hf7BkzJDWQUZRhPKFs9VxqG2LcYr6paAwnm8SEuy3tNbjMdgTe"

export default registerAs(
    'jwt', () => ({
        secret_dev : process.env.JWT_SECRET_KEY_DEVELOPMENT || defaultJWT,
        secret_prod : process.env.JWT_SECRET_KEY_PRODUCTION || defaultJWT,
        expiresIn: process.env.JWT_EXPIRES_IN || '10m',
        issuer: process.env.JWT_ISSUER || 'boba.com',
    })
)