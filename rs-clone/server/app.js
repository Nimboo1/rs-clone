/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
const { Sequelize } = require('sequelize');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const userRouter = require('./src/routes/user.router');
const winnerRouter = require('./src/routes/winner.router');

const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,

  {
    host: process.env.HOST,
    port: 5432,
    dialect: 'postgres',
  },
);

async function connect() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.', process.env.DB_NAME, process.env.DB_USER);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
console.log('*********************');
console.log(process.env.DB_NAME);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);
console.log(process.env.HOST);
console.log('*********************');

connect();

const corsOptions = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api', userRouter);
app.use('/api/winners', winnerRouter);

app.listen(PORT, () => console.log('Success'));
