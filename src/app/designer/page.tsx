"use client"

import { useState, useRef } from "react"
// import DesignerCanvas from "@/components/DesignerCanvas"
import DesignerCanvas, { DesignerCanvasHandle } from "@/components/DesignerCanvas"

const garmentOptions = [
  { id: "tshirt", label: "T-Shirt", img: "/garments/tshirt.jpg" },
  { id: "hoodie", label: "Hoodie", img: "/garments/hoodie.jpg" },
  { id: "hat", label: "Hat", img: "/garments/hat.jpg" },
]

export default function DesignerPage() {
  const [selectedGarment, setSelectedGarment] = useState(garmentOptions[0])
  const [garmentColor, setGarmentColor] = useState("#ffffff")
  const [canvasData, setCanvasData] = useState(null)
  const [textInput, setTextInput] = useState("")
  const canvasRef = useRef<DesignerCanvasHandle>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      canvasRef.current?.addImage(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleAddText = () => {
    if (textInput.trim()) {
      canvasRef.current?.addText(textInput.trim())
      setTextInput("")
    }
  }

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold">Design Your Garment</h1>

      <div className="flex gap-8">
        {/* Controls */}
        <div className="space-y-6 w-48">
          <div>
            <label className="block font-semibold mb-1">Choose Garment</label>
            <select
              className="w-full border rounded p-2"
              value={selectedGarment.id}
              onChange={(e) =>
                setSelectedGarment(
                  garmentOptions.find((g) => g.id === e.target.value) || garmentOptions[0]
                )
              }
            >
              {garmentOptions.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Garment Color</label>
            <input
              type="color"
              value={garmentColor}
              onChange={(e) => setGarmentColor(e.target.value)}
              className="w-full h-10 p-0 border rounded"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
         <input
           type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Enter text"
          className="border p-2 rounded"
        />
         <button
           onClick={handleAddText}
           className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
         >
           Add Text
         </button>
         <input type="file" accept="image/*" onChange={handleImageUpload} />
       </div>

        {/* Preview & Canvas */}
        <div
          className="relative border rounded-md"
          style={{
            width: 500,
            height: 600,
            backgroundColor: garmentColor,
            backgroundImage: `url(${selectedGarment.img})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <DesignerCanvas ref={canvasRef} onChange={() => {}} />
        </div>
      </div>
    </div>
  )
}
// "use client"

// import { useState } from "react"
// import DesignerCanvas from "@/components/DesignerCanvas"
// import GarmentSelector from "@/components/GarmentSelector"
// import ColorPicker from "@/components/ColorPicker"
// import { useRouter } from "next/navigation"

// export default function DesignerPage() {
//   const [canvasData, setCanvasData] = useState(null)
//   const router = useRouter()

//   const handleContinue = () => {
//     if (!canvasData) return alert("Please create a design first!")

//     const encoded = encodeURIComponent(JSON.stringify(canvasData))
//     router.push(`/order?design=${encoded}`)
//   }

//   return (
//     <div className="p-4 space-y-6">
//       <h1 className="text-3xl font-bold">Design Your Garment</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="space-y-4">
//           <GarmentSelector />
//           <ColorPicker />
//         </div>

//         <DesignerCanvas onChange={setCanvasData} />
//       </div>

//       <div className="text-right">
//         <button
//           className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
//           onClick={handleContinue}
//         >
//           Continue to Order
//         </button>
//       </div>
//     </div>
//   )
// }

