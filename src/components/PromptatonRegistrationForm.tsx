import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/DAeJBINDPNI64g6zV0b2TF";
const CONTACT_EMAILS = [
	"devnest.techclub@gmail.com",
] as const;
const PAYMENT_QR_ENDPOINT = "/api/payment-qr";

const normalizeRoll = (roll?: string | null) => roll?.trim().toLowerCase() ?? "";

export type PromptatonFormValues = {
	fullName: string;
	rollNumber: string;
	department: string;
	whatsappNumber: string;
	email: string;
	participationType: "individual" | "team";
	teamName: string;
	teamMember2: string;
	teamMember2Roll: string;
	transactionId: string;
	joinedWhatsapp: boolean;
	notes: string;
};

const promptathonDefaultValues: PromptatonFormValues = {
	fullName: "",
	rollNumber: "",
	department: "",
	whatsappNumber: "",
	email: "",
	participationType: "individual",
	teamName: "",
	teamMember2: "",
	teamMember2Roll: "",
	transactionId: "",
	joinedWhatsapp: false,
	notes: "",
};

export const PromptatonRegistrationForm = () => {
	const { toast } = useToast();
	const [status, setStatus] = useState<"idle" | "loading">("idle");
	const [qrStatus, setQrStatus] = useState<"loading" | "loaded" | "error">("loading");
	const [qrSrc, setQrSrc] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const qrObjectUrlRef = useRef<string | null>(null);
	const isMountedRef = useRef(true);

	const form = useForm<PromptatonFormValues>({
		defaultValues: promptathonDefaultValues,
	});

	const participationType = useWatch({ control: form.control, name: "participationType" });

	const markRollConflicts = useCallback(
		(conflicts: string[]) => {
			const normalizedConflicts = conflicts
				.map((roll) => normalizeRoll(roll))
				.filter((roll) => roll.length > 0);

			if (!normalizedConflicts.length) {
				return;
			}

			const values = form.getValues();
			const rollFields: Array<{
				field: keyof PromptatonFormValues;
				value: string;
			}> = [
					{ field: "rollNumber", value: values.rollNumber },
					{ field: "teamMember2Roll", value: values.teamMember2Roll },
				];

			rollFields.forEach(({ field, value }) => {
				if (value && normalizedConflicts.includes(normalizeRoll(value))) {
					form.setError(field, {
						type: "manual",
						message: "This roll number is already registered.",
					});
				}
			});
		},
		[form],
	);

	const loadPaymentQr = useCallback(async () => {
		try {
			setQrStatus("loading");
			setQrSrc(null);
			const response = await fetch(PAYMENT_QR_ENDPOINT);
			if (!response.ok) {
				throw new Error("Failed to fetch payment QR");
			}
			const blob = await response.blob();
			const objectUrl = URL.createObjectURL(blob);
			if (!isMountedRef.current) {
				URL.revokeObjectURL(objectUrl);
				return;
			}
			if (qrObjectUrlRef.current) {
				URL.revokeObjectURL(qrObjectUrlRef.current);
			}
			qrObjectUrlRef.current = objectUrl;
			setQrSrc(objectUrl);
			setQrStatus("loaded");
		} catch (error) {
			if (!isMountedRef.current) {
				return;
			}
			console.error("Payment QR load error", error);
			setQrStatus("error");
		}
	}, []);

	useEffect(() => {
		loadPaymentQr();
		return () => {
			isMountedRef.current = false;
			if (qrObjectUrlRef.current) {
				URL.revokeObjectURL(qrObjectUrlRef.current);
			}
		};
	}, [loadPaymentQr]);

	const onSubmit = async (values: PromptatonFormValues) => {
		setStatus("loading");

		try {
			const response = await fetch("/api/promptathon", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			if (!response.ok) {
				let errorMessage = "Submission blocked. Please check your details.";
				let handled = false;

				try {
					const errorData = await response.json();
					if (typeof errorData?.message === "string") {
						errorMessage = errorData.message;
					}
					if (Array.isArray(errorData?.conflicts) && errorData.conflicts.length > 0) {
						markRollConflicts(errorData.conflicts as string[]);
						handled = true;
						errorMessage = `${errorMessage} (Conflicts: ${errorData.conflicts.join(", ")})`;
					}
				} catch (parseError) {
					console.error("Promptathon error payload parse", parseError);
				}

				if (handled) {
					toast({
						title: "Submission blocked",
						description: errorMessage,
						variant: "destructive",
					});
					return;
				}

				throw new Error(errorMessage);
			}

			toast({
				title: "Registration received!",
				description: "We will reach out with next steps soon.",
			});

			form.reset(promptathonDefaultValues);
		} catch (error) {
			console.error("Promptathon submission error", error);
			const fallbackMessage = "Please try again or email us at devnest.techclub@gmail.com.";
			const description =
				error instanceof Error && error.message ? error.message : fallbackMessage;
			toast({
				title: "Submission failed",
				description,
				variant: "destructive",
			});
		} finally {
			setStatus("idle");
		}
	};

	return (
		<section
			id="promptathon-form"
			className="glass-effect rounded-3xl border border-border/50 bg-background/80 p-8 shadow-2xl"
		>
			<div className="text-center max-w-3xl mx-auto mb-10">
				<span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-semibold mb-4">
					Promptathon | Registration
				</span>
				<h2 className="text-3xl font-poppins font-bold mb-3">
					Register for Promptathon
				</h2>
				<p className="text-muted-foreground">
					Fill in your details to participate. You can register as an individual or as a team (max 2 members).
					Fields marked with * are mandatory.
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
					<div className="space-y-4">
						<div>
							<h3 className="text-xl font-semibold">Participant Details</h3>
							<p className="text-sm text-muted-foreground">
								We'll use this information to contact you about the event.
							</p>
						</div>
						<div className="grid gap-6 md:grid-cols-2">
							<FormField
								control={form.control}
								name="fullName"
								rules={{ required: "Name is required" }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name *</FormLabel>
										<FormControl>
											<Input placeholder="Your full name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="rollNumber"
								rules={{ required: "Roll number is required" }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>University Roll No *</FormLabel>
										<FormControl>
											<Input placeholder="241000X00XX" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="department"
								rules={{ required: "Department is required" }}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Department *</FormLabel>
										<FormControl>
											<Input placeholder="e.g., Computer Science" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="whatsappNumber"
								rules={{
									required: "WhatsApp number is required",
									pattern: {
										value: /^[6-9]\d{9}$/,
										message: "Enter a valid 10-digit mobile number",
									},
								}}
								render={({ field }) => (
									<FormItem>
										<FormLabel>WhatsApp Number *</FormLabel>
										<FormControl>
											<Input placeholder="9876543210" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								rules={{
									required: "Email is required",
									pattern: {
										value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
										message: "Enter a valid email address",
									},
								}}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email Address *</FormLabel>
										<FormControl>
											<Input type="email" placeholder="you@example.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>

					<div className="space-y-4">
						<div>
							<h3 className="text-xl font-semibold">Participation Type</h3>
							<p className="text-sm text-muted-foreground">
								Choose whether you want to participate individually or as a team (max 2 members).
							</p>
						</div>
						<FormField
							control={form.control}
							name="participationType"
							render={({ field }) => (
								<FormItem>
									<FormLabel>I want to participate as *</FormLabel>
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select participation type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="individual">Individual</SelectItem>
											<SelectItem value="team">Team (2 members)</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{participationType === "team" && (
						<div className="space-y-4">
							<div>
								<h3 className="text-xl font-semibold">Team Details</h3>
								<p className="text-sm text-muted-foreground">
									Provide your team name and second member details.
								</p>
							</div>
							<FormField
								control={form.control}
								name="teamName"
								rules={{
									required: participationType === "team" ? "Team name is required" : false,
								}}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Team Name *</FormLabel>
										<FormControl>
											<Input placeholder="Choose a creative team name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid gap-6 md:grid-cols-2">
								<FormField
									control={form.control}
									name="teamMember2"
									rules={{
										required: participationType === "team" ? "Team member name is required" : false,
									}}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Team Member 2 Name *</FormLabel>
											<FormControl>
												<Input placeholder="Full name" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="teamMember2Roll"
									rules={{
										required: participationType === "team" ? "Roll number is required" : false,
									}}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Team Member 2 Roll No *</FormLabel>
											<FormControl>
												<Input placeholder="241000X00XX" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					)}

					<div className="space-y-4">
						<div>
							<h3 className="text-xl font-semibold">Payment Details</h3>
							<p className="text-sm text-muted-foreground">
								Scan the QR code below to complete payment and enter your transaction ID.
							</p>
						</div>
						<div className="flex flex-col items-center gap-6">
							{qrStatus === "loading" ? (
								<div className="flex items-center justify-center p-12 glass-effect rounded-2xl">
									<Loader2 className="h-8 w-8 animate-spin text-primary" />
								</div>
							) : qrStatus === "error" ? (
								<div className="p-6 glass-effect rounded-2xl text-center">
									<p className="text-muted-foreground mb-2">
										Failed to load payment QR code.
									</p>
									<Button variant="outline" onClick={loadPaymentQr}>
										Retry
									</Button>
								</div>
							) : qrSrc ? (
								<div className="max-w-xs w-full glass-effect rounded-2xl p-6">
									<Image
										src={qrSrc}
										alt="Payment QR Code"
										width={300}
										height={300}
										className="w-full h-auto rounded-lg"
										priority
									/>
								</div>
							) : null}
						</div>
						<FormField
							control={form.control}
							name="transactionId"
							rules={{ required: "Transaction ID is required" }}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Transaction ID / UTR Number *</FormLabel>
									<FormControl>
										<Input placeholder="Enter transaction ID from payment confirmation" {...field} />
									</FormControl>
									<FormDescription>
										Complete the payment using the QR code above and enter the transaction ID here.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="space-y-4">
						<FormField
							control={form.control}
							name="joinedWhatsapp"
							rules={{
								validate: (value) =>
									value || "You must join the WhatsApp group to proceed",
							}}
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>
											I have joined the official WhatsApp group *
										</FormLabel>
										<FormDescription>
											<Link
												href={WHATSAPP_GROUP_LINK}
												target="_blank"
												rel="noreferrer"
												className="text-primary hover:underline"
											>
												Click here to join the group
											</Link>
											. All event updates will be shared there.
										</FormDescription>
										<FormMessage />
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="notes"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Additional Notes (Optional)</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Any questions or special requirements?"
											className="resize-none"
											rows={3}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="flex justify-center">
						<Button
							type="submit"
							size="lg"
							disabled={status === "loading"}
							className="min-w-[200px]"
						>
							{status === "loading" ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Submitting...
								</>
							) : (
								"Submit Registration"
							)}
						</Button>
					</div>

					<p className="text-center text-sm text-muted-foreground">
						By submitting this form, you agree to share your details with DevNest Technical Club for event coordination. For queries, contact{" "}
						{CONTACT_EMAILS[0]}.
					</p>
				</form>
			</Form>
		</section>
	);
};
