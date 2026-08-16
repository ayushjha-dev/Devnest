import { useRef, useEffect, useState } from "react";
import { GeistPixelSquare } from "geist/font/pixel";

import { motion, useScroll, useTransform } from "framer-motion";

import Head from "next/head";
import { Layout } from "@/components/Layout";
import PixelBlast from "@/components/PixelBlast";
import ScrollTypingText from "@/components/ScrollTypingText";
import DomeGallery from "@/components/DomeGallery";
import ScrollDown from "@/components/ScrollDown";

const PROMPTATHON_IMAGES = [
	"/events/promptathon/20260225_100656.jpg",
	"/events/promptathon/20260225_100712.jpg",
	"/events/promptathon/20260225_101003.jpg",
	"/events/promptathon/20260225_101005.jpg",
	"/events/promptathon/20260225_101022.jpg",
	"/events/promptathon/20260225_101035.jpg",
	"/events/promptathon/20260225_101355.jpg",
	"/events/promptathon/20260225_101536.jpg",
	"/events/promptathon/20260225_101548.jpg",
	"/events/promptathon/20260225_101550.jpg",
	"/events/promptathon/20260225_103240.jpg",
	"/events/promptathon/20260225_103301.jpg",
	"/events/promptathon/20260225_103303.jpg",
	"/events/promptathon/20260225_103421.jpg",
	"/events/promptathon/20260225_103441.jpg",
	"/events/promptathon/20260225_103542.jpg",
	"/events/promptathon/20260225_104627.jpg",
	"/events/promptathon/20260225_104630.jpg",
	"/events/promptathon/20260225_104639.jpg",
	"/events/promptathon/20260225_104708.jpg",
	"/events/promptathon/20260225_104710.jpg",
	"/events/promptathon/20260225_104712.jpg",
	"/events/promptathon/20260225_105746.jpg",
	"/events/promptathon/20260225_105749.jpg",
	"/events/promptathon/20260225_105810.jpg",
	"/events/promptathon/20260225_105811.jpg",
	"/events/promptathon/20260225_105831.jpg",
	"/events/promptathon/20260225_105905.jpg",
	"/events/promptathon/20260225_105906.jpg",
	"/events/promptathon/20260225_130321.jpg",
	"/events/promptathon/20260225_130334.jpg",
	"/events/promptathon/20260225_130346.jpg",
	"/events/promptathon/20260225_160733.jpg",
	"/events/promptathon/20260225_160733(1).jpg",
	"/events/promptathon/20260225_160740.jpg",
	"/events/promptathon/20260225_160740(1).jpg",
	"/events/promptathon/20260225_160812.jpg",
	"/events/promptathon/20260225_160812(1).jpg",
	"/events/promptathon/20260225_160814.jpg",
	"/events/promptathon/20260225_160814(1).jpg",
	"/events/promptathon/20260225_160901.jpg",
	"/events/promptathon/20260225_160901(1).jpg",
	"/events/promptathon/20260225_160905.jpg",
	"/events/promptathon/20260225_160905(1).jpg",
	"/events/promptathon/20260225_160907.jpg",
	"/events/promptathon/20260225_160907(1).jpg",
	"/events/promptathon/20260225_161018.jpg",
	"/events/promptathon/20260225_161021.jpg",
	"/events/promptathon/20260225_161058.jpg",
	"/events/promptathon/20260225_161100.jpg",
	"/events/promptathon/20260225_161101.jpg",
	"/events/promptathon/20260225_161353.jpg",
	"/events/promptathon/20260225_161357.jpg",
	"/events/promptathon/20260225_161519.jpg",
	"/events/promptathon/20260225_161521.jpg",
	"/events/promptathon/20260225_161554.jpg",
];

// Tint wrapper: applies blue filter to dome, removes it when image is previewed
function DomeTintWrapper({ children }: { children: React.ReactNode }) {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [enlarging, setEnlarging] = useState(false);

	useEffect(() => {
		const el = wrapperRef.current;
		if (!el) return;
		const observer = new MutationObserver(() => {
			const sphere = el.querySelector('.sphere-root');
			setEnlarging(sphere?.getAttribute('data-enlarging') === 'true');
		});
		observer.observe(el, { subtree: true, attributes: true, attributeFilter: ['data-enlarging'] });
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={wrapperRef}
			className="w-full h-full"
			style={{
				filter: enlarging ? 'none' : 'sepia(1) hue-rotate(190deg) saturate(4) brightness(0.85)',
				transition: 'filter 300ms ease'
			}}
		>
			{children}
		</div>
	);
}

// Helper component for stat cards with scale animation
const StatCard = ({ value, label, color, progress }: { value: string; label: string; color: string; progress: any }) => {
	const opacity = progress;
	const scale = useTransform(progress, [0, 1], [0.7, 1]);

	return (
		<motion.div
			className="backdrop-blur-2xl bg-background/30 rounded-2xl sm:rounded-3xl p-5 sm:p-10 md:p-14 border-2 border-blue-400/30"
			style={{ opacity, scale }}
		>
			<div
				className={`text-5xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black mb-2 sm:mb-6 bg-gradient-to-r ${color} bg-clip-text text-transparent`}
			>
				{value}
			</div>
			<div className="text-xs sm:text-2xl md:text-3xl text-muted-foreground font-black uppercase tracking-wider">
				{label}
			</div>
		</motion.div>
	);
};



export default function Promptathon2026Page() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [domeRadius, setDomeRadius] = useState(600);

	useEffect(() => {
		const update = () => setDomeRadius(window.innerWidth < 768 ? 260 : 600);
		update();
		window.addEventListener('resize', update);
		return () => window.removeEventListener('resize', update);
	}, []);

	const isMobile = domeRadius < 600;
	const { scrollYProgress } = useScroll({
		container: containerRef,
		offset: ["start start", "end end"]
	});

	// Section 1: 0 - 0.2 (Title)
	const section1Progress = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
	const s1TitleOpacity = useTransform(section1Progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.3]);
	const s1TitleScale = useTransform(section1Progress, [0, 0.2], [0.8, 1]);
	const s1YearOpacity = useTransform(section1Progress, [0.2, 0.4], [0, 1]);
	const s1TextOpacity = useTransform(section1Progress, [0.4, 0.6], [0, 1]);

	// Section 2: 0.2 - 0.4 (Challenge)
	const section2Progress = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
	const s2Opacity = useTransform(section2Progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.3]);
	const s2TitleOpacity = useTransform(section2Progress, [0, 0.15], [0, 1]);

	// Section 3: 0.4 - 0.6 (Impact)
	const section3Progress = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
	const s3Opacity = useTransform(section3Progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.3]);
	const s3TitleOpacity = useTransform(section3Progress, [0, 0.15], [0, 1]);
	const s3Stat1 = useTransform(section3Progress, [0.15, 0.3], [0, 1]);
	const s3Stat2 = useTransform(section3Progress, [0.25, 0.4], [0, 1]);
	const s3Stat3 = useTransform(section3Progress, [0.35, 0.5], [0, 1]);

	// Section 4: 0.6 - 0.8 (Victory)
	const section4Progress = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
	const s4Opacity = useTransform(section4Progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.3]);
	const s4IconOpacity = useTransform(section4Progress, [0, 0.2], [0, 1]);
	const s4TitleOpacity = useTransform(section4Progress, [0.2, 0.4], [0, 1]);

	// Section 5: 0.8 - 1.0 (Gallery)
	const section5Progress = useTransform(scrollYProgress, [0.8, 1.0], [0, 1]);
	const s5Opacity = useTransform(section5Progress, [0, 0.1], [0, 1]);

	return (
		<div id="promptathon-page" className={GeistPixelSquare.className}>
			<Layout pauseTerminal customTheme="blue-gold">
				<Head>
					<title>DevNest | Promptathon 2026</title>
					<style>{`
						#promptathon-page h1,#promptathon-page h2,#promptathon-page h3,
						#promptathon-page h4,#promptathon-page h5,#promptathon-page h6{font-family:inherit}
						.pp-dvh{height:100dvh}
					`}</style>
				</Head>
				{/* FIXED BACKGROUND LAYER */}
				<div className="fixed inset-0 z-0 overflow-hidden bg-black">
					<div className="absolute inset-0">
						<PixelBlast
							variant="square"
							pixelSize={4}
							color="#3b82f6"
							patternScale={2}
							patternDensity={1}
							pixelSizeJitter={0}
							enableRipples
							rippleSpeed={0.4}
							rippleThickness={0.12}
							rippleIntensityScale={1.5}
							liquid={false}
							speed={0.5}
							edgeFade={0.25}
							transparent
							className="w-full h-full"
						/>
					</div>
					<div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-blue-950/30" />
				</div>

				{/* SCROLL CONTAINER - 5 sections, each 500vh for scrollytelling */}
				<div ref={containerRef} className="relative z-10 overflow-y-scroll h-screen pp-dvh" style={{ scrollSnapType: 'y proximity' }}>

					{/* Section 1: Title Reveal - Title types → Year appears → Tagline types */}
					<section className="h-[500vh] relative">
						<motion.div
							className="sticky top-0 h-screen pp-dvh flex items-start justify-center pt-24"
							style={{ opacity: s1TitleOpacity }}
						>
							<div className="text-center px-6">
								<motion.h1
									className="text-7xl sm:text-8xl md:text-[10rem] lg:text-[11rem] font-black leading-none tracking-tighter"
									style={{
										scale: s1TitleScale
									}}
								>
									<motion.span
										className="block bg-gradient-to-r from-blue-400 via-blue-300 to-amber-400 bg-clip-text text-transparent"
										style={{ opacity: s1TitleOpacity }}
									>
										<ScrollTypingText text="PROMPTATHON" progress={section1Progress} scrollRange={[0, 0.2]} showCursor={true} />
									</motion.span>
								</motion.h1>

								<motion.div style={{ opacity: s1YearOpacity }}>
									<span className="block text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] text-amber-400 mt-6 font-black tracking-tight">
										2026
									</span>
								</motion.div>

								<motion.p
									className="text-3xl sm:text-4xl md:text-5xl text-blue-300 mt-16 font-bold tracking-wide"
									style={{
										opacity: s1TextOpacity

									}}
								>
									<ScrollTypingText text="Where words control intelligence..." progress={section1Progress} scrollRange={[0.4, 0.6]} showCursor={true} />
								</motion.p>
							</div>
						</motion.div>
					</section>

					{/* Section 2: The Challenge - Single paragraph scroll-typed reveal */}
					<section className="h-[500vh] relative">
						<motion.div
							className="sticky top-0 h-screen pp-dvh flex items-start justify-center px-6 pt-12 sm:pt-20"
							style={{ opacity: s2Opacity }}
						>
							<div className="max-w-4xl w-full">
								<motion.h2
									className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 sm:mb-16 tracking-tighter bg-gradient-to-r from-blue-400 via-blue-300 to-amber-400 bg-clip-text text-transparent"
									style={{ opacity: s2TitleOpacity }}
								>
									THE CHALLENGE
								</motion.h2>
								<p className="text-base sm:text-2xl md:text-4xl leading-relaxed text-white/90 font-medium">
									<ScrollTypingText
										text="No code. No keyboards. Just raw intelligence against a problem. Participants crafted prompts that turned ideas into real solutions — evaluated on clarity, creativity, and impact. Judged by S.H. Akash Sharan, guided by faculty Mr. Wakeel Bhatt & Mr. Aaqib Iqbal."
										progress={section2Progress}
										scrollRange={[0.1, 0.85]}
										showCursor={true}
									/>
								</p>
							</div>
						</motion.div>
					</section>

					{/* Section 3: The Impact - Title → Stats appear sequentially → Details */}
					<section className="h-[500vh] relative">
						<motion.div
							className="sticky top-0 h-screen pp-dvh flex items-start justify-center px-6 pt-12 sm:pt-20"
							style={{ opacity: s3Opacity }}
						>
							<div className="max-w-6xl w-full text-center">
								<motion.h2
									className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-8 sm:mb-20 tracking-tighter bg-gradient-to-r from-blue-400 via-blue-300 to-amber-400 bg-clip-text text-transparent"
									style={{ opacity: s3TitleOpacity }}
								>
									THE IMPACT
								</motion.h2>

								<div className="grid grid-cols-2 gap-4 sm:gap-10 md:gap-16 mb-8 sm:mb-20">
									<StatCard value="68" label="Participants" color="from-blue-400 to-blue-500" progress={s3Stat1} />
									<StatCard value="5" label="Hours" color="from-blue-300 to-teal-400" progress={s3Stat2} />
								</div>

								<motion.div
									className="space-y-2 sm:space-y-4"
									style={{ opacity: useTransform(section3Progress, [0.5, 0.7], [0, 1]) }}
								>
									<p className="text-2xl sm:text-4xl md:text-5xl font-black text-blue-400">
										Feb 25, 2026 • IBM Lab
									</p>
									<p className="text-base sm:text-2xl md:text-3xl text-muted-foreground font-bold">
										Lamrin Tech Skills University, Punjab
									</p>
									<p className="text-sm sm:text-xl text-blue-300/70 font-medium">
										University School of Engineering &amp; Technology
									</p>
								</motion.div>
							</div>
						</motion.div>
					</section>

					{/* Section 4: Victory - Trophy icon → Title types → Stats grid → Quote */}
					<section className="h-[500vh] relative">
						<motion.div
							className="sticky top-0 h-screen pp-dvh flex items-start justify-center px-4 sm:px-6 pt-8 sm:pt-20 overflow-y-auto"
							style={{ opacity: s4Opacity }}
						>
							<div className="max-w-5xl w-full text-center pb-8">
								<motion.div
									className="mb-4 sm:mb-12"
									style={{
										opacity: s4IconOpacity,
										scale: useTransform(s4IconOpacity, [0, 1], [0.3, 1]),
										rotate: useTransform(s4IconOpacity, [0, 1], [-180, 0])
									}}
								>
									<span className="block text-center text-[3.5rem] sm:text-[8rem] leading-none font-black text-amber-400 tracking-tighter">[WIN]</span>
								</motion.div>

								<motion.h2
									className="text-3xl sm:text-6xl md:text-8xl font-black mb-4 sm:mb-12 tracking-tighter bg-gradient-to-r from-blue-400 via-blue-300 to-amber-400 bg-clip-text text-transparent"
									style={{ opacity: s4TitleOpacity }}
								>
									<ScrollTypingText text="A GRAND SUCCESS!" progress={section4Progress} scrollRange={[0.2, 0.4]} showCursor={true} />
								</motion.h2>

								<motion.div
									className="grid sm:grid-cols-3 gap-3 sm:gap-6 md:gap-8 mb-6 sm:mb-12"
									style={{ opacity: useTransform(section4Progress, [0.4, 0.6], [0, 1]) }}
								>
									{[
										{
											medal: '🥇', position: '1st Place', team: 'HyperOPS',
											members: ['Venkata Sai Revanth J.', 'Ch Sathwik Reddy', 'G Siva'],
											border: 'border-amber-400/60', bg: 'from-amber-400/15 to-amber-600/5'
										},
										{
											medal: '🥈', position: '2nd Place', team: 'phoneix.assain',
											members: ['Abhijeet Kumar Mandal', 'Shivam Kumar', 'Satyam Kumar', 'Sujal Roy'],
											border: 'border-blue-300/60', bg: 'from-blue-300/15 to-blue-500/5'
										},
										{
											medal: '🥉', position: '3rd Place', team: 'CODE GEASS',
											members: ['Ayush Gora', 'Nitin Sharma'],
											border: 'border-orange-400/60', bg: 'from-orange-400/15 to-orange-600/5'
										},
									].map((item, i) => (
										<div
											key={i}
											className={`backdrop-blur-xl bg-gradient-to-br ${item.bg} rounded-2xl sm:rounded-3xl p-4 sm:p-6 border ${item.border} text-left`}
										>
											<div className="text-2xl sm:text-4xl mb-1 sm:mb-2"><span className="emoji-white">{item.medal}</span></div>
											<div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{item.position}</div>
											<div className="text-base sm:text-2xl font-black text-white mb-2 sm:mb-4">{item.team}</div>
											<ul className="space-y-0.5">
												{item.members.map((m, j) => (
													<li key={j} className="text-xs sm:text-sm text-blue-200/80 font-medium">{m}</li>
												))}
											</ul>
										</div>
									))}
								</motion.div>

								<motion.blockquote
									className="text-xl sm:text-3xl md:text-5xl font-black italic text-amber-400"
									style={{ opacity: useTransform(section4Progress, [0.6, 0.8], [0, 1]) }}
								>
									&ldquo;Those who ASKED BETTER, WON.&rdquo;
								</motion.blockquote>
							</div>
						</motion.div>
					</section>

					{/* Section 5: Gallery */}
					<section className="h-[500vh] relative">
						<motion.div
							className="sticky top-0 h-screen pp-dvh"
							style={{ opacity: s5Opacity }}
						>
							<DomeTintWrapper>
								<DomeGallery
									images={PROMPTATHON_IMAGES}
									fit={isMobile ? 1 : 0.8}
									fitBasis={isMobile ? 'height' : 'auto'}
									minRadius={isMobile ? 400 : domeRadius}
									maxVerticalRotationDeg={0}
									segments={34}
									dragDampening={2}
									grayscale
								/>
							</DomeTintWrapper>
						</motion.div>
					</section>

				</div>

				{/* Sticky scroll down indicator */}
				<ScrollDown scrollProgress={scrollYProgress} fadeOutStart={0} fadeOutEnd={0.05} />
			</Layout>
		</div>
	);
}
