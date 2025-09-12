// app/layout.tsx
import './globals.css'
import Navigation from '../components/ui/Navigation'
import LayoutWrapper from '../components/LayoutWrapper'
import { AuthProvider } from '../contexts/AuthContext'

export const metadata = {
  title: 'Simple Dev Colab',
  description: 'Collaborative backlog tool for developers',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        <AuthProvider>
          <Navigation />
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}
