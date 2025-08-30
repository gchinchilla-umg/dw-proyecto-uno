// Database initialization and common operations
let SQL;
let db;

// Initialize SQL.js and create/load database
async function initDatabase() {
    try {
        console.log('Initializing SQL.js database...');
        
        // Try different paths for SQL.js files
        const possiblePaths = [
            file => `lib/${file}`,
            file => `/lib/${file}`,
            file => `./lib/${file}`
        ];
        
        let sqlInitialized = false;
        let lastError = null;
        
        for (const locateFile of possiblePaths) {
            try {
                console.log(`Trying to load SQL.js with path: ${locateFile('sql-wasm.js')}`);
                SQL = await initSqlJs({ locateFile });
                sqlInitialized = true;
                console.log('SQL.js loaded successfully');
                break;
            } catch (err) {
                console.warn(`Failed to load SQL.js with current path:`, err);
                lastError = err;
            }
        }
        
        if (!sqlInitialized) {
            throw new Error(`Failed to initialize SQL.js with all attempted paths. Last error: ${lastError?.message}`);
        }
        
        // Create a new database
        console.log('Creating new database...');
        db = new SQL.Database();
        
        // Create tables if they don't exist
        console.log('Creating tables...');
        createTables();
        
        // Insert sample data for testing
        console.log('Inserting sample data...');
        insertSampleData();
        
        console.log('Database initialization completed successfully');
        return true;
    } catch (err) {
        console.error('Error initializing database:', err);
        // Show user-friendly error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error';
        errorDiv.textContent = 'Error al cargar la base de datos. Por favor, recarga la página.';
        document.body.insertBefore(errorDiv, document.body.firstChild);
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
        ('2025-09-23', 'Mantenimiento programado de áreas verdes este fin de semana'),
        ('2025-09-22', 'Nuevo sistema de seguridad instalado en la entrada principal'),
        ('2025-09-21', 'Recordatorio: Reunión de vecinos el próximo martes');
    `);

    // Sample calendar events - Adding events for current month (August 2025) and future months
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // August = 8
    const currentYear = currentDate.getFullYear(); // 2025
    
    db.run(`
        INSERT OR IGNORE INTO Calendario (fecha, titulo, descripcion) VALUES 
        -- Agosto 2025
        ('2025-08-15', 'Mantenimiento Jardines', 'Poda y mantenimiento de áreas verdes'),
        ('2025-08-20', 'Limpieza Piscina', 'Limpieza semanal de la piscina'),
        ('2025-08-25', 'Reunión Junta Directiva', 'Reunión mensual de la junta directiva'),
        ('2025-08-30', 'Fumigación Mensual', 'Fumigación preventiva de áreas comunes'),
        
        -- Septiembre 2025
        ('2025-09-01', 'Fumigación General', 'Fumigación general de áreas comunes'),
        ('2025-09-05', 'Limpieza Piscina', 'Limpieza semanal de la piscina'),
        ('2025-09-10', 'Mantenimiento Jardines', 'Poda y mantenimiento de áreas verdes'),
        ('2025-09-15', 'Mantenimiento Elevadores', 'Revisión técnica de elevadores'),
        ('2025-09-20', 'Limpieza Piscina', 'Limpieza semanal de la piscina'),
        ('2025-09-25', 'Reunión Junta Directiva', 'Reunión mensual de la junta directiva'),
        ('2025-09-28', 'Reunión de Vecinos', 'Reunión mensual para discutir temas importantes del residencial'),
        ('2025-09-30', 'Fumigación Mensual', 'Fumigación preventiva de áreas comunes'),
        
        -- Octubre 2025
        ('2025-10-03', 'Limpieza Piscina', 'Limpieza semanal de la piscina'),
        ('2025-10-05', 'Actividad Familiar', 'Día de actividades familiares en el área social'),
        ('2025-10-10', 'Mantenimiento Jardines', 'Poda y mantenimiento de áreas verdes'),
        ('2025-10-15', 'Mantenimiento General', 'Mantenimiento preventivo de instalaciones'),
        ('2025-10-17', 'Limpieza Piscina', 'Limpieza semanal de la piscina'),
        ('2025-10-20', 'Inspección Seguridad', 'Revisión de sistemas de seguridad'),
        ('2025-10-25', 'Reunión Junta Directiva', 'Reunión mensual de la junta directiva'),
        ('2025-10-31', 'Fumigación Mensual', 'Fumigación preventiva de áreas comunes'),
        
        -- Noviembre 2025
        ('2025-11-02', 'Día de los Muertos', 'Actividad conmemorativa en el área social'),
        ('2025-11-07', 'Limpieza Piscina', 'Limpieza semanal de la piscina'),
        ('2025-11-10', 'Mantenimiento Jardines', 'Poda y mantenimiento de áreas verdes'),
        ('2025-11-15', 'Mantenimiento Elevadores', 'Revisión técnica de elevadores'),
        ('2025-11-21', 'Limpieza Piscina', 'Limpieza semanal de la piscina'),
        ('2025-11-25', 'Reunión Junta Directiva', 'Reunión mensual de la junta directiva'),
        ('2025-11-28', 'Reunión de Vecinos', 'Reunión mensual para discutir temas importantes del residencial'),
        ('2025-11-30', 'Fumigación Mensual', 'Fumigación preventiva de áreas comunes'),
        
        -- Diciembre 2025
        ('2025-12-05', 'Limpieza Piscina', 'Limpieza semanal de la piscina'),
        ('2025-12-10', 'Mantenimiento Jardines', 'Poda y mantenimiento de áreas verdes'),
        ('2025-12-15', 'Posada Navideña', 'Celebración navideña para todos los residentes'),
        ('2025-12-19', 'Limpieza Piscina', 'Limpieza semanal de la piscina'),
        ('2025-12-20', 'Reunión Junta Directiva', 'Última reunión del año'),
        ('2025-12-24', 'Nochebuena', 'Celebración de Nochebuena en el área social'),
        ('2025-12-31', 'Año Nuevo', 'Celebración de fin de año'),
        
        -- Enero 2026
        ('2026-01-02', 'Limpieza Piscina', 'Primera limpieza del año'),
        ('2026-01-10', 'Mantenimiento Jardines', 'Poda y mantenimiento de áreas verdes'),
        ('2026-01-15', 'Mantenimiento General', 'Mantenimiento preventivo de instalaciones'),
        ('2026-01-20', 'Reunión Junta Directiva', 'Primera reunión del año'),
        ('2026-01-25', 'Reunión de Vecinos', 'Planificación de actividades del año'),
        ('2026-01-31', 'Fumigación Mensual', 'Fumigación preventiva de áreas comunes');
    `);

    // Sample resident
    db.run(`
        INSERT OR IGNORE INTO Inquilino (dpi, primer_nombre, primer_apellido, fecha_nacimiento, numero_casa) VALUES 
        ('1234567890123', 'Juan', 'Pérez', '1980-01-01', 'A101');
    `);

    // Sample payments - Add current month payment for testing
    db.run(`
        INSERT OR IGNORE INTO PagoDeCuotas (numero_casa, anio_cuota, mes_cuota, fecha_pago) VALUES 
        ('A101', 2025, 8, '2025-08-01'),
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
