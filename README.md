# TERMINAL 418 KIOSK CAROUSEL

## Getting Started

First, Make sure you have a .env file with the following values:
```bash
DB_HOST = http://localhost:5432  # url for local build or whatever the cdb is hosted
DB_USER = pgUserName  # user name to access you postgres database
DB_PASSWORD = pgUserPassword  # user password to access you postgres database
DB_NAME = pgDbName  # database to save the tables to
``` 

Next, run the installer and udpate:
```bash
npm install
npx drizzle-kit generate
npx drizzle-kit pull
npx drizzle-kit push
```

Then, run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.