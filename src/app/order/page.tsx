"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function OrderPage() {
  const params = useSearchParams()
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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Complete Your Order</h1>

      {!designJson && <p className="text-red-500">Design not found. Please go back and create one.</p>}

      {designJson && (
        <>
          <p className="text-gray-600">Preview:</p>
          <pre className="bg-gray-100 p-4 rounded text-xs max-h-60 overflow-scroll">
            {JSON.stringify(designJson, null, 2)}
          </pre>

          <form className="space-y-4">
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
              <input type="email" className="border p-2 rounded w-full" />
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
            >
              Submit Order
            </button>
          </form>
        </>
      )}
    </div>
  )
}
