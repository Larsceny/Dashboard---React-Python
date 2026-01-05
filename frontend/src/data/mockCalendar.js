// Shared mock calendar data - used by both Calendar tab and Home dashboard
export const mockEvents = {
  '2026-01-03': [
    { id: 1, title: 'Team Meeting', time: '10:00 AM - 11:00 AM', type: 'work', location: 'Conference Room A' },
    { id: 2, title: 'Lunch with Client', time: '12:30 PM - 1:30 PM', type: 'meeting', location: 'Downtown Café' },
    { id: 3, title: 'Project Review', time: '3:00 PM - 4:00 PM', type: 'work', location: 'Online' },
  ],
  '2026-01-04': [
    { id: 4, title: 'Morning Standup', time: '9:00 AM - 9:15 AM', type: 'work', location: 'Online' },
    { id: 5, title: 'Code Review Session', time: '10:30 AM - 11:30 AM', type: 'work', location: 'Conference Room B' },
    { id: 6, title: 'Lunch Break', time: '12:00 PM - 1:00 PM', type: 'personal', location: 'Local Restaurant' },
    { id: 7, title: 'Doctor Appointment', time: '2:00 PM - 3:00 PM', type: 'personal', location: 'Main Street Medical' },
    { id: 8, title: 'Sprint Planning', time: '3:30 PM - 4:30 PM', type: 'work', location: 'Online' },
    { id: 9, title: 'Gym Workout', time: '6:00 PM - 7:00 PM', type: 'personal', location: 'Fitness Center' },
  ],
  '2026-01-05': [
    { id: 5, title: 'Team Standup', time: '9:00 AM - 9:30 AM', type: 'work', location: 'Online' },
    { id: 6, title: 'Gym Session', time: '6:00 PM - 7:00 PM', type: 'personal', location: 'City Gym' },
  ],
}

export const getTodayEvents = () => {
  const today = new Date().toISOString().split('T')[0]
  return mockEvents[today] || []
}

export default mockEvents
