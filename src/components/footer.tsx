export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-sm text-gray-500">
      <p>Copyright {currentYear} Financial Performance Suite. All rights reserved.</p>
    </footer>
  )
}
