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
    const [isLoading, setIsLoading] = useState(true);

    // Load fabric dynamically
    useEffect(() => {
      import("fabric").then((mod) => {
        console.log('Fabric module:', mod); // Debug log
        
        // Try different ways to get fabric
        let fabric: any;
        if (mod.default) {
          fabric = mod.default;
        } else if ((mod as any).fabric) {
          fabric = (mod as any).fabric;
        } else {
          fabric = mod;
        }
        
        console.log('Fabric object:', fabric); // Debug log
        
        if (!fabric || !fabric.Canvas) {
          console.error('Fabric Canvas not found in module:', fabric);
          return;
        }
        
        setFabricModule(fabric);
        setIsLoading(false); // Add loading state

        if (!canvasElRef.current) return;
        
        const canvas = new fabric.Canvas(canvasElRef.current, {
          width: 500,
          height: 600,
          backgroundColor: 'transparent'
        });
        canvasRef.current = canvas;
    
        // Handle object movement
        canvas.on('object:moving', (e: any) => {
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
        canvas.on('mouse:over', (e: any) => {
          if (e.target) {
            canvas.defaultCursor = 'move';
          }
        });
    
        canvas.on('mouse:out', (e: any) => {
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
        console.log('addText called with:', text);
        console.log('fabricModule:', fabricModule);
        console.log('canvasRef.current:', canvasRef.current);
        console.log('isLoading:', isLoading);
        
        if (isLoading) {
          console.error('Canvas is still loading');
          return;
        }
        
        if (!fabricModule || !canvasRef.current) {
          console.error('Missing fabricModule or canvasRef.current');
          return;
        }
        
        const canvas = canvasRef.current;
        console.log('Canvas object:', canvas);
        console.log('Canvas width/height:', canvas.width, canvas.height);
        
        try {
          const textbox = new fabricModule.Textbox(text, {
            left: canvas.width / 2, // Center horizontally
            top: canvas.height / 2, // Center vertically
            fontSize: 48, // Increased font size
            fill: "#ff0000", // Changed to bright red for testing
            editable: true,
            centeredScaling: true,
            originX: 'center',
            originY: 'center',
            padding: 10,
            borderColor: '#ff0000',
            cornerColor: '#ff0000',
            cornerSize: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)', // White background
          });
          
          console.log('Textbox created:', textbox);
          canvas.add(textbox);
          canvas.bringToFront(textbox); // This works even though it shows an error
          canvas.setActiveObject(textbox); // Select the text immediately
          canvas.renderAll();
          console.log('Text object added to canvas successfully');
          console.log('Canvas objects:', canvas.getObjects());
          console.log('Canvas objects length:', canvas.getObjects().length);
          console.log('Canvas viewport:', canvas.viewportTransform);
          console.log('Canvas dimensions:', canvas.width, canvas.height);
          
          // Force a complete re-render
          canvas.requestRenderAll();
          canvas.renderAll();
        } catch (error) {
          console.error('Error creating textbox:', error);
        }
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
        width={500}  // Add explicit width
        height={600} // Add explicit height
        style={{ touchAction: "none", zIndex: 10 }}
      />
    )
  }
)

export default DesignerCanvas
