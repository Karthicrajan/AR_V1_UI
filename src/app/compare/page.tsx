'use client';

import PdfAccordion from '../../components/PdfAccordion';
import ExcelViewerClient from '../../components/ExcelViewerClient';
import React, { useState, useRef, useEffect } from 'react';

const ComparePage = () => {
  const [leftWidth, setLeftWidth] = useState(33); // Initial width in percentage
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Limit the width between 20% and 80%
    if (newLeftWidth >= 20 && newLeftWidth <= 80) {
      setLeftWidth(newLeftWidth);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex h-screen w-full">
      {/* Left: PDF Section */}
      <div 
        className="h-full overflow-auto p-4 bg-gray-50 border-r"
        style={{ width: `${leftWidth}%` }}
      >
        <PdfAccordion />
      </div>

      {/* Resizable Divider */}
      <div
        className="w-1 h-full bg-gray-200 hover:bg-blue-500 cursor-col-resize"
        onMouseDown={handleMouseDown}
      />

      {/* Right: Excel Section */}
      <div 
        className="h-full overflow-auto p-4 bg-white"
        style={{ width: `${100 - leftWidth}%` }}
      >
        <ExcelViewerClient />
      </div>
    </div>
  );
};

export default ComparePage; 