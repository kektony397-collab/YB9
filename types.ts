
export interface Bike {
  id: number;
  name: string;
  brand: string;
  mileage: number;
  engine_cc: number;
  price: string;
  image: string;
}

export type ActiveView = 'dashboard' | 'bikes' | 'fuel' | 'settings';

export interface Coordinates {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface Route {
  id: string;
  startTime: number;
  endTime: number;
  path: Coordinates[];
}

// For encrypted data storage
export interface EncryptedObject {
  iv: string; // Base64 encoded Initialization Vector
  data: string; // Base64 encoded encrypted data
}

export interface EncryptedRoute {
  id: string; // Keep ID unencrypted for querying
  encryptedData: EncryptedObject;
}