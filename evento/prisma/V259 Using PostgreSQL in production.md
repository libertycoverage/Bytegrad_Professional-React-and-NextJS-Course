## V259 Using Postgres In Production 
Description: Replace SQLite with Postgres.

### Storage on Vercel

We are going to deploy the project to Vercel. Vercel does not support SQLite, because we would need access to the file system and behind the scenes Vercel a lot with serverless functions. 

The good news is that Vercel offer storage, we can use one of the databases. We will use PostgreSQL.

Since we are using Prisma we need to make sure that we use settings for PostgreSQL.
All of the interaction with Prisma can stay the same.

When we go to Storage in Vercel, we dive database name `evento-db`

By default it wants to set Region to Washington D.C. area, and this is also the default region for serverless functions that our app will consists of when we deploy to Vercel. This Washington D.C. iad1 is typically the best region. 

We want to keep our database close to the serverless functions

Now it has created the database. Now we need to connect project to the database. We can do this in couple of ways. 

First of all we need to copy environment variables in `.env.local` 

`.env.local` data given by Vercel
```bash
POSTGRES_URL="postgres://default:jd8Zo2bhXiSt@ep-tight-feather-a45uknlo-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require"
POSTGRES_PRISMA_URL="postgres://default:jd8Zo2bhXiSt@ep-tight-feather-a45uknlo-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require&pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NO_SSL="postgres://default:jd8Zo2bhXiSt@ep-tight-feather-a45uknlo-pooler.us-east-1.aws.neon.tech:5432/verceldb"
POSTGRES_URL_NON_POOLING="postgres://default:jd8Zo2bhXiSt@ep-tight-feather-a45uknlo.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require"
POSTGRES_USER="default"
POSTGRES_HOST="ep-tight-feather-a45uknlo-pooler.us-east-1.aws.neon.tech"
POSTGRES_PASSWORD="jd8Zo2bhXiSt"
POSTGRES_DATABASE="verceldb"
```

and then going to setup for Prisma, and then it basically should work.

"Prisma" settings given by Vercel
```js
datasource db {
  provider = "postgresql"
  url = env("POSTGRES_PRISMA_URL") // uses connection pooling
  directUrl = env("POSTGRES_URL_NON_POOLING") // uses a direct connection
}
```

Now if we go to `schema.prisma` file we replace `datasource db` with the settings above

Next.js recommends that we should use `.env.local` file for secrets
Unfortunately Prisma works with `.env` file

It is a bit easier if we use this file for Prisma, so we copy `.env.local` data given by Vercel to `.env` file in our project


For local PostgreSQL debugging we rename old versions `.env` to `.env-local` and `schema.prisma` to `schema-local.prisma`

We have put secrets given by Vercel into `.env` file, and we will push this to Github, and now we do not want to have this included when we push there, so we go to `.gitignore` and we add `.env` there

Now we have all of these environment variables, Prisma should be able to connect to the database. 

On Vercel dashboard (Storage -> Data) we can see that there are no tables in the newly constructed database `evento-db` 

### populating, seeding remote database with data

We are going to populate remote database (in the cloud) with tables, and then with data, 

we execute here locally on a terminal `/evento $ npx prisma db push`, this will make sure our database is in line with the `schema.prisma` where we have our `model EventoEvent`. When in terminal we do not get any errors, we check Vercel dashboard, we can see that there is a table but there are no rows meaning there is no data yet. 

We want to keep using our seed as well, we want to seed our database in the cloud (populate with data)
We execute locally `/evento $ npx prisma db seed`, it is going to connect to different database (cloud), but the interaction with Prisma stays the same.

We can see the data is successfully stored on Vercel database.

Now we can deploy application itself to production.


### additional settings in `package.json` file, regenerating Prisma Client after build due to caching during the build of the project on Vercel 

There is one more thing w want to do before we deploy to production that, it also has to do with Prisma. 

If we go to `package.json`, 

and we are interacting with Prisma, when we go to `server-utils.ts` we are interacting with Prisma Client, we instantiate it once here `import prisma from "./db";`

That is how we interact with the database, this Prisma Client needs to be up to date.
Now when we build on Vercel, Vercel does a lot of caching to optimize the build, so Prisma recommends that we do after installing, that we regenerate the Prisma Client.
In `package.json` we add `"postinstall": "prisma generate"`, if we won't do this we will get an error on Vercel.

`package.json` 
```json
{
  "name": "evento",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate" // just added
  },
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "^5.6.0",
    "@radix-ui/react-icons": "^1.3.0",
    "clsx": "^2.1.1",
    "framer-motion": "^10.16.4",
    "next": "14.0.1",
    "react": "^18",
    "react-dom": "^18",
    "server-only": "^0.0.1",
    "tailwind-merge": "^2.0.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.0.1",
    "postcss": "^8",
    "prisma": "^5.6.0",
    "tailwindcss": "^3.3.0",
    "ts-node": "^10.9.1",
    "typescript": "^5"
  }
}
```

Btw. on using a PostgreSQL database, maybe we remember this (looking at `server-utils.ts`), previously we could not query in mode insensitive. Here we needed to capitalize the city `city: city === "all" ? undefined : capitalize(city),`, now when using PostgreSQL mode insensitive will actually work (look V243). So we do not have to worry about capitalization of the words when we try to make a database query.
