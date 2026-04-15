"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Crop, ZoomIn, ZoomOut, RotateCcw, Check, X } from "lucide-react"

export type AspectRatio = "free" | "3:4" | "1:1" | "16:9" | "4:3"

interface ImageCropperDialogProps {
  open: boolean
  imageFile: File | null
  aspectRatio?: AspectRatio
  onConfirm: (croppedBlob: Blob, previewUrl: string) => void
  onCancel: () => void
}

const ASPECT_RATIOS: { label: string; value: AspectRatio; ratio: number | null }[] = [
  { label: "Free",  value: "free",  ratio: null },
  { label: "3 : 4", value: "3:4",   ratio: 3 / 4 },
  { label: "1 : 1", value: "1:1",   ratio: 1 },
  { label: "4 : 3", value: "4:3",   ratio: 4 / 3 },
  { label: "16 : 9",value: "16:9",  ratio: 16 / 9 },
]

export default function ImageCropperDialog({
  open,
  imageFile,
  aspectRatio = "free",
  onConfirm,
  onCancel,
}: ImageCropperDialogProps) {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef    = useRef<HTMLImageElement | null>(null)
  const animFrame   = useRef<number>(0)

  // Viewport state
  const [zoom, setZoom]       = useState(1)
  const [panX, setPanX]       = useState(0)
  const [panY, setPanY]       = useState(0)
  const [ratio, setRatio]     = useState<AspectRatio>(aspectRatio)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const dragging = useRef(false)
  const lastPos  = useRef({ x: 0, y: 0 })

  // Derived numeric ratio
  const numericRatio = ASPECT_RATIOS.find(r => r.value === ratio)?.ratio ?? null

  // ------------------------------------------------------------------
  // Load image from File
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!open || !imageFile) return
    setImgLoaded(false)
    setZoom(1); setPanX(0); setPanY(0)

    const url = URL.createObjectURL(imageFile)
    const img = new Image()
    img.onload = () => {
      imageRef.current = img
      setImgLoaded(true)
      URL.revokeObjectURL(url)
    }
    img.src = url
    return () => URL.revokeObjectURL(url)
  }, [open, imageFile])

  // ------------------------------------------------------------------
  // Render loop
  // ------------------------------------------------------------------
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const img    = imageRef.current
    if (!canvas || !img) return

    const W = canvas.width
    const H = canvas.height
    const ctx = canvas.getContext("2d")!
    ctx.clearRect(0, 0, W, H)

    // Draw image centred + panned + zoomed
    const scale  = Math.min(W / img.naturalWidth, H / img.naturalHeight) * zoom
    const imgW   = img.naturalWidth  * scale
    const imgH   = img.naturalHeight * scale
    const drawX  = (W - imgW) / 2 + panX
    const drawY  = (H - imgH) / 2 + panY

    ctx.drawImage(img, drawX, drawY, imgW, imgH)

    // Crop overlay
    let cropW: number, cropH: number
    if (numericRatio) {
      if (W / H > numericRatio) {
        cropH = H * 0.85; cropW = cropH * numericRatio
      } else {
        cropW = W * 0.85; cropH = cropW / numericRatio
      }
    } else {
      cropW = W * 0.85; cropH = H * 0.85
    }
    const cropX = (W - cropW) / 2
    const cropY = (H - cropH) / 2

    // Dim outside crop
    ctx.save()
    ctx.fillStyle = "rgba(0,0,0,0.55)"
    ctx.fillRect(0, 0, W, H)
    ctx.clearRect(cropX, cropY, cropW, cropH)
    ctx.restore()

    // Crop border
    ctx.strokeStyle = "rgba(255,255,255,0.8)"
    ctx.lineWidth   = 1.5
    ctx.strokeRect(cropX, cropY, cropW, cropH)

    // Rule of thirds
    ctx.strokeStyle = "rgba(255,255,255,0.2)"
    ctx.lineWidth   = 0.5
    for (let i = 1; i <= 2; i++) {
      ctx.beginPath(); ctx.moveTo(cropX + (cropW / 3) * i, cropY); ctx.lineTo(cropX + (cropW / 3) * i, cropY + cropH); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cropX, cropY + (cropH / 3) * i); ctx.lineTo(cropX + cropW, cropY + (cropH / 3) * i); ctx.stroke()
    }

    // Corner handles
    const hs = 12
    ctx.fillStyle = "white"
    const corners = [[cropX, cropY], [cropX + cropW - hs, cropY], [cropX, cropY + cropH - hs], [cropX + cropW - hs, cropY + cropH - hs]]
    corners.forEach(([cx, cy]) => ctx.fillRect(cx, cy, hs, hs))
  }, [zoom, panX, panY, numericRatio])

  useEffect(() => {
    if (!imgLoaded) return
    cancelAnimationFrame(animFrame.current)
    animFrame.current = requestAnimationFrame(draw)
  }, [draw, imgLoaded])

  // Set canvas size on mount/resize
  useEffect(() => {
    const canvas = canvasRef.current
    const cont   = containerRef.current
    if (!canvas || !cont) return
    const ro = new ResizeObserver(() => {
      canvas.width  = cont.clientWidth
      canvas.height = cont.clientHeight
      draw()
    })
    ro.observe(cont)
    canvas.width  = cont.clientWidth
    canvas.height = cont.clientHeight
    return () => ro.disconnect()
  }, [draw])

  // ------------------------------------------------------------------
  // Pointer events (drag to pan)
  // ------------------------------------------------------------------
  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    lastPos.current  = { x: e.clientX, y: e.clientY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    setPanX(p => p + e.clientX - lastPos.current.x)
    setPanY(p => p + e.clientY - lastPos.current.y)
    lastPos.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerUp = () => { dragging.current = false }

  // Scroll to zoom
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setZoom(z => Math.max(0.3, Math.min(5, z - e.deltaY * 0.001)))
  }

  // ------------------------------------------------------------------
  // Confirm — render crop region to output canvas
  // ------------------------------------------------------------------
  const handleConfirm = async () => {
    const canvas = canvasRef.current
    const img    = imageRef.current
    if (!canvas || !img) return
    setConfirming(true)

    const W = canvas.width
    const H = canvas.height

    let cropW: number, cropH: number
    if (numericRatio) {
      if (W / H > numericRatio) { cropH = H * 0.85; cropW = cropH * numericRatio }
      else                       { cropW = W * 0.85; cropH = cropW / numericRatio }
    } else {
      cropW = W * 0.85; cropH = H * 0.85
    }
    const cropX = (W - cropW) / 2
    const cropY = (H - cropH) / 2

    // Extract crop from the display canvas
    const out = document.createElement("canvas")
    out.width  = cropW
    out.height = cropH
    const ctx = out.getContext("2d")!
    ctx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH)

    out.toBlob(blob => {
      if (!blob) { setConfirming(false); return }
      const preview = URL.createObjectURL(blob)
      onConfirm(blob, preview)
      setConfirming(false)
    }, "image/jpeg", 0.92)
  }

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={() => onCancel()}>
      <DialogContent className="bg-[#050505] border-white/10 text-white max-w-3xl w-full p-0 overflow-hidden">
        <DialogHeader className="px-8 pt-7 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crop size={16} className="text-gray-400" />
              <DialogTitle className="font-serif text-xl uppercase tracking-widest font-light">
                Crop Image
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* Aspect ratio selector */}
        <div className="flex gap-2 px-8 pt-5">
          {ASPECT_RATIOS.map(r => (
            <button
              key={r.value}
              onClick={() => setRatio(r.value)}
              className={`px-3 py-1.5 text-[9px] uppercase tracking-widest border transition-all ${
                ratio === r.value
                  ? "bg-white text-black border-white"
                  : "border-white/15 text-gray-500 hover:border-white/40 hover:text-white"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div
          ref={containerRef}
          className="relative mx-8 mt-4 mb-0 bg-[#111] border border-white/10 cursor-move select-none overflow-hidden"
          style={{ height: 380 }}
          onWheel={onWheel}
        >
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border border-white/20 border-t-white/80 rounded-full animate-spin" />
            </div>
          )}
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          />
        </div>

        {/* Zoom controls */}
        <div className="flex items-center justify-center gap-4 px-8 pt-3">
          <button
            onClick={() => setZoom(z => Math.max(0.3, z - 0.1))}
            className="size-8 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all text-gray-400 hover:text-white"
          >
            <ZoomOut size={14} />
          </button>
          <div className="flex-1 max-w-48 h-px bg-white/10 relative">
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-3 bg-white rounded-full shadow"
              style={{ left: `${((zoom - 0.3) / 4.7) * 100}%` }}
            />
          </div>
          <button
            onClick={() => setZoom(z => Math.min(5, z + 0.1))}
            className="size-8 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all text-gray-400 hover:text-white"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => { setZoom(1); setPanX(0); setPanY(0) }}
            className="size-8 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all text-gray-400 hover:text-white"
            title="Reset"
          >
            <RotateCcw size={14} />
          </button>
          <span className="text-[9px] uppercase tracking-widest text-gray-600 w-12 text-right">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        <DialogFooter className="px-8 py-6 border-t border-white/5 mt-4 flex gap-4">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="flex-1 rounded-none border border-white/10 uppercase tracking-widest text-[10px] text-gray-400 hover:text-white hover:bg-white/5"
          >
            <X size={12} className="mr-2" /> Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!imgLoaded || confirming}
            className="flex-1 bg-white text-black hover:bg-gray-200 rounded-none uppercase tracking-widest text-[10px] transition-all"
          >
            {confirming
              ? <div className="w-4 h-4 border border-black/30 border-t-black rounded-full animate-spin" />
              : <><Check size={12} className="mr-2" /> Apply Crop</>
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
