import { LessonContent } from '../../components/training/TrainingLesson';
import { QuizQuestion } from '../../components/training/TrainingQuiz';

export const dependencyManagementLessons: LessonContent[] = [
  {
    title: "Healthcare Technology Dependency Mapping",
    content: `
## Understanding Technology Dependencies in Healthcare

A **technology dependency** exists when one system, application, or process relies on another to function correctly. In healthcare, these dependencies are complex, often undocumented, and carry life-safety implications when they fail.

### Why Dependency Mapping Matters

Healthcare organizations operate overlapping networks of clinical, administrative, and infrastructure systems. A single unmapped dependency can cascade into:
- EHR unavailability affecting patient care decisions
- Laboratory results unable to reach clinical staff
- Medication dispensing systems going offline
- Imaging workflows halted mid-procedure

Regulatory bodies including The Joint Commission, CMS, and HHS increasingly require documented evidence of technology risk management, including dependency awareness.

### Types of Dependencies

#### Hard Dependencies (Blocking)
The upstream system must be running for the downstream system to function at all.

**Examples:**
- Active Directory → EHR login (if AD is down, no one logs in)
- Network switch → PACS server (imaging goes dark)
- Database server → Clinical Decision Support alerts

#### Soft Dependencies (Degraded Mode)
The downstream system can operate in a reduced capacity if the upstream fails.

**Examples:**
- Internet connection → Telehealth platform (falls back to phone)
- Lab interface → EHR (results can be entered manually)
- Email system → Nurse call system (falls back to pagers)

#### Circular Dependencies (Risk Amplifiers)
System A requires System B, and System B requires System A. These create catastrophic failure loops and should be eliminated or managed with break-glass procedures.

### Healthcare System Categories

| Category | Examples | Typical Criticality |
|---|---|---|
| EHR Systems | Epic, Cerner, Meditech | Critical |
| Clinical Applications | PACS, LIS, Pharmacy | Critical–High |
| Infrastructure | Servers, Storage, Network, Active Directory | Critical |
| Medical Devices | Infusion pumps, ventilators, monitors | Critical–High |
| Client Devices | Workstations, tablets, thin clients | Medium–High |
| Administrative | Billing, scheduling, HR | Medium–Low |
| Telehealth & Mobile | Remote monitoring, mobile apps | High–Medium |

### The Dependency Mapping Process

#### Step 1: Inventory All Systems
Start with a complete asset inventory. Include:
- Clinical applications (licensed software)
- Infrastructure components (servers, switches, storage)
- Medical devices connected to the network
- Cloud services and SaaS applications
- Vendor-managed systems

#### Step 2: Identify Relationships
For each system, document:
- **Upstream dependencies**: What does this system need to run?
- **Downstream dependents**: What systems depend on this system?
- **Shared dependencies**: What infrastructure does it share with others?

#### Step 3: Document Vendor Information
For every system, record:
- Vendor name and primary contact
- Support contract tier (24/7, business hours, etc.)
- Service Level Agreement (SLA) for issue resolution
- BAA status if the system handles PHI

#### Step 4: Assign Criticality Ratings
Use a defined framework (see Lesson 2) to assign:
- **Critical**: Patient safety or life support involvement
- **High**: Core clinical operations, significant revenue impact
- **Medium**: Operational efficiency, significant staff impact
- **Low**: Administrative, easily replaced manually

#### Step 5: Validate and Review
- Walk the map with both IT and clinical staff
- Verify that IT-identified dependencies match clinical reality
- Update after any system change, upgrade, or new deployment
`,
    keyPoints: [
      "Hard dependencies block function entirely; soft dependencies allow degraded-mode operation",
      "Circular dependencies create catastrophic failure loops and must be documented and managed",
      "Dependency maps must include clinical applications, infrastructure, medical devices, and cloud services",
      "Each mapped system should include vendor contact, SLA, and BAA status",
      "Maps must be validated with clinical staff, not just IT, to reflect operational reality",
      "Regulatory bodies increasingly require documented technology dependency management"
    ],
    example: `
**Mapping the EHR Dependency Chain**

**System**: Epic EHR

**Hard Dependencies (Epic needs all of these):**
- Microsoft Active Directory (authentication)
- Epic database server cluster (data storage)
- Core network switches — minimum 1Gbps connectivity
- Epic application servers (3-node cluster)
- NTP time server (record timestamp accuracy)

**Soft Dependencies (Epic degrades without these):**
- Email server (order notifications)
- Lab interface engine (HL7 results)
- Radiology PACS interface (image viewing)
- Pharmacy interface (eMAR reconciliation)

**Downstream Dependents (systems that need Epic):**
- Clinical Decision Support engine
- Patient portal (MyChart)
- Revenue cycle management
- Quality reporting system

**Vendor Information:**
- Vendor: Epic Systems Corporation
- Support: 24/7 critical issue hotline
- SLA: 4-hour response for critical, 24-hour for high
- BAA: On file (last reviewed 2024-01-15)
`,
    practicalApplication: `
### Building Your First Dependency Map

**Start with your highest-criticality systems:**

1. **List your top 10 clinical systems** (ask department heads what they can't function without)

2. **For each system, answer these questions:**
   - What does it log into? (authentication dependency)
   - Where does it store data? (database/storage dependency)
   - What network infrastructure does it require?
   - What other clinical systems send it data? (interface dependencies)
   - What breaks if this system goes down?

3. **Create a dependency record** for each system with:
   - System name and category
   - Criticality rating (Critical/High/Medium/Low)
   - All upstream dependencies
   - All downstream dependents
   - Vendor name, contact, SLA
   - BAA status

4. **Identify your immediate risks:**
   - Systems with no documented backup procedure
   - Critical systems with unresolved high risk flags
   - Any circular dependency loops
   - Vendor relationships without BAAs where PHI is involved

**Quick win**: Run the dependency map through a validation check — identify every Critical system and verify it has a written downtime procedure.
`
  },
  {
    title: "Risk Assessment Methodologies for Healthcare Systems",
    content: `
## Assessing Risk in Healthcare Technology Environments

Risk assessment for healthcare technology is not the same as general IT risk assessment. The stakes include patient safety, regulatory liability, and care continuity — not just data loss or productivity.

### The Healthcare Risk Framework

Effective healthcare technology risk assessment evaluates three dimensions:

**1. Impact Severity** — How bad is it if this system fails?
**2. Likelihood** — How probable is a failure in a given timeframe?
**3. Detectability** — How quickly would failure be identified and escalated?

### Impact Categories for Healthcare Systems

#### Patient Care Impact
Score 1–5 based on effect on direct patient care:
- **5 (Critical)**: Directly affects patient safety or life-sustaining functions (ventilators, infusion pumps, monitoring)
- **4 (High)**: Significantly impairs clinical decision-making (EHR, CPOE, PACS)
- **3 (Medium)**: Delays care but does not endanger patients (scheduling, non-urgent results)
- **2 (Low)**: Inconvenience, workarounds available (email, HR systems)
- **1 (Minimal)**: No direct patient care effect (administrative systems)

#### Operational Impact
Score 1–5 based on effect on healthcare operations:
- **5**: Operations halt or revert to full manual mode (loss of EHR, network, pharmacy)
- **4**: Significant workflow disruption, productivity drops >50%
- **3**: Notable disruption, productivity drops 25–50%
- **2**: Minor disruption, productivity drops <25%
- **1**: Negligible operational effect

#### Financial Impact
Estimate **daily revenue at risk** for each critical system:
- Calculate the revenue associated with clinical functions that depend on the system
- Add cost of manual workarounds (staff overtime, paper-based processes)
- Add potential regulatory fines if PHI exposure occurs during downtime
- Add vendor incident response or emergency support costs

#### Compliance Impact
Score based on HIPAA and regulatory exposure:
- **High**: Direct ePHI exposure risk or HIPAA audit log gaps
- **Medium**: Documentation delays, reporting disruption
- **Low**: Minor procedural deviations with no PHI impact

### Maximum Tolerable Downtime (MTD)

MTD is the maximum time a system can be unavailable before the impact becomes unacceptable. Define MTD for every Critical and High system:

| System | Typical MTD | Rationale |
|---|---|---|
| Ventilator network monitoring | Minutes | Life-safety |
| EHR (Epic/Cerner) | 2–4 hours | Clinical decision-making halts |
| Pharmacy Management System | 4–8 hours | Medication administration risk |
| PACS | 8–24 hours | Manual film/verbal reporting |
| Laboratory Information System | 4–8 hours | Critical results reporting |
| Radiology scheduling | 24–48 hours | Manual scheduling feasible |
| Billing system | 48–72 hours | Revenue delayed, not lost |

### Single Points of Failure (SPOF)

A **Single Point of Failure** is a component whose failure brings down a disproportionate number of systems. In healthcare networks, common SPOFs include:

- **Core network switches**: If unredundant, failure takes down all connected systems
- **Active Directory domain controllers**: Loss of authentication cascades across all AD-integrated systems
- **Primary database server**: If unredundant, EHR and downstream systems lose data access
- **Internet connection**: If a single ISP connection, telehealth, cloud backup, and external communications fail simultaneously
- **Power to a single server room**: Inadequate UPS or generator coverage

**Identifying SPOFs in your environment:**
1. List every system that more than 3 other systems depend on
2. Check for single points in network topology (unredundant switches, single ISPs)
3. Review power infrastructure (UPS coverage, generator capacity)
4. Verify authentication redundancy (multi-DC Active Directory, backup authentication)

### Risk Scoring

Combine impact and likelihood into a risk score:

**Risk Score = Impact (1–5) × Likelihood (1–5)**

| Score | Rating | Action Required |
|---|---|---|
| 20–25 | Critical | Immediate remediation, executive escalation |
| 15–19 | High | Remediation within 30 days |
| 10–14 | Medium | Remediation within 90 days |
| 5–9 | Low | Include in next planning cycle |
| 1–4 | Minimal | Monitor and document |

### Risk Validation with Clinical Staff

Technology risk assessments must be reviewed by clinical stakeholders. IT staff may underestimate the impact of systems they don't use in patient care. A helpful validation technique is a **"Day Without" exercise**: ask department heads "What would your unit do if [system] was unavailable for 8 hours?" Their answers often reveal:
- Unknown manual workarounds that actually work
- Dependencies IT didn't know about
- Systems rated "Medium" that are actually "Critical" in certain units
`,
    keyPoints: [
      "Healthcare risk assessment must consider patient safety impact, not just IT availability",
      "Maximum Tolerable Downtime must be defined for every Critical and High system",
      "Single Points of Failure should be identified in network topology, authentication, power, and storage",
      "Risk Score = Impact × Likelihood; scores 15+ require remediation within 30 days",
      "Clinical staff must validate technology risk ratings — IT staff often underestimate clinical impact",
      "Financial impact must include revenue at risk, workaround costs, and potential HIPAA fines"
    ],
    example: `
**Risk Assessment: Pharmacy Management System**

**System**: Omnicell Pharmacy Management System

**Impact Scores:**
- Patient Care Impact: **5** (medication errors possible without system guidance; override procedures are error-prone)
- Operational Impact: **4** (pharmacists revert to paper; dispensing slows by ~60%)
- Financial Impact: **$45,000/day** (150 beds × avg $300/patient-day in pharmacy revenue)
- Compliance Impact: **High** (ePHI in dispensing records; audit trail gaps during downtime)

**Likelihood Score: 3** (system is 4 years old, one major outage in past 12 months)

**Risk Score: 5 × 3 = 15 → HIGH**

**MTD: 4 hours** (beyond 4 hours, manual dispensing errors increase significantly)

**Single Point of Failure identified**: Omnicell runs on a single physical server with no failover cluster. This is a critical SPOF requiring remediation.

**Remediation Actions:**
1. Implement server clustering or move to vendor-hosted platform (high priority)
2. Document and train staff on manual dispensing downtime procedures
3. Test downtime procedures quarterly with pharmacy staff
4. Negotiate SLA with Omnicell for 4-hour emergency response
`,
    practicalApplication: `
### Conducting Your Risk Assessment

**Step 1: Assemble the right team**
- IT Director / CISO
- Clinical Informatics lead
- Department heads (nursing, pharmacy, radiology, lab)
- Privacy/Compliance Officer
- Operations Manager

**Step 2: For each Critical/High system, capture:**
- Patient care impact score (1–5)
- Daily revenue at risk ($)
- Maximum Tolerable Downtime (hours)
- Current backup/redundancy status
- Last time the backup was tested

**Step 3: Calculate risk scores and prioritize**
- List all systems with score ≥ 15 (High/Critical)
- For each: identify the specific vulnerability (SPOF, age, no backup)
- Assign an owner and remediation deadline

**Step 4: Report to leadership**
- Present the top 5 risk items to the C-suite with financial impact
- Obtain funding approval for critical remediations
- Schedule a quarterly review cycle

**Red flags that escalate a risk rating immediately:**
🚩 A Critical system has no tested backup procedure  
🚩 MTD < 4 hours but recovery time is estimated at 24+ hours  
🚩 A SPOF in the network path to multiple clinical systems  
🚩 A vendor with no 24/7 support for a Critical system  
🚩 End-of-life hardware or software running Critical clinical workflows  
`
  },
  {
    title: "Vendor Management Best Practices",
    content: `
## Managing Healthcare Technology Vendors

Healthcare organizations typically work with 20–100+ technology vendors. Poor vendor management is one of the most common root causes of extended healthcare system outages — and of HIPAA compliance failures when Business Associate Agreements are missing or outdated.

### Why Vendor Management Is a Compliance Issue

Under HIPAA, any vendor who creates, receives, maintains, or transmits PHI on your behalf is a **Business Associate**. You are responsible for ensuring these vendors comply with HIPAA security requirements. If your vendor suffers a breach and you don't have a BAA, the regulatory and financial consequences fall on your organization.

The 2023 Change Healthcare cyberattack — which disrupted pharmacy transactions and claims processing for healthcare organizations across the United States — illustrated how deeply a single vendor failure can cascade through healthcare operations. Thousands of hospitals and clinics had insufficient vendor risk programs to anticipate or rapidly respond to the disruption.

### Business Associate Agreement (BAA) Requirements

A BAA must be in place **before** the vendor begins handling PHI. The BAA must specify:

- The permitted uses and disclosures of PHI by the BA
- The BA's obligation to implement appropriate safeguards
- The BA's duty to report breaches and security incidents
- The BA's obligation to return or destroy PHI upon contract termination
- The BA's requirement to flow down BAA obligations to subcontractors

**BAA Checklist:**
- [ ] BAA is signed and on file before any PHI exchange
- [ ] BAA is reviewed annually and updated if services change
- [ ] BAA addresses subcontractors (cloud hosting, support providers)
- [ ] Breach notification timeframe is specified (≤60 days required by HIPAA; negotiate for shorter)
- [ ] PHI destruction/return obligations upon contract termination are clear

### Vendor Risk Tiers

Not all vendors require the same level of scrutiny. Tier vendors by their access to PHI and criticality to operations:

#### Tier 1 — Critical, PHI Access (Highest Risk)
- EHR vendors (Epic, Cerner, Meditech)
- Health Information Exchanges
- Cloud backup providers for clinical data
- Revenue cycle management companies
- Medical device manufacturers with connected devices

**Required**: BAA + Annual security questionnaire + Contractual right to audit + SLA with financial penalties + 24/7 support

#### Tier 2 — Operational, Limited PHI
- Network infrastructure vendors
- Helpdesk / managed services providers
- Email encryption providers
- Identity and access management

**Required**: BAA (if any PHI possible) + Initial security assessment + SLA review annually

#### Tier 3 — Administrative, No PHI Access
- Office supply vendors
- Website analytics (non-PHI)
- HR and payroll (de-identified)

**Required**: Standard contract terms, no BAA needed

### Vendor Performance Monitoring

A BAA alone is insufficient. Ongoing monitoring should include:

**Quarterly Reviews (Tier 1 vendors):**
- SLA performance metrics (uptime, response time, resolution time)
- Incident and security event logs
- Patch and update cadence
- Staff turnover in key support roles

**Annual Security Reassessment:**
- Updated security questionnaire (SOC 2 Type II, HITRUST, or equivalent)
- Penetration testing evidence
- Sub-contractor and data hosting location changes
- Regulatory compliance certifications (FedRAMP, HIPAA attestations)

**Contract Renewal Triggers — Renegotiate When:**
- Vendor is acquired by another company
- Vendor announces end-of-life for the supported version you run
- A breach or security incident occurs at the vendor
- Vendor's support response times degrade
- New services are added that weren't in the original BAA scope

### SLA Negotiation for Healthcare

Healthcare SLAs must reflect clinical reality. Standard commercial SLAs designed for business software are often inadequate. Negotiate for:

| Term | Commercial Standard | Healthcare Minimum |
|---|---|---|
| Critical incident response | 4–8 hours | 1–2 hours |
| Critical resolution target | 24–72 hours | 4–8 hours |
| Scheduled maintenance windows | Vendor-selected | Off-hours, advance notice required |
| Uptime SLA | 99% (~87h downtime/year) | 99.9% (~8.7h/year) for Critical systems |
| Data recovery point objective | 24 hours | 4 hours for EHR |
| PHI breach notification to customer | Per HIPAA (60 days) | Within 24–72 hours |

### Vendor Offboarding

When a vendor relationship ends, failing to offboard properly creates ongoing HIPAA liability:

1. **Invoke the BAA termination clause**: Request written confirmation of PHI destruction or return
2. **Revoke all access credentials**: System accounts, VPN access, API keys
3. **Retrieve all data** in a usable format before service termination
4. **Conduct a data flow audit**: Verify no residual PHI remains in vendor systems
5. **Update your dependency map**: Remove the vendor from all affected system records
6. **Document the termination**: Keep records for 6 years per HIPAA retention requirements
`,
    keyPoints: [
      "Any vendor who handles PHI must have a signed BAA before data exchange begins",
      "Tier vendors by PHI access and operational criticality — Tier 1 requires annual security assessment",
      "Healthcare SLAs must require 1–2 hour critical response and 99.9% uptime for clinical systems",
      "The Change Healthcare 2023 attack showed how a single vendor failure can cascade industry-wide",
      "BAAs must address subcontractors — your vendor's cloud hosting provider may also be a Business Associate",
      "Proper vendor offboarding includes verified PHI destruction, access revocation, and 6-year documentation retention"
    ],
    example: `
**Vendor Management: Cloud Backup Provider**

**Vendor**: SecureHealthBackup, Inc.

**Tier Classification: Tier 1** (stores encrypted backups of all clinical data including full EHR exports)

**BAA Status**: Signed 2023-03-01, reviewed 2024-03-01. Covers primary vendor and their cloud hosting subcontractor (AWS GovCloud).

**SLA Terms Negotiated:**
- 99.95% uptime for backup verification portal
- 1-hour critical incident response
- 4-hour recovery point objective (RPO)
- 24-hour PHI breach notification to our organization
- Quarterly restore testing reports provided to us
- Annual SOC 2 Type II report shared

**Annual Security Assessment Results (2024):**
- SOC 2 Type II: Clean opinion ✅
- HITRUST CSF certified ✅
- Penetration test performed (external, no critical findings) ✅
- Encryption standards: AES-256 at rest, TLS 1.3 in transit ✅
- Sub-processors: AWS GovCloud only (previously approved) ✅

**Risk Rating: LOW** (compliant, well-documented, audited)

**Next Review: 2025-03-01**
`,
    practicalApplication: `
### Building Your Vendor Management Program

**This Week:**
1. Pull a complete list of all current technology vendors
2. For each vendor, determine: Does this vendor ever access, store, or transmit PHI?
3. Flag every PHI-accessing vendor without a current, signed BAA

**This Month:**
1. Execute BAAs for all Tier 1 vendors without them — this is your highest regulatory risk
2. Create a vendor register (spreadsheet or dependency manager tool) capturing:
   - Vendor name and service description
   - Contact name, phone, email
   - BAA status and expiration
   - Tier classification (1/2/3)
   - SLA uptime and response time commitments
   - Last security assessment date

**Quarterly:**
1. Review SLA performance reports from all Tier 1 vendors
2. Confirm no subcontractor changes occurred without notification
3. Verify access credentials are still appropriate (staff changes at vendor side)

**Annually:**
1. Request and review SOC 2 Type II or equivalent from all Tier 1 vendors
2. Renew BAA reviews
3. Update the vendor register with any service or contact changes

**Vendor Risk Red Flags:**
🚩 No BAA for a vendor with PHI access (immediate action required)
🚩 Vendor refuses SOC 2 or security questionnaire
🚩 Vendor's parent company changed hands without notification
🚩 SLA breaches recurring without remediation plan
🚩 Vendor running end-of-life software versions on systems containing your PHI
`
  },
  {
    title: "Technology Lifecycle Planning and Governance",
    content: `
## Managing Technology Through Its Lifecycle

Every technology asset — software, hardware, and medical device — has a lifecycle. Failing to plan for end-of-life creates compounding risks: security vulnerabilities from unpatched systems, vendor support gaps, interoperability failures, and compliance exposure.

### The Technology Asset Lifecycle

#### Phase 1: Planning and Procurement
Before acquiring any new system:
- Conduct a compatibility assessment with existing systems
- Identify all integration requirements and expected dependencies
- Evaluate vendor viability (financial health, product roadmap, customer base)
- Review HIPAA compliance certifications and security controls
- Obtain reference contacts from healthcare organizations of similar size

**Planning outputs:**
- Approved vendor selection with documented rationale
- Integration design document
- Training plan for clinical and IT staff
- Go-live risk assessment

#### Phase 2: Implementation and Integration
During deployment:
- Conduct a full dependency mapping update (this system now affects others)
- Implement in phases when possible (pilot unit before full rollout)
- Document all configuration decisions
- Test failover and downtime procedures before go-live
- Obtain signed BAA before any live PHI flows through the system

**Go-live readiness checklist:**
- [ ] Dependency map updated
- [ ] BAA executed
- [ ] Staff trained
- [ ] Downtime procedures documented and tested
- [ ] Rollback plan defined and tested

#### Phase 3: Operations and Maintenance
During active use:
- Apply security patches within policy windows (critical: 72 hours; high: 30 days; medium: 90 days)
- Monitor vendor bulletins for security advisories
- Conduct annual configuration reviews
- Track system performance against SLA
- Test backup and restore procedures quarterly

**Patch Management Priorities in Healthcare:**
Healthcare organizations face a tension between patch speed (security) and patch testing (clinical stability). The solution is a structured testing pipeline:
1. Vendor releases patch
2. IT tests in non-production environment (48–72 hours)
3. Clinical informatics validates no workflow disruption
4. Deploy to production during scheduled maintenance window
5. Document patch date and version for compliance records

#### Phase 4: End-of-Life Planning

**End-of-Life (EOL)** occurs when the vendor stops providing security patches and updates. Running EOL software in healthcare is a significant HIPAA risk because:
- Known vulnerabilities will not be patched
- OCR has cited EOL software in enforcement actions
- Cyber insurance policies may exclude breaches from EOL systems

**EOL Planning Triggers:**
- Vendor announces EOL date (typically 12–18 months in advance)
- Software version is 3+ major versions behind current release
- Hardware manufacturer stops providing firmware updates
- Vendor is acquired and discontinues the product line

**EOL Remediation Options:**

| Option | Best For | Cost | Risk |
|---|---|---|---|
| Upgrade to current version | Most software systems | Medium | Low |
| Migrate to alternative system | Legacy clinical apps | High | Medium (migration risk) |
| Extended support contract | Short-term bridge | High | Medium |
| Network isolation | Medical devices without patch | Low | Medium (reduced but not eliminated) |
| Decommission | Non-essential systems | Low | Low |

#### Phase 5: Decommissioning

When retiring a system:
1. **Data migration**: Extract all data in a standard format before shutdown
2. **PHI sanitization**: Securely wipe or physically destroy all storage media containing PHI
3. **Access revocation**: Remove all user accounts, API integrations, and service accounts
4. **Dependency update**: Remove the system from all dependency maps
5. **Vendor offboarding**: Invoke BAA termination, confirm PHI destruction
6. **Documentation**: Retain decommission records for 6 years (HIPAA)

### Medical Device Lifecycle Challenges

Medical devices present unique lifecycle challenges because:
- Devices often run embedded operating systems (Windows XP, Windows 7) that cannot be easily updated
- FDA clearance requirements create friction for software updates on Class II/III devices
- Biomedical/clinical engineering teams manage devices separately from IT — creating siloes
- Patient safety concerns limit the ability to isolate or shut down devices for patching

**Best Practices for Medical Device Lifecycle:**
- Maintain a medical device inventory with OS version, network connectivity, and EOL date
- Work with biomedical engineering to create a unified asset management approach
- For EOL devices that cannot be replaced immediately: implement network micro-segmentation (isolate device VLAN from general network)
- Negotiate with medical device vendors for extended security support or compensating controls
- Include medical device lifecycle in annual capital equipment budget planning

### Technology Roadmap Development

A **technology roadmap** is a 3–5 year forward-looking plan that aligns technology investments with clinical strategy and risk management. Key components:

**Year 1**: Address critical and high-risk lifecycle gaps (EOL systems, high-SPOF infrastructure)
**Year 2**: Enhance resilience (redundancy, backup improvement, integration modernization)
**Year 3–5**: Strategic investments (cloud migration, AI clinical tools, next-generation EHR modules)

Roadmaps should be reviewed annually with:
- IT leadership
- Clinical informatics
- C-suite (CFO, CMO, COO)
- Board IT/Risk committee
`,
    keyPoints: [
      "Every technology asset has a lifecycle — EOL planning must begin 18 months before vendor support ends",
      "Running end-of-life software is a HIPAA compliance risk and may void cyber insurance coverage",
      "Healthcare patch management requires a testing pipeline to balance security speed with clinical stability",
      "Medical devices present unique lifecycle challenges due to FDA requirements and embedded OS limitations",
      "Decommissioning must include PHI sanitization, dependency map updates, and vendor BAA termination",
      "A 3–5 year technology roadmap should prioritize critical lifecycle gaps in Year 1"
    ],
    example: `
**Lifecycle Planning Scenario: End-of-Life Radiology PACS**

**System**: Agfa IMPAX PACS (Picture Archiving and Communication System)
**Current Status**: Version 6.5.3 — EOL announced for December 2025
**Clinical Impact**: Used by 12 radiologists, 8 radiology techs; processes 400 studies/day

**EOL Risk Assessment:**
- Security patches stop after December 2025
- Known CVEs (Common Vulnerabilities and Exposures) will be unpatched
- Cyber insurance exclusion clause triggered for EOL systems
- OCR enforcement risk if breach occurs on unpatched system

**Remediation Options Evaluated:**

1. **Upgrade to Agfa XERO (current)**: $380,000 capital + $60,000/year maintenance
   - Estimated migration time: 6 months
   - Historical data migration included

2. **Migrate to Sectra PACS**: $420,000 capital + $55,000/year
   - Better AI integration, preferred by radiology leadership
   - 9-month migration timeline

3. **Extended support from Agfa**: $95,000/year + limited patch coverage
   - Available for 18 months only
   - Does not eliminate EOL risk long-term

**Decision**: Option 3 (18-month bridge) while conducting a full RFP for Option 2
- Bridge period reduces immediate risk while ensuring proper vendor selection
- Includes network micro-segmentation of PACS during bridge period

**Timeline:**
- Month 1: Execute extended support contract, implement network isolation
- Month 2–6: Issue RFP, vendor demos, contract negotiation
- Month 7–15: Implementation and parallel running
- Month 16: Decommission legacy PACS (data archived, media destroyed)
`,
    practicalApplication: `
### Building a Technology Lifecycle Register

**Create a lifecycle register with these fields for every system:**

| Field | Description |
|---|---|
| System Name | Official product name |
| Vendor | Vendor name |
| Version/Release | Current running version |
| EOL Date | Date vendor support ends |
| Lifecycle Phase | Planning / Active / EOL Risk / Decommissioning |
| Risk Rating | Critical / High / Medium / Low |
| Next Review | Date for next lifecycle assessment |
| Owner | IT staff member responsible |

**Priority Actions by Lifecycle Phase:**

**EOL Risk Systems (support ending within 18 months):**
1. Confirm EOL date in writing from vendor
2. Evaluate upgrade vs. migration vs. extended support
3. Obtain capital budget approval for remediation
4. Begin procurement process

**End-of-Life Systems (support already ended):**
1. Implement compensating controls immediately (network isolation, enhanced monitoring)
2. Accelerate procurement process
3. Notify leadership and insurance carrier of the risk
4. Document risk acceptance with executive sign-off

**Active Systems (current and supported):**
1. Verify next major version release timeline
2. Confirm patch cadence is meeting security policy
3. Update lifecycle register annually

**Quarterly Review Checklist:**
✅ Are any systems entering EOL status this quarter?
✅ Are all critical patches applied within policy windows?
✅ Has the dependency map been updated for any system changes?
✅ Are decommissioned systems fully wiped and documented?
✅ Is the 3-year technology roadmap current?
`
  }
];

export const dependencyManagementQuiz: QuizQuestion[] = [
  {
    question: "A system that completely prevents another system from functioning when it fails is called a:",
    options: [
      "Soft dependency",
      "Hard dependency",
      "Circular dependency",
      "Shared dependency"
    ],
    correctAnswer: 1,
    explanation: "A hard dependency is a blocking relationship — the upstream system must be running for the downstream system to function at all. Examples include Active Directory being required for EHR authentication. A soft dependency allows degraded-mode operation when the upstream system is unavailable."
  },
  {
    question: "Under HIPAA, when must a Business Associate Agreement (BAA) be executed with a technology vendor?",
    options: [
      "Within 30 days of the vendor beginning to handle PHI",
      "Before the vendor begins handling PHI",
      "At the time of the annual HIPAA security review",
      "Only when the vendor requests it"
    ],
    correctAnswer: 1,
    explanation: "HIPAA requires that a BAA be in place before a Business Associate begins creating, receiving, maintaining, or transmitting PHI on behalf of the covered entity. There is no grace period. Starting PHI exchange without a BAA is an immediate HIPAA violation."
  },
  {
    question: "Which of the following is the BEST definition of Maximum Tolerable Downtime (MTD)?",
    options: [
      "The average time it takes to restore a system after failure",
      "The maximum time a system can be unavailable before the impact becomes unacceptable",
      "The time between the last backup and the system failure",
      "The time required for the vendor to respond to a critical support ticket"
    ],
    correctAnswer: 1,
    explanation: "Maximum Tolerable Downtime (MTD) is the threshold beyond which a system's unavailability causes unacceptable harm — whether to patient safety, clinical operations, revenue, or regulatory compliance. MTD defines the absolute upper boundary for recovery planning; your Recovery Time Objective (RTO) must always be shorter than your MTD."
  },
  {
    question: "A hospital's PACS server is connected to a single core network switch with no redundant path. This is an example of:",
    options: [
      "A soft dependency",
      "A BAA gap",
      "A Single Point of Failure (SPOF)",
      "An acceptable risk for non-critical systems"
    ],
    correctAnswer: 2,
    explanation: "A Single Point of Failure (SPOF) is any component whose failure would disproportionately disrupt multiple systems. A single non-redundant core network switch is a classic SPOF — its failure takes down all systems connected through it, including the PACS. SPOFs must be identified in the dependency map and remediated or documented with compensating controls."
  },
  {
    question: "Which vendor tier requires a BAA, annual security questionnaire, and contractual right to audit?",
    options: [
      "Tier 3 — Administrative, no PHI access",
      "Tier 2 — Operational, limited PHI",
      "Tier 1 — Critical, PHI access",
      "All vendor tiers equally"
    ],
    correctAnswer: 2,
    explanation: "Tier 1 vendors are those with both high operational criticality and PHI access — such as EHR vendors, cloud backup providers, and health information exchanges. They require the most rigorous oversight: BAA, annual security questionnaire (SOC 2 Type II or equivalent), contractual right to audit, financial SLA penalties, and 24/7 support."
  },
  {
    question: "What is the PRIMARY reason running end-of-life (EOL) software in a healthcare organization is a HIPAA compliance risk?",
    options: [
      "EOL software is automatically non-compliant with HIPAA technical safeguards",
      "EOL software cannot process ePHI under any circumstances",
      "Known security vulnerabilities in EOL software will not be patched, increasing breach risk",
      "EOL software violates the HIPAA Minimum Necessary standard"
    ],
    correctAnswer: 2,
    explanation: "When a vendor ends support for software, they stop releasing security patches. Any subsequently discovered vulnerabilities remain unaddressed permanently. This directly conflicts with the HIPAA Security Rule's requirement to protect against reasonably anticipated threats. OCR has cited EOL software in enforcement actions, and cyber insurance policies often exclude breaches originating from EOL systems."
  },
  {
    question: "During a vendor offboarding process, which action is required to comply with HIPAA?",
    options: [
      "Notify HHS of the vendor change within 60 days",
      "Obtain written confirmation that the vendor has destroyed or returned all PHI",
      "Reassign the vendor's BAA to the new vendor automatically",
      "Conduct a new HIPAA risk assessment within 30 days"
    ],
    correctAnswer: 1,
    explanation: "Under HIPAA's BAA requirements, when a Business Associate relationship ends, the covered entity must ensure that the BA returns or destroys all PHI received from or created on behalf of the covered entity. Written confirmation of PHI destruction or return is required. Additionally, all access credentials must be revoked and the offboarding must be documented and retained for 6 years."
  },
  {
    question: "What is the recommended maximum timeframe for applying a CRITICAL security patch in a healthcare environment?",
    options: [
      "24 hours",
      "72 hours",
      "30 days",
      "90 days"
    ],
    correctAnswer: 1,
    explanation: "Critical security patches — those addressing actively exploited vulnerabilities or CVSS scores of 9.0+ — should be applied within 72 hours in healthcare environments. This allows enough time for basic testing in a non-production environment before deployment, while still addressing high-urgency threats promptly. High severity patches target 30 days; medium severity patches target 90 days."
  }
];
