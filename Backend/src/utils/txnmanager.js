const db = require('../config/database');

class TransactionManager {
    generateTransactionId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 7);
        return `${timestamp}-${random}`.toUpperCase();
    }

    async executeTransaction(callback, context = {}) {
        const connection = await db.getConnection();
        const transactionId = this.generateTransactionId();
        
        console.log(`[TXN-${transactionId}] Starting transaction`);
        console.log(`[TXN-${transactionId}] Context:`, context);

        try {
            await connection.beginTransaction();
            
            const result = await callback(connection, transactionId);
            
            await connection.commit();
            console.log(`[TXN-${transactionId}] Committed successfully`);
            
            return result;

        } catch (error) {
            await connection.rollback();
            
            console.error(`[TXN-${transactionId}] Rolled back:`, error.message);
            
            try {
                await connection.execute(
                    `INSERT INTO audit_log 
                     (table_name, record_id, action, new_data, changed_by)
                     VALUES (?, ?, ?, ?, ?)`,
                    [
                        'transaction_rollback',
                        0, 
                        'UPDATE',
                        JSON.stringify({
                            transaction_id: transactionId,
                            error: error.message,
                            endpoint: context.endpoint || 'unknown',
                            timestamp: new Date().toISOString()
                        }),
                        context.user?.id || null
                    ]
                );
            } catch (logError) {
                console.error('Failed to log rollback to audit_log:', logError);
            }
            
            throw error;

        } finally {
            connection.release();
            console.log(`[TXN-${transactionId}] Connection released`);
        }
    }

    async logOperation(connection, tableName, recordId, action, oldData, newData, userId) {
        try {
            await connection.execute(
                `INSERT INTO audit_log 
                 (table_name, record_id, action, old_data, new_data, changed_by)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    tableName,
                    recordId,
                    action,
                    oldData ? JSON.stringify(oldData) : null,
                    newData ? JSON.stringify(newData) : null,
                    userId
                ]
            );
        } catch (error) {
            console.error('Failed to log operation to audit_log:', error);
        }
    }
}

module.exports = new TransactionManager();