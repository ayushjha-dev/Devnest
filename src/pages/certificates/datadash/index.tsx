import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function encodeRollToSlug(rollNumber: string): string {
  const cleanedRoll = rollNumber.trim().toUpperCase();
  return btoa(cleanedRoll);
}

export default function DataDashCertificateLookupPage() {
  const router = useRouter();
  const [rollNumber, setRollNumber] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!rollNumber.trim()) {
      return;
    }

    const slug = encodeRollToSlug(rollNumber);
    router.push(`/certificates/datadash/${encodeURIComponent(slug)}`);
  };

  return (
    <Layout>
      <Head>
        <title>DevNest | DataDash Certificates</title>
      </Head>

      <div className="min-h-screen py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <span className="inline-block rounded-full border border-primary/40 bg-primary/15 px-4 py-2 text-sm font-semibold text-primary">
              DataDash Certificate Portal
            </span>
            <h1 className="mt-4 text-4xl font-poppins font-bold">Get Your DataDash Certificate</h1>
            <p className="mt-3 text-muted-foreground">
              Enter your roll number to open your certificate page.
            </p>
          </div>

          <Card className="glass-effect rounded-3xl border border-border/50 bg-background/80 p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  type="text"
                  value={rollNumber}
                  onChange={(event) => setRollNumber(event.target.value)}
                  placeholder="241000X00XX"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Find Certificate
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
