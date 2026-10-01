import Image from "next/image";
import { Github, Linkedin, ArrowUpRight, Sparkles } from "lucide-react";

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
}

const isValidLink = (link: string | undefined): boolean => {
	return !!link && link !== "#" && link.trim() !== "";
};

const renderMemberImage = (image: string, name: string, position?: string) => {
	const isFilePath =
		image.startsWith("/") ||
		image.startsWith("http") ||
		/\.(jpg|jpeg|png|webp|svg|gif)$/i.test(image);

	if (isFilePath) {
		return (
			<div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl overflow-hidden border-2 border-black bg-white flex items-center justify-center shadow-[3px_3px_0px_#000] group-hover:scale-105 transition-all duration-300">
				<Image
					src={image}
					alt={name}
					fill
					sizes="(max-width: 640px) 80px, 96px"
					style={position ? { objectPosition: position } : undefined}
					className="object-cover transition-transform duration-300 group-hover:scale-105"
				/>
			</div>
		);
	}

	return (
		<div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl bg-[#FFE600] border-2 border-black flex items-center justify-center text-3xl shadow-[3px_3px_0px_#000] group-hover:scale-105 transition-all duration-300">
			{image}
		</div>
	);
};

export function TeamCard({ member }: TeamCardProps) {
	return (
		<div className="group relative rounded-2xl p-6 bg-white border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[7px_7px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden min-h-[340px]">
			{/* Front / Default Face (Visible on mobile and desktop until hover) */}
			<div className="flex flex-col items-center text-center w-full z-10">
				{/* Avatar */}
				<div className="mb-4">{renderMemberImage(member.image, member.name, member.imagePosition)}</div>

				{/* Designation Pill */}
				<span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#FFE600] text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000] mb-2">
					{member.designation}
				</span>

				{/* Name */}
				<h3 className="text-lg font-space font-bold text-black group-hover:underline transition-colors duration-200">
					{member.name}
				</h3>

				{/* Role */}
				<p className="text-xs font-semibold text-neutral-600 mt-0.5 mb-2 font-mono">
					{member.role}
				</p>

				{/* Bio snippet on mobile, hover prompt on desktop */}
				<p className="text-xs text-neutral-700 leading-relaxed line-clamp-2 px-1 lg:hidden font-medium">
					{member.bio}
				</p>

				{/* Desktop Hover Hint */}
				<div className="hidden lg:flex items-center gap-1.5 text-xs text-black font-bold mt-4 pt-4 border-t-2 border-black w-full justify-center">
					<Sparkles className="w-3.5 h-3.5 text-black" />
					<span>Hover to reveal profile</span>
				</div>

				{/* Mobile-only social links */}
				<div className="flex lg:hidden items-center justify-center gap-2 pt-4 mt-3 border-t-2 border-black w-full">
					{isValidLink(member.socials.github) && (
						<a
							href={member.socials.github}
							target="_blank"
							rel="noopener noreferrer"
							className="p-2 rounded-xl bg-[#FAF7EE] text-black hover:bg-[#FFE600] border-2 border-black shadow-[2px_2px_0px_#000] transition-colors"
							title="GitHub"
						>
							<Github className="w-4 h-4" />
						</a>
					)}
					{isValidLink(member.socials.linkedin) && (
						<a
							href={member.socials.linkedin}
							target="_blank"
							rel="noopener noreferrer"
							className="p-2 rounded-xl bg-[#FAF7EE] text-black hover:bg-[#70D6FF] border-2 border-black shadow-[2px_2px_0px_#000] transition-colors"
							title="LinkedIn"
						>
							<Linkedin className="w-4 h-4" />
						</a>
					)}

				</div>
			</div>

			{/* Slide-In Desktop Hover Panel */}
			<div className="hidden lg:flex absolute inset-0 p-6 flex-col justify-between rounded-2xl bg-white border-2 border-black shadow-[6px_6px_0px_#000] translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out z-20">
				<div className="flex flex-col">
					{/* Header inside hover panel */}
					<div className="flex items-center justify-between gap-2 pb-3 border-b-2 border-black">
						<div>
							<h4 className="font-space font-bold text-sm text-black">{member.name}</h4>
							<p className="text-[11px] font-bold text-neutral-700">{member.designation}</p>
						</div>
						<span className="w-2.5 h-2.5 rounded-full bg-[#88EA73] border border-black animate-pulse" />
					</div>

					{/* Full Bio */}
					<div className="py-4">
						<p className="text-xs text-neutral-800 font-medium leading-relaxed max-h-[140px] overflow-y-auto pr-1">
							{member.bio}
						</p>
					</div>
				</div>

				{/* Interactive Social Buttons */}
				<div className="pt-3 border-t-2 border-black">
					<p className="text-[10px] font-bold uppercase tracking-wider text-black mb-2 text-center">
						Connect with {member.name.split(" ")[0]}
					</p>
					<div className="flex items-center justify-center gap-2">
						{isValidLink(member.socials.github) && (
							<a
								href={member.socials.github}
								target="_blank"
								rel="noopener noreferrer"
								className="p-2.5 rounded-xl bg-white hover:bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all group/link"
								title="GitHub Profile"
							>
								<Github className="w-4 h-4 transition-transform group-hover/link:scale-110" />
							</a>
						)}
						{isValidLink(member.socials.linkedin) && (
							<a
								href={member.socials.linkedin}
								target="_blank"
								rel="noopener noreferrer"
								className="p-2.5 rounded-xl bg-white hover:bg-[#70D6FF] text-black border-2 border-black shadow-[2px_2px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all group/link"
								title="LinkedIn Profile"
							>
								<Linkedin className="w-4 h-4 transition-transform group-hover/link:scale-110" />
							</a>
						)}

					</div>
				</div>
			</div>
		</div>
	);
}