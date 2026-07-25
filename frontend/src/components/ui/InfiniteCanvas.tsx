"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
// Note: InertiaPlugin will log a warning without a Club GreenSock membership,
// but it will function correctly on localhost.
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(Draggable, InertiaPlugin);

interface Project {
  id: string | number;
  title: string;
  image: string;
  tech: string[];
  [key: string]: any;
}

interface InfiniteCanvasProps {
  projects: Project[];
  onActiveIndexChange: (index: number) => void;
}

const InfiniteCanvas = ({ projects, onActiveIndexChange }: InfiniteCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasDraggedRef = useRef(false);

  useEffect(() => {
    if (!projects.length || !containerRef.current) return;

    // Use exactly the same grid structure as the original
    const rowNum = 5;
    const imgNum = 9;
    const totalCells = rowNum * imgNum;

    // Create a flat array of cell media mapped to projects
    const cellMedia = Array.from({ length: totalCells }, (_, i) => projects[i % projects.length]);

    let rowArray: HTMLDivElement[] = [];
    let imgRep: HTMLDivElement[][] = [];
    let boxWidth: number, boxHeight: number, gutter: number, horizSpacing: number, vertSpacing: number;
    let startX: number, startY: number;
    let lastCenteredElem: HTMLElement | null = null;

    const imgMidIndex = Math.floor(imgNum / 2);
    const rowMidIndex = Math.floor(rowNum / 2);

    function onMediaLoaded() {
      setIsLoading(false);
    }

    function createImageGrid() {
      const container = containerRef.current!;
      container.innerHTML = '';
      rowArray = [];
      imgRep = [];

      for (let y = 0; y < rowNum; y++) {
        const row = document.createElement('div');
        row.style.position = 'absolute';
        row.style.whiteSpace = 'nowrap';
        row.dataset.offset = y % 2 === 0 ? 'false' : 'true';
        const rowImgs: HTMLDivElement[] = [];

        for (let x = 0; x < imgNum; x++) {
          const project = cellMedia[y * imgNum + x];
          const projectIndex = (y * imgNum + x) % projects.length;
          
          const cell = document.createElement('div');
          cell.style.position = 'absolute';
          cell.style.borderRadius = '5px'; // Exact same border radius as original
          cell.style.backgroundSize = 'cover';
          cell.style.backgroundPosition = 'center';
          cell.style.cursor = 'pointer';
          cell.dataset.projectIndex = String(projectIndex);

          const img = new Image();
          img.onload = () => {
            cell.dataset.mediaW = String(img.naturalWidth);
            cell.dataset.mediaH = String(img.naturalHeight);
            resize();
          };
          img.src = project.image;
          cell.style.backgroundImage = `url(${project.image})`;
          onMediaLoaded();

          // Title element, mimicking original hover style
          const title = document.createElement('div');
          title.style.position = 'absolute';
          title.style.bottom = '10px';
          title.style.left = '10px';
          title.style.color = 'white';
          title.style.fontWeight = 'bold';
          title.style.textShadow = '0px 2px 4px rgba(0,0,0,0.8)';
          title.style.pointerEvents = 'none';
          title.textContent = `${project.title}  [${project.tech?.join(', ') ?? ''}]`;
          cell.appendChild(title);

          row.appendChild(cell);
          rowImgs.push(cell);
        }
        container.appendChild(row);
        rowArray.push(row);
        imgRep.push(rowImgs);
      }
    }

    function moveArrayIndex<T>(array: T[], oldIndex: number, newIndex: number) {
      if (newIndex >= array.length) { let k = newIndex - array.length + 1; while (k--) { array.push(undefined as unknown as T); } }
      array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
    }

    function recycleRowsUp(steps: number) {
      for (let i = 0; i < steps; i++) {
        const firstRowY = gsap.getProperty(rowArray[0], "y") as number;
        const last = rowArray[rowArray.length - 1];
        const firstIsOffset = rowArray[0].dataset.offset === "true";
        const newIsOffset = !firstIsOffset;
        gsap.set(last, {
          y: firstRowY - vertSpacing,
          x: newIsOffset ? startX - boxWidth / 2 : startX,
        });
        last.dataset.offset = String(newIsOffset);
        moveArrayIndex(rowArray, rowArray.length - 1, 0);
        moveArrayIndex(imgRep, imgRep.length - 1, 0);
      }
    }

    function recycleRowsDown(steps: number) {
      for (let i = 0; i < steps; i++) {
        const lastRowY = gsap.getProperty(rowArray[rowArray.length - 1], "y") as number;
        const first = rowArray[0];
        const lastIsOffset = rowArray[rowArray.length - 1].dataset.offset === "true";
        const newIsOffset = !lastIsOffset;
        gsap.set(first, {
          y: lastRowY + vertSpacing,
          x: newIsOffset ? startX - boxWidth / 2 : startX,
        });
        first.dataset.offset = String(newIsOffset);
        moveArrayIndex(rowArray, 0, rowArray.length - 1);
        moveArrayIndex(imgRep, 0, imgRep.length - 1);
      }
    }

    function recycleColsLeft(steps: number) {
      imgRep.forEach(row => {
        for (let i = 0; i < steps; i++) {
          const firstX = gsap.getProperty(row[0], "x") as number;
          const last = row[row.length - 1];
          gsap.set(last, { x: firstX - horizSpacing });
          moveArrayIndex(row, row.length - 1, 0);
        }
      });
    }

    function recycleColsRight(steps: number) {
      imgRep.forEach(row => {
        for (let i = 0; i < steps; i++) {
          const lastX = gsap.getProperty(row[row.length - 1], "x") as number;
          const first = row[0];
          gsap.set(first, { x: lastX + horizSpacing });
          moveArrayIndex(row, 0, row.length - 1);
        }
      });
    }

    function updateCenterElem() {
      // EXACT same logic from the repo
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      const containerX = gsap.getProperty(containerRef.current, "x") as number;
      const containerY = gsap.getProperty(containerRef.current, "y") as number;

      let bestCell: HTMLDivElement | null = null;
      let bestRow = -1, bestCol = -1;
      let bestDist = Infinity;

      imgRep.forEach((row, r) => {
        const rowEl = rowArray[r];
        const rowX = containerX + (gsap.getProperty(rowEl, "x") as number);
        const rowY = containerY + (gsap.getProperty(rowEl, "y") as number);

        row.forEach((cell, c) => {
          const cellCX = rowX + (gsap.getProperty(cell, "x") as number) + horizSpacing / 2;
          const cellCY = rowY + boxHeight / 2;
          const dist = Math.abs(cellCX - cx) + Math.abs(cellCY - cy);
          if (dist < bestDist) {
            bestDist = dist;
            bestCell = cell;
            bestRow = r;
            bestCol = c;
          }
        });
      });

      if (bestCell && bestCell !== lastCenteredElem) {
        lastCenteredElem = bestCell;

        // Broadcast to parent
        const projectIdx = parseInt(bestCell.dataset.projectIndex || '0', 10);
        onActiveIndexChange(projectIdx);

        const rDiff = bestRow - rowMidIndex;
        const cDiff = bestCol - imgMidIndex;

        if (rDiff > 0) recycleRowsDown(rDiff);
        else if (rDiff < 0) recycleRowsUp(Math.abs(rDiff));

        if (cDiff > 0) recycleColsRight(cDiff);
        else if (cDiff < 0) recycleColsLeft(Math.abs(cDiff));
      }
    }

    function resize() {
      // Exactly matching the repo's original size calculations
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      if (vh > vw) {
        boxHeight = vh * 0.15;
        boxWidth = boxHeight / 0.7;
        gutter = vw * 0.1;
      } else {
        boxWidth = vw * 0.15;
        boxHeight = boxWidth * 0.7;
        gutter = vw * 0.05;
      }
      vertSpacing = boxHeight + gutter;

      // Use the widest loaded cell to set column spacing so nothing overlaps
      let maxCellWidth = boxWidth;
      rowArray.forEach(row => {
        row.childNodes.forEach(node => {
          const cell = node as HTMLElement;
          const mw = parseFloat(cell.dataset.mediaW ?? '0');
          const mh = parseFloat(cell.dataset.mediaH ?? '0');
          if (mw && mh) {
            const w = Math.round(boxHeight * (mw / mh));
            if (w > maxCellWidth) maxCellWidth = w;
          }
        });
      });

      horizSpacing = maxCellWidth + gutter;

      startX = (vw / 2) - (imgMidIndex * horizSpacing) - (maxCellWidth / 2);
      startY = (vh / 2) - (rowMidIndex * vertSpacing) - (boxHeight / 2);

      gsap.set(containerRef.current, { x: 0, y: 0 });

      rowArray.forEach((row, i) => {
        const isOdd = i % 2 !== 0;
        gsap.set(row, {
          x: isOdd ? startX - (horizSpacing / 2) : startX,
          y: startY + (i * vertSpacing)
        });

        row.childNodes.forEach((node, idx) => {
          const cell = node as HTMLElement;
          const mw = parseFloat(cell.dataset.mediaW ?? '0');
          const mh = parseFloat(cell.dataset.mediaH ?? '0');
          const cellWidth = mw && mh ? Math.round(boxHeight * (mw / mh)) : boxWidth;
          gsap.set(cell, {
            width: cellWidth,
            height: boxHeight,
            x: idx * horizSpacing,
            y: 0,
          });
          cell.style.left = '0';
          cell.style.top  = '0';
        });
      });
      
      updateCenterElem();
    }

    createImageGrid();
    resize();

    // Use the exact GSAP Draggable logic with Inertia
    const dragger = Draggable.create(containerRef.current, {
      type: 'x,y',
      trigger: containerRef.current.parentElement!,
      inertia: true,
      onPress: () => {
        hasDraggedRef.current = false;
        gsap.killTweensOf(containerRef.current);
      },
      onDrag: () => {
        hasDraggedRef.current = true;
        updateCenterElem();
      },
      onThrowUpdate: updateCenterElem,
    });

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      gsap.killTweensOf(containerRef.current);

      const curX = gsap.getProperty(containerRef.current, "x") as number;
      const curY = gsap.getProperty(containerRef.current, "y") as number;

      gsap.set(containerRef.current, {
        x: curX - e.deltaX,
        y: curY - e.deltaY,
      });

      updateCenterElem();
    };

    const containerWrapper = containerRef.current?.parentElement;
    if (containerWrapper) {
      containerWrapper.addEventListener('wheel', handleWheel, { passive: false });
    }

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      if (containerWrapper) {
        containerWrapper.removeEventListener('wheel', handleWheel);
      }
      if (dragger[0]) {
        dragger[0].kill();
      }
    };
  }, [projects, onActiveIndexChange]);

  return (
    <div style={{ overflow: 'hidden', width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="w-12 h-12 border-4 border-[var(--border)] border-t-[var(--text-primary)] rounded-full animate-spin" />
        </div>
      )}
      <div 
        ref={containerRef} 
        style={{ position: 'relative', width: '100%', height: '100%', willChange: 'transform' }} 
      />
    </div>
  );
};

export default InfiniteCanvas;
