"use client"

import { useEffect, useRef } from "react"

export default function DesignerCanvas({ onChange }: { onChange: (json: any) => void }) {
  const canvasRef = useRef<any>(null)

  useEffect(() => {
    let canvas: any

    import("fabric").then((fabric) => {
      canvas = new fabric.Canvas("canvas", {
        width: 500,
        height: 600,
        backgroundColor: "#fff",
      })

      canvasRef.current = canvas

      canvas.on("object:modified", () => onChange(canvas.toJSON()))
      canvas.on("object:added", () => onChange(canvas.toJSON()))
    })

    return () => {
      if (canvas) canvas.dispose()
    }
  }, [onChange])

  return <canvas id="canvas" className="border border-gray-400" />
}
