// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize database
    const initialized = await window.dbOperations.initDatabase();
    if (!initialized) {
        console.error('Failed to initialize database');
        return;
    }

    // Set up form handlers
    setupFormHandlers();
});

// Set up form handlers and validation
function setupFormHandlers() {
    const consultaForm = document.getElementById('consulta-form');
    const btnHistorial = document.getElementById('btn-historial');
    const btnFiltrar = document.getElementById('btn-filtrar');
    const historialSection = document.getElementById('historial-section');

    // Form submission handler
    consultaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            checkPaymentStatus();
        }
    });

    // History button handler
    btnHistorial.addEventListener('click', () => {
        historialSection.classList.toggle('hidden');
        if (!historialSection.classList.contains('hidden')) {
            loadPaymentHistory();
        }
    });

    // Filter button handler
    btnFiltrar.addEventListener('click', loadPaymentHistory);

    // Set max date for date inputs
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fecha-nacimiento').max = today;
    document.getElementById('fecha-fin').max = today;
}

// Validate form inputs
function validateForm() {
    const dpi = document.getElementById('dpi').value;
    const numeroCasa = document.getElementById('numero-casa').value;
    const primerNombre = document.getElementById('primer-nombre').value;
    const primerApellido = document.getElementById('primer-apellido').value;
    const fechaNacimiento = document.getElementById('fecha-nacimiento').value;

    // DPI validation
    if (!/^\d{13}$/.test(dpi)) {
        showError('El DPI debe contener exactamente 13 dígitos');
        return false;
    }

    // House number validation
    if (!/^[A-Za-z0-9]+$/.test(numeroCasa)) {
        showError('El número de casa debe contener solo letras y dígitos');
        return false;
    }

    // Name validation
    if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ]+$/.test(primerNombre)) {
        showError('El primer nombre debe contener solo letras');
        return false;
    }

    // Last name validation
    if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ]+$/.test(primerApellido)) {
        showError('El primer apellido debe contener solo letras');
        return false;
    }

    // Birth date validation
    if (!fechaNacimiento) {
        showError('La fecha de nacimiento es requerida');
        return false;
    }

    return true;
}

// Check payment status
async function checkPaymentStatus() {
    const dpi = document.getElementById('dpi').value;
    const numeroCasa = document.getElementById('numero-casa').value;
    const primerNombre = document.getElementById('primer-nombre').value;
    const primerApellido = document.getElementById('primer-apellido').value;
    const fechaNacimiento = document.getElementById('fecha-nacimiento').value;
    const resultadoConsulta = document.getElementById('resultado-consulta');

    console.log('Checking payment status with:', { dpi, numeroCasa, primerNombre, primerApellido, fechaNacimiento });

    try {
        // Verify resident
        const residentResult = window.dbOperations.verifyResident(
            dpi, numeroCasa, primerNombre, primerApellido, fechaNacimiento
        );
        
        console.log('Resident verification result:', residentResult);

        if (!residentResult || residentResult.length === 0 || residentResult[0].values.length === 0) {
            showError('Los datos ingresados no corresponden a ningún inquilino registrado');
            return;
        }

        // Check current month's payment
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        console.log('Checking payment for:', { numeroCasa, currentMonth, currentYear });

        const paymentResult = window.dbOperations.checkMaintenancePayment(
            numeroCasa, currentMonth, currentYear
        );
        
        console.log('Payment check result:', paymentResult);

        // Log the payment result details
        console.log('Payment result check:', {
            hasResult: !!paymentResult,
            hasLength: paymentResult && paymentResult.length > 0,
            hasValues: paymentResult && paymentResult.length > 0 && paymentResult[0].values.length > 0
        });
        
        // Check if resultadoConsulta exists
        console.log('resultadoConsulta element:', resultadoConsulta);
        
        if (paymentResult && paymentResult.length > 0 && paymentResult[0].values.length > 0) {
            console.log('Setting success message');
            resultadoConsulta.innerHTML = `
                <div class="alert alert-success">
                    Cuota de mantenimiento al día
                </div>
            `;
        } else {
            console.log('Setting error message');
            resultadoConsulta.innerHTML = `
                <div class="alert alert-error">
                    Cuota de mantenimiento pendiente
                </div>
            `;
        }
        
        // Make sure the element is visible
        resultadoConsulta.style.display = 'block';
        
        // Force a repaint to ensure the message is displayed
        setTimeout(() => {
            console.log('Forcing repaint of resultadoConsulta');
            resultadoConsulta.style.display = 'none';
            resultadoConsulta.offsetHeight; // Force a repaint
            resultadoConsulta.style.display = 'block';
            
            // Add a direct message to the page for debugging
            document.body.insertAdjacentHTML('beforeend', `
                <div style="background-color: #f8d7da; color: #721c24; padding: 10px; margin: 10px; border-radius: 5px;">
                    Debug: Payment status check completed. Result: ${paymentResult && paymentResult.length > 0 && paymentResult[0].values.length > 0 ? 'Al día' : 'Pendiente'}
                </div>
            `);
        }, 100);
    } catch (error) {
        console.error('Error checking payment status:', error);
        showError('Error al verificar el estado de pago');
    }
}

// Load payment history
async function loadPaymentHistory() {
    const numeroCasa = document.getElementById('numero-casa').value;
    const fechaInicio = document.getElementById('fecha-inicio').value;
    const fechaFin = document.getElementById('fecha-fin').value;
    const historialBody = document.getElementById('historial-body');

    if (!numeroCasa) {
        showError('Ingrese un número de casa para consultar el historial');
        return;
    }

    if (!fechaInicio || !fechaFin) {
        showError('Seleccione un rango de fechas para filtrar el historial');
        return;
    }

    try {
        const historyResult = window.dbOperations.getPaymentHistory(
            numeroCasa, fechaInicio, fechaFin
        );

        if (historyResult && historyResult.length > 0 && historyResult[0].values.length > 0) {
            const historyHTML = historyResult[0].values.map(([fechaPago, mesCuota, anioCuota]) => {
                const formattedDate = new Date(fechaPago).toLocaleDateString('es-GT');
                const monthName = new Date(anioCuota, mesCuota - 1).toLocaleString('es-GT', { month: 'long' });
                
                return `
                    <tr>
                        <td>${formattedDate}</td>
                        <td>${monthName}</td>
                        <td>${anioCuota}</td>
                        <td>Pagado</td>
                    </tr>
                `;
            }).join('');
            
            historialBody.innerHTML = historyHTML;
        } else {
            historialBody.innerHTML = `
                <tr>
                    <td colspan="4">No se encontraron pagos en el rango de fechas seleccionado</td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error loading payment history:', error);
        showError('Error al cargar el historial de pagos');
    }
}

// Show error message
function showError(message) {
    const resultadoConsulta = document.getElementById('resultado-consulta');
    resultadoConsulta.innerHTML = `
        <div class="alert alert-error">
            ${message}
        </div>
    `;
}
