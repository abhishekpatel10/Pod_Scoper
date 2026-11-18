import type { SampleTranscript } from '../types/scope';

export const SAMPLE_TRANSCRIPTS: SampleTranscript[] = [
  {
    id: 'logistics',
    title: 'Mid-Market 3PL & Intermodal Freight Operations',
    executiveRole: 'VP of Supply Chain & Logistics',
    organization: 'Apex Global Logistics ($450M 3PL / Freight Operator)',
    estimatedAnnualSavings: '$1.4M - $1.8M / yr',
    tags: ['3PL Logistics', 'SAP TMS', 'CargoWise', 'Demurrage', 'Drayage PDFs'],
    description: 'Fast-talking, impatient VP venting about 4,000 monthly containers, drayage PDF reconciliation hell, and $80k/month demurrage bleed.',
    transcript: `[00:00:04] Tenex FDE (Alex): Dave, morning. Appreciate you carving out twenty minutes. I know peak shipping season is kicking off.

[00:00:11] Dave Miller (VP Logistics): Yeah, hey Alex—sorry, give me one second to kick my door shut. The dispatch floor sounds like the New York Stock Exchange today. Look, let's skip the pitch deck. I've had three different AI startups cold-call me this week promising "autonomous supply chain nirvana." Every single one of them wanted a six-month data lake migration. Don't pitch me a six-month data lake migration. My CFO wants to see something working in two weeks, or we're cutting exploratory tech spend altogether.

[00:00:44] Alex: Fair enough, no slide decks here. We only ship working code in 14-day sprints. What is the single biggest operational bleeding neck on your board right now?

[00:00:53] Dave: Demurrage and detention fees. It is literally draining our EBITDA. We move about 4,000 containers a month across Long Beach, Newark, and Savannah. Here is how stupid our workflow is: our ops team spends half their morning reconciling PDFs from drayage carriers against our SAP TMS and CargoWise. 

[00:01:21] Alex: Why PDFs? Don't the drayage truckers push EDI 214 status events?

[00:01:26] Dave: In theory? Sure. In reality? Half of these regional drayage guys don't have EDI set up, or their EDI feed breaks every Tuesday. So what do they do? They email a scanned PDF rate-con with a grease-stained gate ticket attached. Meanwhile, when a customs hold hits—say CBP wants an intensive exam on an inbound box from Ningbo—nobody knows for 6 hours until an angry customer emails asking why their chassis didn't move! The port terminal websites like eModal and Advent post the hold status at 07:00 AM, but my coordinator doesn't check that specific container number until 01:00 PM because they're buried in CargoWise data entry.

[00:02:18] Alex: And by 1:00 PM the free-time clock on the terminal yard has already expired.

[00:02:22] Dave: Exactly! The container sits on terminal tarmac incurring daily per-diem penalties. Those detention and demurrage fees are killing us—probably $80k a month just in avoidable penalties. That's nearly a million dollars a year we are literally setting on fire because our systems don't talk to each other.

[00:02:46] Alex: How many coordinators are currently stuck doing that manual reconciliation?

[00:02:51] Dave: I've got eight full-time ops reps. They're making $65,000 base plus benefits. They spend roughly 3 to 4 hours every single morning with three monitors open: CargoWise on the left, SAP TMS in the middle, and an Outlook folder with 600 unread carrier emails on the right. They're copy-pasting container numbers, checking free-time expiration dates, and keying exception codes by hand. My best coordinator quit last Friday because she said she felt like a human copy-paste macro.

[00:03:32] Alex: If our FDE pod deploys for 14 days, what is the exact shippable feature that makes your CFO say yes?

[00:03:39] Dave: Day 14 deliverable: an event pipe that scrapes our terminal watchlists at 6:00 AM, pulls inbound drayage rate confirmation PDFs from our ops inbox, extracts the container and chassis IDs, flags customs holds before 8:00 AM, and pushes an exception flag straight into CargoWise and SAP TMS with a Slack ping to the dispatcher. If you can show me that running on our top 200 high-risk containers in two weeks, you've got a deal.`
  },
  {
    id: 'healthcare',
    title: 'Multi-Site Regional Healthcare Network',
    executiveRole: 'Chief Operating Officer',
    organization: 'Highland Health Partners (14 Outpatient & Specialty Clinics)',
    estimatedAnnualSavings: '$2.1M - $2.8M / yr',
    tags: ['Healthcare', 'Epic EHR', 'Prior Authorization', 'HIPAA Compliance', 'Payer Rubrics'],
    description: 'Risk-averse, compliance-focused COO dealing with 14 clinics, faxed PDF referrals, a 14% prior-auth denial spike, and nurse burnout.',
    transcript: `[00:00:08] Tenex FDE (Alex): Good afternoon, Brenda. Thanks for taking the time. I know managing operations across fourteen clinical facilities doesn't leave much open calendar space.

[00:00:18] Brenda Vance (COO): Thanks Alex. I'll be direct with you: our legal and compliance committee was hesitant to even let me take this call. Every healthcare software vendor says "AI this" and "AI that," but the moment I ask about HIPAA business associate agreements or where protected health information resides, they start stammering. If any patient PHI touches a public LLM or gets used to train a foundation model, our Chief Compliance Officer will shut this down before we even open an IDE.

[00:00:54] Alex: 100% agreed, Brenda. Tenex pods deploy zero-retention HIPAA-compliant enterprise pipelines directly into your own tenant VPC, or on-prem with local weights. No patient data ever trains any model. Everything runs under an executed BAA.

[00:01:10] Brenda: Okay, good. That is the baseline prerequisite. Now, let me tell you where we are bleeding operationally. We have 14 clinics running on Epic, plus faxed referrals still coming in as messy scanned PDFs from outside independent primary care groups. It is absolute intake chaos.

[00:01:36] Alex: Unpack what happens when one of those referral packets comes in.

[00:01:41] Brenda: A primary care doc refers an elderly patient for a knee arthroplasty or an MRI of the lumbar spine. Instead of a clean electronic FHIR referral, we get an 18-page e-fax. It's a scanned PDF: crooked pages, faint handwriting, doctor clinical notes, previous physical therapy records, and blood work labs all mixed together. Our intake coordinators have to manually re-type the demographic and insurance data into Epic just to generate a patient encounter.

[00:02:18] Alex: And then the prior-authorization nightmare begins?

[00:02:22] Brenda: Exactly. Our prior-auth team of 12 nurses spends roughly 25 minutes per chart hunting through unstructured physician notes just to match payer policies from United and Aetna. UnitedHealthcare wants six weeks of documented non-steroidal anti-inflammatory trial notes; Aetna wants specific radiographic angles. That information is in the chart, but it's buried in page 12 of a handwritten progress note. The nurses are copy-pasting snippets into payer web portals all day long.

[00:03:04] Alex: What is that doing to your claim denial rates and clinical backlog?

[00:03:09] Brenda: It's disastrous. Denial rate jumped to 14% last quarter because codes don't match latest payer guidelines. The commercial payers update their clinical necessity guidelines every ninety days without notice. When a prior-auth gets denied, the surgical suite sits dark, the orthopedic surgeon has to do a 15-minute peer-to-peer phone appeal with an insurance medical director, and the patient is waiting in pain for three weeks. We calculated that 14% denial rate leaked over $1.8 million in delayed or lost surgical collections over the past six months.

[00:03:52] Alex: If our FDE pod steps in for a 14-day outcome-based sprint, what specific capability do you need in production?

[00:04:01] Brenda: By Day 14, I need an automated clinical necessity reviewer embedded inside Epic. When a referral or chart comes in, the pipeline should parse the scanned PDF, match the patient's documented clinical history against United and Aetna's latest policy rubrics in a local vector store, and output a pre-populated prior-auth summary with exact page and line citations to the physician notes. If my 12 nurses can review and approve a packet in 3 minutes instead of 25 minutes, you will have saved our clinical intake operation.`
  },
  {
    id: 'fintech',
    title: 'High-Growth Fintech & Payment Orchestration',
    executiveRole: 'Chief Financial Officer',
    organization: 'NeoFin Payments ($1.2B Annual GMV Platform)',
    estimatedAnnualSavings: '$1.3M - $1.8M / yr',
    tags: ['Fintech', 'Stripe', 'NetSuite GL', 'Plaid', 'ACH Reconciliations', 'Chargeback Disputes'],
    description: 'Impatient CFO with 85k daily transactions, 9 analysts stuck doing 5-hour manual settlement cross-referencing, and $65k/mo dispute leakage.',
    transcript: `[00:00:05] Tenex FDE (Marcus): Alex, good to connect. I know you're preparing for your quarterly board review. Let's get straight to the numbers.
    
[00:00:12] Alex Chen (CFO): Thanks Marcus. We process roughly 85,000 ACH and wire transactions a day across Stripe, Plaid, and three regional depository banks: Silicon Valley Bank, JPMorgan Chase, and Wells Fargo.

[00:00:31] Marcus: Where is the operational bleeding right now?

[00:00:35] Alex: Exception reconciliation is a total disaster. Every morning, our finance team of 9 analysts downloads CSV settlement files and MT940 bank statements, manually cross-referencing them against our Postgres ledger. Easily 4 to 5 hours every single day. If there is a batch mismatch or delayed wire return, it takes us 24 to 48 hours to identify which ledger account is out of balance. We had an audit finding last month because $320,000 in unallocated suspense account funds sat unreconciled for 18 business days.

[00:01:15] Marcus: What about fraud and chargeback disputes?

[00:01:19] Alex: Total blind spot. We are paying over $65,000 a month in card network dispute fees and non-compliance penalties because we cannot match dispute notices from Stripe with customer transaction histories fast enough. Our chargeback ratio hit 0.94% last quarter—if it crosses 1.0%, Visa places us on excessive dispute monitoring, which will cost us our merchant processing status.

[00:01:48] Marcus: What is your primary system of record for the ledger?

[00:01:52] Alex: We have custom Go microservices writing transaction events to PostgreSQL, and we use NetSuite for general ledger accounting. But there is zero automated bridge between the raw payment events in Postgres and NetSuite GL entries. The team literally manually keys summary journal entries into NetSuite every Friday.

[00:02:18] Marcus: What is your timeline for fixing this?

[00:02:22] Alex: I have board review in three weeks. I cannot wait six months for an enterprise ERP consulting project. Day 14 deliverable: an automated two-way reconciliation pipeline ingesting Stripe and bank MT940 files, matching against Postgres within 60 seconds, and posting auto-balanced journal entries to NetSuite with real-time Slack dispute alerts. If you can deliver that in 14 days, my CFO signature is on the contract.`
  }
];
