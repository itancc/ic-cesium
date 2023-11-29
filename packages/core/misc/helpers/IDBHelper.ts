export class IDBHelper {
  private dbName: string;
  private dbVersion: number;
  private db: IDBDatabase | null = null;

  constructor(dbName: string, dbVersion: number) {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
  }

  open(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(new Error("Failed to open database"));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        this.db = request.result;
        // Perform any necessary database schema upgrades here
      };
    });
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  getObjectStore(
    storeName: string,
    mode: IDBTransactionMode = "readonly"
  ): IDBObjectStore | null {
    if (!this.db) {
      return null;
    }

    const transaction = this.db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }
}
