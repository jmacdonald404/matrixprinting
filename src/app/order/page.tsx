"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function OrderPage() {
  const params = useSearchParams()
  const router = useRouter()
  const [designJson, setDesignJson] = useState(null)

  useEffect(() => {
    const encoded = params.get("design")
    if (encoded) {
      try {
        const decoded = JSON.parse(decodeURIComponent(encoded))
        setDesignJson(decoded)
      } catch (err) {
        console.error("Invalid design data")
      }
    }
  }, [params])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const garmentId = 1 // for now, hardcoded — replace with real selection later

    const quantities: Record<string, number> = {}
    for (const size of ["XS", "S", "M", "L", "XL", "2XL"]) {
      const qty = parseInt(formData.get(`qty_${size}`)?.toString() || "0")
      if (qty > 0) quantities[size] = qty
    }

    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        garmentId,
        designJson,
        previewUrl: "", // Add later if you generate previews
        quantities,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      router.push(`/thank-you?orderId=${data.orderId}`)
    } else {
      alert("Failed to submit order: " + data.error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Complete Your Order</h1>

      {!designJson && <p className="text-red-500">Design not found. Please go back and create one.</p>}

      {designJson && (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-semibold mb-1">Quantity by Size</label>
            <div className="grid grid-cols-3 gap-2">
              {["XS", "S", "M", "L", "XL", "2XL"].map((size) => (
                <input
                  key={size}
                  type="number"
                  min="0"
                  name={`qty_${size}`}
                  placeholder={`${size}`}
                  className="border p-2 rounded w-full"
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Your Email</label>
            <input type="email" name="email" required className="border p-2 rounded w-full" />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
          >
            Submit Order
          </button>
        </form>
      )}
    </div>
  )
}
