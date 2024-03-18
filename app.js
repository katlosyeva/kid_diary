const path = require('path');
const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express();

const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const auth = require('./middleware/auth');

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(auth);
app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || 'An error occurred.';
      const code = err.originalError.code || 500;
      return {
        message: message,
        path: err.path,
        status: code,
        data: data,
        stack: err.stack ? err.stack.split('\n') : [],
      };
}
  })
);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});


mongoose
  .connect(
    'mongodb+srv://katlos:katlos2024@cluster0.o3zxvef.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  )
  .then(result => {
    const server = app.listen(8080);
  })
  .catch(err => console.log(err));