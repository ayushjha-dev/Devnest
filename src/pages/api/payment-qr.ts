import type { NextApiRequest, NextApiResponse } from "next";

import { getPaymentQrStream } from "../../../server/payment-qr";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "GET") {
		res.setHeader("Allow", "GET");
		return res.status(405).json({ message: "Method not allowed" });
	}

	try {
		const { stream, size, contentType } = getPaymentQrStream();
		res.setHeader("Content-Type", contentType);
		res.setHeader("Content-Length", size.toString());
		res.setHeader("Cache-Control", "public, max-age=3600, immutable");

		stream.on("error", (error) => {
			console.error("QR stream error", error);
			if (!res.headersSent) {
				res.status(500).json({ message: "Failed to stream payment QR" });
			} else {
				res.end();
			}
		});

		stream.pipe(res);
	} catch (error) {
		console.error("QR handler error", error);
		res.status(500).json({ message: "Unable to load payment QR" });
	}
}
