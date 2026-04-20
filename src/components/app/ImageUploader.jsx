import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, X, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';

const PixelLabel = ({ children }) => (
  <span className="font-pixel text-[8px] text-primary uppercase tracking-wider">{children}</span>
);

export default function ImageUploader({ images, setImages }) {
  const [draggingOver, setDraggingOver] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith('image/'));
    const readers = valid.map(
      (file) =>
        new Promise((res) => {
          const reader = new FileReader();
          reader.onload = (e) => res({ id: Date.now() + Math.random(), url: e.target.result, name: file.name });
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((newImgs) => setImages((prev) => [...prev, ...newImgs]));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDraggingOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const remove = (id) => setImages((prev) => prev.filter((img) => img.id !== id));

  const move = (id, dir) => {
    setImages((prev) => {
      const idx = prev.findIndex((img) => img.id === id);
      const next = [...prev];
      const swapIdx = idx + dir;
      if (swapIdx < 0 || swapIdx >= next.length) return prev;
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
  };

  return (
    <section id="images" className="relative py-20 lg:py-28">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <PixelLabel>Step 4 – Images</PixelLabel>
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground tracking-tight mt-3 mb-2">
            Upload Images
          </h2>
          <p className="text-base font-body text-muted-foreground">
            Upload images that will be combined with your audio into a video. Reorder as needed.
          </p>
        </motion.div>

        {/* Drop zone */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
        >
          <div
            className={`rounded-2xl border-2 border-dashed transition-all duration-200 p-10 text-center cursor-pointer ${
              draggingOver
                ? 'border-primary/70 bg-primary/10'
                : 'border-border/50 bg-card/40 hover:border-primary/40 hover:bg-card/60'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDraggingOver(true); }}
            onDragLeave={() => setDraggingOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="w-14 h-14 bg-primary/10 border border-primary/25 flex items-center justify-center mx-auto mb-4">
              <ImagePlus className="w-6 h-6 text-primary" />
            </div>
            <p className="font-body font-semibold text-foreground mb-1">
              Drop images here or click to browse
            </p>
            <p className="text-sm font-body text-muted-foreground">
              PNG, JPG, WEBP — multiple files supported
            </p>
          </div>
        </motion.div>

        {/* Preview grid */}
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          >
            <AnimatePresence>
              {images.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className="relative group rounded-xl overflow-hidden border border-border/40 bg-secondary/40 aspect-video"
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => move(img.id, -1)}
                      disabled={i === 0}
                      className="w-7 h-7 bg-secondary border border-border/50 flex items-center justify-center rounded disabled:opacity-30 hover:bg-primary/20 transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 text-foreground" />
                    </button>
                    <button
                      onClick={() => move(img.id, 1)}
                      disabled={i === images.length - 1}
                      className="w-7 h-7 bg-secondary border border-border/50 flex items-center justify-center rounded disabled:opacity-30 hover:bg-primary/20 transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-foreground" />
                    </button>
                    <button
                      onClick={() => remove(img.id)}
                      className="w-7 h-7 bg-destructive/80 border border-destructive/50 flex items-center justify-center rounded hover:bg-destructive transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>

                  {/* Order badge */}
                  <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-background/80 border border-border/50 flex items-center justify-center">
                    <span className="font-pixel text-[7px] text-foreground">{i + 1}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}