// Shared mock tasks data - used by both Activities tab and Home dashboard
// All dates use ISO 8601 format (YYYY-MM-DD) and are set to 2026
export const mockTodayTasks = [
  { id: 1, title: 'Review project proposals', status: 'pending', time: '09:00 AM', date: '2026-01-03' },
  { id: 2, title: 'Team standup meeting', status: 'completed', time: '10:00 AM', date: '2026-01-03' },
  { id: 3, title: 'Code review', status: 'pending', time: '02:00 PM', date: '2026-01-03' },
  { id: 4, title: 'Workout', status: 'pending', time: '06:00 PM', date: '2026-01-03' },
]

export const mockWeeklyTasks = [
  { id: 5, title: 'Finish quarterly report', status: 'in-progress', dueDate: '2026-01-05' },
  { id: 6, title: 'Update documentation', status: 'pending', dueDate: '2026-01-07' },
  { id: 7, title: 'Review pull requests', status: 'completed', dueDate: '2026-01-02' },
]

export default {
  todayTasks: mockTodayTasks,
  weeklyTasks: mockWeeklyTasks,
}
