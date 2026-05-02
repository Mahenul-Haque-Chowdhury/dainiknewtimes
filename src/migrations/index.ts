import * as migration_20260502_064436_add_news_globals from './20260502_064436_add_news_globals';
import * as migration_20260502_081500_reconcile_site_settings_columns from './20260502_081500_reconcile_site_settings_columns';
import * as migration_20260502_192500_sync_category_strip from './20260502_192500_sync_category_strip';

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
  {
    up: migration_20260502_192500_sync_category_strip.up,
    down: migration_20260502_192500_sync_category_strip.down,
    name: '20260502_192500_sync_category_strip'
  },
];
