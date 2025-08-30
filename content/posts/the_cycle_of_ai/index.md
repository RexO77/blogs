---
title: "The Cycle of AI: How Your ₹2,000 Subscription Funds a $5,000/Month GPU"
date: 2025-08-31T08:30:00+05:30
draft: false
description: "The wild economics of AI: from your subscription to hyperscalers' billions, exploring why AI costs are exploding despite cheaper tokens and what stops this from becoming dot-com 2.0."
tags: ["AI", "Technology", "Economics", "Business", "Research"]
categories: ["Technology", "Business"]
featured_image: "/images/posts/the_cycle_of_ai/thumbnail.jpeg"
author: "Nischal Skanda"
keywords: ["AI economics", "GPU costs", "cloud computing", "artificial intelligence pricing", "data center economics"]
---

{{< img src="images/thumbnail.jpeg" alt="Meme showing the AI money flow from user to hyperscalers" caption="The AI money cycle: You pay peanuts, they rake in billions. Classic economics, but make it digital." >}}

> **"You pay a neat little fee for an AI app. That cash takes a theme-park ride: tokens → cloud GPUs → power bill → NVIDIA's earnings call. The only folks sleeping well? The people selling shovels in the gold rush."**

## TL;DR

You pay a neat little fee for an AI app. That cash takes a theme-park ride: **tokens → cloud GPUs → power bill → NVIDIA's earnings call**. The only folks sleeping well? The people selling shovels in the gold rush. Meanwhile, enterprises burn money on "pilots," electricity prices climb, and capex goes brrr. Is this dot-com déjà vu? Insaneeee. Only this time the write-offs are **concrete and substations**, not .com logos. [^1] [^2] [^3]

## The meme is hilarious because… no shit, it's the actual flow

**You → App → OpenAI → Microsoft/AWS/Google → NVIDIA → Power companies.**
Tiny stream (you). Big river (them).

Real prices, not vibes:

* **Cursor** now sells an **Ultra** plan at **\$200/month** for compute-hungry power users. **Teams** is **\$40/user/mo**. What the HELL, that escalated fast. [^4]
* **Lovable**: **\$25/month** Pro. Budget dev dopamine. [^5] [^6]

Now the brick wall: **model pricing**.
OpenAI's **GPT-5** posts **\$1.25 per 1M input tokens** and **\$10 per 1M output tokens**. The "cheap" **GPT-5 mini** is **\$0.25 in / \$2 out**. Output is the wallet-killer. (Because generating long, "smart" text eats compute like jalebis at a wedding.) [^7]

Quick human math: a single power user who munches **60M input + 12M output** tokens in a month on GPT-5 racks up **≈\$195** in API cost **alone**. There goes your ₹2k, before you even pay for auth, storage, support, or—minor detail—the product team. This is why "unlimited" plans quietly… aren't. And yes, cost-per-token is dropping while **tokens-per-task** explodes (agents, long context, tool calls = token buffets). WSJ literally called out that paradox. [^8]

## Upstream is where the money actually lives (bring a helmet)

The hyperscalers are not play-acting; they're paving cities. Analysts peg **Big Tech's 2025 AI capex** around **\$344B**, with some trackers saying it's gliding toward **\$400B+** next year. Microsoft alone guided to **~\$30B in a single quarter**. That's not "move fast and break things"; that's **pour concrete and bend GDP**. [^9] [^10] [^1]

Who’s catching the waterfall? **NVIDIA** just printed **\$46.7B** revenue in a quarter, **\$41.1B** from data center. Translation: the shovel store has a line out the door. [^2]

## GPUs: you don't buy compute—you feed it rent every hour

Don't own GPUs? You're renting the treadmill. An **Azure H100** VM is **about \$6.98/GPU-hour**; run it 24×7 and it's **~\$5,095/month… for one GPU**. Real workloads use racks. Your token bill hasn't even said hello yet. [^11] [^12]

Own the silicon? Cool flex. Blackwell arrives and makes last year's kit look like dial-up. Hardware obsolescence moves faster than the **5-year** depreciation schedule your accountant swears by. Corporate finance says "asset"; physics says "upgrade, buddy." (And NVIDIA's release cadence keeps receipts.) [^2]

## The denominator: electricity (aka "did my power bill just… double?")

The **IEA** projects **data-centre electricity demand roughly doubling by 2030 to ~945 TWh**, up from ~**1.5% of global electricity** in 2024. AI is the big driver. That's not a blog-boy opinion piece; that's the energy people. [^13]

And the **U.S. grid**? A lot of it was built in the **1960s–70s**; **~70% of transmission lines are 25+ years old**. Try bolting gigawatt-scale data centres onto that antique. Spoiler: utilities ask regulators for rate hikes, and the rest of us subsidize chatbot latency. Nincompoops will say "just build more." Sure, after permits, transformers, land, cooling, interconnects… see you in 2030. [^14]

## "But surely the business value is massive?"

Let's be adults. A brand-new **MIT** study lighting up headlines says **~95% of enterprise GenAI pilots show no measurable ROI yet**. Not "zero benefit" in life; just "nothing that Finance can circle with a pen." That's… a lot of POCs and not a lot of P\&L. (Yes, it's early; yes, the stat's being debated; but the vibe in boardrooms is exactly this.) [^15] [^16]

Meanwhile, shovel-sellers keep selling shovels. Again: **\$41.1B** data-centre revenue—**in one quarter**—for NVIDIA. No further questions, your honour. [^2]

## Dot-com déjà vu, but with transformers instead of fiber

Wall Street houses are openly modeling **~\$2.9T** in global data-centre capex by **2028**, with a **~\$1.5T financing gap** that debt markets will need to fill. What the HELL. If demand under-delivers, we don't just mothball swag; we strand megawatts and refinance empty buildings. Even the **FT** is asking, "what if we spend nearly \$3T on data centres no one needs?" Tell me that doesn't smell like 1999 with better lighting. [^17] [^18] [^19]

## Okay, so what stops this from becoming a flaming crater?

Boring, disciplined product work. Not launch-day pyrotechnics.

* **Token diets**: outputs are pricier than inputs; cut verbosity, cap context, kill runaway agents. (OpenAI's table practically begs you.) [^7]
* **Model tiering**: run **GPT-5 mini** for 80% of jobs, burst to big-brain **GPT-5** for the 20% users will actually notice. That swing is the difference between "viable" and "weeping CFO." [^7]
* **Capacity with contracts**: build data centres against **committed demand**, not vibes. Microsoft's **\$30B/quarter** should terrify you into grown-up procurement. [^1]
* **Grid-aware growth**: site near real power, plan for interconnects, and stop pretending a substation fairy will bless your PDF. **IEA**'s curves aren't memes. [^3]

## Where I land (and I say this with love)

I **like** these tools. They help. They reduce drudge work. They make teams faster **when** you redesign the workflow instead of duct-taping a chatbot on top. But the **money loop** today is an upstream transfer: users → tokens → GPUs → utilities → earnings. Until we fix **unit economics** and **power math**, this ain't your iPhone moment. It's dot-com with a larger electricity bill… crazyyy.

Ship smarter. Spend slower. Save the poetry for launch day; bring a spreadsheet to everything else.

{{ partial "portfolio-cta" (dict "text" "Want to see how I design AI-powered experiences that actually make financial sense?" "section" "projects") }}

---

## How to Not Light Money on Fire: A Snarky Survival Guide

**Because apparently we all need a reminder that "AI first, think later" isn't a business strategy.**

### 🚨 Emergency Cost-Cutting Checklist
- [ ] **Audit your token usage** - Is that agent really generating 10x more output than input? Probably not.
- [ ] **Kill the unlimited plans** - They're like all-you-can-eat buffets: great until you realize you're funding someone else's yacht.
- [ ] **Model tiering isn't optional** - GPT-5 mini for the grunt work, save the expensive one for when it actually matters.
- [ ] **Set output limits** - Because nobody needs a 5,000-word essay about why cats are better than dogs.

### 💡 The "Actually Smart" Playbook
1. **Start with the problem, not the tech** - What are you actually trying to solve? (Hint: It's not "use more AI")
2. **Measure ROI before you deploy** - Not after 6 months of "pilots" that go nowhere
3. **Contract for capacity** - Don't build data centers on vibes
4. **Power matters** - Site near actual electricity, not just good WiFi

### 😤 Signs You're Doing It Wrong
- Your CFO cries when the cloud bill arrives
- Your data center uses more electricity than a small city
- You're explaining to investors why "AI transformation" means "we spent \$50M and got a chatbot"
- NVIDIA's earnings make you physically ill

**Pro tip:** If your AI costs are growing faster than your revenue, you're not "innovating" – you're subsidizing hyperscalers. Fix it before the board notices.

---

## References

[^1]: [Reuters - Microsoft to spend record $30 billion this quarter as AI investments pay off](https://www.reuters.com/business/microsoft-spend-record-30-billion-this-quarter-ai-investments-pay-off-2025-07-30/)
[^2]: [NVIDIA Announces Financial Results for Second Quarter Fiscal 2026](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2026)
[^3]: [IEA - Energy demand from AI](https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai)
[^4]: [Cursor - Updates to Ultra and Pro](https://cursor.com/blog/new-tier)
[^5]: [Lovable AI Resources - Lovable Pricing Guide](https://lovableai.ai/lovable-pricing)
[^6]: [Lovable - Pricing](https://lovable.dev/pricing)
[^7]: [OpenAI - Pricing](https://openai.com/api/pricing/)
[^8]: [WSJ - AI costs expensive startups](https://www.wsj.com/tech/ai/ai-costs-expensive-startups-4c214f59)
[^9]: [Bloomberg Law - Big Tech's Big Bet on AI](https://news.bloomberglaw.com/capital-markets/big-techs-big-bet-on-ai-driving-344-billion-in-spend-this-year)
[^10]: [MarketWatch - A $400 billion bonanza](https://www.marketwatch.com/story/a-400-billion-bonanza-as-ai-spending-estimates-move-higher-so-do-the-stakes-for-investors-a6742a00)
[^11]: [Vantage - NC40ads H100 v5 pricing](https://instances.vantage.sh/azure/vm/nc40adsh100-v5)
[^12]: [Cost Calculator - Standard-NC40ads-H100-v5](https://costcalc.cloudoptimo.com/azure-pricing-calculator/vm/Standard-NC40ads-H100-v5)
[^13]: [IEA - AI is set to drive surging electricity demand](https://www.iea.org/news/ai-is-set-to-drive-surging-electricity-demand-from-data-centres-while-offering-the-potential-to-transform-how-the-energy-sector-works)
[^14]: [DOE - What does it take to modernize the U.S. electric grid?](https://www.energy.gov/gdo/articles/what-does-it-take-modernize-us-electric-grid)
[^15]: [Fortune - MIT report: 95% of generative AI pilots at companies are failing](https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/)
[^16]: [Digital Commerce 360 - MIT report finds 95% of enterprises see no return on generative AI](https://www.digitalcommerce360.com/2025/08/25/mit-report-no-return-on-generative-ai/)
[^17]: [The Economist - Who will pay for the trillion-dollar AI boom?](https://www.economist.com/business/2025/07/31/who-will-pay-for-the-trillion-dollar-ai-boom)
[^18]: [Reuters - AI and gravity-defying US GDP](https://www.reuters.com/markets/us/ai-gravity-defying-us-gdp-2025-07-23/)
[^19]: [Financial Times - What'll happen if we spend nearly $3tn on data centres no one needs?](https://www.ft.com/content/7052c560-4f31-4f45-bed0-cbc84453b3ce)
[^20]: [Cursor - Pricing](https://cursor.com/pricing)
[^21]: [IEA - Executive summary – Energy and AI](https://www.iea.org/reports/energy-and-ai/executive-summary)

