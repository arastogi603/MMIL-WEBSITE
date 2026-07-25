"use client";

import styles from "./page.module.css";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { projectsApi } from "@/lib/api/projects";
import Image from "next/image";
import InfiniteSlider from "@/components/ui/InfiniteSlider";
import gsap from "gsap";
import { useRouter } from "next/navigation";

import Lenis from 'lenis';

const mapValue = (value: number, min: number, max: number, newMin: number, newMax: number) => {
  return (value - min) / (max - min) * (newMax - newMin) + newMin;
};

export default function ProjectsClient({ initialPosts }: { initialPosts: any[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [currentPost, setCurrentPost] = useState<any | null>(initialPosts[0] || null);

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
      if (!projectRef.current || !descriptionRef.current || !sketchRef.current) return;
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
        const isCurrentPost = slug !== null && String(slug) === String(currentPostRef.current?.slug);
        const hoverClass = styles['page__project--hovered'];
        if (hoverClass) {
          projectRef.current?.classList.toggle(hoverClass, isCurrentPost);
        }
        (document.getElementById("container") as HTMLElement).style.cursor = isCurrentPost ? 'none' : 'default';
        gsap.to(followerRef.current, { opacity: isCurrentPost ? 1 : 0, duration: 0.3, ease: "power2.out" });
      },
      onClick: (slug: string) => {
        const isCurrentPost = slug !== null && String(slug) === String(currentPostRef.current?.slug);
        if (currentPostRef.current?.image && isCurrentPost) {
          handleViewMore(String(slug), currentPostRef.current.image)
        }
      }
    });

    sketchRef.current = sketch;

    const loops = 5;
    let lastScroll = window.scrollY;
    let smoothVelocity = 0;
    let smoothScroll = window.scrollY;

    const animate = () => {
      if (!sketchRef.current || isExitingRef.current) return;

      const targetScroll = window.scrollY;
      smoothScroll += (targetScroll - smoothScroll) * 0.08; // Buttery smooth interpolation

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? smoothScroll / maxScroll : 0;

      const rawVelocity = (targetScroll - lastScroll) * 0.1;
      lastScroll = targetScroll;
      smoothVelocity += (rawVelocity - smoothVelocity) * 0.1;

      const position = progress * infinitePosts.length;
      positionRef.current = position;
      const idx = ((Math.round(position)) % infinitePosts.length + infinitePosts.length) % infinitePosts.length;
      
      if (currentPostRef.current?.slug !== infinitePosts[idx].slug) {
        currentPostRef.current = infinitePosts[idx];
        setCurrentPost(infinitePosts[idx]);
      }

      const mappedVelocity = mapValue(Math.abs(smoothVelocity), 0, 15, 0, 5);
      const clampVelocity = Math.max(0, Math.min(mappedVelocity, 2));

      const minRadius = 2;
      const maxRadius = 2.5;
      
      const minSpacing = 0.8;
      const maxSpacing = 0.8;

      const minHSpacing = 1.0;
      const maxHSpacing = 1.2;

      const targetRadius = minRadius + clampVelocity * (maxRadius - minRadius);
      const targetSpacing = minSpacing + clampVelocity * (maxSpacing - minSpacing);
      const targetHSpacing = minHSpacing + clampVelocity * (maxHSpacing - minHSpacing);

      const lerpSpeed = 0.15;
      radiusRef.current += (targetRadius - radiusRef.current) * lerpSpeed;
      spacingRef.current += (targetSpacing - spacingRef.current) * lerpSpeed;
      hSpacingRef.current += (targetHSpacing - hSpacingRef.current) * lerpSpeed;

      sketchRef.current.updateMeshes(position, loops, spacingRef.current, hSpacingRef.current, radiusRef.current);
      if (sketchRef.current.getVelocity) sketchRef.current.getVelocity(smoothVelocity);
      sketchRef.current.setDeform(Math.max(-1.5, Math.min(1.5, smoothVelocity)));

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
     Home intro
  ---------------------------------- */
  useEffect(() => {
    const containerEl = document.getElementById("container");
    if (
      introPlayedRef.current ||
      !containerEl ||
      !projectRef.current ||
      !descriptionRef.current ||
      !currentPost
    ) return;
  
    introPlayedRef.current = true;
  
    gsap.set(containerEl, { y: "120vh", rotateX: -45, opacity: 0 });
    gsap.set([descriptionRef.current, projectRef.current], { opacity: 0, y: 30 });
  
    gsap.to(containerEl, {
      y: "0vh",
      rotateX: 0,
      opacity: 1,
      duration: 1.8,
      ease: "power3.inOut"
    });

    gsap.to([descriptionRef.current, projectRef.current], { 
      opacity: 1, 
      y: 0, 
      duration: 1, 
      stagger: 0.1,
      delay: 0.8
    });
  
    setTimeout(() => {
      sketchRef.current?.introAnimation();
    }, 500); 
  }, [currentPost]);

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
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const handlePreload = useCallback((imageUrl: string) => {
    const img = new window.Image();
    img.src = imageUrl;
  }, []);

  /* ----------------------------------
     Render
  ---------------------------------- */
  return (
    <div className={styles.page}>
      {/* Hero Text that scrolls away naturally */}
      <div className="absolute top-0 left-0 w-full h-[100vh] flex items-center justify-center z-50 pointer-events-none">
        <h1 
          className="hero-title text-white drop-shadow-2xl"
          style={{ WebkitTextStroke: '3px black' }}
        >
          OUR PROJECTS
        </h1>
      </div>

      <div style={{ height: `${posts.length * 100}vh` }} />

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

          <div ref={descriptionRef} className={styles.page__description} data-anim="description">
            <p>{currentPost.title} — {currentPost.basicInfo?.category || 'Tech'}</p>
          </div>

          <div
            ref={projectRef}
            className={styles.page__project}
            data-anim="project"
            onMouseEnter={() => handlePreload(currentPost.image)}
            onClick={() => handleViewMore(currentPost.slug, currentPost.image)}
          >
            <p className={`${styles.page__project__item} ${styles.page__project__title}`}>
              {currentPost.title}
            </p>
            <p className={`${styles.page__project__item} ${styles.page__project__category}`}>
              {currentPost.basicInfo.category}
            </p>
            <p className={`${styles.page__project__item} ${styles.page__project__year}`}>
              {currentPost.basicInfo.year}
            </p>
            <div className={`${styles.page__project__item} ${styles.page__project__index}`}>
              {String(posts.findIndex(p => p.id === currentPost.id) + 1).padStart(2, '0')}
            </div>
          </div>
        </>
      )}

      <div ref={followerRef} className={styles.page__follower}>[VIEW PROJECT]</div>
      <div id="container" className={styles.page__container} />
    </div>
  );
}
