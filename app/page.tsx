import ImageResizer from '@/components/image-resizer';
import {
  Wand2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Lock,
  Gauge,
  Monitor,
  Smartphone,
  Layers,
  FileImage,
  Sparkles,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/20">
                <Wand2 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                ResizeCraft <span className="text-primary">Pro</span>
              </h1>
            </div>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Resize Images Instantly — No Watermark, No Signup, 100% Free
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                No Sign-In
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                No Watermark
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                No Subscription
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Ad Slot 1 - Top banner 728x90 */}
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-[90px] max-w-[728px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20">
          <div className="text-center">
            <p className="text-xs font-semibold text-muted-foreground/60">
              Ad Space
            </p>
            <p className="text-[10px] text-muted-foreground/40">728×90</p>
          </div>
        </div>
      </div>

      {/* Main tool section */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Free Online Image Resizer
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Resize JPG, PNG, WEBP, and AVIF images right in your browser. No
            uploads, no watermark, completely free.
          </p>
        </div>

        <div className="animate-fade-in-up">
          <ImageResizer />
        </div>

        {/* Ad Slot 3 - Bottom banner after tool */}
        <div className="mt-8">
          <div className="mx-auto flex h-[90px] max-w-[728px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20">
            <div className="text-center">
              <p className="text-xs font-semibold text-muted-foreground/60">
                Ad Space
              </p>
              <p className="text-[10px] text-muted-foreground/40">728×90</p>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="mx-auto mt-16 max-w-3xl">
          {/* What is ResizeCraft Pro */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-foreground sm:text-2xl">
              What is ResizeCraft Pro?
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              ResizeCraft Pro is a free online image resizer that lets you
              resize, optimize, and convert images directly in your browser.
              Unlike other image resizing tools, ResizeCraft Pro processes
              everything 100% client-side using the HTML5 Canvas API — meaning
              your images never get uploaded to a server. There is no watermark,
              no signup, and no subscription. Whether you need to resize a
              single photo for a social media post or batch-resize 20 images
              for your website, ResizeCraft Pro handles it instantly and
              privately. It supports JPG, PNG, WEBP, and AVIF formats, and
              includes quick presets for Instagram posts, Instagram stories,
              YouTube thumbnails, and Facebook covers. ResizeCraft Pro is built
              for creators, marketers, and developers who need a fast, reliable,
              and completely free image resizing tool that respects their
              privacy.
            </p>
          </section>

          {/* How to Resize in 3 Steps */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-foreground sm:text-2xl">
              How to Resize Images in 3 Steps
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Upload Your Images
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Drag and drop your images into the upload area, or click to
                    browse. You can add up to 20 images at once in JPG, PNG,
                    WEBP, or AVIF format.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Choose Your Settings
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Pick a quick preset like Instagram Post or YouTube
                    Thumbnail, or enter custom dimensions. You can also resize by
                    percentage and choose your output format and quality.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Resize & Download
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Click the green Resize button, then download your resized
                    image. For bulk resizing, use Download All to get every image
                    in one click. No watermark, no signup needed.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Why Resize Images */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-foreground sm:text-2xl">
              Why Resize Images?
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    Website Speed
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Large images are the #1 cause of slow websites. Resizing
                  images to the correct dimensions before uploading can reduce
                  page load times by 50% or more, improving your Core Web Vitals
                  and SEO rankings.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    Social Media
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Every platform has different image size requirements.
                  ResizeCraft Pro&apos;s presets make it easy to create
                  perfectly sized images for Instagram posts, stories, YouTube
                  thumbnails, and Facebook covers in seconds.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    Save Storage
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Resizing and compressing images reduces file size
                  dramatically. A 5MB photo can become a 200KB image with no
                  visible quality loss, saving disk space and bandwidth.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">
                  Email & Messaging
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Email providers often block attachments over 25MB. Resizing
                  images before attaching ensures your emails go through
                  quickly and land in the inbox, not the spam folder.
                </p>
              </div>
            </div>
          </section>

          {/* Feature highlights */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-foreground sm:text-2xl">
              Key Features
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  icon: Lock,
                  title: '100% Client-Side Processing',
                  desc: 'Your images never leave your browser. No server uploads, complete privacy.',
                },
                {
                  icon: Layers,
                  title: 'Bulk Resize Up to 20 Images',
                  desc: 'Resize multiple images at once and download them all with a single click.',
                },
                {
                  icon: FileImage,
                  title: 'Multiple Format Support',
                  desc: 'JPG, PNG, WEBP, and AVIF. Convert between formats while resizing.',
                },
                {
                  icon: Sparkles,
                  title: 'No Watermark, Ever',
                  desc: 'Your resized images are clean and ready to use. No logos, no branding.',
                },
                {
                  icon: Zap,
                  title: 'Instant Results',
                  desc: 'Processing happens in real-time. No waiting for server queues or uploads.',
                },
                {
                  icon: ShieldCheck,
                  title: 'No Signup Required',
                  desc: 'No account, no email, no tracking. Just open the page and start resizing.',
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="flex gap-3 rounded-lg border border-border bg-white p-4"
                >
                  <f.icon className="h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {f.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="mb-4 text-xl font-bold text-foreground sm:text-2xl">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="q1">
                <AccordionTrigger className="text-left text-base">
                  Is ResizeCraft Pro free to use?
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  Yes, ResizeCraft Pro is 100% free forever. There is no signup,
                  no subscription, and no hidden fees. All image resizing
                  happens right in your browser at no cost.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger className="text-left text-base">
                  Is my data safe when using ResizeCraft Pro?
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  Absolutely. All image processing happens 100% client-side in
                  your browser using the HTML5 Canvas API. Your images are never
                  uploaded to any server, so your data never leaves your device.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3">
                <AccordionTrigger className="text-left text-base">
                  Does ResizeCraft Pro add a watermark to my images?
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  No. ResizeCraft Pro never adds watermarks to your images. Your
                  resized images are clean and ready to use for any purpose.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q4">
                <AccordionTrigger className="text-left text-base">
                  Do I need to create an account to resize images?
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  No account is needed. Simply drag and drop your images, choose
                  your settings, and download. No login, no email, no signup
                  required.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q5">
                <AccordionTrigger className="text-left text-base">
                  What image formats does ResizeCraft Pro support?
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  ResizeCraft Pro supports JPG, PNG, WEBP, and AVIF image
                  formats. You can also convert between formats while resizing —
                  for example, convert a PNG to a smaller JPG or WEBP.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="q6">
                <AccordionTrigger className="text-left text-base">
                  Can I resize multiple images at once?
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  Yes, you can resize up to 20 images at once with the bulk
                  resize feature. After resizing, use the Download All button to
                  download every resized image with a single click.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Wand2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-foreground">
                ResizeCraft <span className="text-primary">Pro</span>
              </span>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Made for creators. No login needed.
            </p>
            <div className="mb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                Contact
              </a>
            </div>
            <Separator className="mb-4" />
            <p className="text-xs text-muted-foreground">
              &copy; 2026 ResizeCraft Pro — All tools are 100% Free Forever
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
