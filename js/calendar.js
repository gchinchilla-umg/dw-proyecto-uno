// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize database
    const initialized = await window.dbOperations.initDatabase();
    if (!initialized) {
        console.error('Failed to initialize database');
        return;
    }

    // Set up calendar controls
    setupCalendarControls();
});

// Set up calendar controls and initial display
function setupCalendarControls() {
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
    monthSelector.addEventListener('change', updateCalendar);
    yearSelector.addEventListener('change', updateCalendar);
    closeModal.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // Initial calendar display
    updateCalendar();
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
    const events = window.dbOperations.getCalendarEvents(month + 1, year);
    const eventMap = createEventMap(events);

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

// Make showEventDetails available globally
window.showEventDetails = showEventDetails;
