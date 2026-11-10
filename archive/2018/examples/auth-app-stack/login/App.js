import React, { Fragment as F } from 'react';
import Login from './Login';

export default async ({ config }) => {
  return [
    {
      path: '/',
      component: Login,
    },
  ];
};
