import express from 'express';

export default async ({ config: { name, version }, app }) => {
  app.get(`/api/${version}/info`, (req, res) => {
    res.send({ name, version });
  });
};
