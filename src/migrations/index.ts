import * as migration_20260502_064436_add_news_globals from './20260502_064436_add_news_globals';
import * as migration_20260502_081500_reconcile_site_settings_columns from './20260502_081500_reconcile_site_settings_columns';

export const migrations = [
  {
    up: migration_20260502_064436_add_news_globals.up,
    down: migration_20260502_064436_add_news_globals.down,
    name: '20260502_064436_add_news_globals'
  },
  {
    up: migration_20260502_081500_reconcile_site_settings_columns.up,
    down: migration_20260502_081500_reconcile_site_settings_columns.down,
    name: '20260502_081500_reconcile_site_settings_columns'
  },
];
