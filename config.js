require("dotenv").config();

module.exports = {
    SERVER_ID:process.env.SERVER_ID,
    IS_DEVELOPMENT: process.env.NODE_ENV === "development",
    IS_TEST: process.env.NODE_ENV === "test",
    IS_PRODUCTION: process.env.NODE_ENV === "production",
    TOKEN:process.env.TOKEN,
    HOST:process.env.HOST,
    PORT:Number(process.env.PORT),
    LOG_DIR:process.env.LOG_DIR,
    INTERNAL_SHARED_SECRET: process.env.INTERNAL_SHARED_SECRET,
    INTERNAL_DOMAINS: process.env.INTERNAL_DOMAINS.split(","),
    INTERNAL_IP_ADDRS: process.env.INTERNAL_IP_ADDRS.split(","),
}