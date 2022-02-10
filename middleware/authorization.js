const express = require("express");
const {
    INTERNAL_SHARED_SECRET,
    INTERNAL_DOMAINS,
    INTERNAL_IP_ADDRS,
} = require("../config");

module.exports = {
    /**
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     */
    authorization: (req, res, next) => {
        const remoteAddress =
            req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress ||
            req.ip;
        if (
            req.headers.authorization === INTERNAL_SHARED_SECRET &&
            INTERNAL_IP_ADDRS.includes(remoteAddress) &&
            INTERNAL_DOMAINS.includes(req.hostname)
        ) {
            req.isAuthorized = true;
            next();
        } else {
            return res.status(401).json({
                ok: false,
                message: "Unauthorized",
                hostname: req.hostname,
                remoteAddress: remoteAddress,
            });
        }
    },
};
