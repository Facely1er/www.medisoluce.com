import { LessonContent } from '../../components/training/TrainingLesson';
import { QuizQuestion } from '../../components/training/TrainingQuiz';

export const hipaaBasicsLessons: LessonContent[] = [
  {
    title: "HIPAA Privacy Rule: Protecting Patient Information",
    content: `
## Understanding the HIPAA Privacy Rule

The **Health Insurance Portability and Accountability Act (HIPAA) Privacy Rule** establishes national standards to protect individuals' medical records and other personal health information (PHI).

### What is Protected Health Information (PHI)?

PHI includes any information that can identify a patient and relates to:
- Past, present, or future physical or mental health
- Provision of healthcare services
- Payment for healthcare services

### The 18 HIPAA Identifiers

PHI includes 18 specific identifiers that must be protected:

1. Names
2. Geographic subdivisions smaller than a state
3. Dates (except year)
4. Telephone numbers
5. Fax numbers
6. Email addresses
7. Social Security numbers
8. Medical record numbers
9. Health plan beneficiary numbers
10. Account numbers
11. Certificate/license numbers
12. Vehicle identifiers and serial numbers
13. Device identifiers and serial numbers
14. Web URLs
15. IP addresses
16. Biometric identifiers
17. Full-face photographs
18. Any other unique identifying number or code

### Minimum Necessary Standard

Healthcare organizations must make reasonable efforts to use, disclose, and request only the **minimum amount of PHI** necessary to accomplish the intended purpose.

### Patient Rights Under HIPAA

Patients have the right to:
- Access their health records
- Request corrections to their health records
- Receive a notice of privacy practices
- Request restrictions on uses and disclosures
- Request confidential communications
- Receive an accounting of disclosures

### Permitted Uses and Disclosures

PHI may be used and disclosed without patient authorization for:
- **Treatment**: Providing care and coordination
- **Payment**: Billing and claims processing
- **Healthcare Operations**: Quality assessment, training, accreditation

All other uses require written patient authorization.
`,
    keyPoints: [
      "PHI includes 18 specific identifiers that must be protected at all times",
      "The Minimum Necessary standard requires using only essential PHI for each purpose",
      "Patients have six fundamental rights regarding their health information",
      "Treatment, payment, and operations (TPO) are the only uses that don't require authorization",
      "All other PHI disclosures require explicit written patient consent"
    ],
    example: `
**Scenario**: A hospital receptionist is discussing a patient's appointment details at the front desk while other patients are waiting.

**Privacy Rule Violation**: The receptionist is discussing PHI (appointment details, health condition) in a public area where unauthorized individuals can overhear.

**Correct Approach**: 
- Use private rooms for discussing PHI
- Lower voice when discussing sensitive information
- Use patient identification numbers instead of names when possible
- Post signs reminding staff to protect patient privacy
`,
    practicalApplication: `
### Implementing Privacy Rule Compliance

**Daily Operations Checklist**:
1. Verify patient identity before discussing PHI
2. Ensure computer screens are not visible to unauthorized persons
3. Close doors when discussing patient information
4. Lock file cabinets containing PHI
5. Log out of computer systems when stepping away
6. Dispose of PHI using shredders or secure bins

**When in Doubt**:
- Ask: "Is this the minimum necessary information?"
- Verify: "Am I authorized to access this PHI?"
- Consider: "Could this disclosure violate patient privacy?"
`
  },
  {
    title: "HIPAA Security Rule: Safeguarding Electronic PHI",
    content: `
## HIPAA Security Rule Requirements

The Security Rule specifically protects **electronic Protected Health Information (ePHI)** through three types of safeguards: **Administrative**, **Physical**, and **Technical**.

### Administrative Safeguards

Administrative safeguards are policies and procedures designed to manage security measures.

#### Key Requirements:

**1. Security Management Process**
- Conduct regular risk assessments
- Implement risk management procedures
- Maintain sanction policies for violations
- Review information system activity regularly

**2. Assigned Security Responsibility**
- Designate a Security Officer
- Ensure clear accountability for security

**3. Workforce Security**
- Implement authorization procedures
- Maintain workforce clearance procedures
- Establish termination procedures

**4. Information Access Management**
- Implement access authorization policies
- Apply role-based access controls
- Document access decisions

**5. Security Awareness and Training**
- Provide security reminders
- Train on malware protection
- Educate about login monitoring
- Train on password management

**6. Security Incident Procedures**
- Establish incident response plans
- Document security incidents
- Implement reporting procedures

**7. Contingency Planning**
- Create data backup plans
- Develop disaster recovery procedures
- Establish emergency mode operations
- Test contingency plans regularly

**8. Business Associate Agreements**
- Obtain written contracts with BAs
- Ensure BAs implement appropriate safeguards

### Physical Safeguards

Physical safeguards control physical access to electronic information systems and facilities.

#### Key Requirements:

**1. Facility Access Controls**
- Implement access control procedures
- Maintain facility security plans
- Use visitor control procedures
- Control physical access to workstations

**2. Workstation Use**
- Define proper workstation functions
- Specify physical attributes of surroundings
- Document workstation security

**3. Workstation Security**
- Implement physical safeguards
- Restrict unauthorized physical access
- Position workstations appropriately

**4. Device and Media Controls**
- Implement disposal procedures
- Maintain media re-use procedures
- Document accountability
- Create data backup and storage procedures

### Technical Safeguards

Technical safeguards use technology to protect ePHI and control access.

#### Key Requirements:

**1. Access Control**
- Assign unique user IDs
- Implement emergency access procedures
- Use automatic logoff
- Encrypt and decrypt ePHI

**2. Audit Controls**
- Implement audit logging
- Monitor system activity
- Review access logs regularly

**3. Integrity Controls**
- Ensure ePHI is not improperly altered
- Implement mechanisms to authenticate ePHI

**4. Person or Entity Authentication**
- Verify user identity before granting access
- Implement strong authentication methods

**5. Transmission Security**
- Implement integrity controls for transmission
- Encrypt ePHI during transmission

### Encryption Standards

While encryption is "addressable" under HIPAA, it's strongly recommended:
- **At Rest**: Encrypt stored ePHI (AES-256)
- **In Transit**: Use TLS 1.2 or higher
- **Email**: Encrypt emails containing PHI
- **Mobile Devices**: Full-disk encryption required
`,
    keyPoints: [
      "Security Rule has three safeguard categories: Administrative, Physical, and Technical",
      "Regular risk assessments are mandatory for identifying security vulnerabilities",
      "Unique user IDs and access controls prevent unauthorized ePHI access",
      "Audit logs must track all ePHI access and system activity",
      "Encryption is addressable but strongly recommended for all ePHI",
      "Business Associate Agreements are required for all vendors with ePHI access"
    ],
    example: `
**Security Rule Compliance in Action**:

**Administrative**: A hospital conducts quarterly risk assessments and discovers that nurses share passwords to save time during emergencies.

**Resolution**: 
- Implement single sign-on (SSO) technology
- Create emergency access procedures with unique break-glass accounts
- Train staff on proper authentication procedures
- Document the risk mitigation in security policies

**Physical**: Medical office workstations are visible to patients in the waiting area.

**Resolution**:
- Reposition workstations away from public view
- Install privacy screens on monitors
- Implement automatic screen locks (3-minute timeout)
- Post "Clean Desk" policy reminders

**Technical**: ePHI is being emailed to specialists without encryption.

**Resolution**:
- Implement email encryption gateway
- Train staff on secure communication methods
- Use secure patient portals for information sharing
- Document encryption standards in security policies
`,
    practicalApplication: `
### Building a Security-Compliant Workflow

**Daily Security Practices**:

1. **Morning Setup**
   - Log in with unique credentials (never share!)
   - Verify security patches are current
   - Check for security alerts

2. **During Work**
   - Lock screen when leaving workstation (Windows + L)
   - Verify recipient before sending ePHI
   - Use encrypted communication channels
   - Access only ePHI needed for current task

3. **End of Day**
   - Log out of all systems
   - Secure all physical documents
   - Report any security incidents
   - Verify backup completion

**Red Flags to Report Immediately**:
- Unauthorized access attempts
- Lost or stolen devices with ePHI
- Suspicious emails (phishing)
- System anomalies or unusual activity
- Privacy breaches or incidents
`
  },
  {
    title: "Breach Notification Rule: Responding to Security Incidents",
    content: `
## HIPAA Breach Notification Requirements

A **breach** is an impermissible use or disclosure of PHI that compromises the security or privacy of the information. Not all incidents are breaches, but all must be investigated.

### What Constitutes a Breach?

A breach has occurred when:
1. PHI is acquired, accessed, used, or disclosed
2. In a manner not permitted by the Privacy Rule
3. Compromises the security or privacy of the PHI

### The Four-Factor Risk Assessment

To determine if an incident is a breach, conduct a risk assessment using four factors:

#### Factor 1: Nature and Extent of PHI Involved
- What types of identifiers were involved?
- How sensitive is the information?
- How many individuals are affected?

**Examples**:
- ❌ High Risk: Social Security numbers, financial information, diagnosis
- ✅ Lower Risk: Names only, limited clinical information

#### Factor 2: Unauthorized Person Who Used/Disclosed PHI
- Who accessed or received the PHI?
- What is their relationship to the organization?
- Do they have malicious intent?

**Examples**:
- ❌ High Risk: Unknown third party, competitor, criminal
- ✅ Lower Risk: Another covered entity, authorized business associate

#### Factor 3: Was PHI Actually Acquired or Viewed?
- Was the information actually accessed?
- Is there evidence of viewing or copying?
- What is the likelihood of further disclosure?

**Examples**:
- ❌ High Risk: Downloaded, printed, photographed, or emailed
- ✅ Lower Risk: Potential access only, no evidence of viewing

#### Factor 4: Extent of Risk Mitigation
- What actions were taken to mitigate harm?
- Were safeguards in place that reduced risk?
- Was the information retrieved or destroyed?

**Examples**:
- ✅ Risk Reduced: Retrieved unread email, destroyed misdirected fax, encryption
- ❌ Risk Not Reduced: No mitigation possible, widespread distribution

### Breach Notification Timeline

When a breach is determined to have occurred:

#### 1. Individual Notification (Within 60 Days)
**Required Content**:
- Brief description of the breach
- Description of PHI involved
- Steps individuals should take
- What the organization is doing
- Contact information for questions

**Method**: 
- Written notice by mail (or email if patient has opted in)
- Phone if urgent
- Substitute notice if contact information insufficient

#### 2. Media Notification (If 500+ Affected)
- Required for breaches affecting 500+ individuals in a state/jurisdiction
- Must notify prominent media outlets
- Timeline: Within 60 days of breach discovery

#### 3. HHS Notification
**Large Breaches (500+ individuals)**:
- Notify HHS within 60 days
- Submitted through HHS Breach Portal
- Published on HHS "Wall of Shame"

**Smaller Breaches (<500 individuals)**:
- Log all breaches
- Submit annual report to HHS
- Due within 60 days after calendar year end

#### 4. Business Associate Notification
- Business associates must notify covered entities within 60 days
- Covered entity then determines breach notification requirements

### Exceptions to Breach Notification

Three situations where notification is NOT required:

#### 1. Unintentional Acquisition
- Good faith, within scope of authority
- No further impermissible use or disclosure

**Example**: Nurse accidentally opens wrong patient's chart, immediately closes it, doesn't share information.

#### 2. Inadvertent Disclosure
- Good faith, within scope of authority
- To another authorized person
- No further impermissible use or disclosure

**Example**: Two nurses discussing patient in private area, another nurse overhears.

#### 3. Good Faith Belief Information Not Retained
- Unauthorized person to whom disclosure was made
- Couldn't reasonably retain the information

**Example**: Wrong fax number, recipient immediately returns fax without reading.

### Documentation Requirements

All security incidents must be documented, even if not a breach:
- Date of incident discovery
- Description of incident
- Four-factor risk assessment
- Determination (breach or not)
- Mitigation actions taken
- Lessons learned and corrective actions

### Breach Prevention Best Practices

**Encryption**: The Security "Safe Harbor"
- Encrypted PHI is generally exempt from breach notification
- Must use NIST-approved encryption standards
- Encryption keys must be properly managed

**Common Breach Causes to Prevent**:
1. Theft or loss of unencrypted devices (laptops, phones, USB drives)
2. Misdirected emails or faxes
3. Unauthorized access by employees
4. Hacking or IT incidents
5. Improper disposal of PHI
`,
    keyPoints: [
      "Not every security incident is a breach - conduct a four-factor risk assessment",
      "Breach notification must occur within 60 days of discovery to individuals and HHS",
      "Breaches affecting 500+ people require media notification and HHS wall of shame posting",
      "Three exceptions exist: unintentional acquisition, inadvertent disclosure, and good faith no retention",
      "Proper encryption can exempt PHI from breach notification requirements (safe harbor)",
      "All incidents must be documented regardless of breach determination"
    ],
    example: `
**Real-World Breach Scenarios**:

### Scenario 1: Lost Laptop
**Incident**: Employee's laptop stolen from car. Contains 2,000 patient records with diagnoses and SSNs.

**Risk Assessment**:
1. Nature/Extent: HIGH (SSNs, sensitive diagnoses, 2,000 patients)
2. Unauthorized Person: UNKNOWN (potential criminal intent)
3. Actually Viewed: LIKELY (device was stolen)
4. Mitigation: NONE if unencrypted

**Determination**: BREACH - Notification required

**Outcome**: 
- Individual notification to 2,000 patients (60 days)
- HHS notification (breach portal)
- Media notification (affects 500+)
- Estimated cost: $200-$500 per record = $400,000-$1,000,000

**Prevention**: Encrypt all portable devices with ePHI

---

### Scenario 2: Wrong Fax Number
**Incident**: Medical records faxed to wrong number (555-1234 instead of 555-1235). Recipient is another medical office.

**Risk Assessment**:
1. Nature/Extent: MEDIUM (full medical records, 1 patient)
2. Unauthorized Person: LOW RISK (healthcare provider, HIPAA-covered)
3. Actually Viewed: UNCERTAIN (no confirmation)
4. Mitigation: HIGH (contacted immediately, confirmed destruction)

**Determination**: NOT A BREACH - Risk sufficiently low

**Action**:
- Document incident and risk assessment
- Contact recipient to verify destruction
- Implement fax verification procedures
- No notification required

---

### Scenario 3: Employee Snooping
**Incident**: ER nurse accessed records of 50 celebrity and neighbor patients without treatment purpose over 6 months.

**Risk Assessment**:
1. Nature/Extent: MEDIUM (medical info, no financial data, 50 patients)
2. Unauthorized Person: HIGH RISK (employee with no legitimate purpose)
3. Actually Viewed: CONFIRMED (audit logs show extensive viewing)
4. Mitigation: LOW (information was viewed, employee terminated)

**Determination**: BREACH - Notification required

**Outcome**:
- Individual notification to 50 patients
- HHS notification (breach portal)
- Employee termination and potential prosecution
- Additional staff training implemented
- Enhanced audit log monitoring

**Prevention**: 
- Regular audit log reviews
- Implement access alerts for VIP patients
- Enforce role-based access controls
- Annual privacy training emphasizing snooping
`,
    practicalApplication: `
### Breach Response Action Plan

#### Immediate Actions (Within 24 Hours):
1. **Contain** the incident
   - Disable compromised accounts
   - Retrieve misdirected information if possible
   - Secure affected systems

2. **Document** everything
   - Date/time of discovery
   - What happened
   - Who discovered it
   - Initial assessment

3. **Notify** key personnel
   - Privacy Officer
   - Security Officer
   - Legal counsel
   - IT security team

#### Investigation Phase (Days 1-14):
1. **Conduct four-factor risk assessment**
2. **Identify all affected individuals**
3. **Determine root cause**
4. **Assess mitigation options**

#### Notification Phase (Within 60 Days):
1. **Prepare notification letters**
2. **Set up call center (if large breach)**
3. **Notify individuals by mail**
4. **Submit HHS breach portal notification**
5. **Contact media (if 500+)**

#### Post-Breach Phase:
1. **Implement corrective actions**
2. **Update policies and procedures**
3. **Conduct additional training**
4. **Enhance monitoring and controls**

### Your Role in Breach Prevention:

✅ **DO**:
- Verify recipient before sending PHI
- Use encryption for emails with PHI
- Report incidents immediately
- Lock devices when unattended
- Follow the minimum necessary standard

❌ **DON'T**:
- Email PHI without encryption
- Leave PHI visible in public areas
- Access PHI without business need
- Ignore suspicious activity
- Delay reporting incidents
`
  },
  {
    title: "Patient Rights and HIPAA Compliance in Practice",
    content: `
## Empowering Patients Through HIPAA Rights

HIPAA grants patients significant rights regarding their protected health information. Understanding and facilitating these rights is crucial for compliance.

### The Six Core Patient Rights

#### 1. Right of Access
**What It Means**: Patients can review and obtain copies of their health records.

**Timeline Requirements**:
- Provide access within **30 days** of request (can extend once for 30 more days)
- For records maintained off-site, within **60 days**

**Permissible Fees**:
Organizations may charge reasonable fees for:
- Cost of copying (per page or flat fee)
- Cost of postage (if mailed)
- Cost of preparing summary (if agreed upon)

**Cannot charge for**:
- Search and retrieval
- Maintaining systems
- Overhead costs

**Exceptions** (Limited situations where access can be denied):
- Psychotherapy notes
- Information compiled for legal proceedings
- Certain research information
- Information that would endanger someone

#### 2. Right to Request Amendment
**What It Means**: Patients can request corrections to their health records.

**Process**:
1. Patient submits written request with reason
2. Organization has **60 days** to respond (can extend once for 30 days)
3. Organization can accept or deny

**Acceptance**:
- Make amendment to record
- Inform patient of change
- Notify relevant parties of amendment

**Denial Requirements**:
- Provide written denial with reason
- Inform patient of complaint rights
- Allow patient to submit statement of disagreement
- Include patient's statement with future disclosures

**Valid Denial Reasons**:
- Record not created by your organization
- Not part of designated record set
- Not available for patient inspection
- Record is accurate and complete

#### 3. Right to Notice of Privacy Practices (NPP)
**What It Means**: Patients must receive notice of how their PHI may be used.

**NPP Must Include**:
- How PHI may be used and disclosed
- Patient rights under HIPAA
- Organization's duties to protect PHI
- Contact information for complaints
- Effective date of notice

**Distribution Requirements**:
- **First visit**: Provide NPP and obtain acknowledgment
- **Posted**: Display prominently in facility
- **Website**: Post if organization has website
- **Updates**: Provide revised NPP when changes occur

**Acknowledgment of Receipt**:
- Obtain good faith effort to get written acknowledgment
- Document if patient refuses to acknowledge
- Does not need to be obtained for emergencies

#### 4. Right to Request Restrictions
**What It Means**: Patients can ask to limit how PHI is used or disclosed.

**Organization's Options**:
- May agree or decline most requests
- **Must agree** if:
  - Patient pays out-of-pocket in full
  - Request is to restrict disclosure to health plan
  - For payment or healthcare operations purposes only

**Example Scenarios**:
- Patient doesn't want mental health info shared with referring physician
- Patient doesn't want family members to know about treatment
- Patient pays cash and requests no insurance billing

**Documentation**:
- Document all restriction requests
- Note whether accepted or denied
- Comply with accepted restrictions
- Apply to business associates if relevant

#### 5. Right to Confidential Communications
**What It Means**: Patients can request to be contacted at alternative locations or by alternative methods.

**Requirements**:
- Must accommodate reasonable requests
- Cannot require explanation for request
- May require specification of alternative address/method

**Examples**:
- "Mail to my work address, not home"
- "Call my cell phone, not home phone"
- "Email me at [personal email], not [work email]"
- "Don't leave voicemails with details"

**Process**:
1. Patient submits request (written preferred)
2. Verify reasonableness
3. Document in system
4. Update communication preferences
5. Train staff on special instructions

#### 6. Right to Accounting of Disclosures
**What It Means**: Patients can receive a list of PHI disclosures made by the organization.

**What Must Be Included**:
- Date of disclosure
- Name (and address, if known) of recipient
- Brief description of information disclosed
- Brief statement of purpose

**Timeline**:
- Provide within **60 days** of request
- Can extend once for 30 days with written explanation

**Exceptions** (Disclosures NOT required in accounting):
- Treatment, payment, healthcare operations (TPO)
- Disclosures to the patient
- Pursuant to patient authorization
- For facility directory or to persons involved in care
- For national security or intelligence
- To correctional institutions or law enforcement
- As part of limited data set

**Tracking Period**:
- Must provide accounting for up to **6 years** prior to request
- First accounting in 12-month period: Free
- Subsequent accountings: Reasonable cost-based fee may be charged

### Handling Patient Rights Requests

#### Step-by-Step Process:

**1. Receive Request**
- Accept verbal or written (written preferred)
- Document immediately
- Assign to appropriate staff member

**2. Verify Identity**
- Confirm patient identity
- Verify authority if representative requesting
- Validate guardian/power of attorney documents

**3. Process Request**
- Start timer (30 or 60 day clock)
- Gather requested information
- Consult Privacy Officer if questions

**4. Review for Exceptions**
- Check for valid denial reasons
- Consider sensitive information
- Determine if partial fulfillment appropriate

**5. Respond to Patient**
- Provide written response
- Meet timeline requirements
- Document completion

**6. Follow Up**
- Track satisfaction
- Note any issues for improvement
- Update procedures if needed

### Special Considerations

#### Personal Representatives
Patients may designate someone to act on their behalf:
- Legal guardians
- Power of attorney holders
- Parents of minors (with exceptions)
- Executors of deceased patient's estate

**Verification Required**:
- Government-issued ID
- Legal documentation of authority
- Notarized authorization

#### Minors and Sensitive Services
Special rules apply when minors:
- Consent to own care (age varies by state)
- Receive sensitive services (STD, substance abuse, mental health)
- Are in danger (abuse reporting)

**Best Practice**: Consult legal counsel for minor access issues.

### Training Staff on Patient Rights

#### Key Training Topics:
1. How to recognize a patient rights request
2. Where to route different types of requests
3. Timeline requirements for each right
4. Documentation requirements
5. How to handle difficult situations

#### Common Mistakes to Avoid:
- ❌ Ignoring informal requests ("Just send records to my lawyer")
- ❌ Charging excessive fees for copies
- ❌ Taking too long to respond
- ❌ Not documenting requests and responses
- ❌ Requiring notarized requests when not necessary
- ❌ Denying rights requests without proper justification

### Technology Solutions

Implementing systems to facilitate patient rights:
- **Patient portals**: Enable direct access to records
- **Automated tracking**: Monitor request timelines
- **Disclosure logs**: Simplify accounting of disclosures
- **Secure messaging**: Facilitate confidential communications
- **Request management**: Centralize all patient rights requests
`,
    keyPoints: [
      "Patients have six core rights: access, amendment, NPP, restrictions, confidential communications, and accounting",
      "Right of access requires response within 30 days, with reasonable copying fees only",
      "Organizations must honor restriction requests when patient pays out-of-pocket in full",
      "Accounting of disclosures must cover up to 6 years but excludes TPO disclosures",
      "Notice of Privacy Practices must be provided at first visit and prominently displayed",
      "Personal representatives must be properly verified before being granted access to PHI"
    ],
    example: `
**Real-World Patient Rights Scenarios**:

### Scenario 1: Access Request
**Request**: Patient requests copies of all medical records from past 3 years for second opinion consultation.

**Response Process**:
1. **Day 1**: Receive request, verify identity, start 30-day clock
2. **Day 5**: HIM department retrieves records (1,200 pages)
3. **Day 10**: Review for psychotherapy notes (excluded)
4. **Day 15**: Calculate fee ($150 for copying + $10 postage)
5. **Day 18**: Contact patient with fee quote, obtain payment
6. **Day 25**: Mail copies via USPS with tracking
7. **Day 25**: Document completion in patient rights log

**Compliance**: ✅ Met 30-day requirement, charged permissible fees only

---

### Scenario 2: Restriction Request (Out-of-Pocket Payment)
**Request**: Patient receives mental health counseling, pays $200 per session in full, requests no billing to insurance and no disclosure to insurance company.

**Response**:
1. Verify payment received in full ✅
2. **Must accept** restriction (HIPAA requirement)
3. Flag account: "NO INSURANCE BILLING - PATIENT PAID"
4. Document restriction in system
5. Train billing staff on restriction
6. Notify therapist of restriction
7. Confirm compliance with patient

**Result**: Insurance company never receives information about mental health treatment

---

### Scenario 3: Amendment Request
**Request**: Patient requests correction to diagnosis code, claiming doctor documented wrong condition.

**Investigation**:
1. Contact treating physician
2. Physician reviews notes and diagnostic criteria
3. Physician determines original diagnosis was accurate based on symptoms at time

**Response (Denial)**:
1. Send written denial within 60 days
2. Include reason: "Record is accurate based on clinical findings"
3. Inform patient of right to submit statement of disagreement
4. Patient submits statement: "I believe diagnosis was premature"
5. Attach patient's statement to record
6. Include both diagnosis and patient's statement in future disclosures

**Compliance**: ✅ Valid denial with proper process

---

### Scenario 4: Confidential Communications
**Request**: Patient going through divorce requests all communications be sent to work address and by cell phone only.

**Response**:
1. Accept request (reasonable accommodation)
2. Update patient demographics:
   - Mailing: Work address only
   - Phone: Cell phone only
   - Note: "DO NOT contact home - per patient request"
3. Document in patient's chart
4. Train front desk staff
5. Verify with patient at next visit

**Compliance**: ✅ Reasonable request honored without requiring explanation
`,
    practicalApplication: `
### Implementing Patient Rights in Daily Operations

#### Front Desk Procedures:
**New Patient**:
1. Provide Notice of Privacy Practices
2. Obtain acknowledgment of receipt
3. Ask about communication preferences
4. Document any special restrictions
5. Answer patient questions about rights

**Returning Patient**:
1. Verify contact information
2. Ask if communication preferences changed
3. Update any restrictions
4. Note any concerns in system

#### Responding to Rights Requests:

**Access Request Workflow**:
\`\`\`
Patient Request → Identity Verification → Assign to HIM
       ↓
Retrieve Records → Review for Exceptions → Calculate Fee
       ↓
Contact Patient → Receive Payment → Provide Copies
       ↓
Document Completion → Monitor Satisfaction
\`\`\`

**Timeline Monitoring**:
- Use calendar reminders for all requests
- Set alerts at 15, 25, and 28 days
- Escalate if approaching deadline
- Prepare extension letter if needed

#### Documentation Best Practices:

Create a "Patient Rights Log" tracking:
- Type of request (access, amendment, etc.)
- Date received
- Date due (30/60 days)
- Status (pending, completed, denied)
- Staff member assigned
- Date completed
- Outcome
- Any issues or appeals

#### Staff Training Checklist:

✅ All staff can recognize patient rights requests  
✅ Staff know where to route each type of request  
✅ Timeline requirements are understood  
✅ Fee schedules are documented and followed  
✅ Denial criteria are clear  
✅ Documentation standards are met  
✅ Personal representative verification process is known  
✅ Annual refresher training is completed  

#### Red Flags to Escalate:

🚩 Request approaching deadline (25+ days)  
🚩 Patient threatening to file complaint  
🚩 Unclear whether denial is appropriate  
🚩 Complex personal representative situation  
🚩 Request involves sensitive information (mental health, HIV, substance abuse)  
🚩 Request from attorney or involves litigation  
🚩 Patient disputes organization's response  

**Action**: Contact Privacy Officer immediately for guidance
`
  }
];

export const hipaaBasicsQuiz: QuizQuestion[] = [
  {
    question: "Which of the following is NOT one of the 18 HIPAA identifiers that must be protected as PHI?",
    options: [
      "Patient's full name and date of birth",
      "Patient's city and state of residence",
      "Patient's zip code (full 5-digit code)",
      "Patient's email address and phone number"
    ],
    correctAnswer: 1,
    explanation: "Under HIPAA, a patient's city and state are NOT considered identifiers and can be included in de-identified data. However, zip codes, dates (except year), and all contact information including names, emails, and phone numbers are PHI that must be protected. Geographic subdivisions smaller than a state (like full zip codes) are identifiers."
  },
  {
    question: "The 'Minimum Necessary' standard requires that:",
    options: [
      "Patients should provide the minimum amount of information possible",
      "Healthcare providers should use the minimum amount of PHI necessary to accomplish the intended purpose",
      "Only physicians can access patient information",
      "Organizations should retain records for the minimum time required by law"
    ],
    correctAnswer: 1,
    explanation: "The Minimum Necessary standard requires that healthcare organizations make reasonable efforts to use, disclose, and request only the minimum amount of PHI necessary to accomplish the intended purpose. This applies to all workforce members and protects patient privacy by limiting unnecessary PHI exposure."
  },
  {
    question: "Under the HIPAA Security Rule, which type of safeguard includes conducting regular risk assessments and implementing workforce security procedures?",
    options: [
      "Physical Safeguards",
      "Technical Safeguards",
      "Administrative Safeguards",
      "Organizational Safeguards"
    ],
    correctAnswer: 2,
    explanation: "Administrative Safeguards are policies and procedures designed to manage the selection, development, implementation, and maintenance of security measures. These include risk assessments, workforce security, training, and incident response procedures. Physical safeguards control facility access, while technical safeguards use technology to protect ePHI."
  },
  {
    question: "A nurse accidentally opens the wrong patient's chart, immediately realizes the mistake, closes it without sharing the information. According to the Breach Notification Rule, what should happen?",
    options: [
      "The organization must notify HHS within 60 days",
      "The organization must notify the patient immediately",
      "The organization must report it to the media if it affects 500+ people",
      "This is likely not a breach due to the unintentional acquisition exception"
    ],
    correctAnswer: 3,
    explanation: "This scenario falls under the 'unintentional acquisition' exception to the breach notification rule. When a workforce member unintentionally acquires PHI in good faith, within their scope of authority, and doesn't further use or disclose it, notification is not required. However, the incident should still be documented internally."
  },
  {
    question: "What is the maximum timeframe for responding to a patient's request to access their medical records?",
    options: [
      "15 days with no extensions permitted",
      "30 days, with one 30-day extension if needed",
      "60 days with no extensions permitted",
      "90 days for complex requests"
    ],
    correctAnswer: 1,
    explanation: "Under HIPAA's Right of Access, covered entities must provide access to medical records within 30 days of the request. If more time is needed, one additional 30-day extension is permitted, but the patient must be informed in writing of the reason for the delay within the initial 30-day period."
  },
  {
    question: "Which of the following fees can be charged to a patient requesting copies of their medical records?",
    options: [
      "Cost of copying, postage, search/retrieval, and system maintenance",
      "Cost of copying, postage, and reasonable cost-based labor",
      "Cost of copying and postage only",
      "Cost of copying, postage, and overhead costs"
    ],
    correctAnswer: 2,
    explanation: "Under HIPAA's Right of Access, covered entities may charge reasonable, cost-based fees that include: (1) cost of copying (labor and supplies), (2) cost of postage if mailing, and (3) cost of preparing a summary if the patient agreed. Organizations CANNOT charge for search/retrieval, maintaining the system, or general overhead costs."
  },
  {
    question: "Under what circumstance MUST a covered entity agree to a patient's request to restrict disclosure of PHI to a health plan?",
    options: [
      "Whenever the patient requests it for any reason",
      "When the patient pays out-of-pocket in full for services and requests restriction for payment or healthcare operations purposes",
      "Never - organizations can always decline restriction requests",
      "Only when the information involves mental health treatment"
    ],
    correctAnswer: 1,
    explanation: "Covered entities MUST agree to a patient's request to restrict disclosure to a health plan if: (1) the disclosure is for payment or healthcare operations purposes (not treatment), and (2) the patient has paid out-of-pocket in full for the service. All other restriction requests may be accepted or declined at the organization's discretion."
  },
  {
    question: "Which of the following disclosures does NOT need to be included in an accounting of disclosures provided to a patient?",
    options: [
      "Disclosure to law enforcement pursuant to a court order",
      "Disclosure to another provider for treatment purposes",
      "Disclosure to a public health authority for disease reporting",
      "Disclosure to a researcher as part of a limited data set"
    ],
    correctAnswer: 1,
    explanation: "Disclosures for treatment, payment, and healthcare operations (TPO) do NOT need to be included in an accounting of disclosures. Also excluded are: disclosures to the patient, pursuant to authorization, for facility directory, to persons involved in care, for national security, and as part of a limited data set. Disclosures to law enforcement and public health authorities generally must be included."
  },
  {
    question: "What is the 'safe harbor' provision related to encrypted data under the HIPAA Breach Notification Rule?",
    options: [
      "Encrypted data never needs to be backed up",
      "Encrypted data can be shared without Business Associate Agreements",
      "Breach of encrypted data generally does not require notification if encryption meets NIST standards",
      "Encryption is optional under HIPAA"
    ],
    correctAnswer: 2,
    explanation: "Under HIPAA's 'safe harbor' provision, if PHI is encrypted using NIST-approved algorithms and the encryption key was not compromised, a breach of that data generally does not trigger notification requirements. This is because properly encrypted data is rendered unusable, unreadable, or indecipherable to unauthorized individuals. However, the incident should still be documented."
  },
  {
    question: "How long must a covered entity retain documentation of HIPAA training for workforce members?",
    options: [
      "2 years from the date of training",
      "3 years from the date of training",
      "5 years from the date of training",
      "6 years from the date of training or the date it was last in effect, whichever is later"
    ],
    correctAnswer: 3,
    explanation: "HIPAA requires covered entities to retain documentation of all policies, procedures, and training for 6 years from the date of creation or the date when it was last in effect, whichever is later. This includes security training, privacy training, sanctions applied, and all other HIPAA-related documentation. This retention requirement applies to both paper and electronic documentation."
  }
];

