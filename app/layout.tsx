import '@prisma/client'
import './globals.css'

export const metadata = {
  title: 'ShareBite - 함께 사서 덜 낭비하자',
  description: '자취생을 위한 식자재 공동구매 플랫폼',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
