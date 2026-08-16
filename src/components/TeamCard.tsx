import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Instagram } from "lucide-react";
import StarBorder from "@/components/StarBorder";

interface TeamMember {
	id: number;
	name: string;
	role: string;
	designation: string;
	bio: string;
	image: string;
	imagePosition?: string;
	socials: {
		github: string;
		linkedin: string;
		instagram: string;
	};
}

interface TeamCardProps {
	member: TeamMember;
	index: number;
}

const isValidLink = (link: string | undefined): boolean => {
	return !!link && link !== "#" && link.trim() !== "";
};

const renderMemberImage = (image: string, name: string, position?: string) => {
	const isFilePath = image.startsWith('/') || image.startsWith('http') || /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(image);

	if (isFilePath) {
		return (
			<div className="relative w-14 h-14 mx-auto rounded-full overflow-hidden mb-1.5 sm:mb-2 border-2 border-[#00B871]/20 bg-white/10 flex items-center justify-center">
				<Image
					src={image}
					alt={name}
					fill
					style={position ? { objectPosition: position } : undefined}
					className="object-cover"
				/>
			</div>
		);
	}

	return <div className="text-3xl mb-1.5 sm:mb-2 text-center">{image}</div>;
};

export function TeamCard({ member, index }: TeamCardProps) {

	const cardContent = (
		<div className="relative rounded-2xl p-4 sm:p-5 hover-lift transition-all duration-300 backdrop-blur-[18px] bg-white/15 dark:bg-white/15 min-h-[230px] sm:min-h-[250px] flex flex-col">
			{/* Glassmorphic border */}
			<div className="absolute inset-0 rounded-2xl border border-white/18 pointer-events-none" />

			{/* Profile Info - Always visible on mobile, hover effect on desktop */}
			<div className="relative z-10 lg:group-hover:translate-y-full transition-transform duration-300 flex-1 flex flex-col">
				{renderMemberImage(member.image, member.name, member.imagePosition)}
				<h3 className="text-base sm:text-lg font-poppins font-bold mb-1 text-center text-gray-900 dark:text-white">
					{member.name}
				</h3>
				<p className="text-xs sm:text-sm font-semibold text-center mb-1 text-[#00B871]">
					{member.designation}
				</p>
				<p className="text-xs sm:text-sm text-center mb-1.5 sm:mb-2 opacity-90 text-gray-600 dark:text-gray-300">
					{member.role}
				</p>
				<div className="h-px bg-gradient-to-r from-transparent via-[#00B871]/80 to-transparent mb-1.5 sm:mb-2" />

				{/* Show bio on mobile, hide on desktop (shown on hover) */}
				<p className="text-xs sm:text-sm text-center mb-1.5 sm:mb-2 line-clamp-2 lg:hidden opacity-90 text-gray-600 dark:text-gray-300">
					{member.bio}
				</p>
				<p className="text-xs sm:text-sm text-center hidden lg:block opacity-90 text-gray-600 dark:text-gray-300">
					Hover to learn more
				</p>

				{/* Spacer to push social links to bottom */}
				<div className="flex-1 min-h-[4px]" />

				{/* Social Links - Mobile only, desktop on hover - Fixed height container */}
				<div className="flex gap-1.5 sm:gap-2 justify-center mt-1.5 sm:mt-2 min-h-[36px] sm:min-h-[40px] items-center lg:hidden">
					{isValidLink(member.socials.github) && (
						<a
							href={member.socials.github}
							target="_blank"
							rel="noopener noreferrer"
							className="group/social p-2.5 rounded-xl backdrop-blur-[18px] bg-white/15 hover:bg-white/25 active:scale-95 transition-all duration-300 border border-white/18"
							title="GitHub"
						>
							<Github className="w-4 h-4 sm:w-5 sm:h-5 text-[#00B871] transition-transform group-hover/social:scale-110" />
						</a>
					)}
					{isValidLink(member.socials.linkedin) && (
						<a
							href={member.socials.linkedin}
							target="_blank"
							rel="noopener noreferrer"
							className="group/social p-2.5 rounded-xl backdrop-blur-[18px] bg-white/15 hover:bg-white/25 active:scale-95 transition-all duration-300 border border-white/18"
							title="LinkedIn"
						>
							<Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-[#00B871] transition-transform group-hover/social:scale-110" />
						</a>
					)}
					{isValidLink(member.socials.instagram) && (
						<a
							href={member.socials.instagram}
							target="_blank"
							rel="noopener noreferrer"
							className="group/social p-2.5 rounded-xl backdrop-blur-[18px] bg-white/15 hover:bg-white/25 active:scale-95 transition-all duration-300 border border-white/18"
							title="Instagram"
						>
							<Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-[#00B871] transition-transform group-hover/social:scale-110" />
						</a>
					)}
				</div>
			</div>

			{/* Hover State Content - Desktop only */}
			<div className="hidden lg:flex absolute inset-0 p-4 sm:p-5 flex-col rounded-2xl -translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[18px] bg-white/15 z-20">
				{/* Glassmorphic border for hover state */}
				<div className="absolute inset-0 rounded-2xl border border-white/18 pointer-events-none" />

				<div className="relative z-10 flex flex-col flex-1">
					{renderMemberImage(member.image, member.name, member.imagePosition)}
					<h3 className="text-base sm:text-lg font-poppins font-bold mb-1 text-center text-gray-900 dark:text-white">
						{member.name}
					</h3>
					<p className="text-xs sm:text-sm font-semibold text-center mb-1.5 text-[#00B871]">
						{member.designation}
					</p>
					<div className="h-px bg-gradient-to-r from-transparent via-[#00B871]/80 to-transparent mb-1.5" />

					<div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
						<p className="text-xs sm:text-sm text-center mb-2 opacity-90 text-gray-600 dark:text-gray-300">
							{member.bio}
						</p>
					</div>

					<div className="flex gap-2 justify-center mt-2 min-h-[40px] items-center">
						{isValidLink(member.socials.github) && (
							<a
								href={member.socials.github}
								target="_blank"
								rel="noopener noreferrer"
								className="group/social p-2.5 rounded-xl backdrop-blur-[18px] bg-white/15 hover:bg-white/25 active:scale-95 transition-all duration-300 border border-white/18"
								title="GitHub"
							>
								<Github className="w-4 h-4 sm:w-5 sm:h-5 text-[#00B871] transition-transform group-hover/social:scale-110" />
							</a>
						)}
						{isValidLink(member.socials.linkedin) && (
							<a
								href={member.socials.linkedin}
								target="_blank"
								rel="noopener noreferrer"
								className="group/social p-2.5 rounded-xl backdrop-blur-[18px] bg-white/15 hover:bg-white/25 active:scale-95 transition-all duration-300 border border-white/18"
								title="LinkedIn"
							>
								<Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-[#00B871] transition-transform group-hover/social:scale-110" />
							</a>
						)}
						{isValidLink(member.socials.instagram) && (
							<a
								href={member.socials.instagram}
								target="_blank"
								rel="noopener noreferrer"
								className="group/social p-2.5 rounded-xl backdrop-blur-[18px] bg-white/15 hover:bg-white/25 active:scale-95 transition-all duration-300 border border-white/18"
								title="Instagram"
							>
								<Instagram className="w-4 h-4 sm:w-5 sm:h-5 text-[#00B871] transition-transform group-hover/social:scale-110" />
							</a>
						)}
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div
			className="group relative overflow-hidden rounded-2xl"
			style={{
				animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
			}}
		>
			{/* Card Background Gradient - GPU Accelerated */}
			<div className="absolute inset-0 bg-gradient-to-br from-[#00B871]/20 via-[#00B871]/10 to-[#FFD700]/20 dark:from-[#00B871]/15 dark:to-[#FFD700]/15 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ filter: 'blur(24px)', transform: 'translateZ(0)', willChange: 'opacity, filter' }} />

			<StarBorder
				as="div"
				color="#00B871"
				speed="8s"
				thickness={2}
				className="w-full overflow-hidden rounded-2xl"
			>
				<div
					className="relative rounded-2xl transition-shadow duration-300 overflow-hidden"
					style={{
						boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
					}}
				>
					{cardContent}
				</div>
			</StarBorder>
		</div>
	);
}