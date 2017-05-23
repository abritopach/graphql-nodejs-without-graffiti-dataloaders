// Import express and graphQHTTP .

import express from 'express';
import graphQLHTTP from 'express-graphql';

import { serverConfig } from '../config/config';

// MongoDB connection.
import {} from '../database';

import { Schema} from '../graphql/schema';

const app = express();

// GraphqQL server route.
app.use(graphQLHTTP({
    schema: Schema,
    graphiql: true
}));

// Start server.
var server = app.listen(serverConfig.port, () => {
    console.log('Listening at port', server.address().port);
});
