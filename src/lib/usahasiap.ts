// ═══════════════════════════════════════════════════════════════
// 🏭 USAHASIAP — Compliance to Revenue OS (Data Register)
// Sumber kebenaran: USMR-001 Master Document Register v1.0
// (baseline 31 Oktober 2026 · repo gunaracorp/usahasiap-compliance-to-revenue-os)
// Di-generate oleh scripts/gen-usahasiap-data.py — jangan edit manual.
// by Gugun Gunara — Muhammad Lutfi Azmi · PT Top Konsultan Internasional
// ═══════════════════════════════════════════════════════════════

export interface UsaDoc {
  kode: string; nama: string; domain: string; domainNama: string;
  pgaRef: string; ownerRole: string; reviewer: string; dependensi: string;
  gelombang: number; status: string; output: string; catatan: string;
}

export const USA_DOCUMENTS: UsaDoc[] = [
  { kode: "USA-01", nama: "Vision Statement", domain: "A", domainNama: "Identity & Foundation", pgaRef: "PGA-01 — Vision Statement", ownerRole: "Gugun Gunara — Founder / Business Owner", reviewer: "Strategy reviewer", dependensi: "—", gelombang: 1, status: "DRAFT v0.3", output: "Approved vision, principles, impact statement and measurable vision indicators.", catatan: "" },
  { kode: "USA-02", nama: "Mission Statement", domain: "A", domainNama: "Identity & Foundation", pgaRef: "PGA-02 — Mission Statement", ownerRole: "Founder / Business Owner", reviewer: "Strategy reviewer", dependensi: "USA-01", gelombang: 1, status: "REGISTERED / NOT STARTED", output: "Mission priorities, functional missions and measurable mission outcomes.", catatan: "" },
  { kode: "USA-03", nama: "Identity & Positioning Paper", domain: "A", domainNama: "Identity & Foundation", pgaRef: "PGA-06 — Identity & Positioning Paper", ownerRole: "Brand / Strategy Lead", reviewer: "Founder + market reviewer", dependensi: "USA-01, USA-02", gelombang: 1, status: "REGISTERED / NOT STARTED", output: "Brand identity, positioning, differentiation, persona and voice.", catatan: "" },
  { kode: "USA-04", nama: "Strategic Masterplan", domain: "B", domainNama: "Strategy & Business Architecture", pgaRef: "PGA-09 — Strategic Masterplan 3–10 Years", ownerRole: "Business Owner / Strategy Lead", reviewer: "Finance + Product + Operations leads", dependensi: "USA-01, USA-02, USA-06", gelombang: 1, status: "REGISTERED / NOT STARTED", output: "Strategic objectives, initiatives, resources, milestones and strategic risks.", catatan: "" },
  { kode: "USA-05", nama: "Business Model & Value Architecture", domain: "B", domainNama: "Strategy & Business Architecture", pgaRef: "PGA-10 — Business Model & Value Architecture", ownerRole: "Business Owner / Strategy Lead", reviewer: "Finance + Product leads", dependensi: "USA-01, USA-02, USA-06", gelombang: 1, status: "REGISTERED / NOT STARTED", output: "Customer/value proposition map, revenue streams, cost structure and unit-economic hypotheses.", catatan: "" },
  { kode: "USA-06", nama: "Market Landscape & Industry Map", domain: "B", domainNama: "Strategy & Business Architecture", pgaRef: "PGA-11 — Market Landscape & Industry Map", ownerRole: "Market Research Lead", reviewer: "Strategy + Product reviewer", dependensi: "USA-01, USA-02", gelombang: 1, status: "REGISTERED / NOT STARTED", output: "Evidence-backed market map, customer insight, competitor map and opportunity shortlist.", catatan: "" },
  { kode: "USA-07", nama: "Go-To-Market Strategy", domain: "B", domainNama: "Strategy & Business Architecture", pgaRef: "PGA-12 — Go-To-Market Strategy", ownerRole: "Growth / Sales Lead", reviewer: "Business Owner + Finance reviewer", dependensi: "USA-03, USA-04, USA-05, USA-06", gelombang: 1, status: "REGISTERED / NOT STARTED", output: "Beachhead segment, offer, pricing tests, channels, sales motion and launch targets.", catatan: "" },
  { kode: "USA-08", nama: "Ecosystem Strategy", domain: "B", domainNama: "Strategy & Business Architecture", pgaRef: "PGA-13 — Ecosystem Strategy", ownerRole: "Partnership Lead", reviewer: "Business Owner + Legal reviewer", dependensi: "USA-05, USA-06, USA-07", gelombang: 1, status: "REGISTERED / NOT STARTED", output: "Partner map, partner value exchange, ecosystem governance and network-effect hypotheses.", catatan: "" },
  { kode: "USA-09", nama: "Competitive Moat & Advantage Paper", domain: "B", domainNama: "Strategy & Business Architecture", pgaRef: "PGA-15 — Competitive Moat & Advantage Paper", ownerRole: "Strategy Lead", reviewer: "Founder + Product reviewer", dependensi: "USA-05, USA-06, USA-08", gelombang: 1, status: "REGISTERED / NOT STARTED", output: "Defensibility thesis, switching-cost hypotheses, differentiated know-how and moat evidence plan.", catatan: "" },
  { kode: "USA-10", nama: "Governance Charter", domain: "C", domainNama: "Governance & Legal", pgaRef: "PGA-17 — Governance Charter", ownerRole: "Business Owner", reviewer: "Legal / Governance reviewer", dependensi: "USA-01, USA-02, USA-04", gelombang: 1, status: "REGISTERED / NOT STARTED", output: "Decision forums, accountability principles, oversight and governance cadence.", catatan: "" },
  { kode: "USA-11", nama: "Organizational Structure", domain: "C", domainNama: "Governance & Legal", pgaRef: "PGA-18 — Organizational Structure", ownerRole: "Business Owner / People Lead", reviewer: "Operations + Finance reviewer", dependensi: "USA-10", gelombang: 1, status: "REGISTERED / NOT STARTED", output: "Organization chart, functions, reporting lines and role definitions.", catatan: "" },
  { kode: "USA-12", nama: "Role & Authority Matrix (RACI)", domain: "C", domainNama: "Governance & Legal", pgaRef: "PGA-19 — Role & Authority Matrix (RACI)", ownerRole: "Operations Lead", reviewer: "Business Owner + functional leads", dependensi: "USA-10, USA-11", gelombang: 1, status: "REGISTERED / NOT STARTED", output: "RACI, decision rights, approval limits and escalation ownership.", catatan: "" },
  { kode: "USA-13", nama: "Legal Compliance Pack", domain: "C", domainNama: "Governance & Legal", pgaRef: "PGA-21 — Legal Compliance Pack", ownerRole: "Legal / Compliance Lead", reviewer: "Qualified legal/regulatory reviewer", dependensi: "USA-06, USA-10", gelombang: 1, status: "REGISTERED / NOT STARTED", output: "Company-level obligations register, compliance controls, monitoring and remediation framework.", catatan: "" },
  { kode: "USA-14", nama: "Contracting Framework", domain: "C", domainNama: "Governance & Legal", pgaRef: "PGA-23 — Contracting Framework", ownerRole: "Legal / Contract Owner", reviewer: "Business Owner + Finance reviewer", dependensi: "USA-10, USA-12, USA-13", gelombang: 1, status: "REGISTERED / NOT STARTED", output: "Approved contract taxonomy, template library, review/approval workflow and dispute clauses.", catatan: "" },
  { kode: "USA-15", nama: "Product/Service Architecture", domain: "D", domainNama: "Product, AI & Technology", pgaRef: "PGA-25 — Product/Service Architecture", ownerRole: "Product Owner", reviewer: "Business Owner + UX + Engineering reviewer", dependensi: "USA-05, USA-06, USA-19", gelombang: 2, status: "REGISTERED / NOT STARTED", output: "Product portfolio, service taxonomy, feature map, tiers and lifecycle.", catatan: "" },
  { kode: "USA-16", nama: "Product Requirement Document (PRD)", domain: "D", domainNama: "Product, AI & Technology", pgaRef: "PGA-26 — Product Requirement Document (PRD)", ownerRole: "Product Owner", reviewer: "UX + Engineering + Operations reviewer", dependensi: "USA-15, USA-19", gelombang: 2, status: "REGISTERED / NOT STARTED", output: "Testable product requirements, user stories, acceptance criteria and non-functional requirements.", catatan: "" },
  { kode: "USA-17", nama: "Product Strategy & Roadmap", domain: "D", domainNama: "Product, AI & Technology", pgaRef: "PGA-27 — Product Strategy & Roadmap", ownerRole: "Product Owner", reviewer: "Business Owner + Engineering + Finance reviewer", dependensi: "USA-15, USA-16, USA-29, USA-30", gelombang: 2, status: "REGISTERED / NOT STARTED", output: "Prioritized roadmap, release strategy, resource needs and outcome measures.", catatan: "" },
  { kode: "USA-18", nama: "System Architecture / Service Blueprint", domain: "D", domainNama: "Product, AI & Technology", pgaRef: "PGA-28 — System Architecture / Service Blueprint", ownerRole: "Technical Lead / Architect", reviewer: "Security + Product reviewer", dependensi: "USA-15, USA-16, USA-13", gelombang: 2, status: "REGISTERED / NOT STARTED", output: "System context, components, data flows, integration, security, scaling and recovery design.", catatan: "" },
  { kode: "USA-19", nama: "Customer/User Journey Map", domain: "D", domainNama: "Product, AI & Technology", pgaRef: "PGA-29 — Customer/Member/User Journey Map", ownerRole: "Product / UX Lead", reviewer: "Customer Research + Operations reviewer", dependensi: "USA-06", gelombang: 2, status: "REGISTERED / NOT STARTED", output: "Journey stages, user needs, touchpoints, pain points and experience measures.", catatan: "" },
  { kode: "USA-20", nama: "Quality Standard & Acceptance Criteria", domain: "D", domainNama: "Product, AI & Technology", pgaRef: "PGA-30 — Quality Standard & Acceptance Criteria", ownerRole: "QA Lead", reviewer: "Product + Engineering + Regulatory reviewer", dependensi: "USA-16, USA-18, USA-45", gelombang: 2, status: "REGISTERED / NOT STARTED", output: "Quality gates, test standards, acceptance criteria, defect handling and release readiness.", catatan: "" },
  { kode: "USA-21", nama: "Change Request & Version Governance", domain: "D", domainNama: "Product, AI & Technology", pgaRef: "PGA-32 — Change Request & Version Governance", ownerRole: "Product Operations / Release Manager", reviewer: "Product + Engineering + Document Controller", dependensi: "USA-17, USA-18, USA-44", gelombang: 2, status: "REGISTERED / NOT STARTED", output: "Change intake, impact review, approval, versioning, release and rollback controls.", catatan: "" },
  { kode: "USA-22", nama: "AI & Automation Strategy", domain: "D", domainNama: "Product, AI & Technology", pgaRef: "PGA-118 — AI & Automation Strategy", ownerRole: "AI / Automation Lead", reviewer: "Product + Regulatory + Security reviewer", dependensi: "USA-13, USA-18, USA-40, USA-41", gelombang: 2, status: "REGISTERED / NOT STARTED", output: "Prioritized AI use cases, build/buy criteria, human oversight, governance and success measures.", catatan: "" },
  { kode: "USA-23", nama: "Software Development Standards", domain: "D", domainNama: "Product, AI & Technology", pgaRef: "PGA-121 — Software Development Standards", ownerRole: "Engineering Lead", reviewer: "QA + Security reviewer", dependensi: "USA-18, USA-20, USA-21, USA-41", gelombang: 2, status: "REGISTERED / NOT STARTED", output: "Coding, architecture, testing, security, documentation and deployment standards.", catatan: "" },
  { kode: "USA-24", nama: "Master Operational SOP", domain: "E", domainNama: "Operations & Service Delivery", pgaRef: "PGA-33 — Master Operational SOP", ownerRole: "Operations Lead", reviewer: "Business Owner + QA reviewer", dependensi: "USA-10, USA-12, USA-13", gelombang: 3, status: "REGISTERED / NOT STARTED", output: "SOP framework, process ownership, training and operational controls.", catatan: "" },
  { kode: "USA-25", nama: "End-to-End Process Map", domain: "E", domainNama: "Operations & Service Delivery", pgaRef: "PGA-34 — Process Map End-to-End", ownerRole: "Process / Operations Analyst", reviewer: "Product + Service Delivery reviewer", dependensi: "USA-15, USA-19, USA-24", gelombang: 3, status: "REGISTERED / NOT STARTED", output: "Process maps, process owners, dependencies, bottlenecks and process KPIs.", catatan: "" },
  { kode: "USA-26", nama: "Service Delivery Manual", domain: "E", domainNama: "Operations & Service Delivery", pgaRef: "PGA-35 — Service Delivery Manual", ownerRole: "Service Delivery Lead", reviewer: "Operations + Regulatory + QA reviewer", dependensi: "USA-13, USA-20, USA-24, USA-25", gelombang: 3, status: "REGISTERED / NOT STARTED", output: "Service standards, case workflow, customer updates, QA, escalation and service levels.", catatan: "" },
  { kode: "USA-27", nama: "Incident & Escalation SOP", domain: "E", domainNama: "Operations & Service Delivery", pgaRef: "PGA-38 — Incident & Escalation SOP", ownerRole: "Operations / Incident Manager", reviewer: "Security + Product + Legal reviewer", dependensi: "USA-24, USA-26, USA-33, USA-41", gelombang: 3, status: "REGISTERED / NOT STARTED", output: "Incident severity, triage, escalation, communications, resolution and post-incident review.", catatan: "" },
  { kode: "USA-28", nama: "Business Continuity & Disaster Recovery Plan", domain: "E", domainNama: "Operations & Service Delivery", pgaRef: "PGA-39 — Business Continuity & Disaster Recovery Plan", ownerRole: "Operations + Technical Lead", reviewer: "Business Owner + Security reviewer", dependensi: "USA-18, USA-27, USA-33, USA-41", gelombang: 3, status: "REGISTERED / NOT STARTED", output: "Business impact analysis, recovery objectives, continuity actions, backup/restore and exercises.", catatan: "" },
  { kode: "USA-29", nama: "Financial Model / Projection", domain: "F", domainNama: "Finance, Revenue & Risk", pgaRef: "PGA-41 — Financial Model / Projection", ownerRole: "Finance Lead", reviewer: "Business Owner + Strategy reviewer", dependensi: "USA-05, USA-07", gelombang: 4, status: "REGISTERED / NOT STARTED", output: "Assumptions-led revenue, cost, cash-flow and scenario model.", catatan: "" },
  { kode: "USA-30", nama: "Unit Economics", domain: "F", domainNama: "Finance, Revenue & Risk", pgaRef: "PGA-42 — Unit Economics", ownerRole: "Finance / Revenue Operations Lead", reviewer: "Business Owner + Growth reviewer", dependensi: "USA-29, USA-07", gelombang: 4, status: "REGISTERED / NOT STARTED", output: "CAC, LTV, contribution margin, payback and segment-level economics.", catatan: "" },
  { kode: "USA-31", nama: "Budgeting & Cash Control SOP", domain: "F", domainNama: "Finance, Revenue & Risk", pgaRef: "PGA-43 — Budgeting & Cash Control SOP", ownerRole: "Finance Lead", reviewer: "Business Owner + Accounting reviewer", dependensi: "USA-29, USA-33", gelombang: 4, status: "REGISTERED / NOT STARTED", output: "Budget calendar, approval matrix, cash controls, reconciliation and variance reporting.", catatan: "" },
  { kode: "USA-32", nama: "Revenue Model & Monetization Playbook", domain: "F", domainNama: "Finance, Revenue & Risk", pgaRef: "PGA-44 — Revenue Model & Monetization Playbook", ownerRole: "Commercial / Revenue Lead", reviewer: "Business Owner + Finance reviewer", dependensi: "USA-05, USA-07, USA-29, USA-30", gelombang: 4, status: "REGISTERED / NOT STARTED", output: "Pricing architecture, revenue streams, billing, collection and monetization experiments.", catatan: "" },
  { kode: "USA-33", nama: "Risk Register & Mitigation Plan", domain: "F", domainNama: "Finance, Revenue & Risk", pgaRef: "PGA-45 — Risk Register & Mitigation Plan", ownerRole: "Risk Owner / Business Owner", reviewer: "Functional risk owners + Governance reviewer", dependensi: "USA-10, USA-13, USA-18, USA-24, USA-29", gelombang: 4, status: "REGISTERED / NOT STARTED", output: "Risk taxonomy, likelihood/impact, owners, mitigations, appetite and reporting.", catatan: "" },
  { kode: "USA-34", nama: "Talent & Recruitment Framework", domain: "G", domainNama: "People, Culture & Ethics", pgaRef: "PGA-49 — Talent & Recruitment Framework", ownerRole: "People / HR Lead", reviewer: "Business Owner + Functional leads", dependensi: "USA-11, USA-12, USA-29, USA-33", gelombang: 4, status: "REGISTERED / NOT STARTED", output: "Critical roles, hiring profile, recruitment process and workforce plan.", catatan: "" },
  { kode: "USA-35", nama: "HR Operating Manual", domain: "G", domainNama: "People, Culture & Ethics", pgaRef: "PGA-51 — HR Operating Manual", ownerRole: "People / HR Lead", reviewer: "Legal + Finance + Business Owner", dependensi: "USA-11, USA-12, USA-34", gelombang: 4, status: "REGISTERED / NOT STARTED", output: "Employment, onboarding, performance, leave, compensation and employee administration policies.", catatan: "" },
  { kode: "USA-36", nama: "Ethics & Conduct Code", domain: "G", domainNama: "People, Culture & Ethics", pgaRef: "PGA-55 — Ethics & Conduct Code", ownerRole: "Business Owner / People Lead", reviewer: "Legal + Privacy + Governance reviewer", dependensi: "USA-10, USA-12, USA-13", gelombang: 4, status: "REGISTERED / NOT STARTED", output: "Code of conduct, confidentiality, conflicts, reporting and investigation principles.", catatan: "" },
  { kode: "USA-37", nama: "Brand & Communication Guideline", domain: "H", domainNama: "Brand, Marketing & Growth", pgaRef: "PGA-57 — Brand & Communication Guideline", ownerRole: "Brand / Marketing Lead", reviewer: "Founder + Legal reviewer", dependensi: "USA-03, USA-04", gelombang: 5, status: "REGISTERED / NOT STARTED", output: "Visual/verbal brand standards, tone, usage rules and brand governance.", catatan: "" },
  { kode: "USA-38", nama: "Narrative & Messaging Matrix", domain: "H", domainNama: "Brand, Marketing & Growth", pgaRef: "PGA-58 — Narrative & Messaging Matrix", ownerRole: "Marketing / Communications Lead", reviewer: "Founder + Product + Regulatory reviewer", dependensi: "USA-03, USA-06, USA-37", gelombang: 5, status: "REGISTERED / NOT STARTED", output: "Audience-specific messages, proof points, claims guardrails and messaging templates.", catatan: "" },
  { kode: "USA-39", nama: "Sales / Acquisition Playbook", domain: "H", domainNama: "Brand, Marketing & Growth", pgaRef: "PGA-61 — Sales / Acquisition Playbook", ownerRole: "Sales Lead", reviewer: "Business Owner + Finance + Operations reviewer", dependensi: "USA-07, USA-32, USA-37, USA-38", gelombang: 5, status: "REGISTERED / NOT STARTED", output: "Lead stages, qualification, outreach, proposal, follow-up and sales performance.", catatan: "" },
  { kode: "USA-40", nama: "Data Governance & Privacy Policy", domain: "I", domainNama: "Data, Intelligence & Compliance", pgaRef: "PGA-65 — Data Governance & Privacy Policy", ownerRole: "Data Protection / Privacy Owner", reviewer: "Legal + Security reviewer", dependensi: "USA-13, USA-18", gelombang: 5, status: "REGISTERED / NOT STARTED", output: "Data classification, access, consent, retention, rights, sharing and deletion rules.", catatan: "" },
  { kode: "USA-41", nama: "Security & Cyber Compliance Framework", domain: "I", domainNama: "Data, Intelligence & Compliance", pgaRef: "PGA-66 — Security & Cyber Compliance Framework", ownerRole: "Security Lead", reviewer: "Technical + Privacy + Business Owner", dependensi: "USA-18, USA-40", gelombang: 5, status: "REGISTERED / NOT STARTED", output: "Security controls, access, encryption, monitoring, incident response and security assurance.", catatan: "" },
  { kode: "USA-42", nama: "KPI Dashboard & North Star Metrics", domain: "I", domainNama: "Data, Intelligence & Compliance", pgaRef: "PGA-67 — KPI Dashboard & North Star Metrics", ownerRole: "Analytics / Product Operations Lead", reviewer: "Business Owner + Finance + Functional leads", dependensi: "USA-05, USA-07, USA-16, USA-29, USA-30, USA-32, USA-39", gelombang: 5, status: "REGISTERED / NOT STARTED", output: "Metric dictionary, North Star, dashboards, reporting cadence and KPI ownership.", catatan: "" },
  { kode: "USA-43", nama: "Knowledge Management & Documentation SOP", domain: "I", domainNama: "Data, Intelligence & Compliance", pgaRef: "PGA-68 — Knowledge Management & Documentation SOP", ownerRole: "Knowledge / Document Control Lead", reviewer: "Product + Regulatory + Operations reviewer", dependensi: "USA-13, USA-24, USA-40, USA-44", gelombang: 5, status: "REGISTERED / NOT STARTED", output: "Knowledge capture, review, tagging, publishing, versioning, reuse and retirement workflow.", catatan: "" },
  { kode: "USA-44", nama: "Master Index & Document Control Register", domain: "I", domainNama: "Data, Intelligence & Compliance", pgaRef: "PGA-72 — Master Index & Document Control Register", ownerRole: "Document Controller / PMO", reviewer: "Business Owner + all document owners", dependensi: "— (foundational control; maintain from day one)", gelombang: 5, status: "REGISTERED / NOT STARTED", output: "Authoritative inventory, metadata, version history, approval evidence, review dates and archive status.", catatan: "" },
  { kode: "USA-45", nama: "Master Compliance & Regulatory Atlas", domain: "I", domainNama: "Data, Intelligence & Compliance", pgaRef: "PGA-165 — Master Compliance & Regulatory Atlas", ownerRole: "Regulatory Intelligence Lead", reviewer: "Qualified regulatory/legal reviewers + Product Owner", dependensi: "USA-13, USA-40, USA-43", gelombang: 5, status: "REGISTERED / NOT STARTED", output: "Regulatory landscape, applicability mapping, obligations, monitoring, reporting and regulatory intelligence.", catatan: "" },
];

export const USA_DOMAINS = [
  { kode: "A", nama: "Identity & Foundation", rentang: "USA-01–USA-03", jumlah: 3 },
  { kode: "B", nama: "Strategy & Business Architecture", rentang: "USA-04–USA-09", jumlah: 6 },
  { kode: "C", nama: "Governance & Legal", rentang: "USA-10–USA-14", jumlah: 5 },
  { kode: "D", nama: "Product, AI & Technology", rentang: "USA-15–USA-23", jumlah: 9 },
  { kode: "E", nama: "Operations & Service Delivery", rentang: "USA-24–USA-28", jumlah: 5 },
  { kode: "F", nama: "Finance, Revenue & Risk", rentang: "USA-29–USA-33", jumlah: 5 },
  { kode: "G", nama: "People, Culture & Ethics", rentang: "USA-34–USA-36", jumlah: 3 },
  { kode: "H", nama: "Brand, Marketing & Growth", rentang: "USA-37–USA-39", jumlah: 3 },
  { kode: "I", nama: "Data, Intelligence & Compliance", rentang: "USA-40–USA-45", jumlah: 6 }
] as const;

export const USA_VOLUMES = [
  { id: "USM-00", nama: "UsahaSiap Master Blueprint", peran: "Arsitektur, prinsip, stage gate, keputusan, dan peta dokumen", cakupan: "Semua USA-01–USA-45" },
  { id: "USM-01", nama: "Market, Customer & Revenue Strategy", peran: "Pasar, pelanggan, proposisi nilai, distribusi dan hipotesis pendapatan", cakupan: "USA-01–09 · 29–33 · 37–39 · 42" },
  { id: "USM-02", nama: "Product Requirements & Technical Architecture", peran: "Produk, UX, requirement, AI, arsitektur dan engineering", cakupan: "USA-15–23 · 40–42" },
  { id: "USM-03", nama: "Regulatory Knowledge, Trust & Data Governance", peran: "Ketepatan regulasi, kontrol AI, privasi, keamanan dan kepercayaan", cakupan: "USA-13 · 20 · 22 · 26–28 · 40–41 · 43 · 45" },
  { id: "USM-04", nama: "Operations, Sales, Launch & Metrics", peran: "Delivery, CRM, komersial, SOP, peluncuran dan pengukuran", cakupan: "USA-10–14 · 24–39 · 42–44" },
] as const;

/** Pipeline Compliance → Revenue (5 tahap) — inti produk UsahaSiap. */
export const USA_PIPELINE = [
  { no: 1, nama: "Kepatuhan", desc: "Pahami kewajiban regulasi & perizinan yang berlaku untuk usaha pelanggan" },
  { no: 2, nama: "Dokumen & Bukti", desc: "Susun dokumen, checklist, dan bukti kepatuhan yang bisa diaudit" },
  { no: 3, nama: "Kesiapan Usaha", desc: "SOP, proses, dan standar layanan siap dipakai operasional nyata" },
  { no: 4, nama: "Profil Pemasok", desc: "Kredibilitas & kapabilitas terdokumentasi untuk masuk rantai pasok" },
  { no: 5, nama: "Revenue", desc: "Kontrak, pelanggan, dan pendapatan — kepatuhan berubah jadi uang" },
] as const;

/** 5 Stage Gates — gerbang keputusan USM-00 §8. */
export const USA_GATES = [
  { no: 1, nama: "Problem Evidence", desc: "Wawancara menunjukkan masalah berulang dan bernilai; minimal lima calon pelanggan bersedia membayar atau ikut pilot berbayar" },
  { no: 2, nama: "Paid Pilot", desc: "Alur layanan manual dapat diselesaikan dan hasilnya dinilai bermanfaat oleh pelanggan" },
  { no: 3, nama: "MVP Release", desc: "Alur utama diuji end-to-end; harga, klaim, privasi, akses dokumen, kontak, backup dan pemilik follow-up telah disetujui" },
  { no: 4, nama: "Repeatability", desc: "Pelanggan memakai ulang/berlangganan, waktu delivery membaik, dan margin dapat diukur" },
  { no: 5, nama: "Expansion", desc: "Baru membuka segmen/negara baru jika alur inti dan kontrol kualitas stabil" },
] as const;

/** 5 Gelombang pengerjaan (USMR-001 §7). */
export const USA_WAVES = [
  { no: 1, rentang: "USA-01–14", fokus: "Fondasi, pasar, strategi, governance dan legal", exit: "Arah, segmen awal, model bisnis awal, otoritas keputusan dan batas legal terdokumentasi" },
  { no: 2, rentang: "USA-15–23", fokus: "Produk, UX, AI dan teknologi", exit: "PRD, arsitektur, standar engineering dan acceptance criteria siap pakai tim" },
  { no: 3, rentang: "USA-24–28", fokus: "Operasional dan delivery", exit: "Alur layanan, SOP, incident response dan continuity plan siap pilot" },
  { no: 4, rentang: "USA-29–36", fokus: "Keuangan, risiko, SDM dan etika", exit: "Unit economics, pengendalian uang, risiko dan tanggung jawab tim terdinjau" },
  { no: 5, rentang: "USA-37–45", fokus: "Brand, penjualan, data, knowledge dan regulatory atlas", exit: "Akuisisi, pengukuran, privasi, keamanan, dokumentasi dan regulatory intelligence terkendali" },
] as const;

/** Guardrail janji — boleh & tidak boleh (USM-00). */
export const USA_GUARDRAIL = {
  boleh: [
    "Menilai kesiapan & gap kepatuhan usaha berdasarkan regulasi yang terverifikasi",
    "Menyusun dokumen, checklist, dan bukti yang bisa diaudit",
    "Menstandarkan SOP & proses agar layanan konsisten dan bisa diukur",
  ],
  larang: [
    "Menjanjikan hasil regulasi final di luar kewenangan pemerintah/regulator",
    "Menggantikan nasihat hukum profesional tanpa reviewer kompeten",
    "Mengaku data pelanggan aman tanpa kontrol keamanan yang teruji",
  ],
} as const;

/** 6 risiko utama (USM-00 §9). */
export const USA_RISKS = [
  "Salah klasifikasi kebutuhan karena jawaban otomatis terlalu percaya diri",
  "Regulasi berubah tetapi checklist belum diperbarui",
  "Dokumen pelanggan bocor atau dibagikan tanpa persetujuan",
  "Pemasaran menjanjikan hasil yang berada di luar kendali konsultan/platform",
  "Terlalu banyak fitur dan dokumen sebelum ada bukti kemauan membayar",
  "Bisnis terlihat sibuk tetapi unit economics, retensi dan kualitas layanan tidak terukur",
] as const;

/** Prioritas 14 hari pertama (USM-00 §10). */
export const USA_PRIORITAS_14 = [
  "Tetapkan satu subsegmen pangan dan definisikan profil pelanggan ideal",
  "Wawancarai 30 calon pengguna; catat pekerjaan terakhir yang nyata",
  "Siapkan format asesmen kesiapan awal dan contoh laporan gap",
  "Tawarkan pilot berbayar kepada calon pelanggan yang sesuai",
  "Catat waktu pengerjaan, biaya, sumber, kebingungan pelanggan, dan nilai hasil",
  "Bangun fitur software hanya untuk mengurangi friksi yang berulang pada pilot",
] as const;

/** Status vocabulary (USMR-001 §4). */
export const USA_STATUS = [
  "REGISTERED / NOT STARTED", "DRAFT", "IN REVIEW", "APPROVED / ACTIVE",
  "REVISION REQUIRED", "SUPERSEDED", "N/A CONTROLLED", "BLOCKED",
] as const;
