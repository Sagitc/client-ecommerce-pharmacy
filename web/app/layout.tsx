import { 
  Geist, 
  Geist_Mono, 
  Inter 
} from "next/font/google"
import "@/app/globals.css"
import { cn } from "@/lib/utils";
import Providers from "@/utils/providers";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
