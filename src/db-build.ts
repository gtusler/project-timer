#!/usr/local/bin/bun

import { Database } from 'bun:sqlite';

const db = new Database('db/stuff.db', { create: true });
db.exec('PRAGMA journal_mode = WAL;'); // https://bun.sh/docs/api/sqlite#wal-mode
db.exec('PRAGMA foreign_keys = OFF;');

db.query(
    `CREATE TABLE IF NOT EXISTS projects (
    name VARCHAR(255) UNIQUE NOT NULL PRIMARY KEY
);`).run();

db.query(
    `CREATE TABLE IF NOT EXISTS running (
    id INTEGER PRIMARY KEY,
    project VARCHAR(255) NOT NULL,
    FOREIGN KEY (project) REFERENCES projects(name) ON DELETE CASCADE
);`).run();

db.query(
    `CREATE TABLE IF NOT EXISTS timings (
    id INTEGER PRIMARY KEY,
    event VARCHAR(255) NOT NULL,
    project VARCHAR(255) NOT NULL,
    time VARCHAR(255) NOT NULL,
    FOREIGN KEY (project) REFERENCES projects(name) ON DELETE CASCADE
);`).run();

