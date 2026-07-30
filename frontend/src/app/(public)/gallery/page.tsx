import fs from "fs";
import path from "path";
import GalleryClient from "./GalleryClient";

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  let imageUrls: string[] = [];

  try {
    const possibleLocations = [
      { disk: path.join(process.cwd(), "public", "images", "gallery"), urlPrefix: "/images/gallery" },
      { disk: path.join(process.cwd(), "public", "images", "galleryimages"), urlPrefix: "/images/galleryimages" },
      { disk: path.join(process.cwd(), "public", "gallery"), urlPrefix: "/gallery" },
      { disk: path.join(process.cwd(), "public", "galleryimages"), urlPrefix: "/galleryimages" },
    ];

    for (const loc of possibleLocations) {
      if (fs.existsSync(loc.disk)) {
        const files = fs.readdirSync(loc.disk);
        const imageFiles = files.filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext);
        });

        if (imageFiles.length > 0) {
          imageUrls = imageFiles.map(file => `${loc.urlPrefix}/${file}`);
          break;
        }
      }
    }
  } catch (error) {
    console.error("Error reading gallery images:", error);
  }

  if (imageUrls.length === 0) {
    imageUrls = [
      "https://images.unsplash.com/photo-1755331039789-7e5680e26e8f?q=80&w=774&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1755569309049-98410b94f66d?q=80&w=772&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1755497595318-7e5e3523854f?q=80&w=774&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1755353985163-c2a0fe5ac3d8?q=80&w=774&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1745965976680-d00be7dc0377?q=80&w=774&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1752588975228-21f44630bb3c?q=80&w=774&auto=format&fit=crop"
    ];
  }

  return <GalleryClient imageUrls={imageUrls} />;
}

