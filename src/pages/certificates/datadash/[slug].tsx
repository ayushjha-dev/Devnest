import Head from "next/head";
import Image from "next/image";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

type DataDashCertificatePageProps = {
  fileName: string;
};

function normalizeSlug(slug: string): string {
  const decodedSlug = (() => {
    try {
      return decodeURIComponent(slug);
    } catch {
      return slug;
    }
  })();

  const standardBase64 = decodedSlug.replace(/-/g, "+").replace(/_/g, "/");
  return standardBase64;
}

function findCertificateFileName(slug: string): string {
  const normalized = normalizeSlug(slug);

  if (normalized.endsWith("=")) {
    return normalized;
  }

  return `${normalized}=`;
}

export default function DataDashCertificatePage({
  fileName,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const certificateUrl = `/certificates/datadash/${fileName}.png`;

  return (
    <>
      <Head>
        <title>DevNest | DataDash Certificate</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="fixed inset-0 bg-black">
        <Image
          src={certificateUrl}
          alt="DataDash certificate"
          fill
          priority
          sizes="100vw"
          className="object-contain"
        />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<DataDashCertificatePageProps> = async ({
  params,
}) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";

  if (!slug) {
    return { notFound: true };
  }

  const fileName = findCertificateFileName(slug);

  return {
    props: {
      fileName,
    },
  };
};
