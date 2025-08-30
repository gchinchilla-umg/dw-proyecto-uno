// Database initialization and common operations
let SQL;
let db;

// Initialize SQL.js and create/load database
async function initDatabase() {
    try {
        SQL = await initSqlJs({
            locateFile: file => `/lib/${file}`
        });
        
        // Create a new database
        db = new SQL.Database();
        
        // Create tables if they don't exist
        createTables();
        
        // Insert sample data for testing
        insertSampleData();
        
        return true;
    } catch (err) {
        console.error('Error initializing database:', err);
        return false;
    }
}

// Create database tables
function createTables() {
    db.run(`
        CREATE TABLE IF NOT EXISTS Noticias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fecha DATE NOT NULL,
            noticia TEXT NOT NULL
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Calendario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fecha DATE NOT NULL,
            titulo TEXT NOT NULL,
            descripcion TEXT
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Inquilino (
            dpi TEXT PRIMARY KEY,
            primer_nombre TEXT NOT NULL,
            primer_apellido TEXT NOT NULL,
            fecha_nacimiento DATE NOT NULL,
            numero_casa TEXT NOT NULL
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS PagoDeCuotas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero_casa TEXT NOT NULL,
            anio_cuota INTEGER NOT NULL,
            mes_cuota INTEGER NOT NULL,
            fecha_pago DATE NOT NULL
        );
    `);
}

// Insert sample data for testing
function insertSampleData() {
    // Sample news
    db.run(`
        INSERT OR IGNORE INTO Noticias (fecha, noticia) VALUES 
        ('2023-08-23', 'Mantenimiento programado de áreas verdes este fin de semana'),
        ('2023-08-22', 'Nuevo sistema de seguridad instalado en la entrada principal'),
        ('2023-08-21', 'Recordatorio: Reunión de vecinos el próximo martes');
    `);

    // Sample calendar events
    db.run(`
        INSERT OR IGNORE INTO Calendario (fecha, titulo, descripcion) VALUES 
        ('2023-08-25', 'Mantenimiento Piscina', 'Limpieza y mantenimiento general de la piscina'),
        ('2023-08-28', 'Reunión de Vecinos', 'Reunión mensual para discutir temas importantes del residencial'),
        ('2023-09-01', 'Fumigación', 'Fumigación general de áreas comunes');
    `);

    // Sample resident
    db.run(`
        INSERT OR IGNORE INTO Inquilino (dpi, primer_nombre, primer_apellido, fecha_nacimiento, numero_casa) VALUES 
        ('1234567890123', 'Juan', 'Pérez', '1980-01-01', 'A101');
    `);

    // Sample payments - Add current month payment for testing
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    db.run(`
        INSERT OR IGNORE INTO PagoDeCuotas (numero_casa, anio_cuota, mes_cuota, fecha_pago) VALUES 
        ('A101', 2023, 8, '2023-08-01'),
        ('A101', ${currentYear}, ${currentMonth}, '${currentYear}-${currentMonth.toString().padStart(2, '0')}-01');
    `);
}

// Get the latest news (limit to 3)
function getLatestNews() {
    return db.exec(`
        SELECT fecha, noticia 
        FROM Noticias 
        ORDER BY fecha DESC 
        LIMIT 3;
    `);
}

// Get calendar events for a specific month and year
function getCalendarEvents(month, year) {
    return db.exec(`
        SELECT fecha, titulo, descripcion 
        FROM Calendario 
        WHERE strftime('%m', fecha) = ? AND strftime('%Y', fecha) = ?
        ORDER BY fecha;
    `, [month.toString().padStart(2, '0'), year.toString()]);
}

// Verify resident information
function verifyResident(dpi, numeroCasa, primerNombre, primerApellido, fechaNacimiento) {
    console.log('Executing verifyResident query with params:', { dpi, numeroCasa, primerNombre, primerApellido, fechaNacimiento });
    
    // Log all residents in the database for debugging
    const allResidents = db.exec(`SELECT * FROM Inquilino;`);
    console.log('All residents in database:', JSON.stringify(allResidents));
    
    try {
        // Try with exact match
        let result = db.exec(`
            SELECT * FROM Inquilino 
            WHERE dpi = ? 
            AND numero_casa = ? 
            AND primer_nombre = ? 
            AND primer_apellido = ?;
        `, [dpi, numeroCasa, primerNombre, primerApellido]);
        
        console.log('verifyResident query result (without date):', JSON.stringify(result));
        
        if (result && result.length > 0 && result[0].values.length > 0) {
            return result;
        }
        
        // If no result, try with date
        result = db.exec(`
            SELECT * FROM Inquilino 
            WHERE dpi = ? 
            AND numero_casa = ? 
            AND primer_nombre = ? 
            AND primer_apellido = ? 
            AND fecha_nacimiento = ?;
        `, [dpi, numeroCasa, primerNombre, primerApellido, fechaNacimiento]);
        
        console.log('verifyResident query result (with date):', JSON.stringify(result));
        return result;
    } catch (error) {
        console.error('Error in verifyResident:', error);
        return null;
    }
}

// Check if maintenance fee is paid for current month
function checkMaintenancePayment(numeroCasa, mes, anio) {
    console.log('Executing checkMaintenancePayment query with params:', { numeroCasa, mes, anio });
    
    try {
        const result = db.exec(`
            SELECT * FROM PagoDeCuotas 
            WHERE numero_casa = ? 
            AND mes_cuota = ? 
            AND anio_cuota = ?;
        `, [numeroCasa, mes, anio]);
        
        console.log('checkMaintenancePayment query result:', JSON.stringify(result));
        return result;
    } catch (error) {
        console.error('Error in checkMaintenancePayment:', error);
        return null;
    }
}

// Get payment history for a house number within a date range
function getPaymentHistory(numeroCasa, fechaInicio, fechaFin) {
    return db.exec(`
        SELECT fecha_pago, mes_cuota, anio_cuota 
        FROM PagoDeCuotas 
        WHERE numero_casa = ? 
        AND fecha_pago BETWEEN ? AND ?
        ORDER BY fecha_pago DESC;
    `, [numeroCasa, fechaInicio, fechaFin]);
}

// Export functions
window.dbOperations = {
    initDatabase,
    getLatestNews,
    getCalendarEvents,
    verifyResident,
    checkMaintenancePayment,
    getPaymentHistory
};
