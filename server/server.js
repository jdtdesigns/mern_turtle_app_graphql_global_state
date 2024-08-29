require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cookieParser = require('cookie-parser');
const { verify } = require('jsonwebtoken');

const typeDefs = require('./schema/typeDefs');
const resolvers = require('./schema/resolvers');

const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3333;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  await server.start();

  app.use(
    '/graphql',
    // cors(), 
    express.json(),
    cookieParser(),
    expressMiddleware(server, {
      context: ({ req, res }) => {
        const token = req.cookies.token;

        if (token) {
          try {
            const { user_id } = verify(token, process.env.JWT_SECRET);

            req.user_id = user_id;
          } catch (error) {
            console.log('token verification error', error);
          }
        }

        return {
          req,
          res
        }
      }
    })
  );

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log('Express server running on port', PORT);
      console.log('GraphQL ready at /graphql');
    });
  });
}

startServer();