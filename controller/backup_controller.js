const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const backupController = {
    /**
     * Creates a MySQL database backup and sends it as a downloadable file
     */
    downloadBackup: async (req, res) => {
        try {
            // Get database credentials from environment
            const dbHost = process.env.DB_HOST || 'localhost';
            const dbUser = process.env.DB_USER || 'root';
            const dbPassword = process.env.DB_PASSWORD || '';
            const dbName = process.env.DB_NAME || 'inventory_db';

            // Detect OS and set mysqldump path
            const isWindows = os.platform() === 'win32';
            const mysqlDumpPath = process.env.MYSQLDUMP_PATH || (isWindows ? 'C:\\xampp\\mysql\\bin\\mysqldump' : 'mysqldump');

            // Create backup filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFileName = `backup_${dbName}_${timestamp}.sql`;
            const backupDir = path.join(__dirname, '..', 'backups');
            const backupPath = path.join(backupDir, backupFileName);

            // Create backups directory if it doesn't exist
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
            }

            // Build mysqldump command
            let command;
            if (isWindows) {
                command = `"${mysqlDumpPath}" -h ${dbHost} -u ${dbUser}`;
                if (dbPassword) {
                    command += ` -p${dbPassword}`;
                }
                command += ` ${dbName} > "${backupPath}"`;
            } else {
                // Linux command
                command = `${mysqlDumpPath} -h ${dbHost} -u ${dbUser}`;
                if (dbPassword) {
                    command += ` -p'${dbPassword}'`;
                }
                command += ` ${dbName} > "${backupPath}"`;
            }

            // Execute mysqldump with appropriate shell
            const execOptions = isWindows ? { shell: 'cmd.exe' } : { shell: '/bin/bash' };

            exec(command, execOptions, (error, stdout, stderr) => {
                if (error) {
                    console.error('Backup error:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to create backup',
                        error: error.message
                    });
                }

                // Check if backup file was created
                if (!fs.existsSync(backupPath)) {
                    return res.status(500).json({
                        success: false,
                        message: 'Backup file was not created'
                    });
                }

                // Send file as download
                res.download(backupPath, backupFileName, (err) => {
                    if (err) {
                        console.error('Download error:', err);
                    }
                });
            });

        } catch (error) {
            console.error('Backup controller error:', error);
            res.status(500).json({
                success: false,
                message: 'Server Error',
                error: error.message
            });
        }
    },

    /**
     * Lists all available backup files
     */
    listBackups: async (req, res) => {
        try {
            const backupDir = path.join(__dirname, '..', 'backups');

            if (!fs.existsSync(backupDir)) {
                return res.status(200).json({ success: true, data: [] });
            }

            const files = fs.readdirSync(backupDir)
                .filter(file => file.endsWith('.sql'))
                .map(file => {
                    const filePath = path.join(backupDir, file);
                    const stats = fs.statSync(filePath);
                    return {
                        filename: file,
                        size: (stats.size / 1024).toFixed(2) + ' KB',
                        created: stats.mtime
                    };
                })
                .sort((a, b) => new Date(b.created) - new Date(a.created));

            res.status(200).json({ success: true, data: files });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server Error',
                error: error.message
            });
        }
    },

    /**
     * Download a specific backup file by filename
     */
    downloadSpecificBackup: async (req, res) => {
        try {
            const { filename } = req.body;

            if (!filename) {
                return res.status(400).json({
                    success: false,
                    message: 'Filename is required'
                });
            }

            const backupDir = path.join(__dirname, '..', 'backups');
            const backupPath = path.join(backupDir, filename);

            // Security check - prevent directory traversal
            if (!backupPath.startsWith(backupDir)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid filename'
                });
            }

            if (!fs.existsSync(backupPath)) {
                return res.status(404).json({
                    success: false,
                    message: 'Backup file not found'
                });
            }

            res.download(backupPath, filename);

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server Error',
                error: error.message
            });
        }
    },

    /**
     * Delete a backup file
     */
    deleteBackup: async (req, res) => {
        try {
            const { filename } = req.body;

            if (!filename) {
                return res.status(400).json({
                    success: false,
                    message: 'Filename is required'
                });
            }

            const backupDir = path.join(__dirname, '..', 'backups');
            const backupPath = path.join(backupDir, filename);

            // Security check
            if (!backupPath.startsWith(backupDir)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid filename'
                });
            }

            if (!fs.existsSync(backupPath)) {
                return res.status(404).json({
                    success: false,
                    message: 'Backup file not found'
                });
            }

            fs.unlinkSync(backupPath);

            res.status(200).json({
                success: true,
                message: 'Backup deleted successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server Error',
                error: error.message
            });
        }
    },
    /**
   * Import (restore) database from a backup .sql file
   * Expects: req.body.filename (name of .sql file in /backups)
   * WARNING: This will overwrite current database data.
   */
    importBackup: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'SQL file is required'
                });
            }

            const backupPath = req.file.path;

            const dbHost = process.env.DB_HOST || 'localhost';
            const dbUser = process.env.DB_USER || 'root';
            const dbPassword = process.env.DB_PASSWORD || '';
            const dbName = process.env.DB_NAME || 'inventory';

            // Detect OS
            const isWindows = os.platform() === 'win32';
            const mysqlPath = process.env.MYSQL_PATH || (isWindows ? 'C:\\xampp\\mysql\\bin\\mysql' : 'mysql');

            let baseCmd;
            if (isWindows) {
                baseCmd = `"${mysqlPath}" -h ${dbHost} -u ${dbUser}`;
                if (dbPassword) {
                    baseCmd += ` -p${dbPassword}`;
                }
            } else {
                baseCmd = `${mysqlPath} -h ${dbHost} -u ${dbUser}`;
                if (dbPassword) {
                    baseCmd += ` -p'${dbPassword}'`;
                }
            }

            const execOptions = isWindows ? { shell: 'cmd.exe' } : { shell: '/bin/bash' };

            // Drop and recreate database
            const prepCommand = `${baseCmd} -e "DROP DATABASE IF EXISTS ${dbName}; CREATE DATABASE ${dbName};"`;

            exec(prepCommand, execOptions, (prepError, prepStdout, prepStderr) => {
                if (prepError) {
                    console.error('Prepare (drop/create) DB error:', prepError);
                    console.error('stderr:', prepStderr);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to recreate database before import',
                        error: prepError.message
                    });
                }

                const importCommand = `${baseCmd} ${dbName} < "${backupPath}"`;

                exec(importCommand, execOptions, (error, stdout, stderr) => {
                    if (error) {
                        console.error('Import error:', error);
                        console.error('stderr:', stderr);
                        return res.status(500).json({
                            success: false,
                            message: 'Failed to import backup',
                            error: error.message
                        });
                    }

                    return res.status(200).json({
                        success: true,
                        message: 'Database replaced and imported successfully'
                    });
                });
            });
        } catch (error) {
            console.error('Import controller error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server Error',
                error: error.message
            });
        }
    }


};

module.exports = backupController;
