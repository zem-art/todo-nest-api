export default () => ({
    jwt: {
        secret : process.env.JWT_SECRET_KEY || 'Hf7BkzJDWQUZRhPKFs9VxqG2LcYr6paAwnm8SEuy3tNbjMdgTe',
        expiresIn: process.env.JWT_EXPIRES_IN || '10m',
        issuer: process.env.JWT_ISSUER || 'boba.com',
    }
})