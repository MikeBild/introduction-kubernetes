export default {
  port: process.env.PORT || 8080,
  graphqlUrl:
    process.env.GRAPHQLURL ||
    'http://todo-graphql.workshops.mikebild.com/graphql',
};
