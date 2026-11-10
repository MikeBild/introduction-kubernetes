export default {
  port: process.env.PORT || 8080,
  todosUrl:
    process.env.DATABASEURL ||
    'http://couchdb.workshops.mikebild.com:5984/todos',
};
