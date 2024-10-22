import './globals.css'
import AttributeCleaner from '@/components/AttributeCleaner'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AttributeCleaner />
        {children}
      </body>
    </html>
  )
}