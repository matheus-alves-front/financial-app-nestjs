# Financial App Backend

Financial app is my personal app to manage my payments and taxes. 

## Stacks
- Nest.js
- Typescript
- Prisma
- Planetscale MYSQL
## Get Started
- Clone this project
- `npm install`
- `npx prisma generate`
- Rename `.env.example` to `.env`
- Put your database key into `.env -> DATABASE_URL` (You can run planetscale local also, commands down below)
    `DATABASE_URL='mysql://127.0.0.1:3306/nameofproject'`
- `npx prisma db push`
- `npm run start:dev`

### planetscale-cli
- download pscale (read the docs)
- `pscale login`
- `pscale branch list`
- `pscale connect nameofproject pscalebranchname`