import { Card } from "@/components/ui/Card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn Crypto Basics | TokenSentry",
  description: "New to crypto? Learn what honeypots, rug pulls, liquidity, smart contracts, and token risk mean in plain English.",
};

const glossary = [
  {
    term: "Smart Contract",
    anchor: "smart-contract",
    emoji: "📄",
    short: "Self-executing code stored on a blockchain.",
    body: [
      "A smart contract is a program that lives on a blockchain and runs automatically when certain conditions are met. In crypto, every token is defined by a smart contract — it controls who owns what, how many tokens exist, and what rules govern transfers.",
      "Unlike traditional software, smart contracts cannot be updated by a central company once deployed (unless they are built with an upgrade mechanism). This means the code is the law — which is why auditing it matters.",
      "Red flag: a contract that can be upgraded or self-destructed gives the creator a backdoor to change the rules after you invest.",
    ],
  },
  {
    term: "Honeypot",
    anchor: "honeypot",
    emoji: "🍯",
    short: "A token you can buy but cannot sell.",
    body: [
      "A honeypot is a scam token designed to attract buyers but prevent them from ever selling. The contract looks normal — you can buy tokens freely — but the sell function is blocked by hidden code. Your money goes in, and it never comes back.",
      "Honeypots are usually promoted heavily on social media with promises of fast gains. Once enough people have bought in, the creators drain the liquidity and disappear.",
      "TokenSentry simulates both a buy and a sell transaction before you invest, to detect this before it affects you.",
    ],
  },
  {
    term: "Rug Pull",
    anchor: "rug-pull",
    emoji: "🏃",
    short: "When creators drain the liquidity and abandon the project.",
    body: [
      "A rug pull happens when the team behind a token removes all the liquidity from the trading pool, leaving holders with tokens that are now worthless. The price crashes to zero instantly.",
      "Rug pulls can happen in seconds. A project can look legitimate for weeks — it may have a website, a roadmap, and social media presence — and still be a planned exit scam.",
      "The most common indicators: liquidity is not locked, the team holds a large percentage of tokens, or there are contract functions that allow the owner to pause transfers or mint new tokens.",
    ],
  },
  {
    term: "Liquidity",
    anchor: "liquidity",
    emoji: "💧",
    short: "The pool of funds that makes a token tradeable.",
    body: [
      "On decentralised exchanges (DEXes) like Uniswap, tokens are traded against a liquidity pool — a reserve of funds that allows buyers and sellers to trade without needing a matching counterpart.",
      "Low liquidity means high price impact: even a small sell order can drop the price significantly. It also means a large sell could drain the entire pool.",
      "When creators provide liquidity, they receive LP (liquidity provider) tokens. If those LP tokens are not locked in a smart contract, the creators can withdraw the pool at any time — this is a rug pull.",
    ],
  },
  {
    term: "LP Lock",
    anchor: "lp-lock",
    emoji: "🔒",
    short: "When liquidity cannot be removed for a set period.",
    body: [
      "LP locking means the liquidity provider tokens (LP tokens) are deposited into a time-locked contract, preventing the team from withdrawing liquidity before the lock expires.",
      "A project with locked liquidity cannot rug pull during the lock period. However: locks can expire, they may cover only a small percentage of total liquidity, or the lock contract itself might have weaknesses.",
      "TokenSentry checks both whether liquidity is locked and what percentage of LP tokens are covered by the lock.",
    ],
  },
  {
    term: "Token Tax",
    anchor: "tax",
    emoji: "💸",
    short: "A fee deducted from every buy or sell transaction.",
    body: [
      "Some tokens charge a percentage fee on every transaction. These fees may go to holders, a treasury, or be burned. Small taxes (1-5%) are common in DeFi. Large taxes are a serious red flag.",
      "High taxes can make a token unprofitable to trade. Worse, many contracts allow the owner to change the tax rate at any time — including raising it to 100%, which effectively traps all holders.",
      "TokenSentry flags sell taxes above 10% as medium risk and above 25% as high risk.",
    ],
  },
  {
    term: "Whale",
    anchor: "whale",
    emoji: "🐋",
    short: "A wallet holding a very large share of token supply.",
    body: [
      "A whale is any wallet that controls enough tokens to significantly move the market when they buy or sell. If one wallet holds 50% of all tokens, their sell order will crash the price by half.",
      "Whale concentration is not always malicious — early investors, team members, or large funds may legitimately hold large positions. But it is always a risk factor, because their decision to sell has an outsized impact on every other holder.",
      "TokenSentry checks the top 10 holders and flags if any single non-DEX wallet controls more than 20% of supply.",
    ],
  },
  {
    term: "Mint Function",
    anchor: "mint",
    emoji: "🖨️",
    short: "A contract function that creates new tokens.",
    body: [
      "Minting is the process of creating new tokens. If a contract has a mint function, the owner can increase the total supply at will. This dilutes every existing holder's share of the token.",
      "An uncapped mint function with no governance is one of the most dangerous features a token contract can have. It means the creator can print infinite tokens and sell them, crashing the price to near zero.",
      "TokenSentry flags any contract where the owner retains mint capability without restrictions.",
    ],
  },
  {
    term: "Contract Verification",
    anchor: "verification",
    emoji: "✅",
    short: "When source code is published and matches the deployed contract.",
    body: [
      "When a developer deploys a smart contract, only compiled bytecode goes on-chain. Contract verification means the developer has also published the human-readable source code and proven it compiles to the same bytecode.",
      "Verified contracts can be independently audited by anyone. Unverified contracts are black boxes — you cannot know what the code does without reverse-engineering the bytecode.",
      "On Ethereum, Etherscan provides contract verification. TokenSentry flags unverified Ethereum contracts as a risk signal.",
    ],
  },
  {
    term: "DEX (Decentralised Exchange)",
    anchor: "dex",
    emoji: "🔄",
    short: "A peer-to-peer token exchange with no central authority.",
    body: [
      "A decentralised exchange (DEX) allows users to trade tokens directly from their wallets, without depositing funds into a central platform. Examples include Uniswap (Ethereum), PancakeSwap (BNB Chain), and Raydium (Solana).",
      "DEXes use liquidity pools instead of order books. Prices are determined by a mathematical formula based on the ratio of tokens in the pool. This is known as an Automated Market Maker (AMM).",
      "Most new tokens launch on DEXes before (and sometimes instead of) listing on centralised exchanges like Binance or Coinbase.",
    ],
  },
];

export default function LearnPage() {
  return (
    <div className="w-full space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white">Learn Crypto Basics</h1>
        <p className="mt-2 text-sm text-slate-400">Plain-English explanations of the terms and concepts behind TokenSentry reports.</p>
      </div>

      <Card className="space-y-3">
        <p className="text-slate-300">
          Crypto markets move fast. Understanding a few key concepts can be the difference between
          spotting a scam before it hits and losing your investment in seconds. This page explains
          every term used in TokenSentry reports — no jargon, no assumed knowledge.
        </p>
        <div className="flex flex-wrap gap-2">
          {glossary.map(({ term, anchor }) => (
            <a
              key={anchor}
              href={`#${anchor}`}
              className="rounded-full border border-slate-700 bg-slate-900/50 px-3 py-1 text-xs text-slate-300 transition-colors hover:border-white/40 hover:text-white"
            >
              {term}
            </a>
          ))}
        </div>
      </Card>

      {glossary.map(({ term, anchor, emoji, short, body }) => (
        <section key={anchor} id={anchor} className="scroll-mt-6">
          <Card className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{emoji}</span>
              <div>
                <h2 className="text-xl font-semibold text-white">{term}</h2>
                <p className="mt-0.5 text-sm font-medium text-sky-300">{short}</p>
              </div>
            </div>
            <div className="space-y-2 border-t border-slate-700/40 pt-3">
              {body.map((para, i) => (
                <p key={i} className="text-sm leading-relaxed text-slate-300">{para}</p>
              ))}
            </div>
          </Card>
        </section>
      ))}

      <Card className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Further Reading</h2>
        <p className="text-sm text-slate-300">
          These external resources go deeper on crypto security and on-chain research:
        </p>
        <ul className="space-y-2 text-sm">
          {[
            { name: "Etherscan Token Tracker", url: "https://etherscan.io/tokens", desc: "Browse verified Ethereum tokens and check holder lists." },
            { name: "DexScreener", url: "https://dexscreener.com", desc: "Live DEX charts, liquidity data, and pair listings across all major chains." },
            { name: "RugCheck", url: "https://rugcheck.xyz", desc: "Solana token risk reports with detailed flag explanations." },
            { name: "GoPlus Security", url: "https://gopluslabs.io", desc: "Token security database — raw data behind many TokenSentry checks." },
            { name: "Immunefi Blog", url: "https://medium.com/immunefi", desc: "In-depth post-mortems of DeFi hacks and exploits — great for learning what went wrong." },
          ].map(({ name, url, desc }) => (
            <li key={name} className="rounded-lg border border-slate-700/40 bg-slate-900/30 p-3">
              <a href={url} target="_blank" rel="noreferrer" className="font-semibold text-sky-300 hover:text-sky-200">{name}</a>
              <p className="mt-0.5 text-slate-400">{desc}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="text-sm text-slate-400">
        <p className="font-semibold text-white">Always DYOR</p>
        <p className="mt-1">
          Do Your Own Research (DYOR) is the most important rule in crypto. TokenSentry provides
          a starting point — not a verdict. A low risk score does not mean an investment is safe,
          and a high score does not make recovery impossible. Use this tool as one of many inputs in your research.
        </p>
      </Card>
    </div>
  );
}
