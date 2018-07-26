const { ApolloServer } = require("apollo-server");
const fetch = require("node-fetch");
const typeDefs = require("./schemas");
const resolvers = require("./resolvers");

main();

async function main() {
  const config = {
    port: process.env.PORT,
    mocks: process.env.NODE_ENV !== "production"
  };

  const server = await serverStart(config);

  process.once("SIGINT", () => serverStop({ server }));
  process.once("SIGTERM", () => serverStop({ server }));

  console.log(`GraphQL-API listen on ${server.httpServer.address().port}`);
}

async function serverStart({ port = 9000, mocks = false } = {}) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    mocks,
    tracing: true,
    cacheControl: true,
    context({ req }) {
      return {
        fetch
      };
    }
  });

  await server.listen({ port });
  return server;
}

async function serverStop({ server }) {
  console.log("GraphQL-API shutdown");

  await server.stop();

  process.exit(0);
}
