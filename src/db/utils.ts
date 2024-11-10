import { QueryResult, QueryResultRow } from 'pg';
import { pool } from './schema';
import {
  DB_TIMEOUT_MS,
  MAX_RETRIES,
  RETRY_DELAY_MS,
} from '../config/constants';

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT 1');
      return true;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
}

export const executeQuery = async <T extends QueryResultRow>(
  query: string,
  params: unknown[] = [],
  retries = MAX_RETRIES,
): Promise<QueryResult<T>> => {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = await pool.connect();
      try {
        console.log(`Executing query (attempt ${attempt}/${retries})...`);
        const timeout = new Promise<never>((_, reject) => {
          setTimeout(
            () => reject(new Error(`Query timeout after ${DB_TIMEOUT_MS}ms`)),
            DB_TIMEOUT_MS,
          );
        });
        const queryPromise = client.query<T>(query, params);
        const result = await Promise.race([queryPromise, timeout]);
        console.log('Query executed successfully');
        return result;
      } finally {
        client.release();
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.error(`Query attempt ${attempt} failed:`, lastError.message);

      if (attempt < retries) {
        console.log(`Retrying in ${RETRY_DELAY_MS}ms...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  }

  throw lastError || new Error('Query failed after all retries');
};
