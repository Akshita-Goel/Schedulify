document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        height: 'auto',
        events: []
    });
    calendar.render();

    populateTimeZones();

    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    const schedulerForm = document.getElementById('schedulerForm');
    const eventsList = document.getElementById('eventsList');

    schedulerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const timezone = document.getElementById('timezone').value;
        const description = document.getElementById('description').value;

        const event = calendar.addEvent({
            title,
            start: `${date}T${time}`,
            description
        });

        const eventItem = document.createElement('li');
        eventItem.innerHTML = `
            <div>
                <strong>${title}</strong><br>
                ${date} at ${time} (${timezone})<br>
                ${description}
            </div>
            <button class="delete-btn">Delete</button>
        `;
        eventItem.dataset.eventId = event.id;  // Store the event ID in the list item
        eventsList.appendChild(eventItem);

        eventItem.querySelector('.delete-btn').addEventListener('click', function() {
            event.remove();  // Remove the event from the calendar
            eventItem.remove();  // Remove the event from the list
            saveEvents();
        });

        schedulerForm.reset();
        saveEvents();
    });

    const exportPdfButton = document.getElementById('exportPdfButton');
    exportPdfButton.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.text('Scheduled Events', 10, 10);

        const items = eventsList.querySelectorAll('li');
        items.forEach((item, index) => {
            const text = item.textContent.replace('Delete', '').trim();
            const lines = doc.splitTextToSize(text, 180);
            doc.text(lines, 10, 20 + (30 * index));
        });

        doc.save('conference-schedule.pdf');
    });

    const searchInput = document.getElementById('searchEvents');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const events = eventsList.querySelectorAll('li');
        events.forEach(event => {
            const eventText = event.textContent.toLowerCase();
            event.style.display = eventText.includes(searchTerm) ? '' : 'none';
        });
    });

    loadEvents();

    function saveEvents() {
        const events = calendar.getEvents().map(event => ({
            id: event.id,
            title: event.title,
            start: event.start.toISOString(),
            description: event.extendedProps.description
        }));
        localStorage.setItem('events', JSON.stringify(events));
    }

    function loadEvents() {
        const storedEvents = JSON.parse(localStorage.getItem('events'));
        if (storedEvents) {
            storedEvents.forEach(storedEvent => {
                const event = calendar.addEvent({
                    id: storedEvent.id,
                    title: storedEvent.title,
                    start: storedEvent.start,
                    description: storedEvent.description
                });

                const eventItem = document.createElement('li');
                eventItem.innerHTML = `
                    <div>
                        <strong>${event.title}</strong><br>
                        ${event.start.toISOString().split('T')[0]} at ${event.start.toISOString().split('T')[1].substr(0, 5)}<br>
                        ${event.extendedProps.description}
                    </div>
                    <button class="delete-btn">Delete</button>
                `;
                eventItem.dataset.eventId = event.id;
                eventsList.appendChild(eventItem);

                eventItem.querySelector('.delete-btn').addEventListener('click', function() {
                    event.remove();
                    eventItem.remove();
                    saveEvents();
                });
            });
        }
    }

    function populateTimeZones() {
        const timeZoneSelect = document.getElementById('timezone');
        const commonTimeZones = [
            'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
            'Europe/London', 'Europe/Berlin', 'Asia/Tokyo', 'Australia/Sydney'
        ];

        commonTimeZones.forEach(timeZone => {
            const option = document.createElement('option');
            option.value = timeZone;
            option.textContent = timeZone;
            timeZoneSelect.appendChild(option);
        });
    }
});