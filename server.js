'use strict';

require('elastic-apm-node').start({
  serviceName: 'redis-test',
  asyncHooks: true,
  serverUrl: 'http://localhost:8200',
  logLevel: 'trace'
});

const redis = require('redis');
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
const express = require('express');
const app = express();
const APP_PORT = 3003;
const REDIS_PORT = 6379;
const REDIS_HOST = 'localhost';

const sessionData = {
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }, // 30 days
  proxy: true,
  resave: true,
  saveUninitialized: true,
  secret: 'marketingplatform0070014',
  store: new RedisStore({
    host: REDIS_HOST,
    port: REDIS_PORT,
    client: redis.createClient(REDIS_PORT, REDIS_HOST)
  })
};

app.use(expressSession(sessionData));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/marketing_platform');

const Schema = mongoose.Schema;
var TaskSchema = new Schema({
  name: { type: String },
  description: { type: String }
});

var Task = mongoose.model('Task', TaskSchema, 'tasks');

app.get('/api/v3/tasks/:id',
  (req, res) => {
    console.log('Fetching :: ', req.params.id);
    Task.findById(req.params.id).exec((err, task) => {
      if (err) {
        console.log('err', err);
        return res.status(400).json(err);
      }
      res.status(200).json(task);
    });
  }
);

app.listen(APP_PORT, () => {
  console.log(`Example app listening at http://localhost:${APP_PORT}`);
});
