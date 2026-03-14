## MASTER PRIVACY POLICY

**Effective Date:**November 19, 2025
**Last Updated:** October 31, 2025

ERMITS LLC ("ERMITS," "we," "our," or "us") is committed to protecting
your privacy through a Privacy-First Architecture that ensures you
maintain control over your data. This Privacy Policy explains how we
collect, use, disclose, and safeguard information when you use our
Services across all ERMITS product lines.

By using our Services, you consent to the data practices described in
this policy. If you do not agree with this Privacy Policy, please do not
use our Services.

-----

## 1. SCOPE AND APPLICABILITY

### 1.1 Services Covered

This Privacy Policy applies to all ERMITS products and services,
including:

**ERMITS Advisory + STEEL™:**

- Strategic cybersecurity assessments and advisory services
- STEEL™ (Strategic Threat & Enterprise Evaluation Layer) framework
assessments
- vCISO services and security consulting
- Compliance advisory and implementation services

**SocialCaution:**

- Personalized privacy platform
- AI-powered persona detection
- Privacy exposure index and risk scoring
- Service catalog with privacy risk profiles

**TechnoSoluce™:**

- SBOM (Software Bill of Materials) Analyzer
- Software supply chain security and vulnerability analysis
- Client-side SBOM processing

**CyberCertitude™:**

- CMMC 2.0 Level 1 Implementation Suite
- CMMC 2.0 Level 2 Compliance Platform
- NIST SP 800-171 assessment and compliance tools
- Original Toolkit (localStorage-based compliance management)

**VendorSoluce™:**

- Supply Chain Risk Management Platform
- Vendor assessment and monitoring
- Third-party risk evaluation

**CyberCorrect™:**

- Privacy Portal (workplace privacy compliance)
- Privacy Platform (multi-regulation privacy management)
- Data subject rights management

**CyberCaution™:**

- RansomCheck (ransomware readiness assessment)
- Security Toolkit (comprehensive cybersecurity assessments)
- RiskProfessional (CISA-aligned security assessments)

### 1.2 Geographic Scope

This Privacy Policy applies to users worldwide and complies with:

- General Data Protection Regulation (GDPR) - European Union, United
Kingdom, Switzerland
- California Consumer Privacy Act (CCPA) / California Privacy Rights Act
(CPRA)
- Personal Information Protection and Electronic Documents Act
(PIPEDA) - Canada
- Lei Geral de Proteção de Dados (LGPD) - Brazil
- Other applicable privacy and data protection laws

-----

## 2. PRIVACY-FIRST ARCHITECTURE OVERVIEW

### 2.1 Core Privacy Principles

ERMITS implements Privacy-First Architecture built on five fundamental
principles that distinguish our approach:

**1. Client-Side Processing**

All core computational functions are performed locally within your
browser or self-managed environment whenever technically feasible:

- **Security Assessments:** STEEL™, CMMC, cybersecurity assessments
processed in your browser
- **SBOM Analysis:** TechnoSoluce processes SBOM files entirely
client-side
- **Risk Scoring:** All risk calculations performed locally
- **Compliance Evaluations:** Assessment scoring and gap analysis
done in your browser
- **Privacy Analysis:** SocialCaution persona detection runs
entirely client-side

**Your data remains under your control throughout the analysis
process.**

**2. Data Sovereignty Options**

You choose where your data resides:

- **Local-Only Mode:** All data stored exclusively in your browser
(IndexedDB, localStorage)
- **Self-Managed Cloud:** Deploy to your own cloud infrastructure
with full control (AWS, Azure, GCP)
- **ERMITS-Managed Cloud:** Optional encrypted cloud synchronization
with zero-knowledge architecture
- **Hybrid Deployment:** Local processing with selective encrypted
cloud backup
- **On-Premises:** Enterprise customers can deploy on their own
infrastructure

**3. Zero-Knowledge Encryption**

When using ERMITS-managed cloud features with encryption enabled:

- Data is encrypted client-side using **AES-256-GCM** before
transmission
- Encryption keys are **derived from your credentials** using PBKDF2
and never transmitted to ERMITS
- ERMITS **cannot decrypt, access, or view** your encrypted data
- You are **solely responsible** for maintaining access to
encryption keys
- **Lost keys = permanent data loss** (we cannot recover your data)

**4. Data Minimization**

We collect only the minimum data necessary for service functionality:

**Never Collected:**

- Raw SBOM files, component lists, dependency graphs
- Assessment content, responses, or findings
- Vulnerability scan results or CVE data
- Compliance documentation (SSPs, POA&Ms, evidence)
- CUI (Controlled Unclassified Information)
- FCI (Federal Contract Information)
- PHI (Protected Health Information)
- Proprietary business data or trade secrets

**Optionally Collected:**

- Account information (name, email, company) - only when you create an
account
- Pseudonymized telemetry (anonymous performance metrics) - opt-in only
- Encrypted user data (if cloud sync enabled) - we cannot decrypt

**5. Transparency and Control**

You have complete control over your data:

- **Export** all data at any time in standard formats (JSON, CSV,
PDF)
- **Delete** all data permanently with one click
- **Opt in or opt out** of telemetry collection anytime
- **Choose** your deployment and storage model
- **Review** detailed data flow documentation for each product

-----

## 3. INFORMATION WE COLLECT

### 3.1 Information You Provide Directly

**Account Information (Optional):**

When you create an account or subscribe to paid features, we collect:

- **Name:** Your full name or preferred name
- **Email Address:** For authentication, communications, and
billing
- **Company Name and Job Title:** Optional, for business context
- **Billing Information:** Processed by Stripe, Inc. (our payment
processor)
  - ERMITS does not store complete payment card information
  - We receive only: transaction status, last 4 digits of card, billing
address
- **Password:** Cryptographically hashed using bcrypt, never stored
in plaintext

**User-Generated Content:**

- **Support Requests:** Questions, issues, or feedback sent to
<contact@ermits.com>
- **Survey Responses:** Feedback provided through user surveys
- **Customization Preferences:** UI preferences, notification
settings, feature preferences

### 3.2 Information We Do NOT Collect

**ERMITS explicitly does NOT collect, access, store, or transmit:**

**Assessment and Analysis Data:**

- Security assessment responses or scores
- CMMC compliance assessments or documentation
- STEEL™ assessment responses or risk scores
- Cybersecurity evaluation results
- Privacy assessments or persona analysis results

**Technical Data:**

- SBOM (Software Bill of Materials) files or contents
- Software component lists or dependency graphs
- Vulnerability scan results or CVE findings
- Package metadata or software inventories

**Compliance and Regulatory Data:**

- System Security Plans (SSPs)
- Plans of Action and Milestones (POA&Ms)
- Compliance evidence or audit documentation
- Certification materials or assessment reports

**Controlled Information:**

- CUI (Controlled Unclassified Information)
- FCI (Federal Contract Information)
- PHI (Protected Health Information) under HIPAA
- PCI data (payment card information) except via Stripe

**Business Data:**

- Trade secrets or proprietary information
- Confidential business strategies
- Financial records (except billing data)
- Customer lists or business relationships

**Privacy-First Architecture Explanation:**

Due to our client-side processing model:

- This data is processed entirely in your browser or local environment
- It never leaves your device unless you explicitly enable cloud sync
with encryption
- When encrypted, we cannot access or decrypt this data
- You maintain complete control and ownership

### 3.3 Automatically Collected Information

**Pseudonymized Telemetry (Optional - Opt-In Required):**

With your explicit consent, we collect anonymous, aggregated performance
data:

**What We Collect:**

- Feature usage statistics (which tools are used, how often)
- Performance metrics (page load times, API response times)
- Error reports (crash logs, exceptions) with PII automatically scrubbed
by Sentry
- Browser and device information (browser type/version, OS, screen
resolution)
- Session metadata (session duration, navigation paths, timestamps)

**Privacy Protections:**

- **Irreversible Pseudonymization:** User identifiers are
cryptographically hashed (SHA-256) and cannot be reverse-engineered
- **No Content Data:** Telemetry never includes file contents,
assessment results, or user inputs
- **Differential Privacy:** PostHog analytics use differential
privacy techniques to prevent individual identification
- **Opt-Out Available:** You can disable telemetry at any time in
account settings with retroactive deletion
- **Aggregate Only:** Data used only in aggregate; individual user
behavior cannot be identified

**Technical and Security Data:**

**IP Addresses:**

- Collected for: Security monitoring, rate limiting, geolocation for
service delivery
- Not linked to: User accounts or identifiable information
- Retention: 90 days in server logs, then automatically deleted
- Use: Fraud prevention, DDoS protection, regional service optimization

**Server Logs:**

- Standard web server access logs (timestamp, HTTP method, endpoint,
status code, IP)
- Error logs for debugging and system monitoring
- Retention: 90 days, then automatically deleted
- Access: Restricted to security and engineering teams only

**Cookies and Similar Technologies:**

- See our separate Cookie Policy for detailed information
- Essential cookies for authentication and security only (required)
- Optional cookies for analytics and preferences (opt-in)

-----

### 3.4 Information from Third Parties

**Authentication Providers (OAuth):**

If you use OAuth for authentication (Google, Microsoft, GitHub), we
receive:

- Name and email address from the provider
- Profile information you choose to share with the provider's
permission
- Provider's unique identifier for your account (for account linking)

**We do not:**

- Access your contacts, files, or other data from these providers
- Request more permissions than necessary for authentication
- Share your ERMITS data back to these providers

**Payment Processor (Stripe):**

Stripe provides us with:

- Payment success/failure status
- Subscription status and billing cycle information
- Last 4 digits of payment method (for your reference)
- Billing address (for tax compliance)

**We do not:**

- Receive or store complete payment card numbers
- Process payments directly (all payment processing via Stripe)
- Have access to your full financial information

**Vulnerability Databases (Public APIs):**

When you use SBOM analysis or security assessment tools, your browser
makes anonymous, client-side queries to:

- **OSV.dev** (Google Open Source Vulnerabilities)
- **NIST National Vulnerability Database (NVD)**
- **CISA Known Exploited Vulnerabilities (KEV) catalog**

**Privacy Protection:**

- Queries performed **client-side** directly from your browser
- Only public component identifiers sent (package name, version)
- No proprietary information, file paths, or business context
transmitted
- ERMITS does not track or log your queries to these services
- These services may have their own logging policies (outside ERMITS
control)

-----

## 4. HOW WE USE INFORMATION

### 4.1 Service Delivery and Operation

We use collected information to:

- **Provide Services:** Deliver ERMITS Advisory, SocialCaution,
TechnoSoluce, CyberCertitude, VendorSoluce, CyberCorrect, and
CyberCaution services
- **Process Transactions:** Handle subscriptions, billing, and
payment confirmations
- **Authenticate Users:** Verify identity and maintain account
security
- **Enable Features:** Provide cloud synchronization, multi-device
access, collaboration features (when opted-in)
- **Customer Support:** Respond to inquiries, troubleshoot issues,
provide technical assistance

### 4.2 Service Improvement and Analytics

We use pseudonymized, aggregate data to:

- **Analyze Usage Patterns:** Understand which features are used and
how often (aggregate only)
- **Identify Issues:** Detect and fix bugs, errors, and performance
problems
- **Develop Features:** Plan and build new features based on
anonymized usage trends
- **Conduct Research:** Perform security and privacy research using
aggregated, anonymous data
- **Benchmark Performance:** Measure and improve service performance
and reliability

**We do NOT:**

- Analyze your individual assessment results or SBOM data
- Use your data to train AI models or machine learning systems
- Profile users for behavioral targeting or marketing
- Sell or monetize your data in any way

### 4.3 Communication

We use your contact information to:

- **Service Announcements:** Notify you of system updates,
maintenance, or service changes
- **Security Alerts:** Send critical security notifications or
breach notifications
- **Support Responses:** Reply to your support requests and
feedback
- **Transactional Emails:** Send receipts, invoices, account
confirmations
- **Product Updates:** Inform you of new features or product
launches (opt-in only)
- **Marketing Communications:** Send promotional content only with
your explicit consent (easy opt-out)

**You control communications:**

- Opt out of marketing emails anytime via unsubscribe link
- Cannot opt out of critical service/security notifications
- Manage preferences in Account Settings → Notifications

### 4.4 Security and Fraud Prevention

We use technical data to:

- **Detect Threats:** Identify and prevent security threats,
attacks, and abuse
- **Monitor Security:** Track unauthorized access attempts or
account compromise
- **Enforce Policies:** Ensure compliance with Terms of Service and
Acceptable Use Policy
- **Prevent Fraud:** Detect fraudulent transactions, account
creation, or service abuse
- **Protect Users:** Safeguard ERMITS, our users, and third parties
from harm

### 4.5 Legal and Compliance

We process information as required to:

- **Comply with Laws:** Fulfill legal obligations and respond to
lawful requests
- **Enforce Rights:** Protect ERMITS' legal rights and enforce
agreements
- **Liability Protection:** Defend against legal claims or
liability
- **Audits:** Conduct internal audits and maintain business records
- **Regulatory Compliance:** Meet requirements under GDPR, CCPA,
HIPAA, and other laws

### 4.6 What We Do NOT Do

**ERMITS does NOT:**

**Sell or rent** your personal information to third parties 
**Use your data for advertising** or marketing to others 
**Share your User Data** with third parties except as disclosed in
Section 5 
**Train AI models** on your User Data or assessment content 
**Analyze your results** for any purpose (we cannot access encrypted
data) 
**Profile users** for behavioral targeting or manipulation 
**Monitor your activity** beyond aggregate, anonymous metrics

-----

## 5. INFORMATION SHARING AND DISCLOSURE

### 5.1 Service Providers (Sub-Processors)

We share limited data with trusted third-party service providers who
assist in delivering the Services:

|Service Provider                |Purpose                    |Data
Shared                                          |Location             
              |Privacy Policy                                         
                  |
|--------------------------------|---------------------------|-----------------------------------------------------|------------------------------------|--------------------------------------------------------------------------|
|**Supabase, Inc.**              |Database and
authentication|Email, encrypted user data (if cloud sync enabled) 
 |United States / EU (customer
choice)|[[supabase.com/privacy](https://supabase.com/privacy)](http://supabase.com/privacy%5D(https:/supabase.com/privacy)) 
                    |
|**Stripe, Inc.**                |Payment processing       
 |Email, billing information                           |United States 
                   
 |[[stripe.com/privacy](https://stripe.com/privacy)](http://stripe.com/privacy%5D(https:/stripe.com/privacy)) 
                        |
|**Sentry (Functional Software)**|Error monitoring         
 |Error logs with PII automatically scrubbed           |United States 
                   
 |[[sentry.io/privacy](https://sentry.io/privacy)](http://sentry.io/privacy%5D(https:/sentry.io/privacy)) 
                          |
|**PostHog, Inc.**               |Analytics (opt-in)       
 |Pseudonymized usage metrics with differential privacy|United States
/ EU                 
|[[posthog.com/privacy](https://posthog.com/privacy)](http://posthog.com/privacy%5D(https:/posthog.com/privacy)) 
                      |
|**Vercel, Inc.**                |Hosting and CDN            |IP
address, HTTP headers (standard web traffic)      |Global CDN         
               
|[[vercel.com/legal/privacy-policy](https://vercel.com/legal/privacy-policy)|](http://vercel.com/legal/privacy-policy%5D(https:/vercel.com/legal/privacy-policy)%7C)

**Sub-Processor Requirements:**

All sub-processors are contractually required to:

- Use data **only for specified purposes** (providing services to
ERMITS)
- Implement **appropriate security measures** equivalent to ERMITS
standards
- Comply with **applicable privacy laws** (GDPR, CCPA, etc.)
- **Not use data for their own purposes** or share with others
- **Delete data** when no longer needed for service provision
- Execute **Data Processing Agreements** and **Standard
Contractual Clauses** (for international transfers)

**Sub-Processor Changes:**

- 30 days' advance notice before adding or changing sub-processors
- Notification via email and in-app announcement
- Enterprise customers may object to new sub-processors
- Alternative arrangements if objection cannot be resolved

### 5.2 Legal Requirements

We may disclose information if required by law or in response to:

- **Court Orders:** Subpoenas, search warrants, or judicial orders
- **Government Requests:** Law enforcement or regulatory
investigations
- **Legal Process:** Lawful requests under applicable legal
authority
- **National Security:** Threats to national security or public
safety (where legally required)

**Our Commitments When Legally Required to Disclose:**

When legally permitted, we will:

- **Notify affected users** of legal requests before disclosure
- **Challenge requests** that are overly broad, improper, or
unlawful
- **Provide only minimum information** required by law
- **Seek confidentiality** for user information disclosed
- **Publish transparency reports** when request volume warrants

**Privacy-First Architecture Limitation:**

- Due to zero-knowledge encryption, we **cannot decrypt** user data
even under legal compulsion
- We can only provide account metadata and encrypted data (which we
cannot read)
- Users should be aware that encryption keys may be subject to legal
requests in their jurisdiction

### 5.3 Business Transfers

If ERMITS is involved in a merger, acquisition, asset sale, or
bankruptcy:

- User information may be transferred as part of business assets
- **We will provide notice** before information is transferred to a
new entity
- The **successor entity will be bound** by this Privacy Policy
- You will have the **option to delete your data** before transfer
(minimum 30 days notice)
- **Enterprise contracts** and DPAs will remain in effect or require
renegotiation

### 5.4 Consent-Based Sharing

We may share information with your explicit consent for purposes such
as:

- **Third-Party Integrations:** Sharing data with services you
authorize (HRIS, GRC platforms, etc.)
- **Organization Administrators:** Sharing data with your
organization's designated admins (Enterprise accounts)
- **Testimonials:** Publicly sharing your feedback with identifying
information only if you approve
- **Case Studies:** Using your organization as a case study with
explicit written permission
- **Research Participation:** Including your data in research
studies with explicit opt-in consent

**You control consent-based sharing:**

- Consent required before any sharing
- Revoke consent anytime
- Clear explanation of what will be shared and why
- No penalty for refusing consent

### 5.5 Aggregated and Anonymous Data

We may share aggregated, anonymous data that **cannot identify
you**:

- **Industry Benchmarks:** Comparative statistics for security
maturity, compliance readiness
- **Research Publications:** Academic or industry research on
cybersecurity trends
- **Public Reports:** Trend analysis, threat intelligence, industry
insights
- **Product Insights:** Feature adoption rates, performance
statistics

**Privacy Protections:**

- Data is **irreversibly anonymized** using differential privacy
techniques
- **Minimum anonymity set:** At least 10 organizations in any
aggregate statistic
- **Cannot be reverse-engineered** to identify individuals or
organizations
- **Opt-out available:** You can request exclusion from aggregated
datasets

-----

## 6. DATA SECURITY MEASURES

### 6.1 Encryption

**Data in Transit:**

- **TLS 1.3** encryption for all data transmission (minimum TLS 1.2
for legacy systems)
- **HTTPS required** for all web traffic
- **Certificate Pinning** for critical connections
- **Perfect Forward Secrecy (PFS)** enabled to protect past
sessions
- **Strong Cipher Suites** only (AES-256-GCM, ChaCha20-Poly1305)

**Data at Rest:**

- **AES-256-GCM** encryption for cloud-stored data
- **Client-Side Encryption** with user-controlled keys
(zero-knowledge architecture)
- **Encrypted Database Backups** with separate encryption keys
- **Secure Key Management** using industry-standard HSMs and key
rotation

**Data in Use:**

- **Client-Side Processing** minimizes data exposure during
computation
- **Memory Encryption** where supported by browser and OS
- **Secure Coding Practices** to prevent data leakage
- **Input Validation and Output Encoding** to prevent injection
attacks

### 6.2 Access Controls

**Authentication:**

- **Multi-Factor Authentication (MFA)** available for all accounts,
required for administrators
- **Strong Password Requirements:** Minimum 12 characters,
complexity requirements
- **Password Breach Detection:** Checking against known compromised
password databases
- **Session Management:** Automatic timeout after 4 hours idle, 12
hours maximum
- **OAuth 2.0 Integration** with trusted providers (Google,
Microsoft, GitHub)

**Authorization:**

- **Row-Level Security (RLS):** Database-level policies ensure users
can only access their own data
- **Role-Based Access Control (RBAC):** Granular permissions (Admin,
Editor, Viewer, etc.)
- **Principle of Least Privilege:** Users and systems granted
minimum necessary permissions
- **Attribute-Based Access Control:** Fine-grained policies based on
user attributes and context
- **Just-in-Time Access:** Temporary elevated permissions for
specific tasks

**Access Logging:**

- All data access logged with **timestamp, user, action, resource**
- **Audit logs retained** for 3 years (configurable for Enterprise)
- **Regular audit log review** for anomalies and security events
- **Immutable logs** stored separately (cannot be altered or
deleted)
- **SIEM integration** available for enterprise security monitoring

### 6.3 Infrastructure Security

**Cloud Security:**

- **Secure Hosting:** Enterprise-grade infrastructure (Supabase on
AWS, Vercel on AWS/GCP)
- **Network Segmentation:** Isolated production, staging, and
development environments
- **DDoS Protection:** Distributed denial-of-service attack
mitigation
- **Web Application Firewall (WAF):** Protection against common web
attacks
- **Intrusion Detection/Prevention (IDS/IPS):** 24/7 monitoring for
suspicious activity
- **Regular Vulnerability Scanning:** Automated and manual security
assessments
- **Penetration Testing:** Annual third-party security audits

**Application Security:**

- **Secure Coding Practices:** Following OWASP Top 10 guidelines
- **Code Review:** All code changes reviewed for security issues
- **Input Validation:** Comprehensive sanitization of all user
inputs
- **SQL Injection Prevention:** Parameterized queries and prepared
statements
- **XSS Protection:** Content Security Policy (CSP) and output
encoding
- **CSRF Protection:** Anti-CSRF tokens for state-changing
operations
- **Dependency Management:** Regular updates and vulnerability
scanning
- **Security Headers:** HSTS, X-Frame-Options, CSP, and other
protective headers

### 6.4 Employee and Contractor Access

**Personnel Security:**

- **Background Checks** for employees with data access
- **Enhanced Screening** for security and engineering roles
- **Confidentiality Agreements:** All employees and contractors sign
NDAs
- **Security Training:** Annual security awareness training, GDPR
training
- **Access on Need-to-Know Basis:** Limited to personnel requiring
access
- **Regular Access Reviews:** Quarterly review and revocation of
unnecessary access
- **Immediate Revocation:** Access terminated immediately upon
employment end

**Privilege Management:**

- **Least Privilege:** Staff granted minimum necessary access
- **Separation of Duties:** No single person has complete system
access
- **Privileged Access Monitoring:** Enhanced logging for
administrative actions
- **Multi-Person Control:** Critical operations require approval
from multiple people

### 6.5 Security Incident Response

In the event of a data breach or security incident:

**Detection:**

- 24/7 security monitoring and alerting systems
- Automated threat detection and anomaly analysis
- Real-time intrusion detection

**Containment:**

- Immediate action to isolate affected systems
- Disable compromised accounts or services
- Prevent further unauthorized access

**Investigation:**

- Forensic analysis to determine scope and impact
- Root cause identification
- Evidence preservation for potential legal action

**Notification:**

- **Users notified within 72 hours** of breach discovery (GDPR
requirement)
- **Supervisory authorities notified** as required by law
- **Notification includes:** Nature of breach, data affected, steps
taken, recommendations for users

**Remediation:**

- Implement fixes to prevent recurrence
- Update security controls and policies
- Provide credit monitoring or identity theft protection if appropriate
- Conduct post-incident review and lessons learned

**Documentation:**

- Comprehensive incident reporting
- Compliance with regulatory notification requirements
- Transparency reports published (when appropriate)

-----

## 7. DATA RETENTION

### 7.1 Active Account Data

We retain your data for as long as your account is active or as needed
to provide Services:

|Data Type                     |Retention Period                     
                                                             
 |Purpose                                                |
|------------------------------|-----------------------------------------------------------------------------------------------------|-------------------------------------------------------|
|**Account Information**       |Duration of account + 30 days
after termination                                                     
|Service delivery, support, billing                     |
|**User-Generated Content**    |User-controlled (can delete
anytime); deleted 30 days after account termination (90 days for
backups)|Service functionality, user requests                   |
|**Encrypted Cloud Data**      |User-controlled (can delete
anytime); deleted 30 days after account termination (90 days for
backups)|Cloud synchronization, multi-device access             |
|**Authentication Tokens**     |1 hour (access token), 30 days
(refresh token)                                                     
 |Session management, security                           |
|**Support Communications**    |3 years after last interaction   
                                                                 
 |Customer support, quality improvement, legal compliance|
|**Pseudonymized Telemetry**   |Indefinite (anonymous, cannot be
deleted or linked to individuals)                                 
 |Service improvement, analytics, research               |
|**Server Logs (IP addresses)**|90 days                           
                                                                 
|Security monitoring, fraud prevention, debugging       |

### 7.2 Product-Specific Retention

**ERMITS Advisory + STEEL:**

- Assessment data: User-controlled; deleted with account
- Advisory service records: 7 years (professional services standard)
- Contract documents: 7 years after contract end

**SocialCaution:**

- Privacy assessments: User-controlled; stored locally in browser only
- User preferences: Duration of account + 30 days
- No personal data from assessments stored on ERMITS servers

**TechnoSoluce (SBOM Analyzer):**

- SBOM files: Never transmitted to or stored on ERMITS servers
- Analysis results: Stored locally in user's browser only
- No retention on ERMITS infrastructure

**CyberCertitude (CMMC Compliance):**

- Assessments: User-controlled; deleted with account or on-demand
- Compliance documentation: User-controlled
- Historical assessment data: Retained while account active (for trend
analysis)

**VendorSoluce:**

- Vendor profiles: User-controlled; deleted with account
- Risk assessments: Retained while account active
- Vendor SBOMs: User-controlled; deleted on demand

**CyberCorrect (Privacy Compliance):**

- Privacy assessments: User-controlled; deleted with account
- DPIA documentation: User-controlled
- Data subject requests: 3 years after resolution (regulatory
requirement)

**CyberCaution (Security Assessments):**

- Security assessments: User-controlled; deleted with account
- Risk scores: Retained while account active
- Historical data: Deleted with account or on-demand

### 7.3 Deleted Accounts

When you delete your account or request data deletion:

**Immediate (within 24 hours):**

- Account access disabled
- Data marked for deletion
- Stop all processing of personal data

**Within 30 days:**

- User Data permanently deleted from production systems
- Account information removed from active databases
- Encrypted cloud data deleted (we cannot decrypt, but keys are
destroyed)

**Within 90 days:**

- Backup copies permanently deleted
- All traces removed from backup systems
- Deletion verification available upon request

**Exceptions (data retained longer):**

- **Financial Records:** 7 years (tax and audit requirements - IRS,
SOX)
- **Legal Hold Data:** Retained as required by litigation or
investigation
- **Pseudonymized Analytics:** Indefinite (anonymous, cannot
identify individuals)
- **Aggregated Statistics:** Indefinite (cannot be
reverse-engineered to identify you)

### 7.4 Data Deletion Verification

Upon request, we will provide written certification that your data has
been deleted in accordance with this policy. Contact:
<privacy@ermits.com>

-----

## 8. YOUR PRIVACY RIGHTS

### 8.1 Universal Rights (All Users)

All users have the following rights regardless of location:

**Right to Access:**

- Request a copy of all personal data we hold about you
- Receive information about how your data is processed
- Access your data via Account Settings → Export Data anytime
- Request human-readable summary of data processing activities

**Right to Rectification:**

- Correct inaccurate or incomplete personal data
- Update information directly in Account Settings
- Contact support for assistance: <privacy@ermits.com>
- We will correct errors within 10 business days

**Right to Deletion (Right to be Forgotten):**

- Request deletion of your personal data
- Delete account and all data via Account Settings → Delete Account
- Data deleted within 30 days (production), 90 days (backups)
- Some data retained for legal compliance (financial records, legal
holds)

**Right to Data Portability:**

- Export your data in machine-readable formats (JSON, CSV, PDF)
- Transfer data to another service provider
- Export available anytime via Account Settings → Export Data
- Includes all personal data you provided and data generated about you

**Right to Restriction of Processing:**

- Request limitation of processing in certain circumstances
- Temporarily suspend processing while disputes are resolved
- Object to specific processing activities

**Right to Object:**

- Object to processing based on legitimate interests
- Opt out of marketing communications anytime
- Disable telemetry collection
- Withdraw consent for optional data processing

### 8.2 Additional Rights for EU/UK/Swiss Users (GDPR)

If you are located in the European Economic Area, United Kingdom, or
Switzerland, you have additional rights:

**Legal Basis for Processing:**

We process your data based on:

- **Consent:** When you provide explicit consent (marketing,
telemetry, optional features)
- **Contract:** To perform our contract with you (provide Services
you purchased)
- **Legitimate Interests:** For service improvement, security, fraud
prevention (balanced against your rights)
- **Legal Obligation:** To comply with applicable laws (tax,
financial reporting, law enforcement)

**Right to Withdraw Consent:**

- Withdraw consent at any time (does not affect prior processing)
- Disable telemetry in Account Settings → Privacy → Data Collection
- Unsubscribe from marketing emails via link in each email
- Withdrawal processed immediately

**Right to Lodge a Complaint:**

- File complaint with your local data protection authority (DPA)
- **EU:** Find your DPA at
<<https://edpb.europa.eu/about-edpb/board/members_en>>
- **UK:** Information Commissioner's Office (ICO) -
<<https://ico.org.uk/>>
- **Switzerland:** Federal Data Protection and Information
Commissioner (FDPIC) - <<https://www.edoeb.admin.ch>>
- You may also contact us first to resolve issues: <privacy@ermits.com>

**Right to Data Protection Impact Assessment (DPIA):**

- Request information about DPIAs conducted for high-risk processing
- Review assessments relevant to your data
- Available upon request: <privacy@ermits.com>

**Right to Human Review:**

- Right not to be subject to automated decision-making with
legal/significant effects
- ERMITS does not engage in automated decision-making that significantly
affects you
- All risk scores and assessments are informational tools requiring
human judgment

**Data Protection Officer:**

- For GDPR-related inquiries, contact: <privacy@ermits.com>
- Subject: "GDPR Inquiry - [Your Name]"

### 8.3 Additional Rights for California Residents (CCPA/CPRA)

If you are a California resident, you have additional rights under CCPA
and CPRA:

**Right to Know:**

You can request information about:

- Categories of personal information collected
- Categories of sources of personal information
- Business or commercial purposes for collecting or selling personal
information
- Categories of third parties with whom we share personal information
- Specific pieces of personal information collected about you

**Right to Delete:**

- Request deletion of personal information (subject to legal
exceptions)
- Exceptions: Legal compliance, fraud prevention, internal uses, service
provision

**Right to Opt-Out of Sale:**

- **ERMITS does not sell personal information** and has not sold
personal information in the past 12 months
- We do not sell personal information of minors under 16
- We will not sell your information in the future without opt-in
consent

**Right to Correct:**

- Request correction of inaccurate personal information
- We will correct errors within 45 days

**Right to Limit Use of Sensitive Personal Information:**

- ERMITS does not use or disclose sensitive personal information for
purposes other than providing Services
- You can limit use via Account Settings → Privacy

**Right to Non-Discrimination:**

- Equal service and pricing regardless of privacy rights exercise
- No denial of goods or services for exercising privacy rights
- No different quality of service based on rights exercise
- No discriminatory pricing or offerings

**Authorized Agent:**

- You may designate an authorized agent to make requests on your behalf
- Agent must provide written authorization from you
- We may require verification of both your identity and agent's
authority

**California Consumer Privacy Request:**

- Submit requests via email: <privacy@ermits.com>
- Subject: "CCPA Request - [Your Name]"
- Online form:
[[www.ermits.com/privacy-request](http://www.ermits.com/privacy-request)](http://www.ermits.com/privacy-request%5D(http:/www.ermits.com/privacy-request))

**California "Shine the Light" Law:**

- ERMITS does not share personal information with third parties for
their direct marketing purposes
- No opt-out required under California Civil Code Section 1798.83

### 8.4 Additional Rights for Other Jurisdictions

**Canada (PIPEDA):**

- Right to access and correct personal information
- Right to withdraw consent
- Right to challenge compliance
- Office of the Privacy Commissioner of Canada:
<<https://www.priv.gc.ca>>

**Brazil (LGPD):**

- Rights similar to GDPR (access, correction, deletion, portability)
- Right to information about data sharing
- Autoridade Nacional de Proteção de Dados (ANPD)

**Australia (Privacy Act):**

- Australian Privacy Principles (APPs) apply
- Right to access and correct
- Office of the Australian Information Commissioner (OAIC)

### 8.5 Exercising Your Rights

**How to Submit Requests:**

**Email:**

- Address: <privacy@ermits.com>
- Subject: "Privacy Rights Request - [Type of Request]"
- Include: Your name, email address, description of request

**Online Form:**

- Visit:
[[www.ermits.com/privacy-request](http://www.ermits.com/privacy-request)](http://www.ermits.com/privacy-request%5D(http:/www.ermits.com/privacy-request))
- Fill out form with request details
- Submit with verification

**In-App:**

- Navigate to Account Settings → Privacy Rights
- Select type of request
- Complete verification and submit

**Mail:**

- ERMITS LLC
- [Physical Address]
- Attn: Privacy Rights Request
- Include: Name, email, detailed request description

**Verification Process:**

To protect your privacy, we must verify your identity before fulfilling
requests:

1. **Account-Based Verification:** Log in to your account (preferred
method)
1. **Email Verification:** Confirm via link sent to registered email
address
1. **Additional Verification:** For sensitive requests (deletion,
data access), we may require:

- Government-issued ID (driver's license, passport)
- Additional account information (subscription details, recent
activity)
- Two-factor authentication
- Notarized authorization (for authorized agent requests)

**Response Timeline:**

- **Initial Response:** Within 10 business days acknowledging
receipt of request
- **Complete Response:** Within 45 days (may extend 45 days with
notice for complex requests)
- **GDPR Requests:** Within 30 days (may extend 60 days with
justification)
- **CCPA Requests:** Within 45 days (may extend 45 days with
notice)
- **Free of Charge:** First two requests per year are free;
reasonable fee may apply for excessive, repetitive, or manifestly
unfounded requests

**Request Limitations:**

We may decline requests that:

- Are manifestly unfounded or excessive
- Would adversely affect others' rights and freedoms
- Are prohibited by law
- Would compromise security or fraud prevention
- Require disclosure of trade secrets or confidential business
information

If we decline a request, we will explain why and inform you of your
right to lodge a complaint with a supervisory authority.

-----

## 9. INTERNATIONAL DATA TRANSFERS

### 9.1 Data Processing Locations

ERMITS is based in the United States. If you access Services from
outside the U.S., your data may be transferred to, stored, and processed
in the United States or other countries where our service providers
operate.

**Primary Data Locations:**

- **United States:** Primary data processing and storage (Supabase
US, Vercel US)
- **European Union:** Optional data residency for EU customers
(Supabase EU region - Frankfurt)
- **Global CDN:** Content delivery network nodes worldwide (Vercel
Edge Network)

**Service Provider Locations:**

- **Supabase:** United States (default), EU (optional)
- **Stripe:** United States (global processing)
- **Sentry:** United States
- **PostHog:** United States / EU (customer choice)
- **Vercel:** Global (primary US)

### 9.2 Safeguards for International Transfers

For data transfers from the EEA, UK, or Switzerland to the United
States:

**Standard Contractual Clauses (SCCs):**

- ERMITS uses European Commission-approved Standard Contractual Clauses
(Decision 2021/914)
- SCCs incorporated into agreements with all sub-processors
- Module Two (Controller to Processor) SCCs apply
- Full text available upon request: <privacy@ermits.com>

**UK International Data Transfer Addendum:**

- UK Addendum to EU SCCs for UK data transfers
- Approved by UK Information Commissioner's Office (ICO)
- Compliance with UK GDPR requirements

**Swiss Data Transfer Mechanisms:**

- Swiss-adapted Standard Contractual Clauses
- Compliance with Swiss Federal Data Protection Act (FADP)
- Swiss FDPIC-approved mechanisms

**Additional Safeguards:**

- **Encryption in Transit and at Rest:** TLS 1.3, AES-256
- **Access Controls:** RBAC, MFA, Row-Level Security
- **Regular Security Assessments:** Audits, penetration testing
- **Incident Response Procedures:** 72-hour breach notification
- **Transparency:** Government access request notifications (when
legally permitted)
- **Zero-Knowledge Architecture:** Technical impossibility of
accessing encrypted data

### 9.3 Data Residency Options

**EU Data Residency (Available Now):**

- Supabase EU region (Frankfurt, Germany)
- All data stored and processed within EU
- EU-based backups and disaster recovery
- Request at signup or contact: <privacy@ermits.com>

**Self-Managed Infrastructure (Enterprise):**

- Deploy to your own cloud environment (AWS, Azure, GCP)
- Choose any geographic region
- Complete control over data location
- ERMITS provides software and support only

**On-Premises Deployment (Enterprise Plus):**

- Install on your own servers
- Air-gapped operation supported
- No data leaves your network
- Complete data sovereignty

### 9.4 No Adequacy Decision Reliance

ERMITS does not rely solely on adequacy decisions for international
transfers. We implement Standard Contractual Clauses and additional
safeguards regardless of adequacy status to ensure ongoing compliance
even if adequacy decisions are invalidated.

-----

## 10. CHILDREN'S PRIVACY

### 10.1 Age Restrictions

**The Services are not intended for children under 18 years of
age.** We do not knowingly collect personal information from children
under 18.

**If You Are Under 18:**

- Do not use the Services
- Do not provide any information to ERMITS
- Do not create an account
- Have a parent or guardian contact us if you have provided information

### 10.2 Parental Rights

If we learn that we have collected personal information from a child
under 18 without verified parental consent:

- We will **delete the information as quickly as possible**
- Parents may contact us to request deletion: <privacy@ermits.com>
- Parents have the right to:
  - Review information collected from their child
  - Request deletion of their child's information
  - Refuse further collection of their child's information
  - Receive information about our data practices

**How to Contact Us:**

- Email: <privacy@ermits.com>
- Subject: "Child Privacy - Parental Request"
- Include: Child's name, your relationship, details of concern

### 10.3 Educational Use

For educational institutions using Services for students:

**Institution Responsibilities:**

- Institution must obtain appropriate parental consent under FERPA and
COPPA
- Institution acts as agent for parents
- Student data is processed under institution's direction
- Institution is responsible for FERPA and COPPA compliance

**ERMITS Commitments:**

- Process student data only as directed by institution
- Maintain confidentiality of education records
- Not use student data for marketing or advertising
- Provide secure data deletion upon contract termination

**FERPA Compliance:**

- ERMITS acts as "school official" with legitimate educational interest
- We do not re-disclose education records without consent
- We maintain security controls required by FERPA

-----

## 11. PRODUCT-SPECIFIC PRIVACY CONSIDERATIONS

### 11.1 ERMITS Advisory + STEEL™

**What We Collect:**

- Contact information (name, email, company) for consultation
scheduling
- Billing information (via Stripe) for paid advisory services
- Communication history (emails, meeting notes) for service delivery

**What We Do NOT Collect:**

- STEEL assessment responses (processed client-side or recorded by you)
- Strategic recommendations or advisory deliverables (owned by you)
- Proprietary business information or trade secrets

**Data Retention:**

- Advisory service records: 7 years (professional services standard)
- Communication history: 3 years after project completion
- STEEL assessment data: Never collected by ERMITS (you retain all
data)

### 11.2 SocialCaution

**What We Collect:**

- Minimal account information (email for login, optional)
- User preferences (theme, notification settings)
- Anonymous aggregate statistics (opt-in only)

**What We Do NOT Collect:**

- Privacy assessment responses (processed 100% client-side)
- Personal data entered into assessments
- Service usage details or persona detection results
- Any identifiable information about your privacy posture

**Data Storage:**

- All assessment data stored locally in your browser (IndexedDB,
localStorage)
- Zero data transmission to ERMITS servers during assessments
- You control all data; we have no access

**Privacy Protections:**

- No tracking or analytics cookies
- No server-side data collection
- No account required for basic use
- 100% client-side AI processing

### 11.3 TechnoSoluce™ (SBOM Analyzer)

**What We Collect:**

- Account information (email, name) if you create an account
- Payment information (via Stripe) for premium features

**What We Do NOT Collect:**

- SBOM files or contents (processed 100% client-side)
- Software component lists or dependency graphs
- Vulnerability analysis results
- Package metadata or software inventories
- File paths or proprietary naming conventions

**Data Flow:**

- SBOM analysis performed entirely in your browser
- Only component identifiers (public package names, versions) sent to
vulnerability databases (OSV.dev, NIST NVD)
- No proprietary information transmitted
- Results stored locally in your browser only

**Privacy Protections:**

- Zero-knowledge architecture (we never see your SBOM data)
- Anonymous vulnerability queries (cannot be linked to your
organization)
- Local storage only (you control all data)
- Export results to your own systems

### 11.4 CyberCertitude™ (CMMC Compliance)

**Toolkit (localStorage-based):**

- **No data collected:** 100% local storage in browser
- **No account required:** Anonymous use
- **No transmission:** Zero data sent to ERMITS servers
- **User controlled:** All data in your browser; you manage backups

**Level 1 & Level 2 Platform (Cloud-Enabled):**

**What We Collect (with account):**

- Account information (name, email, company)
- Encrypted compliance data (if cloud sync enabled)
- Optional pseudonymized telemetry

**What We Do NOT Collect:**

- Unencrypted assessment responses
- SSPs (System Security Plans) - encrypted or stored locally
- POA&Ms (Plans of Action & Milestones) - encrypted or stored locally
- Evidence files - encrypted or stored locally
- CUI or FCI (processed by you, encrypted by you)

**Encryption:**

- Zero-knowledge E2EE with user-managed keys
- ERMITS cannot decrypt your compliance data
- Lost keys = permanent data loss (we cannot recover)

### 11.5 VendorSoluce™

**What We Collect:**

- Account information (name, email, company)
- Encrypted vendor assessment data (if cloud sync enabled)
- Vendor risk scores (encrypted)

**What We Do NOT Collect:**

- Vendor names or identities (encrypted)
- Vendor SBOM contents (processed client-side)
- Proprietary vendor information
- Contractual details or business relationships

**Privacy Protections:**

- Vendor data encrypted before transmission
- SBOM analysis performed client-side
- Only anonymous component queries to vulnerability databases
- Vendor portal users can only see their own organization's data

### 11.6 CyberCorrect™ (Privacy Compliance)

**Privacy Portal:**

**What We Collect:**

- Employee email address (for identity verification)
- Data subject request metadata (type, date, status)
- Communication logs (request/response correspondence)

**What We Do NOT Collect:**

- Employee personal data (remains in your HRIS)
- HR records or personnel files
- Medical information or sensitive data
- Personal data content (we coordinate requests only)

**Privacy Platform:**

**What We Collect:**

- Privacy team account information
- Encrypted privacy assessments (with E2EE option)
- DPIA documentation (encrypted)

**What We Do NOT Collect:**

- Unencrypted privacy assessment responses
- Data processing records (encrypted)
- Personal data inventories (encrypted)
- GDPR Article 30 records (encrypted)

### 11.7 CyberCaution™ (Security Assessments)

**Browser-Based (Standard):**

- **No data collected:** 100% local processing
- **No account required:** Anonymous use
- **No transmission:** Zero data sent to ERMITS servers

**Cloud-Enabled (Professional):**

**What We Collect:**

- Account information (name, email, company)
- Encrypted security assessment data (if cloud sync enabled)
- Risk scores and recommendations (encrypted)

**What We Do NOT Collect:**

- Unencrypted assessment responses
- Network diagrams or infrastructure details
- Security control implementations
- Vulnerability details or remediation plans

**Anonymous Benchmarking (Opt-In Only):**

- Aggregate industry statistics only
- No identifiable information
- Differential privacy applied
- Minimum 10 organizations in any statistic

-----

## 12. SPECIAL CONSIDERATIONS

### 12.1 Federal Contractor Privacy

For users handling Controlled Unclassified Information (CUI) or Federal
Contract Information (FCI):

**Privacy-First Architecture Benefits:**

- CUI/FCI processed client-side; never transmitted to ERMITS
- Zero-knowledge encryption ensures ERMITS cannot access CUI/FCI
- Local storage options eliminate cloud transmission of sensitive data
- You maintain complete control over CUI/FCI data

**Your Responsibilities:**

- Properly mark and handle CUI/FCI according to NIST SP 800-171 and 32
CFR Part 2002
- Use encryption features and self-managed deployment options for
CUI/FCI
- Implement appropriate access controls per DFARS requirements
- Maintain audit logs for CUI/FCI access
- Report cyber incidents as required by DFARS 252.204-7012 (within 72
hours to DoD)

**ERMITS Cannot:**

- Access or view CUI/FCI due to zero-knowledge architecture
- Report cyber incidents on your behalf (you must report)
- Determine if information qualifies as CUI/FCI (your responsibility)

**Incident Reporting:**

- You are solely responsible for detecting and reporting cyber incidents
involving CUI/FCI
- Report to DoD via <<https://dibnet.dod.mil>> within 72 hours
- ERMITS will cooperate with authorized incident investigations
- ERMITS maintains audit logs that may assist investigations (metadata
only)

### 12.2 Healthcare Privacy (HIPAA)

For healthcare organizations subject to HIPAA:

**Business Associate Agreement (BAA) Available:**

- Required for healthcare customers processing PHI
- Contact: <privacy@ermits.com> to execute BAA
- HIPAA-compliant infrastructure and safeguards

**What We Collect (Under BAA):**

- Account information (name, email, organization)
- Encrypted PHI (with zero-knowledge encryption)
- Audit logs for compliance

**What We Do NOT Collect:**

- Unencrypted PHI (processed client-side)
- Medical records or clinical data
- Patient names or identifiers
- Protected health information content

**Recommended Configuration:**

- Use local-only storage for all PHI
- Use self-managed cloud infrastructure
- Enable client-side encryption for any cloud-stored data
- Implement access controls per HIPAA Security Rule
- Maintain audit logs of PHI access

**Your Responsibilities:**

- Determine if ERMITS is a Business Associate for your use case
- Execute BAA before processing PHI
- Configure Services for HIPAA compliance
- Conduct required risk analysis
- Train workforce on HIPAA requirements

### 12.3 Financial Services Privacy

For financial institutions subject to GLBA, SOX, or PCI-DSS:

**Compliance Support:**

- SOC 2 Type II certification (in progress)
- Encryption and access controls exceed industry standards
- Audit logging for compliance monitoring

**Your Responsibilities:**

- Do not process payment card information (PCI data) through Services
- Use Stripe integration for payment processing only
- Implement required financial data safeguards
- Maintain compliance with GLBA, SOX, PCI-DSS independently

-----

## 13. UPDATES TO THIS PRIVACY POLICY

### 13.1 Policy Updates

We may update this Privacy Policy periodically to reflect:

- Changes in data practices or Services
- New product launches or features
- Legal or regulatory developments
- Technological improvements
- User feedback and industry best practices

### 13.2 Notification of Changes

**Material Changes:**

For significant changes affecting your rights or data practices:

- **30 Days' Advance Notice:** Email notification and in-app
announcement
- **Prominent Display:** Notice displayed on website and in
Services
- **Opt-Out Option:** Option to export data and close account before
changes take effect
- **Continued Use:** Continued use after effective date constitutes
acceptance

**Non-Material Changes:**

For clarifications, formatting, or minor updates:

- Update "Last Updated" date at top of policy
- Changes effective immediately upon posting
- No advance notice required

### 13.3 Version History

Previous versions of this Privacy Policy are available upon request:
<privacy@ermits.com>

**Current Version:** 2.0 (January 2025)
**Previous Versions:**

- Version 1.0 (Original policy)

-----

## 14. CONTACT INFORMATION

### 14.1 Privacy Inquiries

**General Privacy Questions:**

- Email: <privacy@ermits.com>
- Subject: "Privacy Inquiry"
- Website:
[[www.ermits.com/privacy](http://www.ermits.com/privacy)](http://www.ermits.com/privacy%5D(http:/www.ermits.com/privacy))

**Data Rights Requests:**

- Email: <privacy@ermits.com>
- Subject: "Privacy Rights Request - [Type]"
- Online Form:
[[www.ermits.com/privacy-request](http://www.ermits.com/privacy-request)](http://www.ermits.com/privacy-request%5D(http:/www.ermits.com/privacy-request))

### 14.2 Jurisdiction-Specific Contacts

**Data Protection Officer (EU/UK/Swiss):**

- Email: <privacy@ermits.com>
- Subject: "GDPR Inquiry - DPO"
- Handles: GDPR, UK GDPR, Swiss FADP matters

**California Privacy Requests (CCPA/CPRA):**

- Email: <privacy@ermits.com>
- Subject: "CCPA Request"
- Handles: California consumer privacy rights

**HIPAA Privacy Officer (Healthcare):**

- Email: <privacy@ermits.com>
- Subject: "HIPAA Privacy Matter"
- Handles: BAA requests, PHI concerns

### 14.3 Product-Specific Privacy Contacts

**ERMITS Advisory + STEEL:**

- Email: <privacy@ermits.com>
- Subject: "Advisory Privacy Inquiry"

**SocialCaution:**

- Email: <privacy@ermits.com>
- Subject: "SocialCaution Privacy Inquiry"

**TechnoSoluce:**

- Email: <privacy@ermits.com>
- Subject: "TechnoSoluce Privacy Inquiry"

**All Other Products:**

- Email: <privacy@ermits.com>
- Subject: "[Product Name] Privacy Inquiry"

### 14.4 Security Concerns

**Security Issues or Data Breaches:**

- Email: <contact@ermits.com>
- Subject: "Security Issue - [Urgent/Non-Urgent]"
- For vulnerabilities: <contact@ermits.com> (responsible disclosure)

### 14.5 Mailing Address

**ERMITS LLC** 
[Physical Address to be inserted] 
Attn: Privacy Team

-----

## 15. EFFECTIVE DATE AND ACCEPTANCE

**Effective Date:** October 31, 2025
**Last Updated:** November 19,profes 2025

**By using ERMITS Services, you acknowledge that you have read,
understood, and agree to be bound by this Privacy Policy.**

If you do not agree with this Privacy Policy, you must discontinue use
of all ERMITS Services immediately.

