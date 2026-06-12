import * as migration_20260603_124733_initial from './20260603_124733_initial';
import * as migration_20260603_125735_add_finance_category from './20260603_125735_add_finance_category';
import * as migration_20260603_152305_simplify_tools from './20260603_152305_simplify_tools';
import * as migration_20260611_100101_add_subscribers from './20260611_100101_add_subscribers';

export const migrations = [
  {
    up: migration_20260603_124733_initial.up,
    down: migration_20260603_124733_initial.down,
    name: '20260603_124733_initial',
  },
  {
    up: migration_20260603_125735_add_finance_category.up,
    down: migration_20260603_125735_add_finance_category.down,
    name: '20260603_125735_add_finance_category',
  },
  {
    up: migration_20260603_152305_simplify_tools.up,
    down: migration_20260603_152305_simplify_tools.down,
    name: '20260603_152305_simplify_tools',
  },
  {
    up: migration_20260611_100101_add_subscribers.up,
    down: migration_20260611_100101_add_subscribers.down,
    name: '20260611_100101_add_subscribers'
  },
];
