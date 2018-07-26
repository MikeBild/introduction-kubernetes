import React, { Fragment as F } from 'react';
import Home from './Home';

export default async ({ config }) => {
  return [
    {
      path: '/home',
      component: Home,
    },
  ];
};
