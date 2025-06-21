"use client"

import { useSearchParams } from "next/navigation"

export default function ThankYouPage() {
  const params = useSearchParams()
  const orderId = params.get("orderId")

  return (
    <div className="p-6 text-center space-y-4">
      <h1 className="text-3xl font-bold text-green-700">Thank You!</h1>
      <p>Your order has been submitted successfully.</p>
      {orderId && <p className="text-gray-500">Order ID: <code>{orderId}</code></p>}
    </div>
  )
}
