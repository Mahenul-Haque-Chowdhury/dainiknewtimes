import * as migration_20260502_064436_add_news_globals from './20260502_064436_add_news_globals';

export const migrations = [
  {
    up: migration_20260502_064436_add_news_globals.up,
    down: migration_20260502_064436_add_news_globals.down,
    name: '20260502_064436_add_news_globals'
  },
];
