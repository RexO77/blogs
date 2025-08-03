---
title: "Stop Oversharing With AI: Your Deepest Secrets Don’t Belong on Google"
date: 2025-08-03T10:30:00+05:30
draft: false
description: "A raw, unfiltered rant on why using ChatGPT as your therapist is a terrible idea, how OpenAI accidentally exposed private convos to Google, and how to actually protect yourself—with a product designer's take on how to design AI better."
tags: ["AI", "Privacy", "Technology", "ChatGPT", "Ollama", "Product Design"]
categories: ["Technology", "Privacy", "Design"]
---

{{< img src="images/thumbnail.jpg" alt="Chat bubbles spilling out from a phone into a search bar" caption="Your secrets? Yep, they're not as private as you think." >}}

## You Should Never Share Anything Personal With ChatGPT

So folks, welcome to another episode of *Nischal vs. the AI Apocalypse*.  
This one’s spicy because, yeah, **people are spilling their hearts to ChatGPT** like it’s their BFF therapist—and turns out, it’s basically shouting that to the internet.

I’m serious. All those convos you thought were private? Many were indexed by Google. That means your “Dear ChatGPT, I’m lonely and hate my job” is one search query away from going *viral* (for all the wrong reasons).  

{{< img src="images/proof.png" alt="Chats being indexed on google" caption="Your secrets? Yep, they're not as private as you think." >}}

And before you act smart—“Ahhh Nischal, we’re not dumb like you to share things online”—cool, me neither. I only had *exam notes* in there… (don’t fact check that). But the thing is, **OpenAI gave us the perfect trap**:  
- Share your chat → tick the little “Make Discoverable” box (because it looked required) → boom, it’s public.  
- Now anyone with `site:chatgpt.com/share` could find your stuff faster than your mom finding your hidden Maggi stash in college.

---

## When Even Sam Altman Says, “Don’t Do It”

Here’s where it gets wilder:  
Sam Altman, CEO of OpenAI, literally said people use ChatGPT as a **therapist, life coach, even relationship guru**. And then—get this—**all that intimate stuff was searchable**.  

It’s like telling a robot your deepest secrets, and the robot just… puts it on Google.  
> “People use it—young people, especially—as a therapist, a life coach; having these relationship problems and [asking] ‘what should I do?’” — *Sam Altman, TechCrunch*

Oh, and legally, OpenAI has to keep your chats and can share them in case of lawsuits.  
So basically, **anything you say can and will be used against you in the court of LAW**.  
*(WTH, am I getting arrested by my own chatbot?)*

---

## Where the Internet Lost Its Mind (PCMag Update)

Just when I thought this was peak chaos—**PCMag drops a bomb:**  
> *“After backlash, ChatGPT removes the option to have private chats indexed by Google.”*  

Yep, OpenAI literally had to yank a feature because people were unknowingly putting their **private therapy sessions, relationship drama, and wild conspiracy theories** on Google search.  

Now, OpenAI removed the “Make Discoverable” checkbox and started scrubbing old links, but **Bing and DuckDuckGo still show them as of this writing**. Translation: *the internet doesn’t forget because OpenAI clicked undo*.  

Sam Altman’s quote suddenly hits harder. People literally turned ChatGPT into their emotional dumping ground—and it went public.  
*(Black Mirror episode intensifies.)*

---

## My Product Designer Take (aka “Why Did This Feature Even Exist?”)

Here’s where I flip from “ranting user” to “product designer who actually builds stuff.”  

That **Make Discoverable** checkbox? *Chef’s kiss bad design.*  
- It looked mandatory because of its placement and tiny print—classic dark pattern vibes.  
- The feature shipped without strong “Are you SURE you want this public?” guardrails.  

If I designed this, I’d:  
1. **Make public sharing an explicit, friction-heavy flow** (multi-step, scary red warnings).  
2. **Default to private** always, because people’s lives aren’t content fodder.  
3. **Build in auto-expiry for shared links** (imagine your convos self-destructing like Mission Impossible).  

We keep talking about “responsible AI,” but this? This was **reckless UX at scale**.  

I’ve been designing interfaces that *make users think more, not panic later*.  
Want to see my take on non-zombie, privacy-first tech? **[Check out my portfolio](https://www.nischalskanda.tech)**—I design to keep people in control, not accidentally trending on Google.

---

## So How the Heck Do You Protect Yourself?

1. **Don’t Treat ChatGPT as Your Therapist**  
   - If you wouldn’t post it on your Insta story, don’t type it into ChatGPT.  
   - AI can feel “safe” but it’s still feeding on your data like it’s free samosas at an office party.

2. **Use Local AI Like Ollama**  
   - Want the AI magic without the oversharing nightmare? Use **[Ollama](https://ollama.ai/)** or similar apps. They run locally, offline, and keep your data on your machine.  
   - Basically, your laptop = your private AI, no snitching to Big Tech.

3. **Audit Your Shared Links**  
   - If you *ever* hit “share” on ChatGPT, go back and unpublish or delete those links. Don’t assume “private” means private—it doesn’t.

4. **Stop Being Lazy With Privacy**  
   - Take 5 minutes to actually read what you’re sharing and with whom. Or at least pretend to care—your future self will thank you.

---

## Final Word

Look, I’m not anti-AI. I literally use it every day. But giving it your **raw emotions, secrets, and trauma dumps**? Nah fam, that’s a one-way ticket to embarrassment land.  

**OpenAI already had to backpedal because oversharing became a global SEO goldmine**. Don’t wait for the next “oops, your secrets are trending” headline. Use AI smart, keep it local when possible, and for the love of privacy—don’t tell it stuff you wouldn’t even tell your diary.

**Your brain, your secrets, your call. Protect them.**

---

*References:*  
- [PCMag: ChatGPT Removes Option to Have Private Chats Indexed by Google](https://www.pcmag.com/news/after-backlash-chatgpt-removes-option-to-have-private-chats-indexed-by-google)  
- [TechCrunch interview with Sam Altman](https://techcrunch.com)  
- [Ollama: Run AI Locally](https://ollama.ai/)
