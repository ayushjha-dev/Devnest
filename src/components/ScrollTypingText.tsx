'use client';

import { useEffect, useRef, useState } from 'react';
import { MotionValue, useTransform } from 'framer-motion';

interface ScrollTypingTextProps {
	text: string;
	progress: MotionValue<number>;
	scrollRange?: [number, number]; // Range of scroll progress to animate over (default [0, 1])
	showCursor?: boolean;
	className?: string;
}

export default function ScrollTypingText({
	text,
	progress,
	scrollRange = [0, 1],
	showCursor = false,
	className = ''
}: ScrollTypingTextProps) {
	const [displayedText, setDisplayedText] = useState('');
	const lengthRef = useRef(0);

	useEffect(() => {
		const unsubscribe = progress.on('change', (value) => {
			const start = scrollRange[0];
			const end = scrollRange[1];
			const normalizedProgress = Math.max(0, Math.min(1, (value - start) / (end - start)));
			const charsToShow = Math.floor(normalizedProgress * text.length);

			if (charsToShow !== lengthRef.current) {
				lengthRef.current = charsToShow;
				setDisplayedText(text.substring(0, charsToShow));
			}
		});

		return () => unsubscribe();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [progress, text, scrollRange[0], scrollRange[1]]);

	const done = lengthRef.current >= text.length;

	return (
		<span className={className}>
			{displayedText}
			{showCursor && !done && (
				<span className="animate-pulse">|</span>
			)}
		</span>
	);
}
