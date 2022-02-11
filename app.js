const express = require("express");
const app = express();

const { accessLogger, errorLogger } = require("./utils/logger");

app.set('trust proxy',true);

app.use(accessLogger);

app.use(errorLogger);

module.exports = app;