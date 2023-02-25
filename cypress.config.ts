import { defineConfig } from "cypress";
import seed from './prisma/seed.cypress';
import { exec } from 'child_process';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        'db:reset': () => {
          return exec("npx prisma migrate reset --skip-seed");
        }
      })
      on('task', {
        'db:seed': () => {
          return seed()
        }
      })
    },
  },
});
