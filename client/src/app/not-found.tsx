import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-4xl font-bold text-blue-500">404</h2>
      <p className="text-gray-600">Could not find the requested resource</p>
      <Link className="text-blue-500" href="/">Return Home</Link>
    </div>
  )
}