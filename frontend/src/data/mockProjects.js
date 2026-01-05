// Shared mock projects data - used by both Projects tab and Home dashboard
export const mockProjects = [
  {
    id: 1,
    name: 'Personal Dashboard',
    description: 'Building a comprehensive personal life dashboard with React, Electron, and Python Flask. Includes task management, calendar integration, health tracking, and music analytics.',
    nextStep: 'Implement backend API integration for data persistence',
    link: 'C:\\Users\\Michael Larson\\Obsidian\\Projects\\Dashboard-App.md',
    isMain: true,
    status: 'active',
    progress: 65,
    createdAt: '2025-12-01', // ISO 8601 format
    tags: ['Development', 'Personal'],
  },
  {
    id: 2,
    name: 'Machine Learning Course',
    description: 'Completing Stanford\'s Machine Learning specialization. Working through neural networks and deep learning concepts.',
    nextStep: 'Complete Week 5 assignments on backpropagation',
    link: 'C:\\Users\\Michael Larson\\Obsidian\\Projects\\ML-Course.md',
    isMain: false,
    status: 'active',
    progress: 40,
    createdAt: '2025-09-12',
    tags: ['Education', 'AI'],
  },
  {
    id: 3,
    name: 'Home Automation',
    description: 'Smart home system using Raspberry Pi and Home Assistant. Integrating lights, sensors, and climate control.',
    nextStep: 'Set up motion sensors in living room',
    link: 'C:\\Users\\Michael Larson\\Obsidian\\Projects\\Home-Automation.md',
    isMain: false,
    status: 'planning',
    progress: 15,
    createdAt: '2025-11-20',
    tags: ['Personal', 'IoT'],
  },
  {
    id: 4,
    name: 'Personal Website',
    description: 'Portfolio website showcasing projects and blog posts. Built with Next.js and deployed on Vercel.',
    nextStep: 'Write blog post about React hooks',
    link: 'C:\\Users\\Michael Larson\\Obsidian\\Projects\\Personal-Website.md',
    isMain: false,
    status: 'active',
    progress: 55,
    createdAt: '2025-10-05',
    tags: ['Development', 'Personal'],
  },
]

export const getActiveProjects = () => {
  return mockProjects.filter(p => p.status === 'active')
}

export default mockProjects
