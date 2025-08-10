import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
  "lastUpdated": "2025-08-10",
  "market": {
    "month": "July 2025",
    "sales": 1180,
    "avg_price": 682000,
    "hpi": 645000,
    "dom": 24,
    "moi": 2.1,
    "yoy_price_change": 0.032,
    "yoy_sales_change": 0.058,
    "trend": [
      615,
      628,
      630,
      634,
      637,
      640,
      642,
      646,
      648,
      650,
      644,
      645
    ]
  },
  "neighbourhoods": [
    {
      "id": "kanata-lakes",
      "name": "Kanata Lakes",
      "pop": 18600,
      "owners_pct": 0.82,
      "median_income": 138000,
      "schools": [
        "Earl of March SS",
        "W. Erskine Johnston PS"
      ],
      "notes": "Great for tech commuters; strong schools; larger lots."
    },
    {
      "id": "the-glebe",
      "name": "The Glebe",
      "pop": 12600,
      "owners_pct": 0.62,
      "median_income": 118000,
      "schools": [
        "Glebe CI",
        "First Avenue PS"
      ],
      "notes": "Walkable, boutique retail, higher price per sq.ft."
    },
    {
      "id": "orleans-avalon",
      "name": "Orl\u00e9ans \u2013 Avalon",
      "pop": 31100,
      "owners_pct": 0.78,
      "median_income": 112000,
      "schools": [
        "\u00c9SC B\u00e9atrice-Desloges",
        "Avalon PS"
      ],
      "notes": "Family-friendly, newer builds, good value-for-space."
    }
  ],
  "services": [
    {
      "name": "StageRight Co.",
      "category": "Staging",
      "desc": "Occupied & vacant staging bundles for faster sale.",
      "rating": 4.7,
      "price": "From $699"
    },
    {
      "name": "SparkleClean Ottawa",
      "category": "Cleaning",
      "desc": "Deep cleans & pre-list shine (eco-friendly).",
      "rating": 4.8,
      "price": "From $159"
    },
    {
      "name": "Fix-It Handy",
      "category": "Handyman",
      "desc": "Repairs, paint touch-ups, fixtures \u2014 list-ready.",
      "rating": 4.9,
      "price": "From $85/hr"
    },
    {
      "name": "ProShots Media",
      "category": "Photography & Video",
      "desc": "HDR photos, twilight set, video & 3D tours.",
      "rating": 4.8,
      "price": "From $249"
    },
    {
      "name": "Eagle Inspections",
      "category": "Home Inspection",
      "desc": "Buyer & pre-list inspections, same-day report.",
      "rating": 4.7,
      "price": "From $499"
    },
    {
      "name": "Smith & Partners LLP",
      "category": "Real Estate Lawyer",
      "desc": "Flat-fee closings, title insurance guidance.",
      "rating": 4.6,
      "price": "From $1,299"
    },
    {
      "name": "Capital Mortgages",
      "category": "Mortgage Broker",
      "desc": "Rate shopping + approval prep for offers.",
      "rating": 4.8,
      "price": "Free consult"
    }
  ],
  "packages": [
    {
      "title": "List-Ready in 7 Days",
      "tagline": "Clean \u2022 Touch-ups \u2022 Photos \u2022 Staging-Lite",
      "price": "From $1,499",
      "includes": [
        "Deep clean (team of 2, 6 hours)",
        "Paint touch-ups & minor fixes",
        "Pro photos (25), floor plan",
        "Staging-lite in key rooms",
        "Project coordination"
      ]
    },
    {
      "title": "Investor Turnover Pack",
      "tagline": "Tenant move-out to re-rent or sell",
      "price": "From $1,199",
      "includes": [
        "Unit refresh clean",
        "Minor repairs, caulking, hardware",
        "Photo set + listing-copy polish",
        "Optional lock change"
      ]
    },
    {
      "title": "Move-In Smooth",
      "tagline": "Day-1 comfort for buyers",
      "price": "From $799",
      "includes": [
        "Deep clean before keys",
        "Basic handyman fixes",
        "Key locks re-pin (optional)",
        "Welcome essentials kit"
      ]
    }
  ]
} as const;
  return NextResponse.json(data, { status: 200 });
}