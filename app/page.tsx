// app/page.tsx
import { Header } from '@/components/layout/Header'
import { Hero } from '@/components/layout/Hero'
import { Footer } from '@/components/layout/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        {/* Add Features section here later */}
      </main>
      <Footer />
    </div>
  )
}