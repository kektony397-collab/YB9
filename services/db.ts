import Dexie, { Table } from 'dexie';
import { EncryptedRoute, Route } from '../types';
import { encryptRoute, decryptRoute } from './crypto';

export class BikeAdvanceDB extends Dexie {
  routes!: Table<EncryptedRoute, string>; // 'string' is the type of the primary key 'id'

  constructor() {
    super('BikeAdvanceDB');
    // Fix: Corrected Dexie schema. 'encryptedData' is a complex object and cannot be an index.
    // An invalid schema can cause cascading type errors, such as the 'version' method not being found.
    this.version(1).stores({
      routes: 'id', // Primary key 'id'
    });
  }
}

const db = new BikeAdvanceDB();

// Add a route to the database, encrypting it first
export const addRoute = async (route: Route): Promise<void> => {
  try {
    const encryptedData = await encryptRoute(route);
    await db.routes.add({
      id: route.id,
      encryptedData,
    });
  } catch (error) {
    console.error('Failed to add encrypted route to DB:', error);
  }
};

// Get all routes from the database, decrypting them before returning
export const getAllRoutes = async (): Promise<Route[]> => {
  try {
    const encryptedRoutes = await db.routes.toArray();
    const routes = await Promise.all(
      encryptedRoutes.map(async (encRoute) => {
        return await decryptRoute(encRoute.encryptedData);
      })
    );
    // Sort by start time, most recent first
    return routes.sort((a, b) => b.startTime - a.startTime);
  } catch (error) {
    console.error('Failed to get and decrypt routes from DB:', error);
    return [];
  }
};
