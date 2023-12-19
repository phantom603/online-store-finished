# Server for Online Store

## Run in development mode

```bash
npm start
```

## Run in production mode with pm2 node process manager

```bash
pm2 start npm --name "online-store-server" -- run start
pm2 save
```
