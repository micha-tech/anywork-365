'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'

type MissionKey = 'hire' | 'scale' | 'offer'
type CategoryKey = 'electrical' | 'plumbing' | 'solar' | 'painting' | 'carpentry' | 'engineering'

const MISSIONS: Record<
  MissionKey,
  {
    label: string
    eyebrow: string
    title: string
    description: string
    href: string
    cta: string
    streak: string
  }
> = {
  hire: {
    label: 'Hire',
    eyebrow: 'Client mode',
    title: 'Turn urgent work into a clear next move.',
    description: 'Search, compare, and contact vendors without digging through long feeds or crowded screens.',
    href: '/professionals',
    cta: 'Start finding vendors',
    streak: 'Fast response track',
  },
  scale: {
    label: 'Post project',
    eyebrow: 'Business mode',
    title: 'Build for recurring work, field teams, and multi-city demand.',
    description: 'Use the platform as a practical nationwide entry point when your hiring need goes beyond one neighbourhood.',
    href: '/jobs',
    cta: 'Open project flow',
    streak: 'Nationwide reach',
  },
  offer: {
    label: 'Offer skill',
    eyebrow: 'Professional mode',
    title: 'Show your work and get discovered beyond your immediate circle.',
    description: 'Join as a professional, sharpen your presence, and appear where serious clients are already searching.',
    href: '/signup',
    cta: 'Create your profile',
    streak: 'Growth streak ready',
  },
}

const CATEGORIES: Record<
  CategoryKey,
  {
    label: string
    pulse: string
    zones: string[]
    note: string
  }
> = {
  electrical: {
    label: 'Electrical',
    pulse: 'Power fixes, installs, rewiring',
    zones: ['South West', 'North Central', 'South South'],
    note: 'Strong for urgent technical jobs that need quick matching.',
  },
  plumbing: {
    label: 'Plumbing',
    pulse: 'Leaks, pipes, fittings, maintenance',
    zones: ['Lagos', 'Abuja', 'Port Harcourt'],
    note: 'Home and facility work stay easy to scan on mobile.',
  },
  solar: {
    label: 'Solar',
    pulse: 'Installations, upgrades, diagnostics',
    zones: ['North West', 'North East', 'South West'],
    note: 'Energy work benefits from wider geography and specialist discovery.',
  },
  painting: {
    label: 'Painting',
    pulse: 'Interior refresh, finishing, site prep',
    zones: ['South East', 'South South', 'South West'],
    note: 'Good for projects where style, speed, and visibility matter.',
  },
  carpentry: {
    label: 'Carpentry',
    pulse: 'Furniture, fittings, woodwork, framing',
    zones: ['North Central', 'South West', 'South East'],
    note: 'Craft work sits naturally alongside renovation and furnishing jobs.',
  },
  engineering: {
    label: 'Engineering',
    pulse: 'Technical field work and specialist support',
    zones: ['Kano', 'Kaduna', 'Abuja'],
    note: 'Higher-skill categories signal the depth of the marketplace.',
  },
}

const MISSION_ORDER: MissionKey[] = ['hire', 'scale', 'offer']
const CATEGORY_ORDER: CategoryKey[] = ['electrical', 'plumbing', 'solar', 'painting', 'carpentry', 'engineering']

export function LandingExperience() {
  const [mission, setMission] = useState<MissionKey>('hire')
  const [category, setCategory] = useState<CategoryKey>('electrical')

  const missionData = MISSIONS[mission]
  const categoryData = CATEGORIES[category]

  const missionScore = useMemo(() => MISSION_ORDER.indexOf(mission) + 1, [mission])

  return (
    <section className="relative">
      <div className="absolute -left-8 top-10 h-28 w-28 rounded-full bg-[#ffd666]/20 blur-3xl" />
      <div className="absolute -right-8 bottom-6 h-32 w-32 rounded-full bg-[#56c7b4]/18 blur-3xl" />

      <div className="relative overflow-hidden rounded-[32px] border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.06))] p-4 shadow-[0_32px_90px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-5">
        <div className="rounded-[28px] border border-white/12 bg-[#0f322f]/80 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9ed5cc]">Interactive mission board</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">Choose a path, unlock the right next step.</h2>
            </div>
            <div className="hidden rounded-full border border-white/12 px-4 py-2 text-xs font-medium text-white/64 sm:block">
              Level {missionScore} active
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {MISSION_ORDER.map((item) => {
              const active = mission === item
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMission(item)}
                  className={`rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${
                    active
                      ? 'border-[#ffd666] bg-[#ffd666]/14 text-white shadow-[0_14px_30px_rgba(255,214,102,0.12)]'
                      : 'border-white/10 bg-white/4 text-white/72 hover:border-white/22 hover:bg-white/8'
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-white/54">{MISSIONS[item].eyebrow}</p>
                  <p className="mt-2 font-display text-lg font-semibold">{MISSIONS[item].label}</p>
                  <p className="mt-2 text-sm leading-6">{MISSIONS[item].streak}</p>
                </button>
              )
            })}
          </div>

          <div className="mt-5 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ffd666]">{missionData.eyebrow}</p>
                <h3 className="mt-2 max-w-md font-display text-2xl font-semibold text-white">{missionData.title}</h3>
              </div>
              <div className="rounded-full border border-[#9ed5cc]/20 bg-[#9ed5cc]/10 px-3 py-1 text-xs font-medium text-[#d6f3ee]">
                {missionData.streak}
              </div>
            </div>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/72">{missionData.description}</p>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9ed5cc]">Pick a skill lane</p>
                <div className="h-2 w-28 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-[#ffd666] transition-all duration-300" style={{ width: `${((CATEGORY_ORDER.indexOf(category) + 1) / CATEGORY_ORDER.length) * 100}%` }} />
                </div>
              </div>

              <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORY_ORDER.map((item) => {
                  const active = category === item
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? 'border-[#56c7b4] bg-[#56c7b4]/18 text-white'
                          : 'border-white/12 bg-white/4 text-white/68 hover:bg-white/10'
                      }`}
                    >
                      {CATEGORIES[item].label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.82fr]">
              <div className="rounded-[24px] border border-white/10 bg-[#081f1d] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9ed5cc]">Live pulse</p>
                <p className="mt-3 font-display text-2xl font-semibold text-white">{categoryData.pulse}</p>
                <p className="mt-3 max-w-md text-sm leading-7 text-white/70">{categoryData.note}</p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/4 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9ed5cc]">Coverage hints</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {categoryData.zones.map((zone) => (
                    <span key={zone} className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-sm text-white/78">
                      {zone}
                    </span>
                  ))}
                </div>
                <Link
                  href={missionData.href}
                  className="mt-6 inline-flex min-h-[46px] items-center justify-center rounded-2xl bg-[#ffd666] px-5 py-3 text-sm font-semibold text-[#08211f] transition-colors hover:bg-[#ffe08a]"
                >
                  {missionData.cta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
