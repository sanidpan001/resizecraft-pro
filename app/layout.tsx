import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://resizecraft.pro'),
  title: 'ResizeCraft Pro - Free Image Resizer, No Watermark, No Signup',
  description:
    'Resize images online for free with ResizeCraft Pro. No watermark, no signup, 100% client-side image processing. Resize JPG, PNG, WEBP, and AVIF instantly in your browser.',
  keywords:
    'image resizer, resize image, free image resizer, online image resizer, no watermark, resize jpg, resize png, resize webp, bulk image resizer, resizecraft',
  openGraph: {
    title: 'ResizeCraft Pro - Free Image Resizer, No Watermark, No Signup',
    description:
      'Resize images online for free. No watermark, no signup, 100% client-side. Resize JPG, PNG, WEBP, and AVIF instantly.',
    type: 'website',
    siteName: 'ResizeCraft Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResizeCraft Pro - Free Image Resizer',
    description:
      'Resize images online for free. No watermark, no signup, 100% client-side.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Is ResizeCraft Pro free to use?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, ResizeCraft Pro is 100% free forever. There is no signup, no subscription, and no hidden fees. All image resizing happens right in your browser.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Is my data safe when using ResizeCraft Pro?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Absolutely. All image processing happens 100% client-side in your browser. Your images are never uploaded to any server, so your data never leaves your device.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Does ResizeCraft Pro add a watermark to my images?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'No. ResizeCraft Pro never adds watermarks to your images. Your resized images are clean and ready to use.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Do I need to create an account to resize images?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'No account is needed. Simply drag and drop your images, choose your settings, and download. No login, no email, no signup required.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What image formats does ResizeCraft Pro support?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'ResizeCraft Pro supports JPG, PNG, WEBP, and AVIF image formats. You can also convert between formats while resizing.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can I resize multiple images at once?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, you can resize up to 20 images at once with the bulk resize feature, and download them all with a single click.',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
