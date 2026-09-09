'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Upload,
  Lock,
  Unlock,
  Download,
  DownloadCloud,
  X,
  ImageIcon,
  ShieldCheck,
  Zap,
  Trash2,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

type ResizeMode = 'dimensions' | 'percentage';
type OutputFormat = 'original' | 'image/jpeg' | 'image/png' | 'image/webp';

interface ImageItem {
  id: string;
  file: File;
  name: string;
  originalWidth: number;
  originalHeight: number;
  originalSize: number;
  originalType: string;
  originalUrl: string;
  resizedUrl: string | null;
  resizedWidth: number;
  resizedHeight: number;
  resizedSize: number;
  resizedBlob: Blob | null;
  status: 'pending' | 'resized' | 'error';
}

interface Preset {
  label: string;
  width: number;
  height: number;
  icon: string;
}

const PRESETS: Preset[] = [
  { label: 'Instagram Post', width: 1080, height: 1080, icon: 'IG' },
  { label: 'Instagram Story', width: 1080, height: 1920, icon: 'IG' },
  { label: 'YouTube Thumb', width: 1280, height: 720, icon: 'YT' },
  { label: 'Facebook Cover', width: 1640, height: 924, icon: 'FB' },
];

const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
];

const MAX_IMAGES = 20;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 / 1024)).toFixed(2)} MB`;
}

function getExtension(format: OutputFormat, originalType: string): string {
  if (format === 'original') {
    if (originalType === 'image/jpeg') return 'jpg';
    if (originalType === 'image/png') return 'png';
    if (originalType === 'image/webp') return 'webp';
    if (originalType === 'image/avif') return 'avif';
    return 'jpg';
  }
  if (format === 'image/jpeg') return 'jpg';
  if (format === 'image/png') return 'png';
  if (format === 'image/webp') return 'webp';
  return 'jpg';
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

async function resizeImage(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  format: OutputFormat,
  quality: number,
  originalType: string
): Promise<{ blob: Blob; url: string }> {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const outputType =
    format === 'original' ? originalType || 'image/png' : format;
  const outputQuality = format === 'image/png' ? undefined : quality / 100;

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Failed to create blob'))),
      outputType,
      outputQuality
    );
  });

  const url = URL.createObjectURL(blob);
  return { blob, url };
}

export default function ImageResizer() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [resizeMode, setResizeMode] = useState<ResizeMode>('dimensions');
  const [percentage, setPercentage] = useState(50);
  const [format, setFormat] = useState<OutputFormat>('original');
  const [quality, setQuality] = useState(85);
  const [selectedPreset, setSelectedPreset] = useState<string>('custom');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeImage = images.find((img) => img.id === activeImageId) || null;

  // Set dimensions when first image is loaded
  useEffect(() => {
    if (images.length > 0 && activeImageId) {
      const img = images.find((i) => i.id === activeImageId);
      if (img && width === 0 && height === 0) {
        setWidth(img.originalWidth);
        setHeight(img.originalHeight);
        setAspectRatio(img.originalWidth / img.originalHeight);
      }
    }
  }, [images, activeImageId, width, height]);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      const validFiles = Array.from(files).filter((f) =>
        ACCEPTED_TYPES.includes(f.type)
      );

      const remaining = MAX_IMAGES - images.length;
      const toAdd = validFiles.slice(0, remaining);

      const newItems: ImageItem[] = [];
      for (const file of toAdd) {
        try {
          const img = await loadImage(file);
          const url = URL.createObjectURL(file);
          const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
          newItems.push({
            id,
            file,
            name: file.name,
            originalWidth: img.naturalWidth,
            originalHeight: img.naturalHeight,
            originalSize: file.size,
            originalType: file.type,
            originalUrl: url,
            resizedUrl: null,
            resizedWidth: 0,
            resizedHeight: 0,
            resizedSize: 0,
            resizedBlob: null,
            status: 'pending',
          });
        } catch {
          // skip files that fail to load
        }
      }

      if (newItems.length > 0) {
        setImages((prev) => [...prev, ...newItems]);
        if (!activeImageId) {
          setActiveImageId(newItems[0].id);
          setWidth(newItems[0].originalWidth);
          setHeight(newItems[0].originalHeight);
          setAspectRatio(
            newItems[0].originalWidth / newItems[0].originalHeight
          );
        }
      }
    },
    [images.length, activeImageId]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspect && val > 0) {
      setHeight(Math.round(val / aspectRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspect && val > 0) {
      setWidth(Math.round(val * aspectRatio));
    }
  };

  const applyPreset = (presetLabel: string) => {
    setSelectedPreset(presetLabel);
    if (presetLabel === 'custom') {
      setLockAspect(false);
      return;
    }
    const preset = PRESETS.find((p) => p.label === presetLabel);
    if (preset) {
      setLockAspect(false);
      setWidth(preset.width);
      setHeight(preset.height);
    }
  };

  const getTargetDimensions = (img: ImageItem): { w: number; h: number } => {
    if (resizeMode === 'percentage') {
      return {
        w: Math.max(1, Math.round((img.originalWidth * percentage) / 100)),
        h: Math.max(1, Math.round((img.originalHeight * percentage) / 100)),
      };
    }
    return { w: Math.max(1, width), h: Math.max(1, height) };
  };

  const resizeSingle = async (img: ImageItem): Promise<ImageItem> => {
    try {
      const loadedImg = await loadImage(img.file);
      const { w, h } = getTargetDimensions(img);
      const { blob, url } = await resizeImage(
        loadedImg,
        w,
        h,
        format,
        quality,
        img.originalType
      );
      URL.revokeObjectURL(loadedImg.src);
      return {
        ...img,
        resizedUrl: url,
        resizedWidth: w,
        resizedHeight: h,
        resizedSize: blob.size,
        resizedBlob: blob,
        status: 'resized',
      };
    } catch {
      return { ...img, status: 'error' };
    }
  };

  const handleResize = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    const updated = await Promise.all(images.map(resizeSingle));
    setImages(updated);
    setIsProcessing(false);
  };

  const handleDownload = (img: ImageItem) => {
    if (!img.resizedBlob) return;
    const ext = getExtension(format, img.originalType);
    const baseName = img.name.replace(/\.[^/.]+$/, '');
    const a = document.createElement('a');
    a.href = img.resizedUrl!;
    a.download = `${baseName}_${img.resizedWidth}x${img.resizedHeight}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAll = () => {
    const resized = images.filter((img) => img.status === 'resized');
    resized.forEach((img, idx) => {
      setTimeout(() => handleDownload(img), idx * 200);
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        URL.revokeObjectURL(item.originalUrl);
        if (item.resizedUrl) URL.revokeObjectURL(item.resizedUrl);
      }
      const filtered = prev.filter((i) => i.id !== id);
      if (activeImageId === id) {
        setActiveImageId(filtered[0]?.id || null);
        if (filtered[0]) {
          setWidth(filtered[0].originalWidth);
          setHeight(filtered[0].originalHeight);
          setAspectRatio(
            filtered[0].originalWidth / filtered[0].originalHeight
          );
        }
      }
      return filtered;
    });
  };

  const clearAll = () => {
    images.forEach((img) => {
      URL.revokeObjectURL(img.originalUrl);
      if (img.resizedUrl) URL.revokeObjectURL(img.resizedUrl);
    });
    setImages([]);
    setActiveImageId(null);
    setWidth(0);
    setHeight(0);
  };

  const showQualitySlider = format === 'image/jpeg' || format === 'image/webp';
  const resizedCount = images.filter((i) => i.status === 'resized').length;
  const totalOriginalSize = images.reduce((s, i) => s + i.originalSize, 0);
  const totalResizedSize = images.reduce(
    (s, i) => s + (i.resizedSize || 0),
    0
  );
  const reduction =
    totalOriginalSize > 0 && totalResizedSize > 0
      ? Math.round(
          ((totalOriginalSize - totalResizedSize) / totalOriginalSize) * 100
        )
      : 0;

  return (
    <div className="w-full">
      {/* Upload area */}
      {images.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300',
            'flex flex-col items-center justify-center py-20 px-6 text-center',
            'hover:border-primary/50 hover:bg-primary/[0.02]',
            isDragging
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-border bg-muted/30'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div
            className={cn(
              'mb-6 flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300',
              isDragging
                ? 'bg-primary text-primary-foreground scale-110'
                : 'bg-primary/10 text-primary'
            )}
          >
            <Upload className="h-9 w-9" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-foreground">
            Drop images here or Click to browse
          </h3>
          <p className="text-sm text-muted-foreground">
            Supports JPG, PNG, WEBP, AVIF — up to {MAX_IMAGES} images at once
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {['JPG', 'PNG', 'WEBP', 'AVIF'].map((f) => (
              <Badge
                key={f}
                variant="secondary"
                className="bg-white shadow-sm"
              >
                {f}
              </Badge>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {images.length} image{images.length !== 1 ? 's' : ''}
              </Badge>
              {resizedCount > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-green-50 text-green-700"
                >
                  {resizedCount} resized
                </Badge>
              )}
              {reduction > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-green-50 text-green-700"
                >
                  {reduction > 0 ? '-' : '+'}
                  {Math.abs(reduction)}% size
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-1.5 h-4 w-4" />
                Add More
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                Clear All
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(',')}
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>
          </div>

          {/* Main layout: tool + sidebar */}
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Left: previews + controls */}
            <div className="flex-1 space-y-6">
              {/* Image thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => {
                        setActiveImageId(img.id);
                        setWidth(img.originalWidth);
                        setHeight(img.originalHeight);
                        setAspectRatio(
                          img.originalWidth / img.originalHeight
                        );
                      }}
                      className={cn(
                        'group relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                        activeImageId === img.id
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.originalUrl}
                        alt={img.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100" />
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(img.id);
                        }}
                        className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </span>
                      {img.status === 'resized' && (
                        <div className="absolute bottom-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-white">
                          <CheckCircle2 className="h-3 w-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Preview panels */}
              {activeImage && (
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Original */}
                  <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-muted-foreground">
                        Original
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Badge variant="outline" className="font-mono">
                          {activeImage.originalWidth}×{activeImage.originalHeight}
                        </Badge>
                        <Badge variant="outline" className="font-mono">
                          {formatBytes(activeImage.originalSize)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex h-48 items-center justify-center overflow-hidden rounded-lg bg-muted/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeImage.originalUrl}
                        alt="Original"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Resized */}
                  <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">
                        Resized
                      </span>
                      {activeImage.status === 'resized' ? (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Badge
                            variant="outline"
                            className="font-mono text-primary"
                          >
                            {activeImage.resizedWidth}×
                            {activeImage.resizedHeight}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="font-mono text-primary"
                          >
                            {formatBytes(activeImage.resizedSize)}
                          </Badge>
                          {activeImage.originalSize > 0 && (
                            <Badge
                              className={
                                activeImage.resizedSize <
                                activeImage.originalSize
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-orange-100 text-orange-700'
                              }
                            >
                              {activeImage.resizedSize <
                              activeImage.originalSize
                                ? '-'
                                : '+'}
                              {Math.abs(
                                Math.round(
                                  ((activeImage.originalSize -
                                    activeImage.resizedSize) /
                                    activeImage.originalSize) *
                                    100
                                )
                              )}
                              %
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Not resized yet
                        </span>
                      )}
                    </div>
                    <div className="flex h-48 items-center justify-center overflow-hidden rounded-lg bg-muted/30">
                      {activeImage.resizedUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={activeImage.resizedUrl}
                          alt="Resized"
                          className="max-h-full max-w-full object-contain animate-scale-in"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-muted-foreground">
                          <ImageIcon className="mb-2 h-10 w-10 opacity-30" />
                          <span className="text-xs">
                            Click Resize to preview
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Resize Controls */}
              <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-base font-semibold text-foreground">
                  Resize Settings
                </h3>

                {/* Presets */}
                <div className="mb-5">
                  <Label className="mb-2 text-xs text-muted-foreground">
                    Quick Presets
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {PRESETS.map((preset) => (
                      <Button
                        key={preset.label}
                        variant={
                          selectedPreset === preset.label ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => applyPreset(preset.label)}
                        className={
                          selectedPreset === preset.label
                            ? 'bg-primary text-primary-foreground'
                            : ''
                        }
                      >
                        <span className="mr-1.5 rounded bg-black/10 px-1 text-[10px] font-bold">
                          {preset.icon}
                        </span>
                        {preset.label}
                        <span className="ml-1.5 text-xs opacity-70">
                          {preset.width}×{preset.height}
                        </span>
                      </Button>
                    ))}
                    <Button
                      variant={
                        selectedPreset === 'custom' ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => applyPreset('custom')}
                      className={
                        selectedPreset === 'custom'
                          ? 'bg-primary text-primary-foreground'
                          : ''
                      }
                    >
                      Custom
                    </Button>
                  </div>
                </div>

                <Separator className="mb-5" />

                {/* Resize mode */}
                <div className="mb-5">
                  <Label className="mb-2 text-xs text-muted-foreground">
                    Resize Mode
                  </Label>
                  <Select
                    value={resizeMode}
                    onValueChange={(v) => setResizeMode(v as ResizeMode)}
                  >
                    <SelectTrigger className="w-full sm:w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dimensions">
                        By Dimensions
                      </SelectItem>
                      <SelectItem value="percentage">
                        By Percentage
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dimensions or Percentage */}
                {resizeMode === 'dimensions' ? (
                  <div className="mb-5">
                    <Label className="mb-2 text-xs text-muted-foreground">
                      Dimensions (pixels)
                    </Label>
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <Label className="mb-1 block text-xs text-muted-foreground">
                          Width
                        </Label>
                        <Input
                          type="number"
                          value={width || ''}
                          onChange={(e) =>
                            handleWidthChange(parseInt(e.target.value) || 0)
                          }
                          className="text-center font-mono"
                        />
                      </div>
                      <button
                        onClick={() => setLockAspect(!lockAspect)}
                        className={cn(
                          'mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-md border transition-all',
                          lockAspect
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border bg-background text-muted-foreground hover:bg-accent'
                        )}
                        title={
                          lockAspect
                            ? 'Aspect ratio locked'
                            : 'Aspect ratio unlocked'
                        }
                      >
                        {lockAspect ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <Unlock className="h-4 w-4" />
                        )}
                      </button>
                      <div className="flex-1">
                        <Label className="mb-1 block text-xs text-muted-foreground">
                          Height
                        </Label>
                        <Input
                          type="number"
                          value={height || ''}
                          onChange={(e) =>
                            handleHeightChange(parseInt(e.target.value) || 0)
                          }
                          className="text-center font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-5">
                    <Label className="mb-2 text-xs text-muted-foreground">
                      Scale Percentage:{' '}
                      <span className="font-semibold text-foreground">
                        {percentage}%
                      </span>
                    </Label>
                    <div className="flex items-center gap-3">
                      <Slider
                        value={[percentage]}
                        onValueChange={(v) => setPercentage(v[0])}
                        min={1}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <div className="flex gap-1">
                        {[25, 50, 75].map((p) => (
                          <Button
                            key={p}
                            variant={
                              percentage === p ? 'default' : 'outline'
                            }
                            size="sm"
                            onClick={() => setPercentage(p)}
                            className={cn(
                              'h-8 px-2 text-xs',
                              percentage === p
                                ? 'bg-primary text-primary-foreground'
                                : ''
                            )}
                          >
                            {p}%
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <Separator className="mb-5" />

                {/* Format + Quality */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label className="mb-2 text-xs text-muted-foreground">
                      Output Format
                    </Label>
                    <Select
                      value={format}
                      onValueChange={(v) => setFormat(v as OutputFormat)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="original">
                          Keep Original
                        </SelectItem>
                        <SelectItem value="image/jpeg">JPG</SelectItem>
                        <SelectItem value="image/png">PNG</SelectItem>
                        <SelectItem value="image/webp">WEBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    {showQualitySlider ? (
                      <>
                        <Label className="mb-2 text-xs text-muted-foreground">
                          Quality:{' '}
                          <span className="font-semibold text-foreground">
                            {quality}%
                          </span>
                        </Label>
                        <Slider
                          value={[quality]}
                          onValueChange={(v) => setQuality(v[0])}
                          min={1}
                          max={100}
                          step={1}
                        />
                      </>
                    ) : (
                      <div className="text-xs text-muted-foreground sm:pt-7">
                        Quality slider available for JPG / WEBP
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="my-5" />

                {/* Action buttons */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    onClick={handleResize}
                    disabled={isProcessing || images.length === 0}
                    size="lg"
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Resizing...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-5 w-5" />
                        Resize & Download
                      </>
                    )}
                  </Button>
                  {resizedCount > 0 && (
                    <Button
                      onClick={handleDownloadAll}
                      size="lg"
                      variant="outline"
                      className="sm:w-auto"
                    >
                      <DownloadCloud className="mr-2 h-5 w-5" />
                      Download All ({resizedCount})
                    </Button>
                  )}
                </div>

                {/* Per-image download for active */}
                {activeImage && activeImage.status === 'resized' && (
                  <div className="mt-3 flex justify-center">
                    <Button
                      onClick={() => handleDownload(activeImage)}
                      variant="ghost"
                      size="sm"
                      className="text-primary"
                    >
                      <Download className="mr-1.5 h-4 w-4" />
                      Download {activeImage.name}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Right sidebar: ad + info */}
            <div className="flex w-full shrink-0 flex-col gap-4 lg:w-80">
              {/* Ad Slot 2 - Sidebar sticky */}
              <div className="lg:sticky lg:top-4">
                <div className="flex h-[250px] w-full items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-muted-foreground/60">
                      Ad Space
                    </p>
                    <p className="text-[10px] text-muted-foreground/40">
                      300×250
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy info card */}
              <div className="rounded-xl border border-border bg-gradient-to-br from-green-50 to-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <h4 className="text-sm font-semibold text-foreground">
                    100% Private & Secure
                  </h4>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  All image processing happens directly in your browser. Your
                  images are never uploaded to any server — they never leave
                  your device.
                </p>
                <div className="mt-3 space-y-1.5">
                  {[
                    'No watermark, ever',
                    'No signup required',
                    'No data collected',
                    'Works offline after load',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
