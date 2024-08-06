import db from './db';

export function getTrainings() {
  return db.prepare('SELECT * FROM trainings').all();
}
