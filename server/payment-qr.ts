import fs from "node:fs";
import path from "node:path";

const QR_FILE_PATH = path.join(process.cwd(), "server", "assets", "promptathon-qr.jpg");

export const getPaymentQrStream = () => {
	if (!fs.existsSync(QR_FILE_PATH)) {
		throw new Error("Promptathon payment QR asset missing");
	}

	const stats = fs.statSync(QR_FILE_PATH);
	const stream = fs.createReadStream(QR_FILE_PATH);

	return {
		stream,
		size: stats.size,
		contentType: "image/jpeg",
	};
};
