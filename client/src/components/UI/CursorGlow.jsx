import { useEffect, useState, useRef } from 'react';

export function CursorGlow() {
  const cursorRef = useRef(null);
  const glowRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isNearRobot, setIsNearRobot] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const glow = glowRef.current;
    if (!cursor || !glow) return;

    const moveCursor = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';

      // Check if cursor is on right side (near robot area)
      const isRight = e.clientX > window.innerWidth * 0.45;
      setIsNearRobot(isRight);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('role') === 'button'
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      {/* Traditional arrow cursor */}
      <div
        ref={cursorRef}
        className={`cursor-arrow ${isHovering ? 'hovering' : ''}`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M5.5 3.21V20.79L10.92 15.37L14.5 21.77L16.5 20.77L12.92 14.37L20.08 13.21L5.5 3.21Z" 
            fill="white"
            stroke="black"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {/* Large ambient glow - only visible near robot */}
      <div
        ref={glowRef}
        className={`cursor-ambient-glow ${isNearRobot ? 'visible' : ''}`}
      />
    </>
  );
}
