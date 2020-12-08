import express from 'express';
import {solve} from './8';

const app = express();

app.get('/', async (_, res, next) => {
  try {
    const solution = await solve();
    res.send('Solution: ' + solution);
  } catch (error) {
    return next(error);
  }
});

app.listen(8000, () => {
  console.log('App listening on http://localhost:8000')
});
