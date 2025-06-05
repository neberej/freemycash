import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { FinancialData } from '../src/types';

const PORT = 9002;

const defaultData =  {
  transactions: [],
  saveInBrowser: false,
  prefixDownload: false,
  currency: '$',
  categories: [],
  externalApi: {
    read: '',
    write: '',
  }
}


async function main() {
  const app = express();
  app.use(express.json());

  const dbFile = path.join('db', 'data.json');
  const historyDir = path.join('db', 'history');
  const adapter = new JSONFile<FinancialData>(dbFile);
  const db = new Low<FinancialData>(adapter, defaultData);

  await db.read();

  app.get('/read', async (_req: Request, res: Response) => {
    await db.read();
    res.json(db.data);
  });

  app.post('/write', async (req: Request, res: Response) => {
    const newData = req.body;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(historyDir, `${timestamp}-${nanoid(5)}.json`);
    fs.mkdirSync(historyDir, { recursive: true });
    fs.writeFileSync(backupFile, JSON.stringify(db.data, null, 2));

    db.data = newData;
    await db.write();

    res.status(200).json({ ok: true });
  });

  app.get('/history', (_req: Request, res: Response) => {
    if (!fs.existsSync(historyDir)) {
      return res.json([]);
    }
    const snapshots = fs.readdirSync(historyDir).sort().reverse();
    res.json(snapshots);
  });

  app.post('/rollback', async (req: Request, res: Response) => {
    const { file } = req.body;
    const rollbackPath = path.join(historyDir, file);

    if (!fs.existsSync(rollbackPath)) {
      return res.status(404).send('Snapshot not found');
    }

    const data = JSON.parse(fs.readFileSync(rollbackPath, 'utf-8'));
    db.data = data;
    await db.write();

    res.json({ ok: true });
  });

  const server = app.listen(PORT);
  server.on('listening', () => {
    console.log(`Backend running at http://localhost:${PORT}`);
  });
  server.on('error', (err: NodeJS.ErrnoException) => {
    console.error('Server error:', err.code, err.message);
    process.exit(1);
  });
}

// Call the main function
main().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});