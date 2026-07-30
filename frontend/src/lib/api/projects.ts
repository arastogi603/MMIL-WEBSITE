import { apiClient } from './client';

export const REAL_PROJECTS = [
  {
    id: 'voxtrace-ai',
    slug: 'voxtrace-ai',
    title: 'VoxTrace.AI',
    description: 'AI Calls. Automatic Insights. Zero Friction. Delivering automated AI calling, real-time voice analytics, and seamless conversation tracing.',
    liveDemoUrl: 'https://voxtraceai.vercel.app/',
    repositoryUrl: 'https://github.com',
    thumbnailImage: '/images/projects/VoxTrace.jpg',
    image: '/images/projects/VoxTrace.jpg',
    technologies: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Python'],
    submittedByName: 'VoxTrace Team',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'vaultmeet',
    slug: 'vaultmeet',
    title: 'VaultMeet',
    description: 'Host & Join Events in a 2D Virtual World. Revolutionary spatial event platform for hackathons, workshops, and tech expos with real-time avatar interaction.',
    liveDemoUrl: 'https://www.vaultmeet.in/',
    repositoryUrl: 'https://github.com/KuldeepPandit75',
    thumbnailImage: '/images/projects/vaultMeet.jpg',
    image: '/images/projects/vaultMeet.jpg',
    technologies: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'WebRTC'],
    submittedByName: 'Kuldeep Kumar Pandit',
    createdAt: '2026-02-10T00:00:00.000Z'
  },
  {
    id: 'clientflow',
    slug: 'clientflow',
    title: 'ClientFlow',
    description: 'Connect WhatsApp and manage live chats from one unified inbox. Multi-agent customer messaging MVP powered by Evolution API and QR code device connection.',
    liveDemoUrl: 'https://client-flow-sage.vercel.app/landing',
    repositoryUrl: 'https://github.com',
    thumbnailImage: '/images/projects/ClientFlow.jpg',
    image: '/images/projects/ClientFlow.jpg',
    technologies: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Node.js'],
    submittedByName: 'ClientFlow Team',
    createdAt: '2026-03-01T00:00:00.000Z'
  },
  {
    id: 'vaultrade',
    slug: 'vaultrade',
    title: 'VaulTrade',
    description: 'Modern Fintech trading platform featuring live TradingView chart widgets, Razorpay payment gateway integration, Google Auth, and market portfolio tracking.',
    liveDemoUrl: 'https://vault-trade-omega.vercel.app/login',
    repositoryUrl: 'https://github.com',
    thumbnailImage: '/images/projects/vaultTrade.jpg',
    image: '/images/projects/vaultTrade.jpg',
    technologies: ['React', 'Tailwind CSS', 'Firebase', 'JavaScript'],
    submittedByName: 'VaulTrade Team',
    createdAt: '2026-03-12T00:00:00.000Z'
  },
  {
    id: 'tech-taste-foods',
    slug: 'tech-taste-foods',
    title: 'Tech Taste Foods',
    description: 'Online food ordering and catering platform built with React, Cloudinary media optimization, and intuitive web checkout user experience.',
    liveDemoUrl: 'https://techtastefoods.com',
    repositoryUrl: 'https://github.com',
    thumbnailImage: '/images/projects/teachTasteFoods.jpg',
    image: '/images/projects/teachTasteFoods.jpg',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    submittedByName: 'Tech Taste Foods Team',
    createdAt: '2026-04-05T00:00:00.000Z'
  },
  {
    id: 'parthdev-portfolio',
    slug: 'parthdev-portfolio',
    title: 'Parth.Dev Portfolio',
    description: 'Modern interactive developer portfolio showcasing full-stack web applications, UI/UX designs, animations, and software engineering projects.',
    liveDemoUrl: 'https://parthdev-portfolio.vercel.app/',
    repositoryUrl: 'https://github.com',
    thumbnailImage: '/images/projects/portfolioParth.jpg',
    image: '/images/projects/portfolioParth.jpg',
    technologies: ['React', 'JavaScript', 'Tailwind CSS', 'HTML'],
    submittedByName: 'Parth',
    createdAt: '2026-04-20T00:00:00.000Z'
  },
  {
    id: 'kuldeep-pandit-portfolio',
    slug: 'kuldeep-pandit-portfolio',
    title: 'Kuldeep K Pandit Portfolio',
    description: 'Personal developer portfolio highlighting full stack web applications, spatial virtual world platforms, and data science engineering projects.',
    liveDemoUrl: 'https://kuldeepandit-portfolio.vercel.app/',
    repositoryUrl: 'https://github.com/kuldeeppandit75',
    thumbnailImage: '/images/projects/PortfolioKuldeep.jpg',
    image: '/images/projects/PortfolioKuldeep.jpg',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Python'],
    submittedByName: 'Kuldeep K Pandit',
    createdAt: '2026-05-01T00:00:00.000Z'
  },
  {
    id: 'study-smart',
    slug: 'study-smart',
    title: 'Study Smart',
    description: 'Study Smart is an Android app designed to help students efficiently manage study schedules by organizing tasks, setting priority due dates, and tracking study sessions with an integrated timer.',
    liveDemoUrl: 'https://github.com/vaishnavgupta/Study-Smart',
    repositoryUrl: 'https://github.com/vaishnavgupta/Study-Smart',
    thumbnailImage: '/images/projects/studySmart.jpg',
    image: '/images/projects/studySmart.jpg',
    technologies: ['Android', 'Kotlin', 'Jetpack Compose', 'Mobile'],
    submittedByName: 'Vaishnav Gupta',
    createdAt: '2026-05-15T00:00:00.000Z'
  },
  {
    id: 'guardian-safety-app',
    slug: 'guardian-safety-app',
    title: 'Guardian Safety App',
    description: 'Guardian is an emergency safety Android application providing instant SOS alerts, real-time location sharing, and emergency ambient audio recording to empower users in critical situations.',
    liveDemoUrl: 'https://github.com/vaishnavgupta/Guardian-The-Safety-App',
    repositoryUrl: 'https://github.com/vaishnavgupta/Guardian-The-Safety-App',
    thumbnailImage: '/images/projects/guardianSafety.jpg',
    image: '/images/projects/guardianSafety.jpg',
    technologies: ['Android', 'Kotlin', 'Firebase', 'Mobile'],
    submittedByName: 'Vaishnav Gupta',
    createdAt: '2026-06-01T00:00:00.000Z'
  }
];

export const projectsApi = {
  getPublicProjects: async () => {
    try {
      const response = await apiClient.get('/projects');
      const data = response.data || [];
      if (Array.isArray(data) && data.length > 0) return data;
      return REAL_PROJECTS;
    } catch (error) {
      console.warn("Failed to fetch public projects, returning real projects fallback:", error);
      return REAL_PROJECTS;
    }
  },
  getProjectBySlug: async (slug: string) => {
    try {
      const response = await apiClient.get(`/projects/${slug}`);
      if (response.data) return response.data;
    } catch (error) {
      console.warn(`Failed to fetch project by slug (${slug}):`, error);
    }
    return REAL_PROJECTS.find(p => p.slug === slug || p.id === slug) || null;
  },
  getAllProjects: async () => {
    try {
      const response = await apiClient.get('/projects/all');
      const data = response.data || [];
      if (Array.isArray(data) && data.length > 0) return data;
      return REAL_PROJECTS;
    } catch (error) {
      console.warn("Failed to fetch all projects, returning real projects fallback:", error);
      return REAL_PROJECTS;
    }
  },
  updateStatus: async (slug: string, status: string) => {
    const response = await apiClient.post(`/projects/${slug}/status`, null, {
      params: { status }
    });
    return response.data;
  }
};


