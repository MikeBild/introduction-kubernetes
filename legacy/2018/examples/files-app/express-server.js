import { readdir, mkdir } from 'fs';
import { promisify } from 'util';
import express from 'express';
import fileUpload from 'express-fileupload';
const readdirPromise = promisify(readdir);
const mkdirPromise = promisify(mkdir);

const FILESDIR = './files';

export default async ({ config, app }) => {
  app.set('view engine', 'ejs');
  app.use(fileUpload());
  app.use('/files', express.static(FILESDIR));

  try {
    await mkdirPromise(FILESDIR);
  } catch (e) {}

  app.get('/', async (req, res) => {
    const files = await readdirPromise(FILESDIR);
    res.render('index', { files });
  });

  app.post('/upload', async (req, res, next) => {
    await req.files.sampleFile.mv(`${FILESDIR}/${req.files.sampleFile.name}`);
    res.redirect('/');
  });
};
