import React, { useEffect, useRef } from 'react';

export default function PixelBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animFrame;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Stars: [x, y, size, opacity, speed]
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() < 0.3 ? 4 : 2, // pixel size (multiples of 2)
      opacity: Math.random() * 0.6 + 0.1,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
    }));

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.016;

      stars.forEach((star) => {
        star.opacity += star.twinkleSpeed * star.twinkleDir;
        if (star.opacity >= 0.8 || star.opacity <= 0.05) star.twinkleDir *= -1;

        ctx.globalAlpha = star.opacity;
        // Pixel: draw as crisp rect
        ctx.fillStyle = Math.random() > 0.98 ? '#c084fc' : '#a78bfa';
        ctx.fillRect(
          Math.round(star.x / star.size) * star.size,
          Math.round(star.y / star.size) * star.size,
          star.size,
          star.size
        );
      });

      ctx.globalAlpha = 1;
      animFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
    />
  );
}