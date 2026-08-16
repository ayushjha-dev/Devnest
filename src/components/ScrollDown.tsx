import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

interface ScrollDownProps {
	scrollProgress: any; // MotionValue from framer-motion
	fadeOutStart?: number; // At what scroll progress to start fading (0-1)
	fadeOutEnd?: number; // At what scroll progress to fully fade (0-1)
}

export default function ScrollDown({
	scrollProgress,
	fadeOutStart = 0,
	fadeOutEnd = 0.05
}: ScrollDownProps) {
	// Fade out the component as user scrolls
	const opacity = useTransform(scrollProgress, [fadeOutStart, fadeOutEnd], [1, 0]);

	return (
		<motion.div
			className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
			style={{ opacity }}
		>
			<div className="flex flex-col items-center gap-2">
				<motion.p
					className="text-xs sm:text-sm md:text-base font-bold tracking-widest text-blue-300/90 uppercase"
					animate={{ opacity: [0.5, 1, 0.5] }}
					transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
				>
					Scroll Down
				</motion.p>
				<motion.div
					className="flex flex-col items-center"
					animate={{ y: [0, 8, 0] }}
					transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="text-blue-400"
					>
						<path
							d="M12 5V19M12 19L19 12M12 19L5 12"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</motion.div>
				{/* Optional: Mouse scroll indicator */}
				<motion.div
					className="w-6 h-10 border-2 border-blue-400/60 rounded-full mt-2 relative"
					animate={{ opacity: [0.4, 0.8, 0.4] }}
					transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
				>
					<motion.div
						className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-2 bg-blue-400 rounded-full"
						animate={{ y: [0, 12, 0] }}
						transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
					/>
				</motion.div>
			</div>
		</motion.div>
	);
}
