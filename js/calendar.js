// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', async () => {
    // Show loading indicator
    showLoadingIndicator();
    
    try {
        // Initialize database
        const initialized = await window.dbOperations.initDatabase();
        if (!initialized) {
            console.error('Failed to initialize database');
            showErrorMessage('Error al cargar la base de datos. Por favor, recarga la página.');
            return;
        }

        // Set up calendar controls
        await setupCalendarControls();
        
        // Hide loading indicator
        hideLoadingIndicator();
    } catch (error) {
        console.error('Error during initialization:', error);
        showErrorMessage('Error al inicializar el calendario. Por favor, recarga la página.');
        hideLoadingIndicator();
    }
});

// Set up calendar controls and initial display
async function setupCalendarControls() {
    const monthSelector = document.getElementById('month-selector');
    const yearSelector = document.getElementById('year-selector');
    const modal = document.getElementById('event-modal');
    const closeModal = document.querySelector('.close-modal');

    // Setup year selector
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 1; year <= currentYear + 2; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelector.appendChild(option);
    }

    // Set current month and year
    const currentDate = new Date();
    monthSelector.value = currentDate.getMonth();
    yearSelector.value = currentDate.getFullYear();

    // Event listeners
    monthSelector.addEventListener('change', async () => await updateCalendar());
    yearSelector.addEventListener('change', async () => await updateCalendar());
    closeModal.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // Initial calendar display
    await updateCalendar();
}

// Update calendar display
async function updateCalendar() {
    const monthSelector = document.getElementById('month-selector');
    const yearSelector = document.getElementById('year-selector');
    const calendarGrid = document.getElementById('calendar-grid');
    
    const month = parseInt(monthSelector.value);
    const year = parseInt(yearSelector.value);

    // Get first day of month and total days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    const startingDay = firstDay.getDay();

    // Get events for the month
    console.log(`Loading events for month: ${month + 1}, year: ${year}`);
    const events = await window.dbOperations.getCalendarEvents(month + 1, year);
    console.log('Events loaded:', events);
    const eventMap = createEventMap(events);
    console.log('Event map created:', eventMap);

    // Generate calendar HTML
    let calendarHTML = '';
    let dayCount = 1;

    // Create weeks
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < startingDay) {
                // Empty cells before first day
                calendarHTML += '<div class="calendar-day"></div>';
            } else if (dayCount > totalDays) {
                // Empty cells after last day
                calendarHTML += '<div class="calendar-day"></div>';
            } else {
                // Regular day cells
                const currentDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayCount).padStart(2, '0')}`;
                const dayEvents = eventMap[currentDate] || [];
                
                calendarHTML += `
                    <div class="calendar-day">
                        <div class="day-number">${dayCount}</div>
                        ${dayEvents.map(event => `
                            <div class="event" onclick="showEventDetails('${event.titulo}', '${event.descripcion}', '${currentDate}')">
                                ${event.titulo}
                            </div>
                        `).join('')}
                    </div>
                `;
                dayCount++;
            }
        }
    }

    calendarGrid.innerHTML = calendarHTML;
}

// Create map of events by date
function createEventMap(events) {
    const eventMap = {};
    
    if (events && events.length > 0 && events[0].values.length > 0) {
        events[0].values.forEach(([fecha, titulo, descripcion]) => {
            if (!eventMap[fecha]) {
                eventMap[fecha] = [];
            }
            eventMap[fecha].push({ titulo, descripcion });
        });
    }
    
    return eventMap;
}

// Show event details in modal
function showEventDetails(titulo, descripcion, fecha) {
    const modal = document.getElementById('event-modal');
    const titleElement = document.getElementById('event-title');
    const descriptionElement = document.getElementById('event-description');
    const dateElement = document.getElementById('event-date');

    const formattedDate = new Date(fecha).toLocaleDateString('es-GT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    titleElement.textContent = titulo;
    descriptionElement.textContent = descripcion;
    dateElement.textContent = formattedDate;
    modal.style.display = 'block';
}

// Show loading indicator
function showLoadingIndicator() {
    const calendarSection = document.querySelector('.calendar-section');
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-indicator';
    loadingDiv.className = 'alert';
    loadingDiv.style.backgroundColor = '#3498db';
    loadingDiv.style.color = 'white';
    loadingDiv.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
            <div style="width: 20px; height: 20px; border: 2px solid #ffffff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            Cargando calendario...
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    calendarSection.insertBefore(loadingDiv, calendarSection.firstChild);
}

// Hide loading indicator
function hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
}

// Show error message
function showErrorMessage(message) {
    const calendarSection = document.querySelector('.calendar-section');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-error';
    errorDiv.textContent = message;
    calendarSection.insertBefore(errorDiv, calendarSection.firstChild);
    
    // Auto-remove error message after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Make showEventDetails available globally
window.showEventDetails = showEventDetails;
