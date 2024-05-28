## run migrations
echo "Run Migrations"
pnpm prisma migrate deploy

## start app
echo "Run APP"
pnpm start:prod