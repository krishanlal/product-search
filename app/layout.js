import './globals.css';

export const metadata = {
  title: 'ProductSearch AI — Intelligent Product Discovery',
  description: 'Search and discover products intelligently using AI. Get detailed insights, comparisons, and recommendations powered by advanced language models.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0f" />
      </head>
      <body>{children}</body>
    </html>
  )
}
