import { promises as fs } from "node:fs";
import path from "node:path";

const DIR = process.env.PA_DATA_DIR ?? path.join(process.cwd(), "..", "data");

function file(table: string) {
  return path.join(DIR, `${table}.json`);
}

export async function read<T>(table: string): Promise<T> {
  return JSON.parse(await fs.readFile(file(table), "utf8")) as T;
}

export async function update<T>(table: string, mutate: (current: T) => T): Promise<T> {
  const updated = mutate(await read<T>(table));
  await fs.writeFile(file(table), JSON.stringify(updated, null, 2) + "\n", "utf8");
  return updated;
}

export function ok(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function fail(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export function newId(prefix: string) {
  return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
