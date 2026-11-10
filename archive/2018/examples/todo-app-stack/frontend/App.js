import React, { Fragment as F } from 'react';
import { Query } from 'react-apollo';
import ALL_TODOS from './AllTodos.gql';

export default async ({ name, version }) => (
  <F>
    <h1>
      Todo App {name} {version}
    </h1>
    <Query query={ALL_TODOS} pollInterval={1000}>
      {({ data: { todos = [] }, error, loading }) => {
        return (
          <ul>
            {todos.map(({ id, description, done }) => (
              <li key={id}>
                <input type="checkbox" checked={done} disabled={true} />
                <label>{description}</label>
              </li>
            ))}
          </ul>
        );
      }}
    </Query>
  </F>
);
