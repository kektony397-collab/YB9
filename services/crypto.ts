import { EncryptedObject, Route } from '../types';

const KEY_NAME = 'bike-advance-crypto-key';

// Helper to convert ArrayBuffer to Base64
const bufferToBase64 = (buffer: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
};

// Helper to convert Base64 to ArrayBuffer
const base64ToBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// Gets the key from IndexedDB or generates a new one.
// Storing the key as non-extractable is a key security measure.
const getKey = async (): Promise<CryptoKey> => {
  let key = await localforage.getItem<CryptoKey>(KEY_NAME);
  if (!key) {
    key = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      false, // non-extractable
      ['encrypt', 'decrypt']
    );
    await localforage.setItem(KEY_NAME, key);
  }
  return key;
};

// This script needs to be added to index.html for localforage
const ensureLocalForage = async () => {
    if (!(window as any).localforage) {
        return new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/localforage@1.10.0/dist/localforage.min.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load localforage'));
            document.head.appendChild(script);
        });
    }
};

ensureLocalForage();
// Fix: Add type definition for localforage to allow generic type arguments on its methods, resolving the untyped function call error.
interface LocalForage {
    getItem<T>(key: string): Promise<T | null>;
    setItem<T>(key: string, value: T): Promise<T>;
}
declare const localforage: LocalForage;


// Encrypts a Route object
export const encryptRoute = async (route: Route): Promise<EncryptedObject> => {
  await ensureLocalForage();
  const key = await getKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV is recommended for AES-GCM
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(route));

  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    data
  );

  return {
    iv: bufferToBase64(iv),
    data: bufferToBase64(encryptedData),
  };
};

// Decrypts an EncryptedObject back to a Route object
export const decryptRoute = async (encrypted: EncryptedObject): Promise<Route> => {
    await ensureLocalForage();
    const key = await getKey();
    const iv = base64ToBuffer(encrypted.iv);
    const data = base64ToBuffer(encrypted.data);

    const decryptedData = await window.crypto.subtle.decrypt(
        {
        name: 'AES-GCM',
        iv: iv,
        },
        key,
        data
    );

    const decoder = new TextDecoder();
    const jsonString = decoder.decode(decryptedData);
    return JSON.parse(jsonString) as Route;
};
