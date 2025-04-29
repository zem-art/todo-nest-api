export default () => ({
    smtp: {
        host : process.env.SMTP_HOST,
        port : process.env.SMTP_PORT,
        secure : process.env.SMTP_SECURE,
        user : process.env.SMTP_USER,
        pass : process.env.SMTP_PASS,
        from : process.env.SMTP_FROM,
    }
})