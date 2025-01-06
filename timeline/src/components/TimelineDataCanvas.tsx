import * as React from 'react'

interface TimelineDataCanvasProps {
    
}

export default function TimelineDataCanvas({ }: TimelineDataCanvasProps) {

    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    return (
        <canvas ref={canvasRef} width={} height={} />
    )
}
