import { useEffect, useState, useRef } from 'react';

export function CursorGlow() {
  const glowRef = useRef(null);
  const [isNearRobot, setIsNearRobot] = useState(false);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const moveCursor = (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';

      const isRight = e.clientX > window.innerWidth * 0.45;
      setIsNearRobot(isRight);
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <>
      {/* Large ambient glow that follows cursor */}
      <div
        ref={glowRef}
        className={`cursor-ambient-glow ${isNearRobot ? 'visible' : ''}`}
      />
    </>
  );
}
