# TERMINAL 418 KIOSK CAROUSEL

This is an app made for a kiosk for Neotropolis. Please run this is Kiosk mode in chrome if possible.

Be excellent to each other!

## Getting Started

First, Make sure you have a .env file with the following values:
```bash
DB_HOST = http://localhost:5432  # url for local build or whatever the cdb is hosted
DB_USER = pgUserName  # user name to access you postgres database
DB_PASSWORD = pgUserPassword  # user password to access you postgres database
DB_NAME = pgDbName  # database to save the tables to
NEXT_PUBLIC_DEVICE_NAME = terminal418 #name of the device in the device_id column (optional)
NEXT_PUBLIC_HRS_OFFSET = 8 #number of hours offset from DB time
``` 

Next, run the installer and update:
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

## Run In Docker
The docker will stand up a postgres container so that standing up your own database will not be necessary.

To run docker, you can use the following command:
``` docker compose up -d```

Like the previous command, the app will be available at the url `localhost:3000`