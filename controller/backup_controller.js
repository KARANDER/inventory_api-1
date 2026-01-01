const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

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

            // MySQL bin path - update this in .env file or change default here
            // Common paths: 
            // XAMPP: C:\\xampp\\mysql\\bin\\mysqldump
            // MySQL: C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump
            // WAMP: C:\\wamp64\\bin\\mysql\\mysql8.0.31\\bin\\mysqldump
            const mysqlDumpPath = process.env.MYSQLDUMP_PATH || 'C:\\xampp\\mysql\\bin\\mysqldump';

            // Create backup filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFileName = `backup_${dbName}_${timestamp}.sql`;
            const backupDir = path.join(__dirname, '..', 'backups');
            const backupPath = path.join(backupDir, backupFileName);

            // Create backups directory if it doesn't exist
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
            }

            // Build mysqldump command with full path
            let command = `"${mysqlDumpPath}" -h ${dbHost} -u ${dbUser}`;
            if (dbPassword) {
                command += ` -p${dbPassword}`;
            }
            command += ` ${dbName} > "${backupPath}"`;

            // Execute mysqldump
            exec(command, { shell: 'cmd.exe' }, (error, stdout, stderr) => {
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
    }
};

module.exports = backupController;
