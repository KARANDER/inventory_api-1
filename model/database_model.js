const db = require('../config/db');

const Database = {
    // Delete all data from all tables in the database
    deleteAllData: async () => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Disable foreign key checks temporarily
            await connection.query('SET FOREIGN_KEY_CHECKS = 0');

            // List of all tables to delete from (in order to handle dependencies)
            const tables = [
                // Transaction tables first
                'account_history',
                'receipts',
                'payments',
                'user_activity',

                // Invoice and order tables
                'invoice_items',
                'invoices',
                'sales_invoice_items',
                'sales_invoices',
                'purchase_invoice_items',
                'purchase_invoices',
                'sales_order_items',
                'sales_orders',

                // Journal entries
                'journal_entry_items',
                'journal_entries',
                'journal_customers',

                // Inventory tables
                'inventory_items',
                'master_items',
                'carton_inventory',
                'order_stock',
                'stock_history',
                'finishes',
                'patis',

                // Employee tables
                'employee_advances',
                'employee_weekly_salary',
                'employees',

                // Contact tables
                'customer_details',
                'supplier_details',
                'contacts',

                // Account and other tables
                'accounts',
                'transports',
                'payment_methods',

                // User tables (keep users and permissions for system access)
                // 'user_permissions',
                // 'users'
            ];

            const deletedTables = [];
            const summary = {};

            for (const table of tables) {
                try {
                    // Get count before deleting
                    const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
                    const count = countResult[0].count;

                    if (count > 0) {
                        // Delete all records from table
                        await connection.query(`DELETE FROM ${table}`);

                        // Reset auto increment
                        await connection.query(`ALTER TABLE ${table} AUTO_INCREMENT = 1`);

                        deletedTables.push(table);
                        summary[table] = count;
                    }
                } catch (error) {
                    // Table might not exist, continue with next table
                    console.log(`Skipping table ${table}: ${error.message}`);
                }
            }

            // Re-enable foreign key checks
            await connection.query('SET FOREIGN_KEY_CHECKS = 1');

            await connection.commit();

            return {
                deletedTables,
                summary,
                totalTables: deletedTables.length
            };
        } catch (error) {
            await connection.rollback();
            // Re-enable foreign key checks even on error
            try {
                await connection.query('SET FOREIGN_KEY_CHECKS = 1');
            } catch (e) {
                console.error('Error re-enabling foreign key checks:', e);
            }
            throw error;
        } finally {
            connection.release();
        }
    }
};

module.exports = Database;
