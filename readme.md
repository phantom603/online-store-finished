# Online Store

## Start development

```bash
npm run build
```

### Start client standalon

```bash
npm run start:client
```

### Start server standalon

```bash
npm run start:server
```

### Start server with pm2

```bash
pm2 start npm --name "online-store-server" -- run start:server
pm2 save
```

## Run tests

```bash
npm run test
```
