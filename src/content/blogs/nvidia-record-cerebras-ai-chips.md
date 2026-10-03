---
title: "Nvidia Hits a Record While Cerebras Struggles: A Beginner's Look at AI Chips"
author: "Ayush Kumar Jha"
date: "2026-08-17"
category: "Artificial Intelligence"
thumbnail: "🔌"
coverImage: "/images/blogs/ai-chip-market.svg"
excerpt: "Nvidia's stock reached a record high while Cerebras fell to a low since going public. A plain-English explainer of AI chips, market leaders, lockup expirations, and why competing with a giant is hard."
readTime: "10 min read"
---

Nvidia's stock reached a record high, while Cerebras — a newer AI chip company — fell to a low since going public. The drop was linked to Nvidia's competitive pressure and the end of a lockup period.

Two very different stories in one headline. Here is what is actually going on.

## What AI Chips Are

AI chips are the **special processors that train and run AI**. They are not general-purpose CPUs. They are built around one assumption: almost all the useful work is a huge number of multiply-and-add operations, running in parallel, over and over.

That shape is a poor fit for running an operating system and an excellent fit for crunching a matrix. It is why a task that takes a consumer laptop hours can take a datacenter chip minutes.
The market has an old name for companies supplying this layer. They sell the **picks and shovels** — the tools, not the gold.

## Why Nvidia Leads

Nvidia is the market leader, so many companies depend on it. That dominance is not accidental; it is close to a decade of compounding advantage:

- **CUDA.** Decades of software written to run on Nvidia hardware. Competitors must reimplement all of it. This is the real moat — not the chip, the ecosystem.
- **Developer familiarity.** Millions of engineers already know the tooling.
- **Full-stack integration.** Network, interconnect and software sold together as one system.

## Why Cerebras Is Struggling

Cerebras built something genuinely impressive — a chip that treats an entire wafer as one processor, dramatically reducing the data movement that limits conventional designs. On paper the numbers are excellent.

But that is a **performance** advantage in a **market** fight. Competing with a giant means something more specific than building good hardware:

1. **The lockup expiration.** A lockup expiration is when early investors are finally allowed to sell their shares, which can push prices down. A company that just IPO'd has a limited, known number of shares in public hands. When the lockup ends, new supply hits the market at once. This is mechanical, not a judgement about the company.

2. **Customer concentration.** Early adopters who bought on the architecture story now face a choice between a proven stack and a cheaper alternative with migration risk.

3. **Software, again.** Beating a hardware benchmark is achievable. Beating a decade of accumulated software is a different project.

## What This Actually Teaches

The AI boom is not only about software. The companies selling the picks and shovels are making big money, but **competing with a giant is hard** — often for reasons that have nothing to do with whether your technology is good.

That is the transferable lesson for anyone building in AI right now. Technical superiority is necessary and nowhere near sufficient. Distribution, ecosystem and timing usually decide.

## How To Read Chip Performance

Benchmark numbers are the main source of confusion, because several very different quantities get reported as "performance".

**Peak theoretical throughput** is what the chip could do under perfect conditions. It assumes data is always ready and nothing ever waits. Real workloads are never like this, so peak numbers are close to meaningless for comparison.

**Memory bandwidth** is how much data the chip can move per second, and for AI workloads it is often the number that actually matters. Modern models are frequently limited by moving data between memory and compute rather than by arithmetic.

**Real-world application throughput** is tokens per second for inference, or time to complete a training run. This is the only figure that predicts what you will experience, and it depends on the entire system, not just the chip.

The pattern worth remembering is that many designs which look weak on paper win on real workloads because they avoid the transfers. A chip that is theoretically slower but has far better bandwidth characteristics can finish the job considerably sooner.

## Cerebras And The Wafer-Scale Idea

Cerebras made a genuinely different architectural bet, and it is worth understanding because it illustrates the trade-off between theoretical novelty and commercial viability.

Conventional accelerators are cut from silicon wafers, and the individual chips around the edge are discarded because they cannot be perfectly separated or tested. Cerebras instead **uses most of the entire wafer as one processor**, connecting it internally with a very high-bandwidth fabric.

The claimed benefit is real in principle. Most of the energy and time consumed in large AI operations is spent moving data between separate chips. Eliminating that transfer by putting everything on one die is an elegant answer to the industry's biggest bottleneck.

The challenges that came with it are equally real:

- **Manufacturing yield.** A defect anywhere on a huge processor kills the whole thing, and yield on very large dies is hard.
- **A single point of failure.** No redundancy at the scale of the main compute block.
- **System rigidity.** The advantage depends on the whole machine being optimised together, which makes it harder to use in flexible cloud environments.
- **The customer's existing code.** Most AI software is written against assumptions that translate neatly to conventional accelerators.

Excellent engineering solving a real problem is still only half of building a business, and this gap is the single most instructive thing about the episode.

## Why Lockup Expirations Matter

The lockup mechanism is worth understanding because it explains a large share of the volatility in recently listed companies.

At IPO, a company sells a limited number of shares to the public. Insiders — founders, employees, early investors — cannot sell theirs for a set period, usually about six months. That constraint means only a small, known float trades.

When the lockup expires, that entire pool becomes eligible to sell at once. Two things follow:

- **Supply can increase dramatically**, in a stock where the traded volume had been small. Even moderate selling pressure moves the price a long way.
- **Insiders sell for personal reasons** — diversification, taxes, planned sales — which is entirely normal and says nothing about the company's prospects.

This is why a sharp drop weeks or months after a strong IPO is often routine mechanics rather than a verdict on the business. Reading it as a verdict is the most common retail error in newly listed technology companies.

## The Lessons For Anyone Building In AI

This episode is a compact case study in how technology markets actually work:

**Technical superiority is necessary and nowhere near sufficient.** Cerebras built a real innovation and still lost to a company with a better software ecosystem.

**The ecosystem is usually the moat.** CUDA represents roughly a decade of accumulated developer tooling, libraries and institutional knowledge. Beating that with a better chip is not a hardware problem.

**Distribution beats brilliance.** Being the default choice for a huge number of developers is an asset that compounds daily and cannot be bought quickly.

**Market timing is decisive.** A company arriving with genuinely good technology after the incumbent has consolidated can struggle to find anyone to switch to them.

**Cash flow buys time.** Cerebras raised substantial capital, which is what allowed it to keep building through a difficult public period.

## Takeaway

Big winners and struggling challengers can exist in the same industry at the same time. This is a news story, not investment advice, so do your own research before putting money in.
