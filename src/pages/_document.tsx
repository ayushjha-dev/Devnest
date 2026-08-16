import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link rel="icon" type="image/svg+xml" href="/logo.svg" />
				<link rel="alternate icon" href="/favicon.ico" />
				<link rel="apple-touch-icon" href="/logo.svg" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
