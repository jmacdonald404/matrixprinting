"use client"

import DesignerCanvas from "@/components/DesignerCanvas"
import GarmentSelector from "@/components/GarmentSelector"
import ColorPicker from "@/components/ColorPicker"
import { useState } from "react"

export default function DesignerPage() {
  const [canvasData, setCanvasData] = useState(null)

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold">Design Your Garment</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <GarmentSelector />
          <ColorPicker />
        </div>

        <DesignerCanvas onChange={setCanvasData} />
      </div>
    </div>
  )
}
