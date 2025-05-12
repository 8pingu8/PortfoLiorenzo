import { useEffect, useRef } from 'react'
import VANTA from 'vanta/dist/vanta.net.min'
import * as THREE from 'three'

export function VantaBackground() {
	const vantaRef = useRef<HTMLDivElement>(null)
	const vantaEffect = useRef<any>(null)

	useEffect(() => {
		if (!vantaEffect.current) {
			vantaEffect.current = VANTA({
				el: vantaRef.current,
				THREE: THREE,
				mouseControls: true,
				touchControls: true,
				gyroControls: false,
				minHeight: 200.00,
				minWidth: 200.00,
				scale: 1.00,
				scaleMobile: 1.00,
				color: 0x3b82f6,
				backgroundColor: 0x0,
				points: 10.00,
				maxDistance: 25.00,
				spacing: 15.00
			})
		}

		return () => {
			if (vantaEffect.current) {
				vantaEffect.current.destroy()
			}
		}
	}, [])

	return (
		<div
			ref={vantaRef}
			className="fixed inset-0 pointer-events-none"
			style={{ 
				opacity: 0.15,
				zIndex: -1,
				backgroundColor: 'transparent'
			}}
		/>
	)
} 