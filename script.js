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
});

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



























// document.addEventListener('DOMContentLoaded', function() {
//     var calendarEl = document.getElementById('calendar');
//     var calendar = new FullCalendar.Calendar(calendarEl, {
//         initialView: 'dayGridMonth',
//         height: 'auto',
//         events: []
//     });
//     calendar.render();

//     populateTimeZones();

//     const darkModeToggle = document.getElementById('darkModeToggle');
//     darkModeToggle.addEventListener('change', () => {
//         document.body.classList.toggle('dark-mode');
//         localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
//     });

//     // if (localStorage.getItem('darkMode') === 'true') {
//     //     document.body.classList.add('dark-mode');
//     //     darkModeToggle.checked = true;
//     // }

//     const schedulerForm = document.getElementById('schedulerForm');
//     const eventsList = document.getElementById('eventsList');

//     schedulerForm.addEventListener('submit', (e) => {
//         e.preventDefault();

//         const title = document.getElementById('title').value;
//         const date = document.getElementById('date').value;
//         const time = document.getElementById('time').value;
//         const timezone = document.getElementById('timezone').value;
//         const description = document.getElementById('description').value;

//         const eventItem = document.createElement('li');
//         eventItem.innerHTML = `
//             <div>
//                 <strong>${title}</strong><br>
//                 ${date} at ${time} (${timezone})<br>
//                 ${description}
//             </div>
//             <button class="delete-btn">Delete</button>
//         `;
//         eventsList.appendChild(eventItem);

//         eventItem.querySelector('.delete-btn').addEventListener('click', function() {
//             eventItem.remove();
//             // updateNextEventCountdown();
//             saveEvents();
//         });

//         calendar.addEvent({
//             title,
//             start: `${date}T${time}`,
//             description
//         });

//         schedulerForm.reset();

//         // updateNextEventCountdown();
//         saveEvents();
//     });

//     const exportPdfButton = document.getElementById('exportPdfButton');
//     exportPdfButton.addEventListener('click', () => {
//         const { jsPDF } = window.jspdf;
//         const doc = new jsPDF();

//         doc.text('Scheduled Events', 10, 10);

//         const items = eventsList.querySelectorAll('li');
//         items.forEach((item, index) => {
//             const text = item.textContent.replace('Delete', '').trim();
//             const lines = doc.splitTextToSize(text, 180);
//             doc.text(lines, 10, 20 + (30 * index));
//         });

//         doc.save('conference-schedule.pdf');
//     });

//     const searchInput = document.getElementById('searchEvents');
//     searchInput.addEventListener('input', function() {
//         const searchTerm = this.value.toLowerCase();
//         const events = eventsList.querySelectorAll('li');
//         events.forEach(event => {
//             const eventText = event.textContent.toLowerCase();
//             event.style.display = eventText.includes(searchTerm) ? '' : 'none';
//         });
//     });

//     loadEvents();
//     // updateNextEventCountdown();
// });

// function populateTimeZones() {
//     const timeZoneSelect = document.getElementById('timezone');
//     const commonTimeZones = [
//         'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
//         'Europe/London', 'Europe/Berlin', 'Asia/Tokyo', 'Australia/Sydney'
//     ];

//     commonTimeZones.forEach(timeZone => {
//         const option = document.createElement('option');
//         option.value = timeZone;
//         option.textContent = timeZone;
//         timeZoneSelect.appendChild(option);
//     });
// }

// // function updateNextEventCountdown() {
// //     const events = document.querySelectorAll('#eventsList li');
// //     let nextEvent = null;
// //     let smallestDiff = Infinity;

// //     events.forEach(event => {
// //         const eventText = event.textContent;
// //         const dateTimeMatch = eventText.match(/(\d{4}-\d{2}-\d{2}) at (\d{2}:\d{2})/);
// //         if (dateTimeMatch) {
// //             const eventDate = new Date(`${dateTimeMatch[1]}T${dateTimeMatch[2]}`);
// //             const diff = eventDate - new Date();
// //             if (diff > 0 && diff < smallestDiff) {
// //                 smallestDiff = diff;
// //                 nextEvent = eventDate;
// //             }
// //         }
// //     });

// //     const countdownElement = document.getElementById('countdown');
// //     if (nextEvent) {
// //         clearInterval(window.countdownInterval);
// //         window.countdownInterval = setInterval(updateCountdown, 1000);
// //         updateCountdown();
// //     } else {
// //         countdownElement.textContent = 'No upcoming events';
// //         clearInterval(window.countdownInterval);
// //     }

// //     function updateCountdown() {
// //         const now = new Date();
// //         const diff = nextEvent - now;
// //         if (diff > 0) {
// //             const days = Math.floor(diff / (1000 * 60 * 60 * 24));
// //             const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
// //             const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
// //             const seconds = Math.floor((diff % (1000 * 60)) / 1000);

// //             countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
// //         } else {
// //             countdownElement.textContent = 'Event started';
// //             clearInterval(window.countdownInterval);
// //             updateNextEventCountdown();
// //         }
// //     }
// // }

// // function saveEvents() {
// //     const events = document.querySelectorAll('#eventsList li');
// //     const eventsData = Array.from(events).map(event => event.innerHTML);
// //     localStorage.setItem('scheduledEvents', JSON.stringify(eventsData));
// // }

// // function loadEvents() {
// //     const eventsList = document.getElementById('eventsList');
// //     const savedEvents = JSON.parse(localStorage.getItem('scheduledEvents')) || [];
// //     savedEvents.forEach(eventData => {
// //         const eventItem = document.createElement('li');
// //         eventItem.innerHTML = eventData;
// //         eventsList.appendChild(eventItem);

// //         eventItem.querySelector('.delete-btn').addEventListener('click', function() {
// //             eventItem.remove();
// //             updateNextEventCountdown();
// //             saveEvents();
// //         });
// //     });
// // }