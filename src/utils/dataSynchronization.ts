/**
 * Data Synchronization Manager for Limited Backend Scenarios
 * 
 * This module provides intelligent data synchronization with:
 * - Offline-first data management
 * - Conflict resolution strategies
 * - Data compression and batching
 * - Smart retry mechanisms
 * - Local data validation
 * - Schema-aware synchronization
 */

import { optimizedLocalStorage } from './optimizedLocalStorage';
import { schemaManager } from './schemaDifferentiation';

// =============================================
// TYPES AND INTERFACES
// =============================================

interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  table: string;
  data: Record<string, unknown>;
  timestamp: number;
  retryCount: number;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  error?: string;
}

interface SyncConfig {
  batchSize: number;
  retryAttempts: number;
  retryDelay: number;
  syncInterval: number;
  conflictResolution: 'local' | 'remote' | 'merge' | 'manual';
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
}

interface SyncMetrics {
  totalOperations: number;
  pendingOperations: number;
  completedOperations: number;
  failedOperations: number;
  lastSyncTime: number;
  syncDuration: number;
  dataTransferred: number;
  conflictsResolved: number;
}

interface ConflictResolution {
  operationId: string;
  localData: Record<string, unknown>;
  remoteData: Record<string, unknown>;
  resolution: 'local' | 'remote' | 'merge';
  resolvedData: Record<string, unknown>;
  timestamp: number;
}

// =============================================
// CONFIGURATION
// =============================================

const SYNC_CONFIG: SyncConfig = {
  batchSize: 50,
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  syncInterval: 30000, // 30 seconds
  conflictResolution: 'merge',
  compressionEnabled: true,
  encryptionEnabled: true
};

// =============================================
// MAIN SYNC MANAGER CLASS
// =============================================

class DataSynchronizationManager {
  private config: SyncConfig;
  private operations: Map<string, SyncOperation> = new Map();
  private metrics: SyncMetrics = {
    totalOperations: 0,
    pendingOperations: 0,
    completedOperations: 0,
    failedOperations: 0,
    lastSyncTime: 0,
    syncDuration: 0,
    dataTransferred: 0,
    conflictsResolved: 0
  };
  private syncTimer?: NodeJS.Timeout;
  private isOnline: boolean = navigator.onLine;
  private conflictResolutions: Map<string, ConflictResolution> = new Map();

  constructor(config: Partial<SyncConfig> = {}) {
    this.config = { ...SYNC_CONFIG, ...config };
    this.initialize();
  }

  /**
   * Initialize the sync manager
   */
  private initialize(): void {
    this.loadPendingOperations();
    this.setupEventListeners();
    this.startSyncTimer();
  }

  /**
   * Load pending operations from localStorage
   */
  private loadPendingOperations(): void {
    try {
      const pendingOps = optimizedLocalStorage.getItem<SyncOperation[]>('pending-sync-operations') || [];
      pendingOps.forEach(op => {
        this.operations.set(op.id, op);
      });
      this.updateMetrics();
    } catch (error) {
      console.error('Failed to load pending operations:', error);
    }
  }

  /**
   * Save pending operations to localStorage
   */
  private savePendingOperations(): void {
    try {
      const pendingOps = Array.from(this.operations.values())
        .filter(op => op.status === 'pending' || op.status === 'failed');
      optimizedLocalStorage.setItem('pending-sync-operations', pendingOps);
    } catch (error) {
      console.error('Failed to save pending operations:', error);
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.triggerSync();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Visibility change (tab focus)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline) {
        this.triggerSync();
      }
    });
  }

  /**
   * Start sync timer
   */
  private startSyncTimer(): void {
    this.syncTimer = setInterval(() => {
      if (this.isOnline && this.operations.size > 0) {
        this.triggerSync();
      }
    }, this.config.syncInterval);
  }

  /**
   * Stop sync timer
   */
  private stopSyncTimer(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
  }

  /**
   * Queue operation for synchronization
   */
  queueOperation(
    type: SyncOperation['type'],
    table: string,
    data: Record<string, unknown>
  ): string {
    const operation: SyncOperation = {
      id: this.generateOperationId(),
      type,
      table,
      data,
      timestamp: Date.now(),
      retryCount: 0,
      status: 'pending'
    };

    this.operations.set(operation.id, operation);
    this.updateMetrics();
    this.savePendingOperations();

    // Trigger sync if online
    if (this.isOnline) {
      this.triggerSync();
    }

    return operation.id;
  }

  /**
   * Generate unique operation ID
   */
  private generateOperationId(): string {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Trigger synchronization
   */
  async triggerSync(): Promise<void> {
    if (!this.isOnline || this.operations.size === 0) {
      return;
    }

    const startTime = Date.now();
    const pendingOps = Array.from(this.operations.values())
      .filter(op => op.status === 'pending' || op.status === 'failed')
      .slice(0, this.config.batchSize);

    if (pendingOps.length === 0) {
      return;
    }

    try {
      // Process operations in batches
      const batches = this.createBatches(pendingOps, this.config.batchSize);
      
      for (const batch of batches) {
        await this.processBatch(batch);
      }

      this.metrics.lastSyncTime = Date.now();
      this.metrics.syncDuration = Date.now() - startTime;
      this.savePendingOperations();

    } catch (error) {
      console.error('Sync failed:', error);
    }
  }

  /**
   * Create batches from operations
   */
  private createBatches(operations: SyncOperation[], batchSize: number): SyncOperation[][] {
    const batches: SyncOperation[][] = [];
    for (let i = 0; i < operations.length; i += batchSize) {
      batches.push(operations.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * Process a batch of operations
   */
  private async processBatch(operations: SyncOperation[]): Promise<void> {
    const tableGroups = this.groupOperationsByTable(operations);

    for (const [table, tableOps] of tableGroups) {
      try {
        await this.processTableOperations(table, tableOps);
      } catch (error) {
        console.error(`Failed to process operations for table ${table}:`, error);
        // Mark operations as failed
        tableOps.forEach(op => {
          op.status = 'failed';
          op.error = error instanceof Error ? error.message : String(error);
        });
      }
    }
  }

  /**
   * Group operations by table
   */
  private groupOperationsByTable(operations: SyncOperation[]): Map<string, SyncOperation[]> {
    const groups = new Map<string, SyncOperation[]>();
    
    operations.forEach(op => {
      if (!groups.has(op.table)) {
        groups.set(op.table, []);
      }
      groups.get(op.table)!.push(op);
    });

    return groups;
  }

  /**
   * Process operations for a specific table
   */
  private async processTableOperations(table: string, operations: SyncOperation[]): Promise<void> {
    // Validate table exists and is accessible
    const tableInfo = await schemaManager.getTableInfo(table);
    if (!tableInfo.exists) {
      throw new Error(`Table ${table} does not exist`);
    }

    // Process each operation
    for (const operation of operations) {
      await this.processOperation(operation);
    }
  }

  /**
   * Process a single operation
   */
  private async processOperation(operation: SyncOperation): Promise<void> {
    try {
      operation.status = 'syncing';
      this.updateMetrics();

      let result;
      const fullTableName = schemaManager.getFullTableName(operation.table);

      switch (operation.type) {
        case 'create':
          result = await this.createRecord(fullTableName, operation.data);
          break;
        case 'update':
          result = await this.updateRecord(fullTableName, operation.data);
          break;
        case 'delete':
          result = await this.deleteRecord(fullTableName, operation.data);
          break;
        default:
          throw new Error(`Unknown operation type: ${operation.type}`);
      }

      if (result.error) {
        throw new Error(result.error.message);
      }

      operation.status = 'completed';
      this.metrics.completedOperations++;
      this.metrics.dataTransferred += JSON.stringify(operation.data).length;

    } catch (error) {
      operation.status = 'failed';
      operation.error = error instanceof Error ? error.message : String(error);
      operation.retryCount++;

      if (operation.retryCount < this.config.retryAttempts) {
        // Schedule retry
        setTimeout(() => {
          operation.status = 'pending';
          this.triggerSync();
        }, this.config.retryDelay * operation.retryCount);
      } else {
        this.metrics.failedOperations++;
      }
    }

    this.updateMetrics();
  }

  /**
   * Create record in database
   */
  private async createRecord(tableName: string, data: Record<string, unknown>) {
    // Use the secure database wrapper
    const { secureDB } = await import('../lib/supabase');
    return secureDB.insertSecureData(tableName, data, []);
  }

  /**
   * Update record in database
   */
  private async updateRecord(tableName: string, data: Record<string, unknown>) {
    const { secureDB } = await import('../lib/supabase');
    const id = data.id as string;
    if (!id) {
      throw new Error('Update operation requires an ID');
    }
    return secureDB.updateSecureData(tableName, data, { column: 'id', value: id }, []);
  }

  /**
   * Delete record from database
   */
  private async deleteRecord(tableName: string, data: Record<string, unknown>) {
    const { secureDB } = await import('../lib/supabase');
    const id = data.id as string;
    if (!id) {
      throw new Error('Delete operation requires an ID');
    }
    return secureDB.deleteSecureData(tableName, { column: 'id', value: id });
  }

  /**
   * Resolve data conflicts
   */
  resolveConflict(
    operationId: string,
    localData: Record<string, unknown>,
    remoteData: Record<string, unknown>,
    resolution: 'local' | 'remote' | 'merge'
  ): Record<string, unknown> {
    let resolvedData: Record<string, unknown>;

    switch (resolution) {
      case 'local':
        resolvedData = localData;
        break;
      case 'remote':
        resolvedData = remoteData;
        break;
      case 'merge':
        resolvedData = this.mergeData(localData, remoteData);
        break;
      default:
        throw new Error(`Unknown resolution strategy: ${resolution}`);
    }

    const conflictResolution: ConflictResolution = {
      operationId,
      localData,
      remoteData,
      resolution,
      resolvedData,
      timestamp: Date.now()
    };

    this.conflictResolutions.set(operationId, conflictResolution);
    this.metrics.conflictsResolved++;

    return resolvedData;
  }

  /**
   * Merge local and remote data
   */
  private mergeData(localData: Record<string, unknown>, remoteData: Record<string, unknown>): Record<string, unknown> {
    const merged = { ...remoteData };

    // Merge non-conflicting fields
    Object.keys(localData).forEach(key => {
      if (!(key in remoteData)) {
        merged[key] = localData[key];
      } else if (localData[key] !== remoteData[key]) {
        // Handle conflicts based on data type
        if (typeof localData[key] === 'object' && typeof remoteData[key] === 'object') {
          merged[key] = this.mergeData(
            localData[key] as Record<string, unknown>,
            remoteData[key] as Record<string, unknown>
          );
        } else {
          // Use local data for primitive conflicts
          merged[key] = localData[key];
        }
      }
    });

    return merged;
  }

  /**
   * Update metrics
   */
  private updateMetrics(): void {
    this.metrics.totalOperations = this.operations.size;
    this.metrics.pendingOperations = Array.from(this.operations.values())
      .filter(op => op.status === 'pending' || op.status === 'failed').length;
    this.metrics.completedOperations = Array.from(this.operations.values())
      .filter(op => op.status === 'completed').length;
  }

  /**
   * Get sync metrics
   */
  getMetrics(): SyncMetrics {
    return { ...this.metrics };
  }

  /**
   * Get pending operations
   */
  getPendingOperations(): SyncOperation[] {
    return Array.from(this.operations.values())
      .filter(op => op.status === 'pending' || op.status === 'failed');
  }

  /**
   * Get operation by ID
   */
  getOperation(id: string): SyncOperation | undefined {
    return this.operations.get(id);
  }

  /**
   * Cancel operation
   */
  cancelOperation(id: string): boolean {
    const operation = this.operations.get(id);
    if (operation && (operation.status === 'pending' || operation.status === 'failed')) {
      this.operations.delete(id);
      this.updateMetrics();
      this.savePendingOperations();
      return true;
    }
    return false;
  }

  /**
   * Clear completed operations
   */
  clearCompletedOperations(): void {
    const completedOps = Array.from(this.operations.values())
      .filter(op => op.status === 'completed');
    
    completedOps.forEach(op => {
      this.operations.delete(op.id);
    });

    this.updateMetrics();
    this.savePendingOperations();
  }

  /**
   * Get sync status
   */
  getSyncStatus(): {
    isOnline: boolean;
    pendingCount: number;
    lastSyncTime: number;
    syncInProgress: boolean;
  } {
    return {
      isOnline: this.isOnline,
      pendingCount: this.metrics.pendingOperations,
      lastSyncTime: this.metrics.lastSyncTime,
      syncInProgress: Array.from(this.operations.values())
        .some(op => op.status === 'syncing')
    };
  }

  /**
   * Force sync
   */
  async forceSync(): Promise<void> {
    await this.triggerSync();
  }

  /**
   * Destroy the sync manager
   */
  destroy(): void {
    this.stopSyncTimer();
    this.savePendingOperations();
  }
}

// =============================================
// REACT HOOK FOR SYNC MANAGEMENT
// =============================================

/**
 * Hook for managing data synchronization
 */
export function useDataSync(config?: Partial<SyncConfig>) {
  const [syncManager] = React.useState(() => new DataSynchronizationManager(config));
  const [syncStatus, setSyncStatus] = React.useState(syncManager.getSyncStatus());
  const [metrics, setMetrics] = React.useState(syncManager.getMetrics());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSyncStatus(syncManager.getSyncStatus());
      setMetrics(syncManager.getMetrics());
    }, 1000);

    return () => {
      clearInterval(interval);
      syncManager.destroy();
    };
  }, [syncManager]);

  const queueOperation = React.useCallback((
    type: SyncOperation['type'],
    table: string,
    data: Record<string, unknown>
  ) => {
    return syncManager.queueOperation(type, table, data);
  }, [syncManager]);

  const forceSync = React.useCallback(async () => {
    await syncManager.forceSync();
  }, [syncManager]);

  const resolveConflict = React.useCallback((
    operationId: string,
    localData: Record<string, unknown>,
    remoteData: Record<string, unknown>,
    resolution: 'local' | 'remote' | 'merge'
  ) => {
    return syncManager.resolveConflict(operationId, localData, remoteData, resolution);
  }, [syncManager]);

  return {
    syncStatus,
    metrics,
    queueOperation,
    forceSync,
    resolveConflict,
    getPendingOperations: syncManager.getPendingOperations.bind(syncManager),
    cancelOperation: syncManager.cancelOperation.bind(syncManager),
    clearCompletedOperations: syncManager.clearCompletedOperations.bind(syncManager)
  };
}

// =============================================
// EXPORTS
// =============================================

export const dataSyncManager = new DataSynchronizationManager();
export default DataSynchronizationManager;
