import { projectsApi } from "@/lib/api/projects";
import ProjectsClient from "./ProjectsClient";

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  let mapped = [];
  try {
    const data = await projectsApi.getPublicProjects();
    const arr = Array.isArray(data) ? data : (data?.data || []);
    mapped = arr.map((d: any) => ({
      ...d,
      id: d.id,
      slug: d.slug || d.id,
      title: d.title,
      mainImage: d.thumbnailImage || d.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070',
      image: d.thumbnailImage || d.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070',
      basicInfo: {
        category: d.technologies && d.technologies.length > 0 ? d.technologies.join(', ') : 'Tech',
        year: d.createdAt ? new Date(d.createdAt).getFullYear().toString() : '2026'
      }
    }));
  } catch (e) {
    console.error(e);
  }

  const coverProject = {
    id: 'intro-cover',
    slug: 'intro',
    title: '',
    image: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2000',
    basicInfo: { category: '', year: '' }
  };

  mapped = [coverProject, ...mapped];

  // Pad with mock projects until there are 20 real projects (21 items including cover)
  if (mapped.length < 21) {
    const remaining = 21 - mapped.length;
    const mocks = Array.from({ length: remaining }, (_, i) => ({
      id: `mock-${i}`,
      slug: `mock-${i}`,
      title: `Project ${mapped.length + i}`,
      image: `https://picsum.photos/seed/${mapped.length + i}/800/800`,
      basicInfo: { category: 'Design', year: '2026' }
    }));
    mapped = [...mapped, ...mocks];
  }

  return <ProjectsClient initialPosts={mapped} />;
}
