import Head from "next/head";
import { Layout } from "@/components/Layout";
import { About as AboutSection } from "@/components/About";

export default function AboutPage() {
  return (
    <Layout>
      <Head><title>DevNest | About</title></Head>
      <AboutSection />
    </Layout>
  );
}
