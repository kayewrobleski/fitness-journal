import { defineConfig } from "cypress";
import seed from './prisma/seed.cypress';
import { exec } from 'child_process';

export default defineConfig({
  projectId: 'keik7a',
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL,
    env: {
      admin_email: process.env.CYPRESS_ADMIN_EMAIL,
      admin_password: process.env.CYPRESS_ADMIN_PASSWORD,
      user_email: process.env.CYPRESS_USER_EMAIL,
      user_password: process.env.CYPRESS_USER_PASSWORD,
    },
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
