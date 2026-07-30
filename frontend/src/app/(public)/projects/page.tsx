import { projectsApi } from "@/lib/api/projects";
import ProjectsClient from "./ProjectsClient";

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  let mapped = [];
  try {
    const data: any = await projectsApi.getPublicProjects();
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

  // The 3D Infinite Slider requires a minimum of ~20 items to form a complete circle.
  // Instead of using fake mock projects, we simply repeat your REAL projects to fill the circle!
  const originalProjects = mapped.slice(1); // Exclude the cover project
  
  if (originalProjects.length === 0) {
    // Fallback if the database has absolutely 0 projects, so the slider doesn't crash
    mapped.push({
      id: 'coming-soon',
      slug: 'coming-soon',
      title: 'Coming Soon',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070',
      basicInfo: { category: 'Tech', year: new Date().getFullYear().toString() }
    });
  }

  const projectsToRepeat = mapped.slice(1);
  if (mapped.length < 21) {
    let copyIndex = 0;
    while (mapped.length < 21) {
      const padding = projectsToRepeat.map((p) => ({
        ...p,
        id: `${p.id}-copy-${copyIndex++}`, // Ensure unique React keys
      }));
      mapped = [...mapped, ...padding];
    }
    // Trim exactly to 21 items in case we overshot
    mapped = mapped.slice(0, 21);
  }
  return <ProjectsClient initialPosts={mapped} />;
}
