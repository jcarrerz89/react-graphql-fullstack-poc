const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({path: 'variables.env'});

// Bring in GraphQL-Express middleware 
const { graphiqlExpress, grephqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const Recipe = require('./models/Recipe');
const User = require('./models/User');

const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');
const { graphqlExpress } = require('apollo-server-express');
const schema = makeExecutableSchema({
      typeDefs, 
      resolvers
});


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Mongo DB connected'))
.catch(err => console.error(err));

const app = express(); 
// Create Graphql application
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql'}));

app.use(cors({
      origin: 'http://localhost:3000',
      credentials: true
}));

// Set up JWT authentication middleware
app.use( async(req, res, next) => {
       const token = req.headers['authorization'];
       console.log(token, typeof token);
       next();
})

// Connect schema 
app.use('/graphql',
      bodyParser.json(),
      graphqlExpress({
            schema,
            context: { 
                  Recipe, 
                  User
            }
      })
);

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
      console.log(`Server listening at port ${PORT}`);
});

process.on('uncaughtException', (err, origin) => {
      console.error(err);
      process.abort();
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
      console.error(err);
      process.abort();
});   