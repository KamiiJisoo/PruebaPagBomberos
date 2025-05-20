import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Control de Horas Extras',
  description: 'Sistema de control de horas extras para bomberos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[var(--background)] flex flex-col">
        {/* Header fijo */}
        <header className="bg-[var(--primary)] text-white py-4 shadow-md sticky top-0 z-50">
          <div className="container mx-auto flex items-center justify-between px-2 md:px-0">
            <div className="flex items-center gap-3">
              <div className="h-28 flex items-center justify-center bg-white rounded-lg mr-2" style={{height: '10%'}}>
                {/* Logo de la organización */}
                <img src="/LogoFinal.png" alt="Logo Bomberos" className="h-20 w-auto object-contain" style={{maxHeight: '40%'}} />
              </div>
              <span className=" text-2xl font-bold tracking-lg">Control de Horas Extras</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-[var(--secondary)] font-bold text-lg hidden md:block">
                Bomberos Colombia
              </div>
            </div>
          </div>
        </header>
        {/* Contenido principal */}
        <main className="flex-1 container mx-auto w-full px-2 md:px-0">
          {children}
        </main>
        {/* Footer institucional */}
        <footer className="bg-gray-200 text-center py-4 mt-8 text-gray-600 text-sm">
          © 2025 Bomberos  Colombia - Control de Horas Extras
        </footer>
      </body>
    </html>
  )
}
