// Bilingual content for Prominence (EN / ID)
// Industry, platform and solution data are kept in structured form so pages
// can render dynamically from one source of truth.

export const NAV = {
  en: {
    platform: "Platform",
    solutions: "Solutions",
    architecture: "Architecture",
    services: "Services",
    products: "Products",
    resources: "Resources",
    partners: "Partners",
    company: "Company",
    contact: "Contact",
    requestConsultation: "Request Consultation",
    explorePlatform: "Explore Platform",
    talkToTeam: "Talk to our team",
    startAssessment: "Start with Assessment",
    requestPilot: "Request 90-Day Pilot",
    viewArchitecture: "View Architecture",
    learnMore: "Learn more",
  },
  id: {
    platform: "Platform",
    solutions: "Solusi",
    architecture: "Arsitektur",
    services: "Layanan",
    products: "Produk",
    resources: "Sumber Daya",
    partners: "Mitra",
    company: "Perusahaan",
    contact: "Kontak",
    requestConsultation: "Minta Konsultasi",
    explorePlatform: "Jelajahi Platform",
    talkToTeam: "Hubungi tim kami",
    startAssessment: "Mulai dari Asesmen",
    requestPilot: "Minta Pilot 90 Hari",
    viewArchitecture: "Lihat Arsitektur",
    learnMore: "Pelajari lebih lanjut",
  },
};

export const HOME = {
  en: {
    eyebrow: "Sovereign Edge Cloud · AI-Ready · Indonesia",
    heroTitle: "Indonesia's sovereign cloud, engineered for the AI era.",
    heroSubtitle:
      "Prominence helps enterprises, government and strategic industries build secure, sovereign, scalable, operator-grade infrastructure — from core data centers to the edge of the network.",
    heroCtaPrimary: "Request a consultation",
    heroCtaSecondary: "Explore the platform",
    trustedBy: "Built for the institutions that run Indonesia",
    valueTitle: "A single platform. Six guarantees.",
    valueSubtitle:
      "Sovereignty isn't a feature — it's the foundation. Each pillar is engineered to meet the demands of regulated industries and national-scale operators.",
    platformPreviewTitle: "One platform. Core, edge, network, AI.",
    platformPreviewSubtitle:
      "A unified control plane across compute, storage, networking, edge and AI — designed for hybrid, multi-site and sovereign deployments.",
    archTitle: "Three data centers. One sovereign cloud.",
    archSubtitle:
      "Primary, secondary and disaster-recovery sites interconnected by an open, programmable fabric that extends from your core to every branch, factory, campus and BTS.",
    industriesTitle: "Engineered for Indonesia's strategic industries",
    industriesSubtitle:
      "From sovereign government workloads to telco edge and smart city analytics, Prominence is purpose-built for the operators of national-scale services.",
    productsTitle: "Start in weeks. Operate for years.",
    productsSubtitle:
      "Choose your entry point — from a four-week assessment to a fully managed sovereign cloud node.",
    partnersTitle: "An ecosystem you can build on",
    partnersSubtitle:
      "We integrate with the data center, network, security, AI and hyperscaler partners that matter to Indonesia.",
    finalCtaTitle: "Let's build your sovereign cloud roadmap.",
    finalCtaSubtitle:
      "Talk to Prominence about cloud, edge, AI, network and infrastructure modernization.",
  },
  id: {
    eyebrow: "Sovereign Edge Cloud · Siap-AI · Indonesia",
    heroTitle: "Cloud berdaulat Indonesia, dirancang untuk era AI.",
    heroSubtitle:
      "Prominence membantu enterprise, pemerintah, dan industri strategis membangun infrastruktur yang aman, berdaulat, skalabel, dan operator-grade — dari pusat data inti hingga ke ujung jaringan.",
    heroCtaPrimary: "Minta konsultasi",
    heroCtaSecondary: "Jelajahi platform",
    trustedBy: "Dibangun untuk institusi yang menjalankan Indonesia",
    valueTitle: "Satu platform. Enam jaminan.",
    valueSubtitle:
      "Kedaulatan bukan sekadar fitur — ini fondasi. Setiap pilar dirancang untuk industri tregulasi dan operator skala nasional.",
    platformPreviewTitle: "Satu platform. Inti, edge, jaringan, AI.",
    platformPreviewSubtitle:
      "Satu control plane terpadu untuk komputasi, storage, networking, edge, dan AI — untuk deployment hybrid, multi-site, dan berdaulat.",
    archTitle: "Tiga pusat data. Satu cloud berdaulat.",
    archSubtitle:
      "Site primer, sekunder, dan disaster recovery yang terhubung melalui fabric terbuka dan programmable, dari core hingga setiap cabang, pabrik, kampus dan BTS.",
    industriesTitle: "Dirancang untuk industri strategis Indonesia",
    industriesSubtitle:
      "Dari workload pemerintah berdaulat hingga edge telco dan analitik smart city, Prominence dibangun khusus untuk operator layanan skala nasional.",
    productsTitle: "Mulai dalam hitungan minggu. Operasikan selama bertahun-tahun.",
    productsSubtitle:
      "Pilih titik mulai Anda — dari asesmen empat minggu hingga sovereign cloud node yang terkelola penuh.",
    partnersTitle: "Ekosistem yang bisa Anda andalkan",
    partnersSubtitle:
      "Kami terintegrasi dengan mitra data center, jaringan, keamanan, AI, dan hyperscaler yang penting untuk Indonesia.",
    finalCtaTitle: "Mari susun roadmap sovereign cloud Anda.",
    finalCtaSubtitle:
      "Bicarakan dengan Prominence soal cloud, edge, AI, jaringan, dan modernisasi infrastruktur.",
  },
};

export const VALUE_CARDS = [
  {
    key: "sovereign",
    icon: "ShieldCheck",
    en: { title: "Sovereign Control", body: "Data residency, local governance and policy enforcement that satisfy Indonesia's regulatory mandates." },
    id: { title: "Kendali Berdaulat", body: "Residensi data, tata kelola lokal, dan penegakan kebijakan sesuai mandat regulasi Indonesia." },
  },
  {
    key: "open",
    icon: "GitBranch",
    en: { title: "Open & Flexible", body: "Built on open standards — KVM, Kubernetes, EVPN-VXLAN, SONiC — no vendor lock-in." },
    id: { title: "Terbuka & Fleksibel", body: "Dibangun di atas standar terbuka — KVM, Kubernetes, EVPN-VXLAN, SONiC — tanpa vendor lock-in." },
  },
  {
    key: "secure",
    icon: "Lock",
    en: { title: "Secure by Design", body: "Zero Trust, IAM, encryption and continuous audit baked into every layer of the stack." },
    id: { title: "Aman Sejak Dirancang", body: "Zero Trust, IAM, enkripsi, dan audit kontinu tertanam di setiap lapisan stack." },
  },
  {
    key: "scalable",
    icon: "Layers",
    en: { title: "Scalable & Elastic", body: "Elastic compute, storage and networking that scale across multiple data centers and edge sites." },
    id: { title: "Skalabel & Elastis", body: "Komputasi, storage, dan jaringan elastis yang scale di banyak pusat data dan situs edge." },
  },
  {
    key: "ai",
    icon: "Cpu",
    en: { title: "AI-Native Platform", body: "GPU-ready infrastructure with model studio, vector database and a full ML/LLM pipeline." },
    id: { title: "Platform AI-Native", body: "Infrastruktur siap-GPU dengan model studio, vector database, dan pipeline ML/LLM penuh." },
  },
  {
    key: "operator",
    icon: "Activity",
    en: { title: "Operator Grade", body: "24/7 monitored, SLA-backed operations with observability and capacity intelligence." },
    id: { title: "Operator Grade", body: "Operasi termonitor 24/7 dengan SLA, observability, dan capacity intelligence." },
  },
];

export const PLATFORM_PILLARS = [
  {
    slug: "sovereign-cloud",
    icon: "Cloud",
    en: {
      title: "Sovereign Cloud Platform",
      tagline: "Multi-data-center, multi-tenant cloud built for Indonesia.",
      summary:
        "A complete IaaS, PaaS and storage platform across three sovereign data centers — engineered for compliance, resilience and elastic scale.",
      capabilities: [
        "Compute services — VMs, bare metal, GPU and Kubernetes",
        "Storage services — block, object, file and backup",
        "Cloud networking — EVPN-VXLAN, BGP, distributed routing",
        "Platform services — databases, queues, container registry",
        "Multi-data-center architecture with active/active and DR",
        "SLA-backed managed operations",
      ],
    },
    id: {
      title: "Sovereign Cloud Platform",
      tagline: "Cloud multi-data-center, multi-tenant untuk Indonesia.",
      summary:
        "Platform IaaS, PaaS, dan storage lengkap di tiga pusat data berdaulat — dirancang untuk kepatuhan, ketahanan, dan skala elastis.",
      capabilities: [
        "Layanan komputasi — VM, bare metal, GPU, dan Kubernetes",
        "Layanan storage — block, object, file, dan backup",
        "Cloud networking — EVPN-VXLAN, BGP, distributed routing",
        "Layanan platform — database, queue, container registry",
        "Arsitektur multi-pusat data dengan active/active dan DR",
        "Operasi terkelola dengan SLA",
      ],
    },
  },
  {
    slug: "network-as-a-service",
    icon: "Network",
    en: {
      title: "Network as a Service",
      tagline: "Programmable, secure, software-defined networking — delivered as a service.",
      summary:
        "Build virtual networks, load balancers, firewalls and SD-WAN on demand, with private connectivity that spans your branches, factories and data centers.",
      capabilities: [
        "Virtual network and VPC overlays",
        "Load Balancer as a Service",
        "Firewall as a Service",
        "SD-WAN as a Service",
        "Private connectivity and interconnect",
        "DNS, DHCP & IPAM",
        "DDoS protection",
        "End-to-end network monitoring",
      ],
    },
    id: {
      title: "Network as a Service",
      tagline: "Jaringan terprogram, aman, dan software-defined — dikirim sebagai layanan.",
      summary:
        "Bangun virtual network, load balancer, firewall, dan SD-WAN sesuai kebutuhan, dengan konektivitas privat yang menjangkau cabang, pabrik, dan pusat data Anda.",
      capabilities: [
        "Virtual network dan overlay VPC",
        "Load Balancer as a Service",
        "Firewall as a Service",
        "SD-WAN as a Service",
        "Konektivitas privat dan interconnect",
        "DNS, DHCP & IPAM",
        "Proteksi DDoS",
        "Monitoring jaringan ujung-ke-ujung",
      ],
    },
  },
  {
    slug: "edge-cloud",
    icon: "Radio",
    en: {
      title: "Edge Cloud",
      tagline: "Bring cloud to your branches, factories, BTS and smart cities.",
      summary:
        "Operate full cloud capabilities at the edge — for ultra-low latency, data locality and resilient operations far beyond the core data center.",
      capabilities: [
        "Edge PoP / BTS / 5G site stack",
        "Enterprise & campus edge",
        "Industrial & IoT edge",
        "Smart city & CCTV edge",
        "Branch office & retail edge",
        "Remote office & remote campus",
        "Unified edge stack components",
      ],
    },
    id: {
      title: "Edge Cloud",
      tagline: "Bawa cloud ke cabang, pabrik, BTS, dan smart city Anda.",
      summary:
        "Jalankan kapabilitas cloud penuh di edge — untuk latensi sangat rendah, lokalitas data, dan operasi yang tangguh jauh di luar pusat data inti.",
      capabilities: [
        "Stack Edge PoP / BTS / 5G site",
        "Edge enterprise & kampus",
        "Edge industri & IoT",
        "Edge smart city & CCTV",
        "Edge cabang & ritel",
        "Edge kantor & kampus remote",
        "Komponen edge stack terpadu",
      ],
    },
  },
  {
    slug: "ai-data",
    icon: "Brain",
    en: {
      title: "AI & Data Platform",
      tagline: "Train, serve and govern AI — from data lake to production model.",
      summary:
        "An AI-native platform with GPU clusters, model studio, vector database, dataworks pipelines and a feature store — built for enterprise and government AI.",
      capabilities: [
        "AI training platform with GPU clusters",
        "LLM & generative AI model studio",
        "DataWorks / data pipeline",
        "Analytics & data warehouse",
        "Model registry",
        "Feature store",
        "Vector database",
        "Dataset & data lake",
      ],
    },
    id: {
      title: "Platform AI & Data",
      tagline: "Latih, sajikan, dan tata kelola AI — dari data lake hingga model produksi.",
      summary:
        "Platform AI-native dengan klaster GPU, model studio, vector database, pipeline DataWorks, dan feature store — untuk AI enterprise dan pemerintah.",
      capabilities: [
        "Platform pelatihan AI dengan klaster GPU",
        "Model studio LLM & Generative AI",
        "DataWorks / pipeline data",
        "Analytics & data warehouse",
        "Model registry",
        "Feature store",
        "Vector database",
        "Dataset & data lake",
      ],
    },
  },
  {
    slug: "security",
    icon: "ShieldCheck",
    en: {
      title: "Security & Governance",
      tagline: "Zero Trust, compliance and continuous protection across the stack.",
      summary:
        "A unified security and governance layer with identity, policy, encryption, audit and DR orchestration — built for regulated industries.",
      capabilities: [
        "Zero Trust architecture",
        "IAM, SSO, RBAC & MFA",
        "Policy engine",
        "Secrets management",
        "Compliance & audit",
        "WAF & DDoS protection",
        "Encryption & data protection",
        "Backup & disaster recovery orchestration",
      ],
    },
    id: {
      title: "Keamanan & Tata Kelola",
      tagline: "Zero Trust, kepatuhan, dan proteksi kontinu di seluruh stack.",
      summary:
        "Lapisan keamanan dan tata kelola terpadu dengan identitas, kebijakan, enkripsi, audit, dan orkestrasi DR — untuk industri tregulasi.",
      capabilities: [
        "Arsitektur Zero Trust",
        "IAM, SSO, RBAC & MFA",
        "Policy engine",
        "Manajemen secrets",
        "Compliance & audit",
        "WAF & proteksi DDoS",
        "Enkripsi & proteksi data",
        "Orkestrasi backup & disaster recovery",
      ],
    },
  },
  {
    slug: "operations",
    icon: "Settings",
    en: {
      title: "Operations & Automation",
      tagline: "Observable, automated, operator-grade.",
      summary:
        "Run infrastructure like a hyperscaler with full observability, automation, ITSM integration and SLA/SLO management.",
      capabilities: [
        "Observability — logs, metrics, traces",
        "Network operations",
        "Infrastructure automation (IaC, GitOps)",
        "ITSM integration",
        "SLA & SLO management",
        "Capacity & cost optimization",
      ],
    },
    id: {
      title: "Operasi & Otomasi",
      tagline: "Terobservasi, terotomasi, operator-grade.",
      summary:
        "Jalankan infrastruktur seperti hyperscaler dengan observability penuh, otomasi, integrasi ITSM, dan manajemen SLA/SLO.",
      capabilities: [
        "Observability — log, metrik, trace",
        "Operasi jaringan",
        "Otomasi infrastruktur (IaC, GitOps)",
        "Integrasi ITSM",
        "Manajemen SLA & SLO",
        "Optimasi kapasitas & biaya",
      ],
    },
  },
];

export const INDUSTRIES = [
  {
    slug: "government",
    icon: "Landmark",
    en: {
      title: "Government & Public Sector",
      tagline: "Sovereign cloud for national-scale services.",
      summary:
        "Deliver citizen services on a sovereign, resilient platform with full data residency, compliance and disaster recovery.",
      pains: [
        "Strict data residency and sovereignty requirements",
        "Need for transparent governance and audit",
        "Continuity of national-scale services",
        "Modernization of legacy public-sector workloads",
      ],
      solutions: [
        "Prominence Sovereign Cloud Node deployment",
        "Government identity, policy and compliance",
        "Multi-data-center disaster recovery",
        "Secure citizen-data analytics and AI",
      ],
    },
    id: {
      title: "Pemerintah & Sektor Publik",
      tagline: "Sovereign cloud untuk layanan skala nasional.",
      summary:
        "Berikan layanan publik di atas platform berdaulat dan tangguh dengan residensi data, kepatuhan, dan disaster recovery penuh.",
      pains: [
        "Persyaratan residensi dan kedaulatan data ketat",
        "Kebutuhan tata kelola dan audit transparan",
        "Kontinuitas layanan skala nasional",
        "Modernisasi workload sektor publik legacy",
      ],
      solutions: [
        "Deployment Prominence Sovereign Cloud Node",
        "Identitas, kebijakan, dan kepatuhan pemerintah",
        "Disaster recovery multi-data-center",
        "Analitik dan AI data warga yang aman",
      ],
    },
  },
  {
    slug: "telco",
    icon: "Antenna",
    en: {
      title: "Telco & Digital Infrastructure",
      tagline: "Cloud-native infrastructure for telco and 5G edge.",
      summary:
        "Power telco workloads, 5G core and edge sites with a programmable cloud and SD-WAN-grade NaaS.",
      pains: [
        "5G core and edge complexity",
        "Multi-tenant operator-grade SLAs",
        "Network function virtualization",
        "Cost pressure across BTS and POPs",
      ],
      solutions: [
        "Edge PoP, BTS and 5G-site stack",
        "Virtual network and SDN fabric",
        "Operator-grade observability and SLA tooling",
        "Hyperscaler interconnect",
      ],
    },
    id: {
      title: "Telco & Infrastruktur Digital",
      tagline: "Infrastruktur cloud-native untuk telco dan 5G edge.",
      summary:
        "Jalankan workload telco, 5G core, dan situs edge dengan cloud terprogram dan NaaS kelas SD-WAN.",
      pains: [
        "Kompleksitas 5G core dan edge",
        "SLA operator-grade multi-tenant",
        "Virtualisasi fungsi jaringan",
        "Tekanan biaya di BTS dan POP",
      ],
      solutions: [
        "Stack Edge PoP, BTS, dan situs 5G",
        "Virtual network dan SDN fabric",
        "Observability dan tooling SLA operator-grade",
        "Interconnect hyperscaler",
      ],
    },
  },
  {
    slug: "financial-services",
    icon: "Banknote",
    en: {
      title: "Financial Services",
      tagline: "Resilient, regulated cloud for banks and fintech.",
      summary:
        "Run core banking, payments and analytics on a sovereign, audit-ready cloud with the resilience finance regulators expect.",
      pains: [
        "OJK and BI regulatory expectations",
        "Real-time core banking resilience",
        "Fraud and AI risk modeling",
        "Data residency and encryption",
      ],
      solutions: [
        "Sovereign cloud with active/active DR",
        "AI/ML risk and fraud analytics",
        "Encrypted data lake and warehouse",
        "Zero Trust access and audit",
      ],
    },
    id: {
      title: "Jasa Keuangan",
      tagline: "Cloud tangguh dan tregulasi untuk bank dan fintech.",
      summary:
        "Jalankan core banking, pembayaran, dan analitik di cloud berdaulat siap-audit dengan ketahanan yang diharapkan regulator keuangan.",
      pains: [
        "Ekspektasi regulasi OJK dan BI",
        "Ketahanan core banking real-time",
        "Pemodelan risiko dan fraud berbasis AI",
        "Residensi dan enkripsi data",
      ],
      solutions: [
        "Sovereign cloud dengan DR active/active",
        "Analitik risiko dan fraud AI/ML",
        "Data lake dan warehouse terenkripsi",
        "Akses Zero Trust dan audit",
      ],
    },
  },
  {
    slug: "energy",
    icon: "Factory",
    en: {
      title: "Energy, Mining & Industrial",
      tagline: "Edge AI from refinery to mine site.",
      summary:
        "Run industrial workloads at the edge, with secure IoT, OT analytics and centralized operations across remote sites.",
      pains: [
        "Remote, low-connectivity industrial sites",
        "OT/IT convergence and safety",
        "Real-time anomaly and asset analytics",
        "Centralized operations across plants",
      ],
      solutions: [
        "Industrial & IoT edge stack",
        "Edge AI inference and analytics",
        "Resilient SD-WAN to remote sites",
        "Central data lake and observability",
      ],
    },
    id: {
      title: "Energi, Pertambangan & Industri",
      tagline: "Edge AI dari kilang hingga lokasi tambang.",
      summary:
        "Jalankan workload industri di edge, dengan IoT yang aman, analitik OT, dan operasi terpusat di seluruh situs remote.",
      pains: [
        "Situs industri remote dengan konektivitas rendah",
        "Konvergensi OT/IT dan keselamatan",
        "Analitik anomali dan aset real-time",
        "Operasi terpusat lintas pabrik",
      ],
      solutions: [
        "Stack edge industri & IoT",
        "Inference dan analitik AI di edge",
        "SD-WAN tangguh ke situs remote",
        "Data lake dan observability terpusat",
      ],
    },
  },
  {
    slug: "logistics",
    icon: "Ship",
    en: {
      title: "Logistics, Ports & Transportation",
      tagline: "Edge-to-core operations for ports, fleets and terminals.",
      summary:
        "Run port operations, fleet telemetry and supply-chain analytics on a unified platform that reaches every terminal and vehicle.",
      pains: [
        "Distributed terminals, ports and yards",
        "Real-time fleet and asset telemetry",
        "Customs and supply-chain integration",
        "Resilience and security on the move",
      ],
      solutions: [
        "Port and terminal edge stack",
        "Fleet telemetry & analytics",
        "Secure connectivity (SD-WAN, NaaS)",
        "Central supply-chain data lake",
      ],
    },
    id: {
      title: "Logistik, Pelabuhan & Transportasi",
      tagline: "Operasi edge-to-core untuk pelabuhan, armada, dan terminal.",
      summary:
        "Jalankan operasi pelabuhan, telemetri armada, dan analitik rantai pasok di satu platform yang menjangkau setiap terminal dan kendaraan.",
      pains: [
        "Terminal, pelabuhan, dan yard terdistribusi",
        "Telemetri armada dan aset real-time",
        "Integrasi bea cukai dan rantai pasok",
        "Ketahanan dan keamanan saat bergerak",
      ],
      solutions: [
        "Stack edge pelabuhan dan terminal",
        "Telemetri & analitik armada",
        "Konektivitas aman (SD-WAN, NaaS)",
        "Data lake rantai pasok terpusat",
      ],
    },
  },
  {
    slug: "smart-city",
    icon: "Building2",
    en: {
      title: "Smart City",
      tagline: "Sovereign edge cloud for the cities that run Indonesia.",
      summary:
        "Operate citywide CCTV, sensors and citizen services on a sovereign cloud and edge platform built for public-sector scale.",
      pains: [
        "Citywide CCTV and sensor scale",
        "Data sovereignty and privacy",
        "Real-time analytics at the edge",
        "Cross-agency integration",
      ],
      solutions: [
        "Smart city CCTV analytics edge",
        "Citizen-data lake and AI",
        "Secure inter-agency connectivity",
        "Centralized observability and command",
      ],
    },
    id: {
      title: "Smart City",
      tagline: "Sovereign edge cloud untuk kota-kota yang menjalankan Indonesia.",
      summary:
        "Operasikan CCTV, sensor, dan layanan warga seluruh kota di platform sovereign cloud & edge berskala publik.",
      pains: [
        "Skala CCTV dan sensor seluruh kota",
        "Kedaulatan data dan privasi",
        "Analitik real-time di edge",
        "Integrasi lintas dinas",
      ],
      solutions: [
        "Edge analitik CCTV smart city",
        "Data lake & AI data warga",
        "Konektivitas lintas dinas yang aman",
        "Observability dan command terpusat",
      ],
    },
  },
];

export const USE_CASES = [
  { en: "Sovereign Cloud Node", id: "Sovereign Cloud Node" },
  { en: "Edge AI for Operations", id: "Edge AI untuk Operasional" },
  { en: "Disaster Recovery as a Service", id: "Disaster Recovery as a Service" },
  { en: "Secure Branch Connectivity", id: "Konektivitas Cabang Aman" },
  { en: "Smart City CCTV Analytics", id: "Analitik CCTV Smart City" },
  { en: "Enterprise AI Platform", id: "Platform AI Enterprise" },
  { en: "Data Lake & Analytics", id: "Data Lake & Analitik" },
  { en: "Hybrid Cloud Interconnect", id: "Interconnect Hybrid Cloud" },
  { en: "Cloud Cost Optimization", id: "Optimasi Biaya Cloud" },
  { en: "Network Automation", id: "Otomasi Jaringan" },
];

export const PRODUCTS = [
  {
    slug: "edge-assessment",
    code: "P-01",
    duration: { en: "2–4 weeks", id: "2–4 minggu" },
    en: {
      name: "Prominence Edge Assessment",
      tagline: "Map your edge, cloud and network modernization roadmap.",
      bestFor: "Enterprises evaluating edge, cloud and network modernization.",
      deliverables: [
        "Infrastructure & workload assessment",
        "Use case mapping",
        "Architecture recommendation",
        "Risk & cost analysis",
        "Pilot proposal",
      ],
    },
    id: {
      name: "Prominence Edge Assessment",
      tagline: "Petakan roadmap modernisasi edge, cloud, dan jaringan Anda.",
      bestFor: "Enterprise yang mengevaluasi modernisasi edge, cloud, dan jaringan.",
      deliverables: [
        "Asesmen infrastruktur & workload",
        "Pemetaan use case",
        "Rekomendasi arsitektur",
        "Analisis risiko & biaya",
        "Proposal pilot",
      ],
    },
  },
  {
    slug: "edge-pilot",
    code: "P-02",
    duration: { en: "90 days", id: "90 hari" },
    en: {
      name: "Prominence Edge Pilot",
      tagline: "A 90-day, low-risk proof of value.",
      bestFor: "Organizations who need a contained pilot before committing.",
      deliverables: [
        "Limited edge/cloud deployment",
        "Selected workload migration",
        "Security baseline",
        "Performance measurement",
        "KPI report",
      ],
    },
    id: {
      name: "Prominence Edge Pilot",
      tagline: "Bukti nilai 90 hari berisiko rendah.",
      bestFor: "Organisasi yang butuh pilot terbatas sebelum komitmen penuh.",
      deliverables: [
        "Deployment edge/cloud terbatas",
        "Migrasi workload terpilih",
        "Baseline keamanan",
        "Pengukuran performa",
        "Laporan KPI",
      ],
    },
  },
  {
    slug: "managed-edge-platform",
    code: "P-03",
    duration: { en: "12 months", id: "12 bulan" },
    featured: true,
    en: {
      name: "Prominence Managed Edge Platform",
      tagline: "Production-grade managed cloud, edge and NaaS.",
      bestFor: "Operators ready to run cloud, edge and NaaS in production.",
      deliverables: [
        "Managed infrastructure",
        "24/7 monitoring",
        "SLA/SLO reporting",
        "Backup and DR",
        "Capacity and cost optimization",
        "Monthly executive report",
      ],
    },
    id: {
      name: "Prominence Managed Edge Platform",
      tagline: "Cloud, edge, dan NaaS terkelola kelas produksi.",
      bestFor: "Operator yang siap menjalankan cloud, edge, dan NaaS di produksi.",
      deliverables: [
        "Infrastruktur terkelola",
        "Monitoring 24/7",
        "Pelaporan SLA/SLO",
        "Backup dan DR",
        "Optimasi kapasitas dan biaya",
        "Laporan eksekutif bulanan",
      ],
    },
  },
  {
    slug: "sovereign-cloud-node",
    code: "P-04",
    duration: { en: "Long-term", id: "Jangka panjang" },
    en: {
      name: "Prominence Sovereign Cloud Node",
      tagline: "Your dedicated sovereign cloud, fully managed.",
      bestFor: "Government, BUMN, regulated industries and strategic enterprises.",
      deliverables: [
        "Dedicated sovereign cloud node",
        "Local data residency",
        "Private connectivity",
        "Security and governance",
        "DR-ready architecture",
        "Managed operations",
      ],
    },
    id: {
      name: "Prominence Sovereign Cloud Node",
      tagline: "Sovereign cloud dedikasi Anda, terkelola penuh.",
      bestFor: "Pemerintah, BUMN, industri tregulasi, dan enterprise strategis.",
      deliverables: [
        "Sovereign cloud node dedikasi",
        "Residensi data lokal",
        "Konektivitas privat",
        "Keamanan dan tata kelola",
        "Arsitektur siap-DR",
        "Operasi terkelola",
      ],
    },
  },
];

export const SERVICES = [
  {
    slug: "assessment",
    icon: "Search",
    en: {
      title: "Cloud & Edge Assessment",
      points: [
        "Infrastructure assessment",
        "Cloud readiness review",
        "Network & security gap analysis",
        "Cost & capacity assessment",
      ],
    },
    id: {
      title: "Asesmen Cloud & Edge",
      points: [
        "Asesmen infrastruktur",
        "Tinjauan kesiapan cloud",
        "Analisis kesenjangan jaringan & keamanan",
        "Asesmen biaya & kapasitas",
      ],
    },
  },
  {
    slug: "architecture",
    icon: "PenTool",
    en: {
      title: "Architecture & Design",
      points: [
        "Sovereign cloud design",
        "Edge architecture",
        "NaaS design",
        "DR architecture",
        "AI infrastructure design",
      ],
    },
    id: {
      title: "Arsitektur & Desain",
      points: [
        "Desain sovereign cloud",
        "Arsitektur edge",
        "Desain NaaS",
        "Arsitektur DR",
        "Desain infrastruktur AI",
      ],
    },
  },
  {
    slug: "implementation",
    icon: "Hammer",
    en: {
      title: "Implementation",
      points: [
        "Cloud deployment",
        "Network fabric deployment",
        "Kubernetes & platform setup",
        "Security & governance setup",
        "Migration support",
      ],
    },
    id: {
      title: "Implementasi",
      points: [
        "Deployment cloud",
        "Deployment network fabric",
        "Setup Kubernetes & platform",
        "Setup keamanan & tata kelola",
        "Dukungan migrasi",
      ],
    },
  },
  {
    slug: "managed",
    icon: "Headphones",
    en: {
      title: "Managed Services",
      points: [
        "24/7 monitoring",
        "SLA management",
        "Incident response",
        "Patch & lifecycle management",
        "Backup & DR management",
        "Capacity optimization",
      ],
    },
    id: {
      title: "Managed Services",
      points: [
        "Monitoring 24/7",
        "Manajemen SLA",
        "Respons insiden",
        "Manajemen patch & lifecycle",
        "Manajemen backup & DR",
        "Optimasi kapasitas",
      ],
    },
  },
  {
    slug: "automation",
    icon: "Workflow",
    en: {
      title: "Automation Services",
      points: [
        "Infrastructure as Code",
        "GitOps pipeline",
        "Network automation",
        "ITSM integration",
        "Observability setup",
      ],
    },
    id: {
      title: "Layanan Otomasi",
      points: [
        "Infrastructure as Code",
        "Pipeline GitOps",
        "Otomasi jaringan",
        "Integrasi ITSM",
        "Setup observability",
      ],
    },
  },
];

export const PARTNER_CATEGORIES = [
  { key: "data-center", en: "Data Center Partners", id: "Mitra Pusat Data" },
  { key: "network", en: "Network Technology Partners", id: "Mitra Teknologi Jaringan" },
  { key: "security", en: "Cybersecurity Partners", id: "Mitra Keamanan Siber" },
  { key: "ai", en: "AI & GPU Partners", id: "Mitra AI & GPU" },
  { key: "cloud", en: "Cloud & Hyperscaler Partners", id: "Mitra Cloud & Hyperscaler" },
  { key: "si", en: "System Integrator Partners", id: "Mitra System Integrator" },
  { key: "gov", en: "Government & Strategic Ecosystem", id: "Ekosistem Pemerintah & Strategis" },
];

export const COMPANY = {
  en: {
    mission:
      "To enable Indonesia's enterprises, public sector and strategic industries with secure, sovereign, AI-ready, and scalable digital infrastructure.",
    vision:
      "To become Indonesia's trusted sovereign edge cloud and AI infrastructure platform provider.",
    why: [
      "Sovereign — engineered for Indonesian data residency and governance",
      "Open — built on open standards, no vendor lock-in",
      "Secure — Zero Trust and continuous audit by design",
      "AI-ready — GPU, model studio and vector database at the core",
      "Cost-optimized — elastic scale with operator-grade observability",
      "Operator-grade — 24/7 monitoring, SLA-backed, multi-DC resilient",
    ],
    leadershipNote:
      "A team of cloud architects, network engineers and AI specialists with deep telco, government and enterprise experience across Indonesia.",
  },
  id: {
    mission:
      "Memberdayakan enterprise, sektor publik, dan industri strategis Indonesia dengan infrastruktur digital yang aman, berdaulat, siap-AI, dan skalabel.",
    vision:
      "Menjadi penyedia platform sovereign edge cloud dan infrastruktur AI tepercaya untuk Indonesia.",
    why: [
      "Berdaulat — dirancang untuk residensi data dan tata kelola Indonesia",
      "Terbuka — dibangun di atas standar terbuka, tanpa vendor lock-in",
      "Aman — Zero Trust dan audit kontinu sejak dirancang",
      "Siap-AI — GPU, model studio, dan vector database di inti",
      "Hemat biaya — skala elastis dengan observability operator-grade",
      "Operator-grade — monitoring 24/7, didukung SLA, tangguh multi-DC",
    ],
    leadershipNote:
      "Tim arsitek cloud, network engineer, dan spesialis AI dengan pengalaman mendalam di telco, pemerintah, dan enterprise Indonesia.",
  },
};

export const RESOURCES_FAQ = [
  {
    en: {
      q: "What does 'sovereign cloud' mean for Indonesia?",
      a: "A sovereign cloud keeps your data, control plane and operations within Indonesian jurisdiction, with full residency, governance and audit aligned to local regulation.",
    },
    id: {
      q: "Apa arti 'sovereign cloud' untuk Indonesia?",
      a: "Sovereign cloud menjaga data, control plane, dan operasi Anda tetap dalam yurisdiksi Indonesia, dengan residensi, tata kelola, dan audit penuh sesuai regulasi lokal.",
    },
  },
  {
    en: {
      q: "How is Network as a Service (NaaS) different from traditional networking?",
      a: "NaaS delivers virtual network, load balancing, firewall, SD-WAN and private connectivity on demand as cloud services — fully software-defined and consumed via API.",
    },
    id: {
      q: "Apa beda Network as a Service (NaaS) dengan jaringan tradisional?",
      a: "NaaS mengirimkan virtual network, load balancing, firewall, SD-WAN, dan konektivitas privat secara on-demand sebagai layanan cloud — software-defined penuh dan dikonsumsi via API.",
    },
  },
  {
    en: {
      q: "How does Prominence support AI workloads?",
      a: "We provide GPU-ready compute, an LLM and generative AI model studio, vector database, feature store and a full dataworks pipeline — all on the sovereign platform.",
    },
    id: {
      q: "Bagaimana Prominence mendukung workload AI?",
      a: "Kami menyediakan komputasi siap-GPU, model studio LLM dan Generative AI, vector database, feature store, dan pipeline DataWorks penuh — semuanya di platform berdaulat.",
    },
  },
  {
    en: {
      q: "Can Prominence integrate with hyperscalers?",
      a: "Yes. Our partner ecosystem includes hyperscaler interconnects so you can run hybrid workloads while keeping sovereign data on the Prominence platform.",
    },
    id: {
      q: "Apakah Prominence bisa terintegrasi dengan hyperscaler?",
      a: "Ya. Ekosistem mitra kami mencakup interconnect hyperscaler agar Anda dapat menjalankan workload hybrid sambil menjaga data berdaulat di platform Prominence.",
    },
  },
  {
    en: {
      q: "What's the fastest way to start?",
      a: "Begin with a Prominence Edge Assessment (2–4 weeks) — we map your environment, define a sovereign cloud roadmap and propose a 90-day pilot.",
    },
    id: {
      q: "Bagaimana cara tercepat untuk memulai?",
      a: "Mulai dengan Prominence Edge Assessment (2–4 minggu) — kami memetakan environment Anda, menyusun roadmap sovereign cloud, dan mengusulkan pilot 90 hari.",
    },
  },
];

export const FOOTER = {
  en: {
    tagline: "Sovereign Edge Cloud & AI-Ready Infrastructure for Indonesia.",
    address: "Jakarta · Indonesia",
    columns: {
      Platform: [
        { label: "Sovereign Cloud", href: "/platform/sovereign-cloud" },
        { label: "Network as a Service", href: "/platform/network-as-a-service" },
        { label: "Edge Cloud", href: "/platform/edge-cloud" },
        { label: "AI & Data", href: "/platform/ai-data" },
        { label: "Security & Governance", href: "/platform/security" },
        { label: "Operations", href: "/platform/operations" },
      ],
      Solutions: [
        { label: "Government", href: "/solutions/government" },
        { label: "Telco", href: "/solutions/telco" },
        { label: "Financial Services", href: "/solutions/financial-services" },
        { label: "Energy & Industrial", href: "/solutions/energy" },
        { label: "Logistics", href: "/solutions/logistics" },
        { label: "Smart City", href: "/solutions/smart-city" },
      ],
      Company: [
        { label: "About", href: "/company" },
        { label: "Architecture", href: "/architecture" },
        { label: "Services", href: "/services" },
        { label: "Products", href: "/products" },
        { label: "Partners", href: "/partners" },
        { label: "Contact", href: "/contact" },
      ],
    },
    rights: "© 2026 Prominence. All rights reserved.",
    subscribe: "Get sovereign cloud briefings",
    subscribePlaceholder: "Work email",
    subscribeCta: "Subscribe",
  },
  id: {
    tagline: "Sovereign Edge Cloud & Infrastruktur Siap-AI untuk Indonesia.",
    address: "Jakarta · Indonesia",
    columns: {
      Platform: [
        { label: "Sovereign Cloud", href: "/platform/sovereign-cloud" },
        { label: "Network as a Service", href: "/platform/network-as-a-service" },
        { label: "Edge Cloud", href: "/platform/edge-cloud" },
        { label: "AI & Data", href: "/platform/ai-data" },
        { label: "Keamanan & Tata Kelola", href: "/platform/security" },
        { label: "Operasi", href: "/platform/operations" },
      ],
      Solusi: [
        { label: "Pemerintah", href: "/solutions/government" },
        { label: "Telco", href: "/solutions/telco" },
        { label: "Jasa Keuangan", href: "/solutions/financial-services" },
        { label: "Energi & Industri", href: "/solutions/energy" },
        { label: "Logistik", href: "/solutions/logistics" },
        { label: "Smart City", href: "/solutions/smart-city" },
      ],
      Perusahaan: [
        { label: "Tentang", href: "/company" },
        { label: "Arsitektur", href: "/architecture" },
        { label: "Layanan", href: "/services" },
        { label: "Produk", href: "/products" },
        { label: "Mitra", href: "/partners" },
        { label: "Kontak", href: "/contact" },
      ],
    },
    rights: "© 2026 Prominence. Hak cipta dilindungi.",
    subscribe: "Dapatkan briefing sovereign cloud",
    subscribePlaceholder: "Email kerja",
    subscribeCta: "Berlangganan",
  },
};

export const IMAGES = {
  hero: "https://images.pexels.com/photos/14314638/pexels-photo-14314638.jpeg",
  dataCenter: "https://images.pexels.com/photos/5203849/pexels-photo-5203849.jpeg",
  fabric: "https://images.pexels.com/photos/5480781/pexels-photo-5480781.jpeg",
  team: "https://images.pexels.com/photos/8463151/pexels-photo-8463151.jpeg",
  workshop: "https://images.pexels.com/photos/7644016/pexels-photo-7644016.jpeg",
  jakarta: "https://images.pexels.com/photos/32327756/pexels-photo-32327756.jpeg",
  grid: "https://images.pexels.com/photos/7527707/pexels-photo-7527707.jpeg",
};
