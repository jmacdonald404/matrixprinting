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
        const fabric = mod.fabric ?? mod;
        setFabricModule(fabric);
    
        const canvas = new fabric.Canvas(canvasElRef.current, {
          width: 500, // Add a default width
          height: 600, // Add a default height
          backgroundColor: '#ffffff' // Add a background color to make the canvas visible
        });
        canvasRef.current = canvas;
    
        // Handle object movement
        canvas.on('object:moving', (e) => {
          const obj = e.target;
          // Keep objects within canvas bounds
          if (obj) {
            const bound = obj.getBoundingRect();
            if (bound.left < 0) obj.left = bound.width / 2;
            if (bound.top < 0) obj.top = bound.height / 2;
            if (bound.left + bound.width > canvas.width) obj.left = canvas.width - bound.width / 2;
            if (bound.top + bound.height > canvas.height) obj.top = canvas.height - bound.height / 2;
          }
        });
    
        // Update cursor on hover
        canvas.on('mouse:over', (e) => {
          if (e.target) {
            canvas.defaultCursor = 'move';
          }
        });
    
        canvas.on('mouse:out', (e) => {
          canvas.defaultCursor = 'default';
        });
    
        canvas.on('object:modified', () => {
          onChange(canvas.toJSON());
        });
      });
    
      return () => {
        if (canvasRef.current) {
          canvasRef.current.dispose();
          canvasRef.current = null;
        }
      };
    }, [onChange]);

    // Expose API to parent
    useImperativeHandle(ref, () => ({
      addText: (text: string) => {
        if (!fabricModule || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const textbox = new fabricModule.Textbox(text, {
          left: canvas.width / 2, // Center horizontally
          top: canvas.height / 2, // Center vertically
          fontSize: 24,
          fill: "#000000",
          editable: true,
          centeredScaling: true,
          originX: 'center',
          originY: 'center',
          padding: 5,
          borderColor: '#000000',
          cornerColor: '#000000',
          cornerSize: 8,
        });
        canvas.add(textbox);
        canvas.setActiveObject(textbox); // Select the text immediately
        canvas.renderAll();
      },
      
      addImage: (url: string) => {
        if (!fabricModule || !canvasRef.current) return;
        const canvas = canvasRef.current;
        fabricModule.Image.fromURL(url, (img: any) => {
          // Calculate scale to fit within reasonable bounds
          const maxDim = 200;
          const scale = Math.min(maxDim / img.width, maxDim / img.height);
          
          img.set({
            left: canvas.width / 2,
            top: canvas.height / 2,
            scaleX: scale,
            scaleY: scale,
            originX: 'center',
            originY: 'center',
            cornerColor: '#000000',
            cornerSize: 8,
            borderColor: '#000000',
          });
          canvas.add(img);
          canvas.setActiveObject(img); // Select the image immediately
          canvas.renderAll();
        });
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
