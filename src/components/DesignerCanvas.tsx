"use client"

import {
  useEffect,
  useImperativeHandle,
  useRef,
  forwardRef,
  useState,
} from "react"

export type DesignerCanvasHandle = {
  addText: (text: string) => void
  addImage: (url: string) => void
}

const DesignerCanvas = forwardRef<DesignerCanvasHandle, { onChange: (json: any) => void }>(
  function DesignerCanvas({ onChange }, ref) {
    const canvasRef = useRef<any>(null)
    const canvasElRef = useRef<HTMLCanvasElement>(null)
    const [fabricModule, setFabricModule] = useState<any>(null)

    // Load fabric dynamically
    useEffect(() => {
      import("fabric").then((mod) => {
        const fabric = mod.fabric ?? mod
        setFabricModule(fabric)

        const canvas = new fabric.Canvas(canvasElRef.current, {
          backgroundColor: "transparent",
          selection: true,
        })
        canvasRef.current = canvas

        const container = canvasElRef.current?.parentElement
        if (container) {
          canvas.setWidth(container.clientWidth)
          canvas.setHeight(container.clientHeight)
          canvas.renderAll()
        }

        canvas.on("object:modified", () => onChange(canvas.toJSON()))
        canvas.on("object:added", () => onChange(canvas.toJSON()))
      })

      return () => {
        if (canvasRef.current) {
          canvasRef.current.dispose()
          canvasRef.current = null
        }
      }
    }, [onChange])

    // Expose API to parent
    useImperativeHandle(ref, () => ({
      addText: (text: string) => {
        if (!fabricModule || !canvasRef.current) return
        const textbox = new fabricModule.Textbox(text, {
          left: 100,
          top: 100,
          fontSize: 24,
          fill: "#000000",
          editable: true,
        })
        canvasRef.current.add(textbox)
      },

      addImage: (url: string) => {
        if (!fabricModule || !canvasRef.current) return
        fabricModule.Image.fromURL(url, (img: any) => {
          img.set({ left: 100, top: 100, scaleX: 0.5, scaleY: 0.5 })
          canvasRef.current.add(img)
        })
      },
    }))

    return (
      <canvas
        ref={canvasElRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{ touchAction: "none" }}
      />
    )
  }
)

export default DesignerCanvas
