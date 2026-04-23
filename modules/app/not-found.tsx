import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="text-4xl font-light text-gray-900 mb-2">404</h1>
      <h2 className="text-lg font-medium text-gray-800 mb-2">Page not found</h2>
      <p className="text-gray-500 text-sm mb-8">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link 
        href="/" 
        className="text-sm font-medium text-gray-900 underline underline-offset-4 hover:text-gray-600 transition-colors"
      >
        Back to home
      </Link>
    </div>
  )
}