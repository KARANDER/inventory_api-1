# How to Restart the Server

Run these commands:

```bash
# Restart PM2 process
pm2 restart inventory-api

# Or restart all
pm2 restart all

# Check logs
pm2 logs inventory-api --lines 20
```

If still getting errors, check:

1. Make sure you ran the SQL file: `database/sales_lock_table.sql`
2. Check if table exists: `SHOW TABLES LIKE 'sales_lock';`
3. Check PM2 logs: `pm2 logs inventory-api`
