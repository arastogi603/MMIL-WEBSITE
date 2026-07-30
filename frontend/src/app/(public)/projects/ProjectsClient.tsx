"use client";

import styles from "./page.module.css";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { projectsApi } from "@/lib/api/projects";
import Image from "next/image";
import InfiniteSlider from "@/components/ui/InfiniteSlider";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/theme/theme";
import { Code, Server, Smartphone, Globe, Cpu, Palette, Database, Hexagon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Lenis from 'lenis';

const getCategoryIcon = (category: string) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('web3') || cat.includes('blockchain') || cat.includes('crypto')) return <Hexagon size={18} />;
  if (cat.includes('front') || cat.includes('ui') || cat.includes('design')) return <Palette size={18} />;
  if (cat.includes('back') || cat.includes('api') || cat.includes('server')) return <Server size={18} />;
  if (cat.includes('mobile') || cat.includes('app') || cat.includes('android') || cat.includes('ios')) return <Smartphone size={18} />;
  if (cat.includes('data') || cat.includes('db')) return <Database size={18} />;
  if (cat.includes('ai') || cat.includes('ml') || cat.includes('model')) return <Cpu size={18} />;
  if (cat.includes('web') || cat.includes('site')) return <Globe size={18} />;
  return <Code size={18} />;
};

const mapValue = (value: number, min: number, max: number, newMin: number, newMax: number) => {
  return (value - min) / (max - min) * (newMax - newMin) + newMin;
};

export default function ProjectsClient({ initialPosts }: { initialPosts: any[] }) {
  const router = useRouter();
  const { theme } = useTheme();
  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [currentPost, setCurrentPost] = useState<any | null>(initialPosts[0] || null);
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);

  // Lenis is removed in favor of our custom WebGL scroll lerping loop

  const sketchRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const radiusRef = useRef(3);
  const positionRef = useRef(0);
  const spacingRef = useRef(0.8);
  const hSpacingRef = useRef(1.0);

  const bgRef1 = useRef<HTMLDivElement>(null);
  const bgRef2 = useRef<HTMLDivElement>(null);
  const bgRefs = [bgRef1, bgRef2];
  const [bgImages, setBgImages] = useState<[string, string]>(["", ""]);
  const activeBgRef = useRef<0 | 1>(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  const currentPostRef = useRef<any | null>(null);
  const introPlayedRef = useRef(false);
  const isExitingRef = useRef(false);


  /* ----------------------------------
     Exit transition
  ---------------------------------- */
  const handleViewMore = useCallback(
    (slug: string, imageUrl: string) => {
      if (!sketchRef.current) return;
      isExitingRef.current = true;
      const img = new window.Image();
      img.onload = () => {
        sketchRef.current!.exitAnimation(positionRef.current, () => {
          router.push(`/projects/${slug}`);
        });
      };
      img.src = imageUrl;
    },
    [router]
  );

  const infinitePosts = useMemo(() => posts, [posts]);

  const heroTitleRef = useRef<HTMLDivElement>(null);

  /* ----------------------------------
     Init 3D Slider
  ---------------------------------- */
  useEffect(() => {
    if (infinitePosts.length === 0) return;

    const sketch = new InfiniteSlider({
      dom: document.getElementById("container") as HTMLElement,
      images: infinitePosts,
      router: router,
      onHover: (slug: string | null) => {
        if (slug !== null && slug !== undefined) {
          const found = infinitePosts.find(
            (p) => String(p.slug) === String(slug) || String(p.id) === String(slug)
          );
          if (found) {
            setHoveredTitle(found.title);
          } else {
            setHoveredTitle(null);
          }
        } else {
          setHoveredTitle(null);
        }
      },
      onClick: (slug: string) => {
        const isCurrentPost = slug !== null && String(slug) === String(currentPostRef.current?.slug);
        if (currentPostRef.current?.image && isCurrentPost) {
          handleViewMore(String(slug), currentPostRef.current.image)
        }
      }
    });

    sketchRef.current = sketch;

    const loops = 2;
    let lastScroll = window.scrollY;
    let smoothVelocity = 0;
    let smoothScroll = window.scrollY;

    const animate = () => {
      if (!sketchRef.current || isExitingRef.current) return;

      const targetScroll = window.scrollY;
      smoothScroll += (targetScroll - smoothScroll) * 0.05;

      const heroHeight = window.innerHeight;

      // Cards fade IN starting at heroHeight*0.4 (overlap with hero fade for no blank gap)
      const enterThreshold = heroHeight * 0.4;
      const enterFadeRange = heroHeight * 0.25;
      const enterProgress = smoothScroll < enterThreshold
        ? 0
        : Math.max(0, Math.min(1, (smoothScroll - enterThreshold) / enterFadeRange));

      // 3D Canvas: always stays fully visible once entered — no fade at end
      const containerEl = document.getElementById("container");
      if (containerEl) {
        if (enterProgress > 0.01) {
          containerEl.style.visibility = "visible";
          containerEl.style.opacity = String(enterProgress);
          containerEl.style.transform = `translateY(${(1 - enterProgress) * 25}vh)`;
          containerEl.style.pointerEvents = enterProgress > 0.9 ? "auto" : "none";
        } else {
          containerEl.style.visibility = "hidden";
          containerEl.style.opacity = "0";
          containerEl.style.transform = "none";
          containerEl.style.pointerEvents = "none";
        }
      }

      // Project info overlay fades in with the 3D canvas
      if (projectRef.current) {
        projectRef.current.style.opacity = String(Math.min(1, enterProgress * 1.5));
        projectRef.current.style.pointerEvents = enterProgress > 0.9 ? "auto" : "none";
      }

      // Hero title fades out — cards start fading in slightly before it disappears (no gap)
      if (heroTitleRef.current) {
        const heroFade = Math.max(0, 1 - smoothScroll / (heroHeight * 0.5));
        heroTitleRef.current.style.opacity = String(heroFade);
        heroTitleRef.current.style.transform = `translateY(${-smoothScroll * 0.3}px)`;
        heroTitleRef.current.style.display = heroFade <= 0.01 ? "none" : "flex";
      }

      const galleryScroll = Math.max(0, smoothScroll - heroHeight * 0.2);
      const maxGalleryScroll = Math.max(1, (posts.length * 150 * heroHeight / 100) - heroHeight * 0.2);
      const progress = (galleryScroll / maxGalleryScroll) * infinitePosts.length;

      positionRef.current = progress;
      const idx = ((Math.round(progress)) % infinitePosts.length + infinitePosts.length) % infinitePosts.length;

      if (currentPostRef.current?.slug !== infinitePosts[idx].slug) {
        currentPostRef.current = infinitePosts[idx];
        setCurrentPost(infinitePosts[idx]);
      }

      const mappedVelocity = mapValue(Math.abs(smoothVelocity), 0, 15, 0, 5);
      const clampVelocity = Math.max(0, Math.min(mappedVelocity, 1.5));

      // Tight, cohesive radius and spacing for clean 3D spiral layout
      const minRadius = 2.2;
      const maxRadius = 2.5;

      const minSpacing = 0.80;
      const maxSpacing = 0.80;

      const minHSpacing = 0.95;
      const maxHSpacing = 1.05;

      const targetRadius = minRadius + clampVelocity * (maxRadius - minRadius);
      const targetSpacing = minSpacing + clampVelocity * (maxSpacing - minSpacing);
      const targetHSpacing = minHSpacing + clampVelocity * (maxHSpacing - minHSpacing);

      const lerpSpeed = 0.08;
      radiusRef.current += (targetRadius - radiusRef.current) * lerpSpeed;
      spacingRef.current += (targetSpacing - spacingRef.current) * lerpSpeed;
      hSpacingRef.current += (targetHSpacing - hSpacingRef.current) * lerpSpeed;

      sketchRef.current.updateMeshes(progress, loops, spacingRef.current, hSpacingRef.current, radiusRef.current);
      if (sketchRef.current.getVelocity) sketchRef.current.getVelocity(smoothVelocity);
      sketchRef.current.setDeform(Math.max(-0.4, Math.min(0.4, smoothVelocity)));

      const rawVelocity = (targetScroll - lastScroll) * 0.02;
      lastScroll = targetScroll;
      smoothVelocity += (rawVelocity - smoothVelocity) * 0.08;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (sketchRef.current) sketchRef.current.destroy();
      sketchRef.current = null;
    };

  }, [infinitePosts, handleViewMore, router]);

  /* ----------------------------------
     Background crossfade
  ---------------------------------- */
  useEffect(() => {
    if (!currentPost) return;

    const nextImageUrl = currentPost.image;
    const img = new window.Image();

    img.onload = () => {
      const activeBg = activeBgRef.current;
      const nextBg = (1 - activeBg) as 0 | 1;

      setBgImages((prev) => {
        const copy: [string, string] = [...prev];
        copy[nextBg] = nextImageUrl;
        return copy;
      });

      const fadeInEl = bgRefs[nextBg].current;
      const fadeOutEl = bgRefs[activeBg].current;
      if (!fadeInEl || !fadeOutEl) return;

      gsap.killTweensOf([fadeInEl, fadeOutEl]);
      gsap.set(fadeInEl, { opacity: 0 });
      gsap.to(fadeInEl, { opacity: 1, duration: 0.8, ease: "power2.out" });
      gsap.to(fadeOutEl, { opacity: 0, duration: 0.8, ease: "power2.out" });

      activeBgRef.current = nextBg;
    };

    img.src = nextImageUrl;
  }, [currentPost]);

  useEffect(() => {
    gsap.set(followerRef.current, { xPercent: -50, yPercent: -50, x: -999, y: -999 });
    const onMouseMove = (e: MouseEvent) => {
      gsap.to(followerRef.current, { x: e.clientX, y: e.clientY, duration: 0.4, ease: "power2.out", overwrite: "auto" });
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.body.style.cursor = '';
    };
  }, []);

  const handlePreload = useCallback((imageUrl: string) => {
    const img = new window.Image();
    img.src = imageUrl;
  }, []);

  /* ----------------------------------
     Render
  ---------------------------------- */
  return (
    <div className={styles.page} style={{ color: '#fff' }}>
      {/* Hero Text that scrolls away naturally */}
      <div ref={heroTitleRef} className="fixed top-0 left-0 w-full h-[100vh] flex items-center justify-center z-50 pointer-events-none transition-all duration-75">
        <h1
          className="hero-title drop-shadow-2xl"
          style={{
            color: '#fff',
            WebkitTextFillColor: '#fff',
            WebkitTextStroke: '0px',
            fontFamily: "var(--font-josefin), sans-serif",
            fontSize: "clamp(4rem, 15vw, 12rem)",
            fontWeight: 900,
            whiteSpace: "nowrap"
          }}
        >
          OUR PROJECTS
        </h1>
      </div>

      <div style={{ height: `${posts.length * 150}vh` }} />

      <div className={styles.page__wrap}>
        {infinitePosts.map((post, index) => (
          <div key={`${post.id}-${index}`} className="n">
            <img
              className="gallery-images"
              data-slug={post.slug}
              src={post.image}
              alt={post.title}
              width={800}
              height={800}
            />
          </div>
        ))}
      </div>

      {currentPost && (
        <>
          <div ref={wrapperRef} className={styles.page__wrapper}>
            {bgImages.map((img, i) => (
              <div
                key={i}
                ref={bgRefs[i]}
                className={styles.page__wrapper__bg}
                data-anim="bg"
                style={{ backgroundImage: img ? `url(${img})` : "none" }}
              />
            ))}
          </div>
          <div ref={overlayRef} className={styles.page__overlay} />
        </>
      )}

      {/* Hovered Project Title on Left Side - Minimal & Clean */}
      <AnimatePresence>
        {hoveredTitle && (
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-8 md:left-14 top-1/2 -translate-y-1/2 z-40 pointer-events-none max-w-sm md:max-w-md"
          >
            <p className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-lg">
              {hoveredTitle}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div id="container" className={styles.page__container} />
    </div>
  );
}
