import fs from "fs";
import path from "path";
import GalleryClient from "./GalleryClient";

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  let imageUrls: string[] = [];

  try {
    // Read the galleryimages folder directly from the server filesystem!
    const galleryPath = path.join(process.cwd(), "public", "galleryimages");
    
    if (fs.existsSync(galleryPath)) {
      const files = fs.readdirSync(galleryPath);
      
      // Filter out only image files
      const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext);
      });

      // Map to the public URL paths
      imageUrls = imageFiles.map(file => `/galleryimages/${file}`);
    }
  } catch (error) {
    console.error("Error reading gallery images:", error);
  }

  // Fallback to placeholders if the folder is empty or couldn't be read
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
