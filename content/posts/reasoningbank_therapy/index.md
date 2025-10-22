---
title: "ReasoningBank: Therapy for Machines That Keep Messing Up"
date: 2025-10-21T10:00:00+05:30
draft: false
description: "Google just taught AI to remember and reflect. ReasoningBank gives machines a therapist, turning past failures into future wisdom. But when machines start building habits from their mistakes, what could go wrong?"
tags: ["AI", "Machine Learning", "Research", "Google", "Artificial Intelligence", "ChatGPT"]
categories: ["Technology", "AI Impact", "Research"]
author: "Nischal Skanda"
keywords: ["ReasoningBank", "AI memory", "Google AI", "machine learning", "AI research", "test-time scaling", "AI agents", "metacognition"]
---

{{< img src="images/thumbnail.png" alt="ReasoningBank AI therapy concept - machines learning from their mistakes" caption="When AI gets a therapist: Google's ReasoningBank teaches machines to remember their failures and learn from them." >}}

Google just taught its AI how to remember and worse, how to *reflect*.

They call it **ReasoningBank**, and at first glance, it sounds like the next predictable step in the AI hype cycle. Another shiny acronym, another "scaling breakthrough." But if you actually read the paper, it's not hype. It's something far stranger. Google basically gave their models a therapist.

## **The Problem They're Fixing**

Every AI system today is cursed with amnesia.

It can process millions of words but forgets the moment the session ends. Each new problem starts from scratch, like a goldfish with a PhD.

Google's new work changes that.

They built a framework called **ReasoningBank**, which lets an AI agent *learn from its own history* — the good, the bad, and the absolutely dumb.

It doesn't just store data. It *distills* reasoning patterns from every past attempt, including the failed ones, and turns them into reusable "memory items" — kind of like notes to its future self.

When the model faces a new task, it pulls out the relevant lessons, acts on them, and when it's done, writes back what it learned.

Successes become strategy. Failures become warning labels.

That's the loop. Retrieval, action, reflection, repeat.

Over time, the agent *self-evolves* without retraining, without new data.

## **What MaTTS Adds to the Mix**

Now, ReasoningBank by itself is interesting.

But Google didn't stop there. They added a twist called **MaTTS**, short for *Memory-aware Test-Time Scaling*.

You've probably heard of test-time scaling, "run more samples, pick the best one."

MaTTS takes that chaos and gives it purpose.

It spins up multiple attempts (parallel scaling) or self-refines a single one (sequential scaling), compares those experiences, and uses the contrast to build better memory.

Basically: fail more, learn faster.

It's like teaching an AI to argue with its own past mistakes until it figures out why it was wrong.

## **The Results (The Receipts)**

Here's where it gets real.

Across **WebArena**, **Mind2Web**, and **SWE-Bench-Verified** — three serious agent benchmarks, ReasoningBank didn't just edge out baselines. It demolished them.

* On **WebArena**, success rates jumped by **+8.3**, **+7.2**, and **+4.6 points**, depending on the model backbone.
* On **SWE-Bench-Verified**, Gemini-2.5-Flash climbed from **34.2 → 38.8 %**, and Gemini-2.5-Pro from **54.0 → 57.4 %**, while cutting the average steps per task by about **16 %**.
* On **Mind2Web**, it dominated cross-domain generalization, meaning it didn't just memorize, it actually *adapted*.

And the wildest part?

When they fed it *failure data* — the kind every ML engineer throws away, it got **better**.

Success jumped from **46.5 → 49.7 %** when failed attempts were included.

The machine literally learned from screwing up.

## **The Real Meaning: AI That Self-Reflects**

Let's be clear, this isn't about more memory.

It's about *metacognition*.

Google didn't make the window bigger, they taught the model to think, "Hey, I've seen this kind of disaster before."

Each "memory item" is like a reusable principle, a distilled reasoning unit that can guide the next decision.

It's not saving logs, it's saving *lessons*.

Think of it like this.

We're watching AI transition from information processing to **experience processing**.

It's not *what* it knows anymore, it's *how* it learns from what it's done.

## **The Catch: Memory Becomes Baggage**

But here's the part that makes me uneasy.

When you give a machine a past, you also give it baggage.

ReasoningBank doesn't just record the wins, it archives the failures too.

That's how it gets better, but that's also how it can get stuck. If the memory bank itself picks up bad reasoning, bias, or half-truths, the system might just start repeating them faster, more confidently, and with fewer steps.

You're not just building intelligence.

You're building *habit*.

And if you've ever worked with humans, you know, habits are harder to debug than code.

## **Scaling Experience, Not Compute**

Everyone else in the AI race is obsessed with scaling **parameters** or **context windows**.

Google just quietly shifted the axis.

They're scaling **experience**.

They're saying, what if instead of making the model bigger, we make it *wiser*?

Instead of throwing teraflops at every new problem, let it build memory-driven feedback loops and figure out patterns itself.

That's a paradigm shift, and a slightly terrifying one.

Because experience doesn't just scale wisdom, it scales **trauma** too.

{{< img src="images/Minimalist Abstract Design with Colored Circles.png" alt="Abstract visualization of AI memory and experience processing" caption="The shift from information to experience: AI learning to build patterns from the chaos." >}}

## **So What's the Point of All This?**

Maybe the big takeaway isn't about models or benchmarks at all.

It's about how close we're getting to making machines that *reflect*, that pause and ask, "Why did I fail?"

We've taught AI to write code, draw art, and simulate emotion.

Now we're teaching it to remember its own mistakes.

That's either the next great leap in intelligence, or the start of a recursive therapy loop that never ends.

## **Conclusion**

Intelligence isn't about how much you remember.

It's about **what you choose to forget.**

ReasoningBank is a hell of a step forward.

But when the machine starts deciding what's worth keeping,

that's when it stops being a tool

and starts being a thinker.

---

## **References**

1. Google Cloud AI, "ReasoningBank: Scaling Agent Self-Evolving with Reasoning Memory," arXiv:2509.25140v1, 2025. [arXiv](https://arxiv.org/abs/2509.25140)
2. WebArena Benchmark - [GitHub Repository](https://github.com/web-arena-x/webarena)
3. Mind2Web Dataset - [Official Site](https://osu-nlp-group.github.io/Mind2Web/)
4. SWE-Bench-Verified - [GitHub Repository](https://github.com/princeton-nlp/SWE-bench)