import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Search, X, Download } from 'lucide-react';
import Button from '../components/ui/Button';
import DownloadCard from '../components/toolkit/DownloadCard';
import Modal from '../components/ui/Modal';
import ReactMarkdown from 'react-markdown';

export interface DownloadResource {
  id: string;
  title: string;
  description: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'zip';
  downloadLink: string;
  category: string;
  // Add tags property to DownloadResource interface
  tags: string[];
  isPopular: boolean;
  // Add onView property to DownloadResource interface
  onView?: (resource: DownloadResource) => void;
}

const ToolkitPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  
  const categories = [
    'HIPAA Compliance',
    'Technology Dependency',
    'Business Impact',
    'Continuity Planning',
    'Ransomware',
    'Training',
  ];
  
  const resources: DownloadResource[] = [
    {
      id: '1',
      title: 'HIPAA Privacy Policy Template',
      description: 'Comprehensive template for creating a HIPAA-compliant privacy policy for your organization.',
      fileType: 'md',
      downloadLink: '/downloads/hipaa-privacy-policy-template.docx',
      category: 'HIPAA Compliance',
      tags: ['policy', 'hipaa', 'privacy'],
      isPopular: true,
    },
    {
      id: '2',
      title: 'Breach Response Checklist',
      description: 'Step-by-step checklist for responding to a data breach in compliance with HIPAA requirements.',
      fileType: 'md',
      downloadLink: '/downloads/breach-response-checklist.pdf',
      category: 'HIPAA Compliance',
      tags: ['breach', 'incident response', 'hipaa'],
      isPopular: true,
    },
    {
      id: '3',
      title: 'Business Associate Agreement Template',
      description: 'Standard BAA template for agreements with vendors who handle PHI on your behalf.',
      fileType: 'md',
      downloadLink: '/downloads/business-associate-agreement-template.docx',
      category: 'HIPAA Compliance',
      tags: ['baa', 'vendor', 'agreement'],
      isPopular: false,
    },
    {
      id: '4',
      title: 'Staff Training Record Form',
      description: 'Form to track HIPAA compliance training for employees and maintain training records.',
      fileType: 'md',
      downloadLink: '/downloads/staff-training-record-form.pdf',
      category: 'Training',
      tags: ['training', 'documentation', 'compliance'],
      isPopular: false,
    },
    {
      id: '5',
      title: 'Technology Dependency Mapping Template',
      description: 'Template for mapping and documenting critical technology dependencies in healthcare.',
      fileType: 'xlsx',
      downloadLink: '/downloads/technology-dependency-mapping-template.xlsx',
      category: 'Technology Dependency',
      tags: ['mapping', 'inventory', 'dependencies'],
      isPopular: true,
    },
    {
      id: '6',
      title: 'BIA Worksheet for Healthcare',
      description: 'Business Impact Analysis worksheet specifically designed for healthcare organizations.',
      fileType: 'md',
      downloadLink: '/downloads/bia-worksheet-healthcare.docx',
      category: 'Business Impact',
      tags: ['bia', 'impact', 'analysis'],
      isPopular: false,
    },
    {
      id: '7',
      title: 'Continuity Plan Template for Healthcare',
      description: 'Comprehensive business continuity plan template focused on healthcare operations.',
      fileType: 'md',
      downloadLink: '/downloads/continuity-plan-template-healthcare.docx',
      category: 'Continuity Planning',
      tags: ['continuity', 'plan', 'disaster recovery'],
      isPopular: false,
    },
    {
      id: '8',
      title: 'Ransomware Response Playbook',
      description: 'Detailed playbook for preparing for and responding to ransomware attacks in healthcare.',
      fileType: 'md',
      downloadLink: '/downloads/ransomware-response-playbook.pdf',
      category: 'Ransomware',
      tags: ['ransomware', 'incident response', 'security'],
      isPopular: true,
    },
    {
      id: '9',
      title: 'HIPAA Security Risk Assessment Tool',
      description: 'Interactive tool to conduct a HIPAA security risk assessment for your organization.',
      fileType: 'xlsx',
      downloadLink: '/downloads/hipaa-security-risk-assessment-tool.xlsx',
      category: 'HIPAA Compliance',
      tags: ['risk assessment', 'security', 'hipaa'],
      isPopular: false,
    },
    {
      id: '10',
      title: 'Patient Data Backup Strategy Guide',
      description: 'Guide to creating a robust backup strategy for patient data and critical systems.',
      fileType: 'md',
      downloadLink: '/downloads/patient-data-backup-strategy-guide.pdf',
      category: 'Continuity Planning',
      tags: ['backup', 'data protection', 'recovery'],
      isPopular: false,
    },
    {
      id: '11',
      title: 'EHR Downtime Procedures',
      description: 'Procedures for maintaining patient care operations during EHR system downtime.',
      fileType: 'md',
      downloadLink: '/downloads/ehr-downtime-procedures.docx',
      category: 'Continuity Planning',
      tags: ['downtime', 'ehr', 'procedures'],
      isPopular: true,
    },
    {
      id: '12',
      title: 'Vendor Risk Assessment Template',
      description: 'Template for assessing security and compliance risks of healthcare technology vendors.',
      fileType: 'xlsx',
      downloadLink: '/downloads/vendor-risk-assessment-template.xlsx',
      category: 'HIPAA Compliance',
      tags: ['vendor', 'risk assessment', 'compliance'],
      isPopular: false,
    },
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getDocumentContent = (downloadLink: string): string => {
    switch (downloadLink) {
      case '/downloads/hipaa-privacy-policy-template.md':
        return `
# HIPAA Privacy Policy Template

## Healthcare Organization Privacy Policy

**Effective Date:** [Insert Date]  
**Last Updated:** [Insert Date]

---

## 1. PURPOSE AND SCOPE

This Privacy Policy describes how [Organization Name] ("we," "us," or "our") protects the privacy of your Protected Health Information (PHI) in accordance with the Health Insurance Portability and Accountability Act of 1996 (HIPAA) and its implementing regulations.

## 2. YOUR RIGHTS REGARDING YOUR PHI

Under HIPAA, you have the following rights regarding your PHI:

### Right to Access
- You have the right to inspect and obtain a copy of your PHI
- We may charge a reasonable fee for copying costs
- We will respond to your request within 30 days

### Right to Amend
- You may request amendments to your PHI if you believe it is incorrect or incomplete
- We may deny your request if the information was not created by us or if it is accurate and complete

### Right to an Accounting
- You have the right to request an accounting of disclosures of your PHI
- This includes disclosures made for purposes other than treatment, payment, or healthcare operations

### Right to Restrict Uses and Disclosures
- You may request restrictions on how we use or disclose your PHI
- We are not required to agree to all requests but will consider them

### Right to Request Confidential Communications
- You may request that we communicate with you in a specific way or at a specific location
- We will accommodate reasonable requests

### Right to Complain
- You may file a complaint with us or with the U.S. Department of Health and Human Services
- We will not retaliate against you for filing a complaint

## 3. HOW WE USE AND DISCLOSE YOUR PHI

We may use and disclose your PHI for the following purposes:

### Treatment
- Providing, coordinating, or managing your healthcare
- Consultations between healthcare providers
- Referrals to other healthcare providers

### Payment
- Billing and collection activities
- Insurance claims processing
- Utilization review

### Healthcare Operations
- Quality assessment and improvement
- Staff training and education
- Business planning and development
- Legal and compliance activities

### Other Permitted Uses
- As required by law
- For public health activities
- For health oversight activities
- For judicial and administrative proceedings
- For law enforcement purposes
- To prevent serious threat to health or safety

## 4. AUTHORIZATION REQUIRED

For uses and disclosures not described above, we will obtain your written authorization. You may revoke any authorization in writing, except to the extent we have already acted in reliance on it.

## 5. MINIMUM NECESSARY STANDARD

We will make reasonable efforts to use, disclose, and request only the minimum amount of PHI necessary to accomplish the intended purpose.

## 6. SAFEGUARDS

We maintain physical, electronic, and procedural safeguards to protect your PHI, including:
- Secure storage of physical records
- Password-protected electronic systems
- Employee training on privacy requirements
- Regular security assessments

## 7. BREACH NOTIFICATION

If a breach of your PHI occurs, we will notify you in accordance with federal requirements, typically within 60 days of discovery.

## 8. BUSINESS ASSOCIATES

We may share your PHI with business associates who perform services on our behalf. All business associates are required to protect your PHI through written agreements.

## 9. CONTACT INFORMATION

**Privacy Officer:** [Name]  

## 10. CHANGES TO THIS POLICY

We reserve the right to change this policy. Changes will apply to PHI we already have as well as PHI we receive in the future. We will post the current policy in our facility and on our website.

---

**INSTRUCTIONS FOR USE:**
1. Replace all bracketed placeholders with your organization's information
2. Review with legal counsel before implementation
3. Post in prominent locations and provide copies to patients
4. Update annually or as regulations change

**COMPLIANCE CHECKLIST:**
- [ ] Organization name and contact information added
- [ ] Effective date established
- [ ] Privacy Officer designated
- [ ] Posted in patient areas
- [ ] Available on website
- [ ] Staff training completed
- [ ] Annual review scheduled
`;
      case '/downloads/breach-response-checklist.md':
        return `
# HIPAA Breach Response Checklist

## Immediate Response (0-24 Hours)

### Step 1: Discovery and Assessment
- [ ] **Time of Discovery:** _______________
- [ ] **Person Who Discovered:** _______________
- [ ] **Nature of Incident:** _______________

### Step 2: Initial Containment
- [ ] Secure the area/system where breach occurred
- [ ] Prevent further unauthorized access
- [ ] Document the scene (photos if applicable)
- [ ] Preserve evidence for investigation

### Step 3: Notification of Key Personnel
- [ ] Privacy Officer notified: _______________
- [ ] Security Officer notified: _______________
- [ ] CEO/Administrator notified: _______________
- [ ] Legal counsel contacted (if needed): _______________
- [ ] IT Department notified (for electronic breaches): _______________

## Investigation Phase (1-5 Days)

### Step 4: Detailed Investigation
- [ ] Interview involved personnel
- [ ] Review access logs and audit trails
- [ ] Determine scope of PHI involved
- [ ] Identify individuals whose PHI was breached
- [ ] Assess risk of harm to individuals

### Step 5: Risk Assessment
Answer the following questions to determine reporting requirements:

**Nature and Extent of PHI:**
- [ ] What types of PHI were involved?
- [ ] How many individuals are affected?
- [ ] Was PHI encrypted or otherwise secured?

**Who Obtained PHI:**
- [ ] Was PHI obtained by unauthorized persons?
- [ ] Is the person known to the covered entity?
- [ ] Was it inadvertent or intentional?

**Whether PHI was Actually Acquired:**
- [ ] Was PHI actually viewed, acquired, or used?
- [ ] Is there evidence of further disclosure?

**Extent of Mitigation:**
- [ ] Can the PHI be retrieved or destroyed?
- [ ] Are there assurances against further disclosure?

## Documentation (Ongoing)

### Step 6: Incident Documentation
- [ ] **Incident Report Number:** _______________
- [ ] **Date/Time of Incident:** _______________
- [ ] **Description of Incident:**
  _______________________________________________
  _______________________________________________

- [ ] **PHI Involved:**
  _______________________________________________

- [ ] **Individuals Affected:** _______________
- [ ] **Cause of Breach:**
  _______________________________________________

- [ ] **Discovery Method:**
  _______________________________________________

- [ ] **Actions Taken:**
  _______________________________________________

## Notification Requirements

### Step 7: Individual Notification (If Required)
**Timeline:** Within 60 days of breach discovery

- [ ] **Notification Method:**
  - [ ] First-class mail to last known address
  - [ ] Email (if individual agreed to electronic notice)
  - [ ] Phone (if urgent circumstances)
  - [ ] Substitute notice (if insufficient contact info)

- [ ] **Notice Content Includes:**
  - [ ] Brief description of incident
  - [ ] Types of PHI involved
  - [ ] Steps individuals should take
  - [ ] What organization is doing
  - [ ] Contact information

### Step 8: HHS Notification
**Timeline:** Within 60 days of breach discovery

- [ ] Submit breach report to HHS via OCR Portal
- [ ] **Report Submitted Date:** _______________
- [ ] **HHS Case Number:** _______________

### Step 9: Media Notification (If Applicable)
**Required if:** Breach affects 500+ individuals in same state/jurisdiction

- [ ] **Media Outlets Contacted:** _______________
- [ ] **Date of Media Notice:** _______________

## Mitigation and Corrective Actions

### Step 10: Immediate Mitigation
- [ ] Actions taken to mitigate harmful effects:
  _______________________________________________
  _______________________________________________

### Step 11: Corrective Actions
- [ ] **Policy/Procedure Updates:**
  _______________________________________________

- [ ] **Additional Training Required:**
  _______________________________________________

- [ ] **System/Security Improvements:**
  _______________________________________________

- [ ] **Disciplinary Actions:**
  _______________________________________________

## Follow-Up Activities

### Step 12: Ongoing Monitoring
- [ ] Monitor for identity theft (if SSNs involved)
- [ ] Monitor for medical identity theft
- [ ] Track any complaints or issues from affected individuals

### Step 13: Annual Review
- [ ] Include incident in annual risk assessment
- [ ] Review and update policies based on lessons learned
- [ ] Update training materials as needed

## Key Contacts

**Privacy Officer:**
- Name: _______________
- Phone: _______________
- Email: _______________

**Legal Counsel:**
- Name: _______________
- Phone: _______________

**IT Security:**
- Name: _______________
- Phone: _______________

**HHS OCR Regional Office:**
- Phone: 1-800-368-1019
- Website: www.hhs.gov/ocr

## Important Notes

- Document everything throughout the process
- Preserve all evidence related to the breach
- Consider cyber insurance notification requirements
- Consult legal counsel for complex situations
- Remember: Not all incidents are reportable breaches

**Breach vs. Incident:**
- Incident: Potential or suspected breach
- Breach: Confirmed acquisition, access, use, or disclosure of PHI in violation of HIPAA
`;
      case '/downloads/business-associate-agreement-template.md':
        return `
# Business Associate Agreement Template

## BUSINESS ASSOCIATE AGREEMENT

**Between:** [Covered Entity Name] ("Covered Entity")  
**And:** [Business Associate Name] ("Business Associate")

**Effective Date:** [Date]

---

## ARTICLE 1: DEFINITIONS

**1.1 General Terms**
Terms used but not defined in this Agreement have the meanings assigned in the HIPAA Rules (45 CFR Parts 160 and 164).

**1.2 Specific Definitions**
- **"HIPAA Rules"** means the Privacy, Security, Breach Notification, and Enforcement Rules codified at 45 CFR Parts 160 and 164.
- **"Individual"** has the same meaning as the term "individual" in 45 CFR § 160.103.
- **"Protected Health Information" or "PHI"** has the same meaning as the term "protected health information" in 45 CFR § 160.103.

## ARTICLE 2: PERMITTED USES AND DISCLOSURES

**2.1 General Use and Disclosure**
Business Associate may only use or disclose PHI:
- To perform functions, activities, or services for or on behalf of Covered Entity as specified in the underlying agreement
- As required by law
- For proper management and administration of Business Associate
- To carry out legal responsibilities of Business Associate

**2.2 Specific Permitted Uses**
Business Associate may use PHI to:
- [Specify permitted uses, e.g., "Process insurance claims"]
- [Add additional specific uses as needed]
- Perform data aggregation services for Covered Entity
- De-identify PHI in accordance with HIPAA requirements

**2.3 Specific Permitted Disclosures**
Business Associate may disclose PHI to:
- Subcontractors that perform services for Business Associate (with appropriate agreements)
- Third parties as directed by Covered Entity
- Individuals who are the subject of the PHI

## ARTICLE 3: OBLIGATIONS OF BUSINESS ASSOCIATE

**3.1 Safeguards**
Business Associate agrees to:
- Use appropriate safeguards to prevent use or disclosure of PHI other than as permitted
- Implement administrative, physical, and technical safeguards that reasonably and appropriately protect the confidentiality, integrity, and availability of electronic PHI

**3.2 Minimum Necessary**
- Use, disclose, or request only the minimum amount of PHI necessary to accomplish the intended purpose

**3.3 Subcontractors**
- Ensure that any subcontractors that create, receive, maintain, or transmit PHI on behalf of Business Associate agree to the same restrictions and conditions

**3.4 Reporting**
Report to Covered Entity:
- Any use or disclosure not permitted by this Agreement
- Any security incident within 24 hours of becoming aware
- Any breach of unsecured PHI within 24 hours of discovery

**3.5 Individual Rights**
- Provide access to PHI to individuals upon Covered Entity's request
- Make amendments to PHI as directed by Covered Entity
- Provide information needed for Covered Entity to respond to requests for accounting of disclosures
- Make internal practices available to HHS for compliance review

**3.6 Return or Destruction of PHI**
Upon termination of this Agreement:
- Return or destroy all PHI received from, created, or received on behalf of Covered Entity
- Retain no copies of PHI
- If return or destruction is not feasible, extend protections of this Agreement to such information

## ARTICLE 4: OBLIGATIONS OF COVERED ENTITY

**4.1 Permitted Requests**
Covered Entity may request use or disclosure of PHI only if such use or disclosure would not violate HIPAA Rules if done by Covered Entity.

**4.2 Notice of Privacy Practices**
Provide Business Associate with the notice of privacy practices produced by Covered Entity, and any changes to such notice.

**4.3 Restrictions**
Inform Business Associate of any restriction to the use or disclosure of PHI agreed to by Covered Entity.

**4.4 Revocation of Authorization**
Inform Business Associate of any revocation of authorization by an individual to use or disclose PHI.

## ARTICLE 5: SECURITY PROVISIONS

**5.1 Administrative Safeguards**
- Assign security responsibility to designated personnel
- Conduct workforce training on PHI handling
- Implement access management procedures
- Establish incident response procedures

**5.2 Physical Safeguards**
- Secure facilities and workstations
- Implement device and media controls
- Properly dispose of PHI-containing materials

**5.3 Technical Safeguards**
- Implement access control systems
- Use audit controls and logs
- Ensure integrity of PHI
- Encrypt PHI during transmission

## ARTICLE 6: BREACH PROVISIONS

**6.1 Discovery and Assessment**
Business Associate will:
- Have procedures to discover potential breaches
- Conduct risk assessments for suspected breaches
- Document all breach-related activities

**6.2 Notification Timeline**
- Report potential breaches to Covered Entity within 24 hours
- Provide preliminary assessment within 72 hours
- Provide complete investigation report within 10 business days

**6.3 Notification Content**
Include in breach notifications:
- Description of the incident
- Types of PHI involved
- Number of individuals affected
- Actions taken to mitigate harm
- Steps taken to prevent future occurrences

## ARTICLE 7: INDEMNIFICATION

**7.1 Business Associate Indemnification**
Business Associate agrees to indemnify and hold harmless Covered Entity from any claims, damages, or penalties arising from Business Associate's violation of this Agreement or HIPAA Rules.

**7.2 Covered Entity Indemnification**
Covered Entity agrees to indemnify Business Associate for actions taken in good faith reliance on instructions from Covered Entity.

## ARTICLE 8: TERM AND TERMINATION

**8.1 Term**
This Agreement becomes effective on the Effective Date and will terminate upon termination of the underlying service agreement or as otherwise specified.

**8.2 Termination for Cause**
Either party may terminate this Agreement immediately upon written notice if:
- The other party breaches a material term and fails to cure within 30 days
- A breach cannot reasonably be cured

**8.3 Effect of Termination**
Upon termination:
- Business Associate's right to use or disclose PHI immediately ceases
- Return or destruction obligations become effective immediately

## ARTICLE 9: GENERAL PROVISIONS

**9.1 Governing Law**
This Agreement is governed by the laws of [State].

**9.2 Amendment**
This Agreement may only be amended in writing, signed by both parties, and may be required by changes in applicable law.

**9.3 Survival**
Provisions regarding return/destruction of PHI and indemnification survive termination.

**9.4 Interpretation**
Any ambiguity shall be resolved to permit compliance with HIPAA Rules.

---

## SIGNATURES

**COVERED ENTITY:**

_________________________________  
Name: [Name]  
Title: [Title]  
Date: _____________

**BUSINESS ASSOCIATE:**

_________________________________  
Name: [Name]  
Title: [Title]  
Date: _____________

---

## APPENDIX A: SERVICES AND PHI DESCRIPTION

**Services to be Performed:**
[Detailed description of services]

**Types of PHI Involved:**
- [ ] Names
- [ ] Addresses
- [ ] Dates of birth
- [ ] Social Security numbers
- [ ] Medical record numbers
- [ ] Account numbers
- [ ] Health plan beneficiary numbers
- [ ] Medical information
- [ ] Other: ________________

**Methods of PHI Access:**
- [ ] Electronic transmission
- [ ] Physical records
- [ ] Verbal communication
- [ ] Remote access to systems
- [ ] Other: ________________

## IMPLEMENTATION CHECKLIST

- [ ] All blanks completed with specific information
- [ ] Services and PHI clearly defined in Appendix A
- [ ] Legal review completed
- [ ] Both parties have signed and dated
- [ ] Copies provided to both parties
- [ ] Filed with other contract documents
- [ ] Annual review scheduled
`;
      case '/downloads/staff-training-record-form.md':
        return `
# Staff Training Record Form

## HIPAA COMPLIANCE TRAINING RECORD

---

### EMPLOYEE INFORMATION

**Employee Name:** _________________________________  
**Employee ID:** ______________  
**Department:** _________________________________  
**Job Title:** _________________________________  
**Hire Date:** ______________  
**Supervisor:** _________________________________

---

### TRAINING COMPLETION RECORD

#### Initial HIPAA Training
- **Training Date:** ______________
- **Training Type:** [ ] Classroom [ ] Online [ ] Self-Study [ ] Video
- **Training Duration:** __________ hours
- **Trainer Name:** _________________________________
- **Training Materials Used:** _________________________________
- **Assessment Score:** _____% (Minimum 80% required)
- **Certification Date:** ______________
- **Employee Signature:** _________________________________
- **Trainer Signature:** _________________________________

#### Annual Refresher Training

**Year 1:**
- **Training Date:** ______________
- **Training Type:** [ ] Classroom [ ] Online [ ] Self-Study [ ] Video
- **Assessment Score:** _____%
- **Employee Signature:** _________________________________
- **Trainer Signature:** _________________________________

**Year 2:**
- **Training Date:** ______________
- **Training Type:** [ ] Classroom [ ] Online [ ] Self-Study [ ] Video
- **Assessment Score:** _____%
- **Employee Signature:** _________________________________
- **Trainer Signature:** _________________________________

**Year 3:**
- **Training Date:** ______________
- **Training Type:** [ ] Classroom [ ] Online [ ] Self-Study [ ] Video
- **Assessment Score:** _____%
- **Employee Signature:** _________________________________
- **Trainer Signature:** _________________________________

---

### TRAINING TOPICS COVERED

#### HIPAA Privacy Rule ✓
- [ ] Overview of HIPAA and its purpose
- [ ] Definition of Protected Health Information (PHI)
- [ ] Permitted uses and disclosures
- [ ] Patient rights under HIPAA
- [ ] Minimum necessary standard
- [ ] Authorization requirements
- [ ] Complaints process

#### HIPAA Security Rule ✓
- [ ] Administrative safeguards
- [ ] Physical safeguards
- [ ] Technical safeguards
- [ ] Risk assessment requirements
- [ ] Assigned security responsibilities
- [ ] Information systems access management
- [ ] Workforce security measures

#### Breach Notification Rule ✓
- [ ] Definition of a breach
- [ ] Risk assessment process
- [ ] Notification requirements and timelines
- [ ] Documentation requirements
- [ ] Reporting procedures

#### Organization-Specific Policies ✓
- [ ] Privacy policies and procedures
- [ ] Security policies and procedures
- [ ] Incident reporting procedures
- [ ] Business associate agreements
- [ ] Disciplinary actions for violations
- [ ] Role-specific responsibilities

#### Practical Applications ✓
- [ ] Handling PHI in daily work
- [ ] Appropriate disclosure scenarios
- [ ] Email and electronic communication
- [ ] Mobile device security
- [ ] Physical security measures
- [ ] Workstation use guidelines

---

### ACKNOWLEDGMENT AND CERTIFICATION

I acknowledge that I have received, understand, and will comply with:

- [ ] The organization's HIPAA policies and procedures
- [ ] My responsibilities regarding PHI protection
- [ ] The consequences of HIPAA violations
- [ ] The requirement to report suspected violations
- [ ] My obligation to keep PHI confidential

I understand that:
- Failure to comply with HIPAA requirements may result in disciplinary action, up to and including termination
- Civil and criminal penalties may apply to HIPAA violations
- I must report any suspected breaches or violations immediately
- This training is required annually or when policies change significantly

**Employee Signature:** _________________________________  

**Privacy Officer Signature:** _________________________________  

---

### ADDITIONAL TRAINING RECORD

#### Specialized Training (Check all that apply)
- [ ] **IT Security Training** - Date: ______________
- [ ] **Business Associate Management** - Date: ______________
- [ ] **Breach Response Training** - Date: ______________
- [ ] **Risk Assessment Training** - Date: ______________
- [ ] **Audit and Monitoring** - Date: ______________
- [ ] **Patient Rights Training** - Date: ______________

#### Remedial Training (if applicable)
**Reason for Remedial Training:** _________________________________  
**Training Date:** ______________  
**Training Duration:** __________ hours  
**Trainer:** _________________________________  
**Employee Signature:** _________________________________  
**Trainer Signature:** _________________________________

---

### TRAINING VERIFICATION CHECKLIST

**For HR/Privacy Officer Use:**

- [ ] Employee training file created
- [ ] Initial training completed within 30 days of hire
- [ ] Annual training due date entered in calendar
- [ ] Training materials provided to employee
- [ ] Assessment completed with passing score
- [ ] Training certificate issued (if applicable)
- [ ] Training record filed in personnel file
- [ ] Compliance database updated

**Next Training Due:** ______________

**Privacy Officer Notes:**
_________________________________________________
_________________________________________________
_________________________________________________

**Privacy Officer Signature:** _________________________________  

### TRAINING ASSESSMENT RESULTS

**Initial Training Assessment Score:** _____%  
_________________________________________________
_________________________________________________

**Areas Requiring Additional Focus:**
_________________________________________________
_________________________________________________

**Follow-up Actions Required:**
- [ ] Additional one-on-one training
- [ ] Department-specific training
- [ ] Written materials provided
- [ ] Follow-up assessment scheduled for: ______________

---

## INSTRUCTIONS FOR USE

1. **Complete for each employee** who has access to PHI

## RETENTION REQUIREMENTS

- Maintain training records for minimum 6 years after employee separation
- Include in annual HIPAA compliance reporting
- Make available for regulatory inspections
- Update form as regulations or policies change
`;
      case '/downloads/bia-worksheet-healthcare.md':
        return `
# Business Impact Analysis Worksheet for Healthcare

## ORGANIZATION INFORMATION

**Organization Name:** _________________________________  
**Completed By:** _________________________________  
**Title/Position:** _________________________________  
**Date Completed:** ______________  
**Review Date:** ______________

---

## EXECUTIVE SUMMARY

**Purpose:** This Business Impact Analysis (BIA) identifies critical business processes and systems within our healthcare organization and assesses the impact of their disruption on patient care, operations, and regulatory compliance.

**Scope:** All clinical and administrative processes that support patient care delivery and organizational operations.

---

## SECTION 1: CRITICAL BUSINESS PROCESSES

### Process Identification and Prioritization

| Process Name | Department | Process Owner | Criticality Level (1-5) | Patient Impact (1-5) | Financial Impact (1-5) |
|--------------|------------|---------------|-------------------------|---------------------|----------------------|
| Patient Registration | Front Desk | Registration Manager | 5 | 4 | 3 |
| Emergency Department Care | ED | ED Director | 5 | 5 | 4 |
| Inpatient Care | Nursing | CNO | 5 | 5 | 5 |
| Surgery Scheduling | OR | OR Manager | 5 | 5 | 5 |
| Laboratory Testing | Lab | Lab Director | 4 | 4 | 3 |
| Pharmacy Services | Pharmacy | Pharmacy Director | 5 | 5 | 4 |
| Radiology Services | Radiology | Radiology Director | 4 | 4 | 3 |
| Medical Records | HIM | HIM Director | 4 | 3 | 2 |
| Billing and Collections | Finance | CFO | 3 | 2 | 5 |
| IT Support Services | IT | CIO | 4 | 3 | 3 |

*Criticality Scale: 1=Low Impact, 2=Minor Impact, 3=Moderate Impact, 4=Major Impact, 5=Severe Impact*

---

## SECTION 2: IMPACT ANALYSIS BY TIME PERIODS

### For Each Critical Process, Complete the Following:

#### PROCESS: Patient Registration

**Maximum Tolerable Downtime (MTD):** 2 hours  

**Impact Over Time:**

| Timeframe | Patient Care Impact | Operational Impact | Financial Impact | Compliance Impact |
|-----------|--------------------|--------------------|-----------------|-------------------|
| 0-1 hours | Minor delays in admissions | Manual registration required | Minimal revenue delay | No immediate issues |
| 1-4 hours | Moderate admission delays | Significant manual workload | Registration revenue at risk | Patient wait time concerns |
| 4-8 hours | Severe admission problems | Manual systems overwhelmed | Major revenue impact | Potential quality issues |
| 8+ hours | Critical patient access issues | Operations severely impacted | Significant financial loss | Regulatory reporting issues |

#### PROCESS: Emergency Department Care

**Maximum Tolerable Downtime (MTD):** 15 minutes  

**Impact Over Time:**

| Timeframe | Patient Care Impact | Operational Impact | Financial Impact | Compliance Impact |
|-----------|--------------------|--------------------|-----------------|-------------------|
| 0-15 min | Minor care delays | Staff use manual processes | Minimal impact | Documentation delays |
| 15-30 min | Moderate safety concerns | Significant workflow disruption | ED revenue at risk | EMTALA compliance risk |
| 30-60 min | Major patient safety risk | Significant workflow disruption | Major revenue loss | Serious regulatory risk |
| 60+ min | Life-threatening situations | Crisis management required | Catastrophic loss | Regulatory violations likely |

---

## SECTION 3: TECHNOLOGY DEPENDENCIES

### Critical Systems Analysis

| System/Application | Business Process Supported | Criticality (1-5) | Current Backup Method | Backup Effectiveness (1-5) |
|-------------------|----------------------------|-------------------|----------------------|---------------------------|
| Electronic Health Record | All clinical processes | 5 | Real-time replication | 5 |
| Patient Registration System | Admission/Registration | 5 | Daily backup | 3 |
| Laboratory Information System | Lab testing | 4 | Nightly backup | 4 |
| Pharmacy Management System | Medication management | 5 | Real-time backup | 4 |
| Picture Archiving System | Radiology services | 4 | Daily backup | 4 |
| Financial Management System | Billing/Collections | 3 | Nightly backup | 3 |
| Network Infrastructure | All systems | 5 | Redundant systems | 4 |
| Telecommunications | Communication | 4 | Cell phone backup | 3 |

---

## SECTION 4: RESOURCE REQUIREMENTS

### Staffing Requirements During Disruption

| Process | Normal Staffing | Emergency Staffing | Additional Skills Needed | Cross-Training Status |
|---------|----------------|-------------------|-------------------------|----------------------|
| Patient Registration | 5 FTE | 8 FTE | Manual registration | 50% trained |
| Emergency Care | 15 FTE | 20 FTE | Manual documentation | 75% trained |
| Laboratory | 10 FTE | 12 FTE | Manual result reporting | 60% trained |
| Pharmacy | 8 FTE | 10 FTE | Manual dispensing | 80% trained |
| IT Support | 3 FTE | 6 FTE | Emergency procedures | 40% trained |

### Alternative Facilities and Equipment

| Process | Primary Location | Alternative Location | Equipment Requirements | Setup Time |
|---------|-----------------|---------------------|----------------------|------------|
| Registration | Main lobby | Cafeteria area | Laptops, forms | 30 minutes |
| Laboratory | Main lab | Satellite lab | Portable analyzers | 2 hours |
| Radiology | Main radiology | Mobile unit | Portable X-ray | 4 hours |
| Surgery | Main OR | Outpatient OR | Full surgical equipment | 6 hours |

---

## SECTION 5: INTERDEPENDENCIES

### Internal Dependencies

| Primary Process | Dependent Process | Impact of Disruption | Mitigation Strategy |
|----------------|------------------|--------------------|--------------------|
| Patient Registration | All clinical services | Cannot identify patients | Manual ID procedures |
| Network | All electronic systems | Complete system failure | Manual processes |
| Laboratory | Clinical decision making | Delayed diagnoses | Stat lab procedures |
| Pharmacy | Medication administration | Patient safety risk | Emergency drug supply |

### External Dependencies

| Process | External Dependency | Provider | Impact if Unavailable | Alternative Solution |
|---------|-------------------|----------|---------------------|---------------------|
| Laboratory | Reference lab testing | Quest Diagnostics | Delayed results | Secondary lab contract |
| Pharmacy | Drug supply | Cardinal Health | Medication shortages | Emergency suppliers |
| IT Systems | Internet connectivity | Verizon | Cloud access lost | Secondary ISP |
| Communications | Phone service | AT&T | Communication breakdown | Cell phones |

---

## SECTION 6: COMPLIANCE AND REGULATORY IMPACT

### Regulatory Requirements Analysis

| Regulation | Affected Processes | Impact of Non-Compliance | Reporting Requirements | Fines/Penalties |
|------------|-------------------|--------------------------|----------------------|-----------------|
| HIPAA | All PHI processes | Privacy violations | Breach notification | Up to $1.5M per incident |
| EMTALA | Emergency services | Patient dumping violations | CMS reporting | Loss of Medicare |
| Joint Commission | All clinical processes | Accreditation loss | Sentinel event reporting | Loss of accreditation |
| State Licensing | All clinical processes | License suspension | State reporting | Facility closure |
| CMS CoPs | All Medicare patients | Certification loss | Immediate reporting | Loss of Medicare |

---

## SECTION 7: FINANCIAL IMPACT ASSESSMENT

### Revenue at Risk Analysis

| Time Period | Daily Revenue at Risk | Process/Service | Calculation Basis |
|-------------|----------------------|-----------------|------------------|
| 0-4 hours | $50,000 | Outpatient services | Average daily revenue |
| 4-8 hours | $150,000 | All scheduled procedures | Procedure cancellations |
| 8-24 hours | $500,000 | Emergency and inpatient | Full service disruption |
| 1-3 days | $2,000,000 | Total operations | Complete shutdown |

### Additional Costs During Disruption

| Cost Category | Estimated Cost | Description |
|---------------|---------------|-------------|
| Overtime Staffing | $25,000/day | Additional staff for manual processes |
| Alternative Services | $50,000/day | Outsourcing critical services |
| Patient Diversions | $100,000/day | Lost revenue from diversions |
| Recovery Costs | $200,000 | System restoration and data recovery |
| Regulatory Fines | $500,000 | Potential compliance violations |

---

## SECTION 8: RECOVERY STRATEGIES

### Immediate Response (0-4 hours)

| Action Item | Responsible Party | Timeline | Resources Required |
|-------------|------------------|----------|-------------------|
| Activate incident command | Administrator | 15 minutes | Command center |
| Switch to manual processes | Department heads | 30 minutes | Pre-positioned supplies |
| Notify key stakeholders | Communications | 1 hour | Contact lists |
| Assess system damage | IT Director | 2 hours | Technical staff |
| Implement workarounds | All departments | 4 hours | Trained personnel |

### Short-term Recovery (4-24 hours)

| Action Item | Responsible Party | Timeline | Resources Required |
|-------------|------------------|----------|-------------------|
| Restore critical systems | IT Team | 8 hours | Backup systems |
| Resume normal operations | Department heads | 12 hours | Full staffing |
| Update stakeholders | Communications | Ongoing | Communication plan |
| Document lessons learned | Quality team | 24 hours | Documentation tools |

### Long-term Recovery (1-7 days)

| Action Item | Responsible Party | Timeline | Resources Required |
|-------------|------------------|----------|-------------------|
| Full system restoration | IT Team | 3 days | Vendor support |
| Process improvements | All departments | 7 days | Change management |
| Training updates | Education team | 7 days | Training materials |
| Plan updates | BCP coordinator | 7 days | Analysis results |

---

## SECTION 9: RECOMMENDATIONS AND NEXT STEPS

### Priority Improvements

1. **High Priority:**
   - Implement real-time backup for patient registration system
   - Increase cross-training for manual processes
   - Establish secondary internet connectivity

2. **Medium Priority:**
   - Upgrade laboratory backup procedures
   - Enhance emergency communication capabilities
   - Develop vendor backup agreements

3. **Low Priority:**
   - Improve financial system recovery procedures
   - Enhance physical security backup systems
   - Expand alternative facility capabilities

### Implementation Plan

| Recommendation | Responsible Party | Timeline | Budget Required | Success Metrics |
|----------------|------------------|----------|----------------|-----------------|
| System backup improvements | IT Director | 3 months | $100,000 | RTO <30 minutes |
| Staff cross-training | HR Director | 6 months | $50,000 | 80% staff trained |
| Vendor agreements | Procurement | 4 months | $25,000 | 5 backup vendors |

---

## SECTION 10: APPROVAL AND MAINTENANCE

### Review and Approval

**Prepared By:** _________________________________  

**Reviewed By:** _________________________________  

**Approved By:** _________________________________  

### Maintenance Schedule

- **Annual Review:** [Date]
- **Semi-Annual Update:** [Date]
- **Post-Incident Review:** As needed
- **Regulatory Change Review:** As required

### Document Control

- **Version:** 1.0
- **Last Updated:** [Date]
- **Next Review:** [Date]
- **Distribution:** Executive team, Department heads, BCP team

---

## APPENDIX A: CONTACT INFORMATION

### Emergency Contacts

**Internal Contacts:**
- CEO: [Name, Phone]
- CIO: [Name, Phone]
- Facilities: [Name, Phone]

**External Contacts:**
- Primary ISP: [Company, Phone]
- Backup Systems Vendor: [Company, Phone]
- Emergency Services: 911

## APPENDIX B: PROCESS FLOW DIAGRAMS

[Include detailed process flows for critical processes]

## APPENDIX C: SYSTEM ARCHITECTURE DIAGRAMS

[Include network and system architecture diagrams]
`;
      case '/downloads/continuity-plan-template-healthcare.md':
        return `
# Healthcare Business Continuity Plan Template

## EXECUTIVE SUMMARY

**Organization:** [Healthcare Organization Name]  

### Purpose
This Business Continuity Plan (BCP) ensures the continuation of essential healthcare services during and after disruptive events, prioritizing patient safety and regulatory compliance.

### Scope
Covers all critical healthcare operations including:
- Emergency services
- Inpatient care
- Outpatient services
- Laboratory and diagnostic services
- Pharmacy operations
- Information technology systems
- Support services

---

## TABLE OF CONTENTS

1. [Plan Activation](#plan-activation)

---

## PLAN ACTIVATION

### Activation Authority

**Primary Authority:** Chief Executive Officer  

### Activation Process

1. **Immediate (0-15 minutes):**
2. **Short-term (15-60 minutes):**
3. **Sustained (1+ hours):**

### Activation Triggers

**Automatic Activation Events:**
- Complete power failure lasting >30 minutes
- Total IT system failure affecting EHR
- Natural disasters (earthquake, hurricane, flood)
- Fire requiring facility evacuation
- Terrorist attacks or security threats
- Pandemic with significant staff shortages

**Assessment-Required Events:**
- Partial system failures
- Limited facility damage
- Staff shortages <25%
- Supply chain disruptions
- Utility outages (partial)
- Cyber security incidents

---

## EMERGENCY RESPONSE TEAM

### Command Structure

**Incident Commander:** CEO or designee  

### Team Responsibilities

#### Incident Commander
- Overall incident management
- External communication coordination
- Resource authorization
- Final decision-making authority

#### Operations Chief
- Clinical operations oversight
- Patient care coordination
- Staff deployment
- Medical decision support

#### Planning Chief
- Situation assessment
- Recovery planning
- Documentation
- Regulatory reporting

#### Logistics Chief
- IT systems management
- Supply procurement
- Facility management
- Transportation coordination

### Contact Information

| Position | Primary Contact | Phone | Backup Contact | Phone |
|----------|----------------|--------|----------------|--------|
| CEO | [Name] | [Phone] | [Name] | [Phone] |
| COO | [Name] | [Phone] | [Name] | [Phone] |
| CMO | [Name] | [Phone] | [Name] | [Phone] |
| CFO | [Name] | [Phone] | [Name] | [Phone] |
| CIO | [Name] | [Phone] | [Name] | [Phone] |

---

## RISK ASSESSMENT

### Identified Risks and Likelihood

| Risk Category | Specific Risk | Likelihood | Impact | Priority |
|---------------|--------------|------------|---------|----------|
| Natural Disasters | Hurricane | Medium | High | High |
| Technology | IT System Failure | High | High | Critical |
| Infrastructure | Power Outage | Medium | Medium | Medium |
| Human Resources | Staff Shortage | Medium | High | High |
| Security | Cyber Attack | High | High | Critical |
| Supply Chain | Medical Supply Shortage | Medium | Medium | Medium |
| Public Health | Pandemic | Medium | High | High |
| Facility | Equipment Failure | High | Medium | Medium |

### Risk Mitigation Measures

**Technology Risks:**
- Redundant systems and failover capabilities
- Regular data backups and testing
- Cybersecurity monitoring and response
- Vendor support agreements

**Natural Disaster Risks:**
- Emergency generator systems
- Structural assessments and upgrades
- Emergency supply stockpiles
- Evacuation procedures

**Human Resource Risks:**
- Cross-training programs
- Surge staffing agreements
- Employee health monitoring
- Remote work capabilities

---

## CRITICAL OPERATIONS

### Tier 1: Life-Critical Operations (RTO: <15 minutes)

**Emergency Department**
- **Normal Capacity:** 50 patients/day
- **Minimum Capacity:** 25 patients/day
- **Staffing Required:** 2 physicians, 6 nurses, 2 technicians
- **Key Dependencies:** EHR, Laboratory, Pharmacy, Radiology
- **Manual Workarounds:** Paper charts, phone communication

**Intensive Care Unit**
- **Normal Capacity:** 20 beds
- **Minimum Capacity:** 15 beds
- **Staffing Required:** 1 physician, 8 nurses, 2 respiratory therapists
- **Key Dependencies:** Monitoring systems, Ventilators, Pharmacy
- **Manual Workarounds:** Portable monitors, manual ventilation

**Operating Rooms**
- **Normal Capacity:** 8 rooms
- **Minimum Capacity:** 4 rooms (emergency only)
- **Staffing Required:** 4 surgeons, 8 OR nurses, 2 anesthesiologists
- **Key Dependencies:** Anesthesia equipment, Sterilization, Blood bank
- **Manual Workarounds:** Emergency surgical kits, manual monitoring

### Tier 2: Essential Operations (RTO: <2 hours)

**Inpatient Units**
- **Normal Capacity:** 200 beds
- **Minimum Capacity:** 150 beds
- **Staffing Required:** 20 nurses, 5 physicians, 10 support staff
- **Key Dependencies:** EHR, Pharmacy, Laboratory, Nutrition
- **Manual Workarounds:** Paper medication records, manual vital signs

**Laboratory Services**
- **Normal Capacity:** 500 tests/day
- **Minimum Capacity:** 200 critical tests/day
- **Staffing Required:** 5 technologists, 1 pathologist
- **Key Dependencies:** Laboratory equipment, EHR interface
- **Manual Workarounds:** Point-of-care testing, manual result reporting

**Pharmacy Services**
- **Normal Capacity:** 1000 prescriptions/day
- **Minimum Capacity:** 400 critical medications/day
- **Staffing Required:** 3 pharmacists, 5 technicians
- **Key Dependencies:** Pharmacy system, EHR, Suppliers
- **Manual Workarounds:** Emergency drug supply, manual dispensing

### Tier 3: Important Operations (RTO: <8 hours)

**Outpatient Clinics**
- **Normal Capacity:** 300 appointments/day
- **Minimum Capacity:** 100 urgent appointments/day
- **Staffing Required:** 10 providers, 15 support staff
- **Key Dependencies:** Scheduling system, EHR, Patient registration
- **Manual Workarounds:** Paper scheduling, walk-in clinics

**Radiology Services**
- **Normal Capacity:** 150 studies/day
- **Minimum Capacity:** 50 critical studies/day
- **Staffing Required:** 3 radiologists, 8 technologists
- **Key Dependencies:** Imaging equipment, PACS, EHR
- **Manual Workarounds:** Portable X-ray, film processing

---

## RECOVERY PROCEDURES

### Phase 1: Immediate Response (0-4 hours)

**Hour 0-1: Emergency Response**
1. Activate incident command system

**Hour 1-2: Stabilization**
1. Secure affected areas

**Hour 2-4: Initial Recovery**
1. Begin restoration of critical systems

### Phase 2: Short-term Recovery (4-72 hours)

**Priority Actions:**
- Restore primary IT systems
- Resume normal staffing patterns
- Restock emergency supplies
- Conduct damage assessment
- Plan for long-term recovery

**Success Criteria:**
- All life-critical functions operational
- Patient safety maintained
- Regulatory compliance achieved
- Communication systems restored

### Phase 3: Long-term Recovery (72+ hours)

**Priority Actions:**
- Full system restoration
- Return to normal operations
- Conduct lessons learned review
- Update continuity plans
- Rebuild emergency reserves

**Success Criteria:**
- All services at normal capacity
- All systems fully functional
- Staff welfare addressed
- Financial stability maintained

---

## COMMUNICATION PLAN

### Internal Communication

**Staff Notification Methods:**
- Hospital-wide PA system
- Email alerts
- Text message system
- Department phone trees
- Mobile app notifications

**Communication Priorities:**

### External Communication

**Regulatory Bodies:**
- State Health Department
- Joint Commission
- Centers for Medicare & Medicaid Services
- Local Emergency Management

**Media Relations:**
- Designated spokesperson: [Name, Title]
- Pre-approved messaging templates
- Regular update schedule
- Social media monitoring

**Patient/Family Communication:**
- Patient notification procedures
- Family communication center
- Visitor restriction notifications
- Discharge planning updates

### Communication Templates

**Staff Alert Template:**
\`\`\`
ALERT: [Emergency Type] - [Date/Time]
STATUS: [Active/Resolved]
IMPACT: [Brief description]
ACTIONS: [What staff should do]
CONTACT: [Emergency hotline]
\`\`\`

**Patient/Family Template:**
\`\`\`
Dear Patients and Families,
[Hospital Name] is experiencing [brief description of situation].
Patient care continues safely with these precautions:
[List precautions/changes]
For updates: [contact information]
\`\`\`

---

## RESOURCE REQUIREMENTS

### Staffing Resources

**Emergency Staffing Pool:**
- Cross-trained clinical staff: 50 personnel
- Administrative support: 20 personnel
- Facilities/IT support: 15 personnel
- Security personnel: 10 personnel

**Surge Staffing Agreements:**
- Nursing agency contracts
- Physician locum tenens
- Support staff agencies
- Retired employee recall

### Physical Resources

**Emergency Supplies (72-hour supply):**
- Medical supplies and medications
- Food and water for patients/staff
- Backup power fuel
- Communication equipment
- Security supplies

**Alternative Facilities:**
- Offsite clinic locations
- Mobile medical units
- Partner hospital agreements
- Temporary treatment areas

### Technology Resources

**Backup Systems:**
- Redundant data centers
- Mobile IT units
- Satellite communication
- Emergency power systems
- Paper-based procedures

**Vendor Agreements:**
- IT support contracts
- Medical equipment service
- Telecommunications support
- Emergency transportation
- Security services

---

## TESTING AND TRAINING

### Training Program

**Annual Requirements:**
- All staff: 4 hours general emergency training
- Key personnel: 8 hours specialized training
- Leadership team: 16 hours incident command training
- New employees: Emergency training within 30 days

**Training Methods:**
- Classroom instruction
- Online modules
- Tabletop exercises
- Simulation drills
- Cross-training programs

### Testing Schedule

**Quarterly Tests:**
- Communication systems
- Emergency notification
- Key personnel contact
- Backup power systems

**Semi-Annual Tests:**
- Department-specific procedures
- IT system failover
- Emergency supplies inventory
- Vendor response capabilities

**Annual Tests:**
- Full-scale exercise
- Multi-department coordination
- External agency involvement
- Complete plan review

### Documentation Requirements

**Training Records:**
- Attendance tracking
- Competency assessments
- Certification maintenance
- Performance evaluations

**Test Results:**
- Exercise reports
- System test logs
- Performance metrics
- Improvement recommendations

---

## PLAN MAINTENANCE

### Review Schedule

**Monthly Reviews:**
- Contact information updates
- Supply inventory checks
- System performance monitoring
- Vendor agreement status

**Quarterly Reviews:**
- Risk assessment updates
- Procedure modifications
- Training effectiveness
- Resource adequacy

**Annual Reviews:**
- Complete plan revision
- Regulatory compliance check
- Cost-benefit analysis
- Strategic alignment

### Update Procedures

**Change Management:**
- Document all modifications
- Obtain appropriate approvals
- Distribute updated sections
- Train staff on changes
- Track implementation

**Version Control:**
- Maintain master document
- Track all revisions
- Archive previous versions
- Control distribution
- Update references

---

## APPENDICES

### Appendix A: Emergency Contact Lists
[Detailed contact information for all key personnel and external agencies]

### Appendix B: Facility Maps and Evacuation Routes
[Floor plans with emergency exits, utility shutoffs, and assembly areas]

### Appendix C: Vendor Contact Information
[Complete list of critical vendors with 24/7 contact information]

### Appendix D: Regulatory Reporting Requirements
[Templates and procedures for required regulatory notifications]

### Appendix E: Media Communication Templates
[Pre-approved messages for various emergency scenarios]

### Appendix F: Equipment and Supply Inventories
[Lists of emergency supplies and their locations]

### Appendix G: IT System Recovery Procedures
[Detailed technical procedures for system restoration]

---

## APPROVAL AND AUTHORIZATION

**Plan Approved By:**

CEO Signature: _________________________ Date: _________

COO Signature: _________________________ Date: _________

Board Chair Signature: _________________ Date: _________

**Distribution List:**
- Executive team
- Department heads  
- Emergency response team
- Board of directors
- Regulatory agencies (as required)

**Document Control:**
- Version: 1.0
- Effective Date: [Date]
- Review Date: [Date + 1 year]
- Owner: [Emergency Management Coordinator]
`;
      case '/downloads/ransomware-response-playbook.md':
        return `
# Ransomware Response Playbook for Healthcare

## EXECUTIVE SUMMARY

**Purpose:** Provide immediate response procedures for ransomware incidents in healthcare environments  

⚠️ **CRITICAL:** Ransomware can be life-threatening in healthcare settings. Patient safety is the top priority.

---

## TABLE OF CONTENTS

1. [Immediate Response (0-1 Hour)](#immediate-response)

---

## IMMEDIATE RESPONSE (0-1 Hour)

### 🚨 STEP 1: ENSURE PATIENT SAFETY (0-5 minutes)

**Life Safety Priority Actions:**
- [ ] Verify critical life support systems are functioning
- [ ] Check patient monitoring systems (ICU, OR, ED)
- [ ] Activate manual procedures for medication administration
- [ ] Implement paper charting for critical patients
- [ ] Notify clinical staff of system unavailability

**Emergency Contact:**
- Clinical Engineering: ext. 5555
- Nursing Supervisors: ext. 6666
- Emergency Department: ext. 7777

### 🔍 STEP 2: CONFIRM RANSOMWARE (5-10 minutes)

**Identification Indicators:**
- [ ] Ransom note displayed on screens
- [ ] Files encrypted with unusual extensions (.locked, .encrypted, etc.)
- [ ] System performance severely degraded
- [ ] Unable to access network drives or databases
- [ ] Suspicious network activity or unknown processes

**Documentation:**
- Time of discovery: ________________
- First affected system: ________________
- Person who discovered: ________________
- Systems confirmed affected: ________________

### 🚨 STEP 3: ACTIVATE INCIDENT RESPONSE (10-15 minutes)

**Immediate Notifications:**
- [ ] CIO/IT Director: [Phone Number]
- [ ] CEO/Administrator: [Phone Number]  
- [ ] Privacy Officer: [Phone Number]
- [ ] Legal Counsel: [Phone Number]
- [ ] Cyber Insurance Carrier: [Phone Number]

**Incident Commander:** ________________  

### 🛑 STEP 4: CONTAIN THE THREAT (15-30 minutes)

**Network Isolation:**
- [ ] Disconnect affected systems from network immediately
- [ ] Shut down wireless access points if necessary
- [ ] Isolate network segments (clinical vs. administrative)
- [ ] Power down non-critical systems
- [ ] Preserve evidence on infected machines

**Critical System Protection:**
- [ ] Verify EHR system status and isolate if needed
- [ ] Protect backup systems and take offline
- [ ] Secure patient monitoring systems
- [ ] Isolate medical device networks

### 📞 STEP 5: EXTERNAL NOTIFICATIONS (30-60 minutes)

**Law Enforcement:**
- [ ] FBI Internet Crime Complaint Center (IC3)
- [ ] Local FBI Field Office: [Phone Number]
- [ ] Local Police (if appropriate)

**Regulatory Bodies:**
- [ ] State Health Department: [Phone Number]
- [ ] Joint Commission (if applicable)
- [ ] HHS OCR (if PHI breach suspected)

**Vendors and Partners:**
- [ ] Primary IT vendor/MSP
- [ ] Security incident response firm
- [ ] Cyber insurance carrier
- [ ] Critical business associates

---

## ASSESSMENT PHASE (1-4 Hours)

### 🔍 STEP 6: DAMAGE ASSESSMENT

**Scope Determination:**
- [ ] Map all affected systems and networks
- [ ] Identify encrypted vs. accessible data
- [ ] Assess backup system integrity
- [ ] Determine clinical operation impact
- [ ] Evaluate patient data exposure risk

**Systems Assessment Checklist:**

| System | Status | Impact Level | Recovery Priority |
|--------|--------|--------------|------------------|
| Electronic Health Record | [ ] Affected [ ] Clean | [ ] High [ ] Medium [ ] Low | [ ] 1 [ ] 2 [ ] 3 |
| Patient Registration | [ ] Affected [ ] Clean | [ ] High [ ] Medium [ ] Low | [ ] 1 [ ] 2 [ ] 3 |
| Laboratory System | [ ] Affected [ ] Clean | [ ] High [ ] Medium [ ] Low | [ ] 1 [ ] 2 [ ] 3 |
| Pharmacy System | [ ] Affected [ ] Clean | [ ] High [ ] Medium [ ] Low | [ ] 1 [ ] 2 [ ] 3 |
| Radiology/PACS | [ ] Affected [ ] ] Clean | [ ] High [ ] Medium [ ] Low | [ ] 1 [ ] 2 [ ] 3 |
| Financial Systems | [ ] Affected [ ] Clean | [ ] High [ ] Medium [ ] Low | [ ] 1 [ ] 2 [ ] 3 |
| Email System | [ ] Affected [ ] Clean | [ ] High [ ] Medium [ ] Low | [ ] 1 [ ] 2 [ ] 3 |
| Phone System | [ ] Affected [ ] Clean | [ ] High [ ] Medium [ ] Low | [ ] 1 [ ] 2 [ ] 3 |

### 🔬 STEP 7: TECHNICAL ANALYSIS

**Forensic Preservation:**
- [ ] Create forensic images of infected systems
- [ ] Document network traffic and logs
- [ ] Preserve ransom notes and communications
- [ ] Identify attack vector and timeline
- [ ] Analyze malware type and encryption

**Recovery Feasibility:**
- [ ] Test backup system integrity
- [ ] Assess decryption tool availability  
- [ ] Estimate recovery time for each system
- [ ] Identify dependencies and prerequisites
- [ ] Calculate total recovery timeline

### 📊 STEP 8: BUSINESS IMPACT ANALYSIS

**Patient Care Impact:**
- Number of patients affected: ________________
- Critical procedures postponed: ________________
- Patient safety incidents: ________________
- Manual procedure effectiveness: ________________

**Operational Impact:**
- Revenue at risk per day: $________________
- Staff overtime requirements: ________________
- Patient diversion necessity: ________________
- Regulatory compliance risk: ________________

---

## CONTAINMENT PHASE (4-8 Hours)

### 🏥 STEP 9: ACTIVATE MANUAL PROCEDURES

**Clinical Downtime Procedures:**
- [ ] Distribute paper charts and forms
- [ ] Activate phone tree for critical communications
- [ ] Implement manual medication administration records
- [ ] Establish manual patient tracking
- [ ] Set up paper-based lab result reporting

**Resource Deployment:**
- [ ] Deploy additional IT staff
- [ ] Activate cross-trained clinical staff
- [ ] Coordinate with partner organizations
- [ ] Arrange for temporary equipment if needed
- [ ] Implement extended work schedules

### 🔐 STEP 10: SECURITY HARDENING

**Immediate Security Measures:**
- [ ] Reset all administrative passwords
- [ ] Disable remote access capabilities
- [ ] Update firewall rules
- [ ] Implement additional monitoring
- [ ] Patch critical vulnerabilities

**Evidence Preservation:**
- [ ] Secure infected systems for investigation
- [ ] Document all response actions
- [ ] Maintain chain of custody logs
- [ ] Preserve network logs and alerts
- [ ] Photograph ransom notes and screens

### 🔍 STEP 11: THREAT HUNTING

**Network Scanning:**
- [ ] Scan for additional compromised systems
- [ ] Check for lateral movement indicators
- [ ] Verify integrity of backup systems
- [ ] Review user account activities
- [ ] Analyze network traffic patterns

**Malware Analysis:**
- [ ] Identify ransomware variant
- [ ] Check for known decryption tools
- [ ] Analyze encryption strength
- [ ] Determine payment demand details
- [ ] Research similar attacks

---

## RECOVERY PHASE (8+ Hours)

### 💾 STEP 12: BACKUP VERIFICATION AND RESTORATION

**Backup Assessment:**
- [ ] Verify backup system integrity
- [ ] Test backup restoration procedures
- [ ] Identify most recent clean backups
- [ ] Calculate data loss window
- [ ] Plan restoration sequence

**Restoration Priorities:**

1. **Essential Systems (8-24 hours):**
2. **Important Systems (24-72 hours):**

### 🖥️ STEP 13: SYSTEM REBUILDING

**Clean Room Approach:**
- [ ] Build isolated recovery environment
- [ ] Install systems from clean media
- [ ] Apply all security patches
- [ ] Restore data from verified clean backups
- [ ] Test system functionality

**Security Validation:**
- [ ] Perform malware scanning
- [ ] Validate user access controls
- [ ] Test security monitoring
- [ ] Verify network segmentation
- [ ] Confirm endpoint protection

### ✅ STEP 14: OPERATIONAL TESTING

**System Validation:**
- [ ] Test critical workflows
- [ ] Verify data integrity
- [ ] Confirm interface connectivity
- [ ] Test backup and recovery procedures
- [ ] Validate user access and permissions

**User Acceptance Testing:**
- [ ] Clinical workflow testing
- [ ] Administrative function testing
- [ ] Integration testing
- [ ] Performance testing
- [ ] Security testing

---

## COMMUNICATION PROCEDURES

### 📢 INTERNAL COMMUNICATIONS

**Staff Communication Plan:**

| Audience | Method | Frequency | Responsible Party |
|----------|--------|-----------|------------------|
| Clinical Staff | Email/PA | Every 2 hours | Chief Medical Officer |
| Administrative Staff | Email | Every 4 hours | Chief Operating Officer |
| IT Staff | Secure messaging | Every hour | Chief Information Officer |
| Executive Team | Conference call | Every 2 hours | Chief Executive Officer |
| Board of Directors | Email/Call | Daily | Chief Executive Officer |

**Message Templates:**

**Initial Staff Alert:**
\`\`\`
URGENT: System Security Incident
Time: [timestamp]
Impact: IT systems unavailable - use manual procedures
Actions: Follow downtime protocols, do not attempt system access
Updates: Every 2 hours
Contact: [emergency number]
\`\`\`

**Patient/Family Communication:**
\`\`\`
[Organization] is experiencing technical difficulties with computer systems.
Patient care continues safely with backup procedures.
Appointments may be delayed - we will contact you directly.
For urgent needs: [phone number]
Updates: [website/phone number]
\`\`\`

### 📺 EXTERNAL COMMUNICATIONS

**Media Relations:**
- Designated spokesperson: ________________
- Approved messaging only
- Coordinate with legal counsel
- Monitor social media
- Document all media interactions

**Regulatory Notifications:**
- HHS OCR: Within 60 days if PHI breach confirmed
- State health department: As required by state law
- Joint Commission: If patient safety affected
- Law enforcement: Ongoing cooperation

### 📋 DECISION MATRIX

**Payment Decision Framework:**

| Factor | Weight | Score (1-5) | Notes |
|--------|--------|-------------|-------|
| Patient safety impact | 5x | ___ | Life-threatening situations |
| Data recovery feasibility | 4x | ___ | Availability of backups |
| Financial impact | 3x | ___ | Cost vs. ransom amount |
| Timeline pressure | 3x | ___ | Critical deadlines |
| Legal/ethical concerns | 4x | ___ | FBI guidance, policy |
| Insurance coverage | 2x | ___ | Coverage for payments |

**Decision Authority:**
- CEO approval required for payments >$50,000
- Board notification required for payments >$100,000
- Legal counsel consultation mandatory

**Documentation Requirements:**
- [ ] Decision rationale documented
- [ ] Approvals obtained and recorded
- [ ] Legal review completed
- [ ] Insurance notification made
- [ ] Board notification (if required)

---

## PREVENTION MEASURES

### 🛡️ TECHNICAL CONTROLS

**Essential Security Measures:**
- [ ] Implement network segmentation
- [ ] Deploy endpoint detection and response (EDR)
- [ ] Maintain offline/immutable backups
- [ ] Enable email security filtering
- [ ] Implement privileged access management
- [ ] Deploy application whitelisting
- [ ] Maintain current patch management

**Medical Device Security:**
- [ ] Inventory all connected medical devices
- [ ] Implement device network segmentation
- [ ] Monitor device communications
- [ ] Coordinate with biomedical engineering
- [ ] Maintain device security patches

### 👥 ADMINISTRATIVE CONTROLS

**Training and Awareness:**
- Monthly security awareness training
- Phishing simulation exercises
- Incident response drills
- Role-specific security training
- Vendor security requirements

**Policies and Procedures:**
- Incident response procedures
- Business continuity planning
- Vendor risk management
- Data backup and recovery
- Remote access controls

### 🔐 PHYSICAL CONTROLS

**Access Controls:**
- Restricted server room access
- Workstation security cables
- Clean desk policies
- Visitor access controls
- Security camera monitoring

---

## POST-INCIDENT ACTIVITIES

### 📝 LESSONS LEARNED

**After Action Review:**
- [ ] Conduct incident timeline analysis
- [ ] Identify response strengths and weaknesses
- [ ] Document lessons learned
- [ ] Update response procedures
- [ ] Revise training programs

**Improvements Implementation:**
- [ ] Update security technologies
- [ ] Revise policies and procedures
- [ ] Enhance staff training
- [ ] Improve backup procedures
- [ ] Strengthen vendor management

### 📊 REPORTING AND COMPLIANCE

**Internal Reporting:**
- [ ] Executive summary report
- [ ] Board presentation
- [ ] Department briefings
- [ ] Cost impact analysis
- [ ] Timeline documentation

**External Reporting:**
- [ ] Regulatory notifications
- [ ] Insurance claims
- [ ] Law enforcement cooperation
- [ ] Audit requirements
- [ ] Legal documentation

---

## EMERGENCY CONTACTS

### 🚨 CRITICAL CONTACTS

**Internal Emergency Contacts:**
- CEO: [Name, Phone, Alt Phone]
- CIO: [Name, Phone, Alt Phone]  
- CMO: [Name, Phone, Alt Phone]
- Privacy Officer: [Name, Phone, Alt Phone]
- Legal Counsel: [Name, Phone, Alt Phone]

**External Emergency Contacts:**
- FBI Cyber Division: 855-292-3937
- CISA: 888-282-0870
- Cyber Insurance: [Carrier, Phone, Policy #]
- IT Security Vendor: [Company, Phone]
- Legal Counsel: [Firm, Phone]

### 🏥 CLINICAL EMERGENCY CONTACTS

**Department Heads:**
- Emergency Department: [Name, Phone]
- Intensive Care Unit: [Name, Phone]
- Operating Room: [Name, Phone]
- Laboratory: [Name, Phone]
- Pharmacy: [Name, Phone]

**On-Call Numbers:**
- Administrator on Call: [Phone]
- IT Support: [Phone]
- Clinical Engineering: [Phone]
- Facilities: [Phone]
- Security: [Phone]

---

## APPENDICES

### Appendix A: Ransom Note Examples

---

**Document Control:**
- **Version:** 2.0
- **Last Updated:** [Date]
- **Next Review:** [Date + 6 months]
- **Owner:** Chief Information Officer
- **Classification:** CONFIDENTIAL - Internal Use Only
`;
      case '/downloads/patient-data-backup-strategy-guide.md':
        return `
# Patient Data Backup Strategy Guide for Healthcare

## EXECUTIVE SUMMARY

**Purpose:** Establish comprehensive backup and recovery strategies to protect patient data and ensure healthcare continuity  

---

## TABLE OF CONTENTS

1. [Regulatory Requirements](#regulatory-requirements)

---

## REGULATORY REQUIREMENTS

### HIPAA Security Rule Mandates

**§ 164.308(a)(7) - Contingency Plan (Required)**
- Implement procedures for responding to emergencies or other occurrences
- Establish data backup procedures to create and maintain exact copies of ePHI
- Develop disaster recovery procedures to restore any loss of data

**§ 164.308(a)(7)(ii)(A) - Data Backup Plan (Required)**
- Create and maintain retrievable exact copies of electronic PHI
- Establish procedures to create backup copies of electronic PHI before equipment is moved
- Test backup procedures to ensure electronic PHI can be exactly restored

**§ 164.308(a)(7)(ii)(B) - Disaster Recovery Plan (Required)**
- Establish procedures to restore any loss of data
- Document procedures for continuing to protect the security of electronic PHI while operating in emergency mode

### Additional Regulatory Considerations

**HITECH Act Requirements:**
- Breach notification requirements if backup data is compromised
- Enhanced penalties for data loss incidents
- Business associate liability for backup services

**State Regulations:**
- Medical record retention requirements (typically 7-10 years)
- Specific requirements for mental health and substance abuse records
- Data residency requirements for certain states

**Joint Commission Requirements:**
- Information management standards (IM.02.02.01)
- Patient safety requirements for data availability
- Disaster preparedness standards

---

## BACKUP STRATEGY FRAMEWORK

### Recovery Objectives

**Recovery Time Objective (RTO):** Maximum acceptable downtime
- **Critical Systems (EHR, Patient Monitoring):** < 1 hour
- **Essential Systems (Lab, Pharmacy):** < 4 hours  
- **Important Systems (Scheduling, Billing):** < 24 hours
- **Standard Systems (Archive, Reporting):** < 72 hours

**Recovery Point Objective (RPO):** Maximum acceptable data loss
- **Critical Patient Data:** < 15 minutes
- **Clinical Documentation:** < 1 hour
- **Administrative Data:** < 8 hours
- **Historical Archive Data:** < 24 hours

### 3-2-1-1-0 Backup Rule for Healthcare

**3** copies of critical data (production + 2 backups)  

---

## DATA CLASSIFICATION

### Tier 1: Critical Patient Care Data

**Data Types:**
- Electronic Health Records (EHR)
- Patient monitoring data
- Medication administration records
- Laboratory results
- Radiology images and reports

**Backup Requirements:**
- **Frequency:** Continuous or every 15 minutes
- **Retention:** 10 years minimum
- **Recovery Priority:** Highest
- **Encryption:** Required at rest and in transit
- **Testing:** Monthly recovery testing

### Tier 2: Essential Clinical Data

**Data Types:**
- Scheduling and registration
- Clinical communication systems
- Pharmacy management
- Quality assurance data
- Clinical decision support

**Backup Requirements:**
- **Frequency:** Every 1-4 hours
- **Retention:** 7 years
- **Recovery Priority:** High
- **Encryption:** Required
- **Testing:** Quarterly recovery testing

### Tier 3: Administrative Data

**Data Types:**
- Financial systems
- Human resources data
- Facilities management
- Supply chain management
- Marketing systems

**Backup Requirements:**
- **Frequency:** Daily
- **Retention:** 5-7 years
- **Recovery Priority:** Medium
- **Encryption:** Recommended
- **Testing:** Semi-annual testing

### Tier 4: Archive and Historical Data

**Data Types:**
- Long-term medical records
- Research data
- Historical reporting
- Archived communications
- Legacy system data

**Backup Requirements:**
- **Frequency:** Weekly or after changes
- **Retention:** Permanent or per legal requirements
- **Recovery Priority:** Low
- **Encryption:** Required for PHI
- **Testing:** Annual testing

---

## BACKUP TECHNOLOGIES

### Local Backup Solutions

#### Disk-Based Backup
**Pros:**
- Fast backup and recovery
- Easy to manage and monitor
- Good for frequent restores
- Supports incremental backups

**Cons:**
- Higher cost per GB
- Vulnerable to local disasters
- Limited long-term retention
- Single point of failure

**Healthcare Use Cases:**
- Primary backup for critical systems
- Fast recovery for routine issues
- Staging area for other backup types

#### Tape Backup
**Pros:**
- Lower cost for long-term storage
- Portable and removable
- Good for compliance retention
- Offline storage capability

**Cons:**
- Slower backup and recovery
- Sequential access limitations
- Media degradation over time
- Manual handling required

**Healthcare Use Cases:**
- Long-term archival storage
- Offsite storage transport
- Compliance retention
- Air-gapped ransomware protection

### Cloud Backup Solutions

#### Public Cloud Backup
**Advantages:**
- Scalable and cost-effective
- Geographic redundancy
- Professional management
- Advanced security features

**Considerations:**
- Data sovereignty concerns
- Network bandwidth requirements
- Ongoing operational costs
- Vendor dependency

**Recommended Providers:**
- AWS (HIPAA-compliant services)
- Microsoft Azure (Healthcare)
- Google Cloud Healthcare API
- Specialized healthcare cloud providers

#### Hybrid Cloud Backup
**Benefits:**
- Best of both worlds
- Tiered storage approach
- Cost optimization
- Risk distribution

**Architecture:**
- Local backup for fast recovery
- Cloud backup for disaster recovery
- Automated tiering policies
- Encryption key management

### Backup as a Service (BaaS)

#### Healthcare-Focused BaaS Providers
**Features to Evaluate:**
- HIPAA compliance certification
- Healthcare industry experience
- 24/7 monitoring and support
- Regulatory expertise
- Business associate agreements

**Service Level Agreements:**
- Backup success rates (>99.5%)
- Recovery time guarantees
- Data retention commitments
- Security incident response
- Compliance reporting

---

## IMPLEMENTATION PLAN

### Phase 1: Assessment and Planning (Month 1-2)

#### Current State Analysis
- [ ] Inventory all systems and data types
- [ ] Document current backup procedures
- [ ] Assess recovery capabilities
- [ ] Identify gaps and risks
- [ ] Review compliance requirements

#### Requirements Gathering
- [ ] Define RTO/RPO objectives
- [ ] Establish data classification
- [ ] Determine retention requirements
- [ ] Budget allocation
- [ ] Vendor selection criteria

### Phase 2: Infrastructure Deployment (Month 3-4)

#### Technology Implementation
- [ ] Deploy backup hardware/software
- [ ] Configure backup policies
- [ ] Implement security controls
- [ ] Establish network connectivity
- [ ] Create monitoring dashboards

#### Security Configuration
- [ ] Implement encryption at rest
- [ ] Configure encryption in transit
- [ ] Set up access controls
- [ ] Enable audit logging
- [ ] Test security controls

### Phase 3: Data Migration and Testing (Month 5-6)

#### Backup Implementation
- [ ] Begin backing up Tier 1 data
- [ ] Implement Tier 2 systems
- [ ] Configure Tier 3 backups
- [ ] Set up archival processes
- [ ] Document all procedures

#### Initial Testing
- [ ] Perform restore testing
- [ ] Validate data integrity
- [ ] Test recovery procedures
- [ ] Document test results
- [ ] Adjust configurations

### Phase 4: Full Production (Month 7+)

#### Go-Live Activities
- [ ] Complete system cutover
- [ ] Begin regular monitoring
- [ ] Implement reporting
- [ ] Start ongoing testing
- [ ] User training

#### Optimization
- [ ] Monitor performance metrics
- [ ] Optimize backup windows
- [ ] Adjust retention policies
- [ ] Review and update procedures
- [ ] Plan for growth

---

## RECOVERY PROCEDURES

### Emergency Recovery Procedures

#### Immediate Response (0-15 minutes)
1. **Assess the Situation**

2. **Activate Recovery Team**

3. **Initiate Recovery**

#### System Recovery Process

**Step 1: Recovery Planning**
- [ ] Identify recovery targets (RTO/RPO)
- [ ] Select appropriate backup sources
- [ ] Plan recovery sequence
- [ ] Allocate resources
- [ ] Communicate timeline

**Step 2: Infrastructure Preparation**
- [ ] Prepare recovery hardware
- [ ] Configure network connectivity
- [ ] Verify security controls
- [ ] Test system access
- [ ] Prepare monitoring tools

**Step 3: Data Recovery**
- [ ] Restore system configuration
- [ ] Recover database files
- [ ] Restore application data
- [ ] Verify data integrity
- [ ] Test system functionality

**Step 4: Service Restoration**
- [ ] Conduct functionality testing
- [ ] Verify security controls
- [ ] Resume production services
- [ ] Monitor system performance
- [ ] Document lessons learned

### Recovery Testing Scenarios

#### Scenario 1: Single Server Failure
**Objective:** Test recovery of individual server
**Scope:** One server with multiple applications
**Success Criteria:** Full recovery within RTO
**Frequency:** Monthly

#### Scenario 2: Database Corruption
**Objective:** Test database recovery procedures
**Scope:** Primary clinical database
**Success Criteria:** Data integrity maintained
**Frequency:** Quarterly

#### Scenario 3: Complete Site Disaster
**Objective:** Test full disaster recovery
**Scope:** Entire data center failure
**Success Criteria:** Operations restored at DR site
**Frequency:** Annually

#### Scenario 4: Ransomware Attack
**Objective:** Test recovery from encryption attack
**Scope:** Multiple infected systems
**Success Criteria:** Clean recovery without payment
**Frequency:** Semi-annual

---

## TESTING AND VALIDATION

### Testing Framework

#### Regular Testing Schedule

| Test Type | Frequency | Scope | Success Criteria |
|-----------|-----------|-------|------------------|
| Backup Verification | Daily | All backups | 100% completion, no errors |
| File Recovery | Weekly | Sample files | <5 minute recovery time |
| Database Recovery | Monthly | Test database | Full integrity validation |
| System Recovery | Quarterly | Complete system | Meet RTO/RPO objectives |
| DR Exercise | Annually | Full infrastructure | End-to-end validation |

#### Test Documentation Requirements

**Pre-Test Planning:**
- [ ] Define test objectives
- [ ] Identify test scope
- [ ] Plan resource requirements
- [ ] Schedule testing window
- [ ] Notify stakeholders

**During Testing:**
- [ ] Document start/end times
- [ ] Record all actions taken
- [ ] Note any issues or errors
- [ ] Capture performance metrics
- [ ] Take screenshots/evidence

**Post-Test Analysis:**
- [ ] Analyze test results
- [ ] Identify improvement areas
- [ ] Update procedures
- [ ] Report to management
- [ ] Schedule remediation

### Validation Procedures

#### Data Integrity Validation
- **Checksum Verification:** Automated hash comparison
- **File Count Validation:** Verify complete file inventory
- **Database Consistency:** Run database integrity checks
- **Application Testing:** Functional testing of restored systems

#### Recovery Performance Metrics
- **Backup Duration:** Time to complete backup operations
- **Recovery Speed:** Data restoration rate (GB/hour)
- **RTO Achievement:** Actual vs. target recovery time
- **RPO Achievement:** Actual vs. acceptable data loss

---

## MONITORING AND MAINTENANCE

### Monitoring Requirements

#### Automated Monitoring
- **Backup Job Status:** Success/failure notifications
- **Storage Utilization:** Capacity trending and alerts
- **Network Performance:** Backup network monitoring
- **Security Events:** Unauthorized access attempts
- **Compliance Status:** Retention policy adherence

#### Key Performance Indicators

| Metric | Target | Frequency | Alert Threshold |
|--------|--------|-----------|----------------|
| Backup Success Rate | >99.5% | Daily | <98% |
| Recovery Time | Meet RTO | Per incident | Exceed RTO |
| Storage Growth | <20% annually | Monthly | >25% |
| Test Success Rate | 100% | Per test | Any failure |
| Compliance Score | 100% | Monthly | <95% |

### Maintenance Activities

#### Daily Tasks
- [ ] Review backup job reports
- [ ] Check system health status
- [ ] Monitor storage utilization
- [ ] Review security alerts
- [ ] Update job schedules if needed

#### Weekly Tasks
- [ ] Perform file recovery tests
- [ ] Review capacity trends
- [ ] Check offsite storage status
- [ ] Update documentation
- [ ] Review vendor SLA compliance

#### Monthly Tasks
- [ ] Conduct system recovery tests
- [ ] Review and update retention policies
- [ ] Analyze performance trends
- [ ] Update disaster recovery plans
- [ ] Conduct security reviews

#### Quarterly Tasks
- [ ] Full disaster recovery testing
- [ ] Review and update procedures
- [ ] Vendor relationship reviews
- [ ] Cost optimization analysis
- [ ] Compliance audit preparation

#### Annual Tasks
- [ ] Complete strategy review
- [ ] Technology refresh planning
- [ ] Contract renewals
- [ ] Regulatory compliance review
- [ ] Staff training updates

---

## SECURITY CONSIDERATIONS

### Encryption Standards

#### Data at Rest
- **Algorithm:** AES-256 encryption minimum
- **Key Management:** Hardware security modules (HSM)
- **Key Rotation:** Annual key rotation schedule
- **Access Control:** Role-based encryption key access

#### Data in Transit
- **Protocol:** TLS 1.3 for all communications
- **VPN:** IPSec tunnels for offsite transfers
- **Monitoring:** Network encryption validation
- **Certificate Management:** Automated certificate renewal

### Access Controls

#### Administrative Access
- **Multi-Factor Authentication:** Required for all admin access
- **Privileged Access Management:** Vault-based credential management
- **Session Recording:** Log all administrative sessions
- **Access Review:** Quarterly access certification

#### Operational Access
- **Role-Based Access:** Minimum necessary permissions
- **Backup Operators:** Limited restore permissions
- **Monitoring Staff:** Read-only access to logs
- **Emergency Access:** Break-glass procedures

---

## COMPLIANCE AND AUDIT

### Documentation Requirements

#### Policy Documentation
- [ ] Data backup and recovery policy
- [ ] Data retention schedules
- [ ] Incident response procedures
- [ ] Security control documentation
- [ ] Vendor management procedures

#### Operational Documentation
- [ ] Daily backup reports
- [ ] Recovery test results
- [ ] Incident response logs
- [ ] Change management records
- [ ] Performance monitoring reports

#### Audit Preparation
- [ ] Maintain compliance evidence
- [ ] Document control testing
- [ ] Prepare audit responses
- [ ] Update risk assessments
- [ ] Review regulatory changes

### Regulatory Reporting

#### HIPAA Compliance
- **Risk Assessments:** Annual security risk assessments
- **Incident Reporting:** Breach notification procedures
- **Business Associates:** BAA requirements for vendors
- **Audit Trails:** Maintain access and activity logs

#### State Requirements
- **Medical Record Retention:** Meet state-specific requirements
- **Data Residency:** Comply with data location requirements
- **Breach Notification:** Follow state notification laws
- **Professional Licensing:** Meet licensing board requirements

---

## COST OPTIMIZATION

### Cost Analysis Framework

#### Total Cost of Ownership (TCO)
- **Infrastructure Costs:** Hardware, software, facilities
- **Operational Costs:** Staff, utilities, maintenance
- **Compliance Costs:** Audits, legal, training
- **Risk Costs:** Potential downtime, breaches, fines

#### Cost Optimization Strategies
- **Data Tiering:** Move older data to cheaper storage
- **Deduplication:** Reduce storage requirements
- **Compression:** Optimize backup sizes
- **Cloud Economics:** Leverage cloud pricing models
- **Vendor Negotiations:** Optimize contract terms

### Budget Planning

#### Annual Budget Components
- **Capital Expenses:** Hardware refresh, new technology
- **Operating Expenses:** Licenses, support, cloud services
- **Staff Costs:** Training, certification, contractors
- **Compliance Costs:** Audits, legal reviews, consulting

#### Cost Justification
- **Risk Mitigation Value:** Calculate potential loss avoided
- **Compliance Benefits:** Avoid regulatory fines
- **Operational Efficiency:** Reduce manual processes
- **Business Continuity:** Minimize downtime costs

---

## APPENDICES

### Appendix A: Backup Technology Comparison Matrix
[Detailed comparison of backup technologies with pros/cons]

### Appendix B: Vendor Evaluation Criteria
[Scoring matrix for evaluating backup solution vendors]

### Appendix C: Sample Recovery Procedures
[Step-by-step procedures for common recovery scenarios]

### Appendix D: Compliance Checklist
[Comprehensive checklist for regulatory compliance]

### Appendix E: Cost Calculation Worksheets
[Templates for calculating TCO and ROI]

### Appendix F: Testing Templates
[Forms and checklists for backup testing procedures]

---

**Document Control:**
- **Version:** 2.1
- **Last Updated:** [Current Date]
- **Next Review:** [Date + 6 months]
- **Owner:** Chief Information Officer
- **Approved By:** Chief Executive Officer
- **Classification:** Internal Use - Healthcare Compliance
`;
      case '/downloads/ehr-downtime-procedures.md':
        return `
# EHR Downtime Procedures for Healthcare Organizations

## DOCUMENT OVERVIEW

**Purpose:** Provide comprehensive procedures for maintaining safe patient care during Electronic Health Record (EHR) system downtime  

⚠️ **CRITICAL:** Patient safety is the highest priority during all downtime events.

---

## TABLE OF CONTENTS

1. [Downtime Classification](#downtime-classification)

---

## DOWNTIME CLASSIFICATION

### Level 1: Partial System Downtime (Low Impact)
**Duration:** < 2 hours expected  

### Level 2: Major System Downtime (Moderate Impact)
**Impact:** Core EHR functions affected but system partially functional
**Examples:** Medication module down, documentation slow
**Response:** Full downtime procedures, paper backup systems

### Level 3: Complete System Downtime (High Impact)
**Duration:** >8 hours or unknown duration
**Impact:** Complete EHR system unavailable
**Examples:** Server failure, network outage, cyber attack
**Response:** Full emergency procedures, comprehensive paper systems

### Level 4: Extended/Disaster Downtime (Critical Impact)
**Duration:** >24 hours or facility-wide disaster
**Impact:** Multiple systems down, facility operations compromised
**Examples:** Natural disaster, major cyber incident, facility damage
**Response:** Disaster recovery procedures, possible patient transfers

---

## ACTIVATION PROCEDURES

### Downtime Declaration Authority

**Primary Authority:**
- Chief Information Officer (CIO)
- IT Operations Manager
- Chief Medical Officer (CMO)

**Secondary Authority:**
- Administrator on Call
- Nursing Supervisor
- IT Help Desk Manager

### Activation Process

#### Immediate Actions (0-15 minutes)
1. **Assess and Classify Downtime**
   - Determine downtime level
   - Estimate duration if possible
   - Identify affected systems/modules
   - Assess patient safety impact

2. **Notify Key Personnel**
   - CIO/IT Director
   - CMO/Chief Nursing Officer
   - Administrator on Call
   - Department supervisors

3. **Activate Downtime Procedures**
   - Announce via overhead paging
   - Send email/text alerts
   - Update hospital communication boards
   - Begin paper form distribution

#### Setup Activities (15-60 minutes)
1. **Deploy Downtime Resources**
   - Distribute paper forms
   - Set up manual processes
   - Position additional staff
   - Activate communication centers

2. **Establish Command Center**
   - IT Operations center activation
   - Clinical coordination center
   - Regular status updates
   - External communication management

---

## CLINICAL PROCEDURES

### Emergency Department

#### Patient Registration
**Manual Process:**
- Use paper registration forms
- Assign manual medical record numbers
- Create paper patient identification bands
- Maintain paper patient tracking log

**Required Information:**
- Patient name and demographics
- Emergency contact information
- Insurance information
- Chief complaint
- Time of arrival
- Assigned bed/room

#### Triage and Assessment
**Documentation Requirements:**
- Paper triage forms
- Vital signs documentation
- Chief complaint details
- Acuity level assignment
- Nurse assessment notes

**Critical Alerts:**
- Use red stickers for critical patients
- Maintain verbal communication
- Document all patient movements
- Track diagnostic orders manually

#### Medication Administration
**Safety Procedures:**
- Use paper medication administration records (MARs)
- Verify medications with pharmacy by phone
- Double-check all high-risk medications
- Document time, dose, route, and nurse initials
- Use manual drug interaction checking

**High-Risk Medication Protocol:**
- Require physician verification for:
  - Insulin
  - Warfarin
  - Chemotherapy
  - High-dose narcotics
  - Pediatric medications

### Inpatient Units

#### Nursing Documentation
**Essential Documentation:**
- Vital signs every 4 hours minimum
- Medication administration
- Intake and output
- Patient assessment notes
- Physician orders received

**Paper Forms Required:**
- Patient flow sheets
- Medication administration records
- Physician order sheets
- Progress notes
- Discharge planning forms

#### Physician Orders
**Order Management:**
- Use standardized order sets on paper
- Require physician signature on all orders
- Pharmacy verification for all medications
- Verbal orders limited to emergencies only
- Read-back confirmation for all verbal orders

**Priority Order Processing:**
1. STAT orders - immediate processing
2. Emergency medications - within 15 minutes
3. Critical diagnostics - within 30 minutes
4. Routine orders - within 2 hours

### Surgical Services

#### Pre-Operative Procedures
**Documentation:**
- Paper surgical consent forms
- Pre-op checklist completion
- Medication reconciliation
- Allergy verification
- Surgical site marking

**Communication:**
- Surgeon notification of downtime status
- Anesthesia team coordination
- OR schedule adjustments
- Equipment availability confirmation

#### Intra-Operative Management
**Required Documentation:**
- Anesthesia records (paper)
- Surgical count documentation
- Blood product administration
- Medication administration
- Procedure documentation

**Safety Protocols:**
- Enhanced verbal communication
- Manual timing of procedures
- Paper-based count sheets
- Direct physician-to-pharmacy communication

### Laboratory Services

#### Order Management
**Manual Processes:**
- Paper requisitions for all orders
- Phone orders to lab with read-back
- Manual specimen labeling
- Paper result reporting

**Stat Laboratory Protocol:**
- Priority processing for:
  - ICU patients
  - Emergency department
  - Surgical cases
  - Critical care areas

#### Result Reporting
**Communication Methods:**
- Phone calls for critical values
- Paper reports delivered to units
- Verbal reports with read-back
- Written documentation of all communications

### Pharmacy Services

#### Medication Dispensing
**Safety Procedures:**
- Paper prescription processing
- Manual drug interaction screening
- Pharmacist verification required
- Phone consultations with physicians

**Emergency Medication Access:**
- Automated dispensing cabinet override
- Pharmacy-controlled emergency supplies
- Documented justification required
- Post-event reconciliation mandatory

---

## ADMINISTRATIVE PROCEDURES

### Patient Registration

#### New Patient Registration
**Required Information:**
- Complete demographic data
- Insurance verification (phone)
- Emergency contact information
- Primary care physician
- Advance directives status

**Manual Processes:**
- Paper registration forms
- Manual insurance verification
- Phone calls to verify coverage
- Paper medical record creation
- Manual bed assignment tracking

### Health Information Management

#### Medical Record Management
**Downtime Activities:**
- Retrieve paper charts as needed
- Maintain manual record tracking
- Copy critical information
- Secure all PHI appropriately
- Plan for post-downtime data entry

#### Release of Information
**Manual Processes:**
- Paper authorization forms
- Manual record retrieval
- Phone verification of requests
- Secure fax transmission
- Detailed activity logging

### Financial Services

#### Patient Accounting
**Manual Procedures:**
- Paper charge capture forms
- Manual co-payment collection
- Insurance authorization tracking
- Discharge planning coordination
- Post-downtime reconciliation planning

### Quality and Risk Management

#### Incident Reporting
**During Downtime:**
- Paper incident report forms
- Immediate notification of serious events
- Enhanced patient safety monitoring
- Documentation of near-miss events
- Verbal reporting to risk management

---

## COMMUNICATION PROTOCOLS

### Internal Communications

#### Staff Notification Methods
**Primary Communications:**
- Overhead paging system
- Email alerts (if available)
- Phone tree activation
- Text messaging system
- In-person notifications

#### Communication Schedule
- **Initial Announcement:** Immediate
- **Status Updates:** Every 30 minutes for first 2 hours, then hourly
- **Recovery Updates:** Every 15 minutes during restoration
- **Final Announcement:** When fully operational

#### Key Messages
**Downtime Announcement:**
\`\`\`
"ATTENTION ALL STAFF: EHR System downtime is now in effect.
Implement paper procedures immediately.
Duration: [estimated time]
Updates every [frequency]
Questions: Call IT Helpdesk at [number]"
\`\`\`

**Status Update:**
\`\`\`
"EHR Downtime Update: [time]
Status: [description]
Expected restoration: [time]
Continue paper procedures.
Next update: [time]"
\`\`\`

### External Communications

#### Patient and Family Communication
**Key Messages:**
- Patient care continues safely
- Some delays may occur
- Paper records being used
- Electronic access temporarily unavailable
- Updates provided regularly

#### Physician Office Communication
**Notifications:**
- Fax to all referring physicians
- Phone calls to frequent referrers
- Update on practice websites
- Alternative communication methods
- Discharge summary delays expected

### Regulatory Communications

#### Required Notifications
- Joint Commission (if patient safety affected)
- State health department (if required)
- Insurance companies (if service affected)
- Accreditation bodies (as appropriate)

---

## RECOVERY PROCEDURES

### System Restoration Process

#### Phase 1: Initial System Testing (0-2 hours)
**Technical Activities:**
- Verify system functionality
- Test critical interfaces
- Validate data integrity
- Check network connectivity
- Confirm security controls

**Clinical Validation:**
- Test medication administration
- Verify patient data access
- Check order entry functionality
- Validate documentation capabilities
- Confirm interface connections

#### Phase 2: Phased Go-Live (2-4 hours)
**Priority Restoration:**
1. Emergency Department systems
2. Critical care units (ICU, CCU)
3. Operating rooms
4. Pharmacy systems
5. Laboratory systems
6. General inpatient units
7. Outpatient areas
8. Administrative functions

**Go-Live Checklist per Unit:**
- [ ] System functionality confirmed
- [ ] Staff notified and ready
- [ ] Paper forms collected
- [ ] Training refresher provided
- [ ] Supervisor approval obtained

#### Phase 3: Data Reconciliation (4+ hours)
**Post-Downtime Activities:**
- Enter paper documentation
- Reconcile medication administration
- Update patient locations
- Process delayed orders
- Complete missing documentation

**Data Entry Priorities:**
1. Critical patient information
2. Medication reconciliation
3. Diagnostic results
4. Progress notes
5. Administrative data

### Communication During Recovery

#### Staff Notifications
**Go-Live Announcement:**
\`\`\`
"ATTENTION: EHR System restoration beginning.
Areas going live: [list areas]
Continue paper procedures until your area is cleared.
Await unit-specific go-live notification.
Questions: [contact information]"
\`\`\`

**Unit Go-Live:**
\`\`\`
"[Unit Name]: EHR System now operational.
Resume electronic documentation.
Collect all paper forms.
Data entry coordination meeting: [time/location]"
\`\`\`

### Quality Assurance

#### Post-Downtime Review
**Required Activities:**
- Incident analysis meeting
- Review of patient safety events
- Assessment of procedure effectiveness
- Staff feedback collection
- Improvement recommendations

**Documentation:**
- Downtime duration and impact
- Patient safety events
- Staff compliance with procedures
- System performance issues
- Lessons learned

---

## TRAINING REQUIREMENTS

### Initial Training

#### All Staff Requirements
**Core Competencies:**
- Downtime procedure overview
- Paper form locations and usage
- Communication protocols
- Patient safety priorities
- Role-specific responsibilities

**Training Methods:**
- Classroom sessions
- Online modules
- Simulation exercises
- Competency testing
- Annual refreshers

#### Role-Specific Training

**Nursing Staff:**
- Paper documentation techniques
- Manual medication administration
- Patient safety protocols
- Communication procedures
- Emergency procedures

**Physician Staff:**
- Paper order writing
- Manual prescription procedures
- Communication protocols
- Patient safety considerations
- Emergency procedures

**Ancillary Staff:**
- Department-specific procedures
- Communication requirements
- Safety protocols
- Documentation needs
- Recovery procedures

### Ongoing Training

#### Annual Requirements
- All staff: 2-hour refresher training
- New employees: Complete training within 30 days
- Department supervisors: 4-hour advanced training
- IT staff: Technical recovery training

#### Simulation Exercises
- Quarterly unit-based drills
- Semi-annual hospital-wide exercise
- Annual comprehensive downtime test
- Just-in-time training during actual events

---

## QUALITY METRICS AND MONITORING

### Key Performance Indicators

#### Patient Safety Metrics
- Medication errors during downtime
- Patient identification issues
- Critical result delays
- Adverse events related to downtime
- Near-miss incident reports

#### Operational Metrics
- Time to implement procedures
- Staff compliance rates
- Communication effectiveness
- Data entry accuracy post-recovery
- Recovery time by system/unit

### Continuous Improvement

#### After Action Reviews
**Required for All Downtime Events:**
- What went well?
- What could be improved?
- Were procedures followed?
- What training is needed?
- What resources were lacking?

#### Procedure Updates
- Monthly procedure reviews
- Quarterly form updates
- Semi-annual training revisions
- Annual comprehensive review
- Post-incident immediate updates

---

## APPENDICES

### Appendix A: Paper Form Templates
- Patient registration forms
- Medication administration records
- Physician order sheets
- Progress note templates
- Discharge planning forms

### Appendix B: Contact Information
- Key personnel contact lists
- Department phone numbers
- External vendor contacts
- Emergency contact numbers
- Escalation procedures

### Appendix C: Unit-Specific Procedures
- Emergency Department protocols
- ICU/CCU procedures
- Operating room protocols
- Laboratory procedures
- Pharmacy protocols

### Appendix D: Communication Templates
- Staff notification scripts
- Patient communication materials
- External communication templates
- Media response guidelines
- Regulatory notification forms

### Appendix E: Training Materials
- Staff training presentations
- Competency checklists
- Simulation scenarios
- Quick reference guides
- Video training modules

---

## DOCUMENT CONTROL

**Approval Signatures:**

Chief Medical Officer: _________________________ Date: _________

Chief Information Officer: _____________________ Date: _________

Chief Nursing Officer: ________________________ Date: _________

**Distribution:**
- All department heads
- Nursing supervisors
- IT operations staff
- Quality and risk management
- Medical staff leadership

**Revision History:**
- Version 2.0 - [Date] - Complete procedure revision
- Version 1.5 - [Date] - Added pharmacy procedures
- Version 1.0 - [Date] - Initial document

**Next Review Date:** [Date + 6 months]
**Document Owner:** Chief Medical Officer
**Classification:** Internal Use - Patient Safety Critical
`;
      case '/downloads/vendor-risk-assessment-template.xlsx':
        return `
Risk Category,Risk Factor,Weight,Score (1-5),Weighted Score,Risk Level,Comments,Mitigation Required,Action Items,Responsible Party,Due Date
General Information,Vendor Name,N/A,N/A,N/A,N/A,[Vendor Company Name],N/A,Document vendor details,Procurement,
General Information,Service Type,N/A,N/A,N/A,N/A,[Description of services],N/A,Categorize service type,Procurement,
General Information,Contract Value,N/A,N/A,N/A,N/A,[Annual contract value],N/A,Document financial exposure,Finance,
General Information,Data Access Level,N/A,N/A,N/A,N/A,[PHI/PII/Internal/Public],N/A,Classify data sensitivity,Privacy Officer,
General Information,Criticality Level,N/A,N/A,N/A,N/A,[Critical/High/Medium/Low],N/A,Assess business criticality,Operations,
Security Controls,Data Encryption at Rest,5,3,15,Medium,Basic encryption implemented,Yes,Require AES-256 encryption,IT Security,2024-06-01
Security Controls,Data Encryption in Transit,5,4,20,Low,TLS 1.3 implemented,No,Current implementation adequate,IT Security,
Security Controls,Access Control Management,4,2,8,High,Basic username/password only,Yes,Require multi-factor authentication,IT Security,2024-05-01
Security Controls,Security Monitoring and Logging,4,3,12,Medium,Basic logging in place,Yes,Require SIEM integration,IT Security,2024-07-01
Security Controls,Vulnerability Management,4,2,8,High,No formal program,Yes,Require regular vulnerability scans,IT Security,2024-05-15
Security Controls,Incident Response Plan,4,3,12,Medium,Plan exists but not tested,Yes,Require annual testing,IT Security,2024-08-01
Security Controls,Security Awareness Training,3,3,9,Medium,Annual training provided,No,Adequate current training,HR,
Security Controls,Penetration Testing,3,2,6,High,No recent testing,Yes,Require annual pen testing,IT Security,2024-06-01
Security Controls,Network Segmentation,4,2,8,High,Flat network architecture,Yes,Implement network segmentation,Network Admin,2024-07-01
Security Controls,Endpoint Protection,3,4,12,Low,Next-gen endpoint protection,No,Current solution adequate,IT Security,
Compliance,HIPAA Compliance Program,5,3,15,Medium,Program exists but gaps identified,Yes,Conduct compliance audit,Compliance,2024-05-01
Compliance,SOC 2 Type II Report,4,4,16,Low,Current report available,No,Annual report review adequate,Compliance,
Compliance,HITECH Compliance,4,3,12,Medium,Compliance claimed but not verified,Yes,Request compliance documentation,Compliance,2024-06-01
Compliance,State Privacy Law Compliance,3,3,9,Medium,Multi-state compliance claimed,Yes,Verify state-specific compliance,Legal,2024-07-01
Compliance,Industry Certifications,3,4,12,Low,ISO 27001 and others,No,Certifications current and valid,Compliance,
Compliance,Business Associate Agreement,5,4,20,Low,Comprehensive BAA in place,No,BAA adequately addresses risks,Legal,
Compliance,Data Breach History,4,2,8,High,Two breaches in past 3 years,Yes,Enhanced monitoring required,Risk Management,2024-05-01
Compliance,Regulatory Audit History,3,3,9,Medium,Clean audit record,No,No additional action needed,Compliance,
Data Management,Data Classification,4,3,12,Medium,Basic classification scheme,Yes,Align with organizational standards,Privacy Officer,2024-06-01
Data Management,Data Retention Policies,4,4,16,Low,Comprehensive retention policies,No,Policies meet requirements,Compliance,
Data Management,Secure Data Disposal,4,2,8,High,Basic deletion procedures,Yes,Require certified disposal,IT Security,2024-05-15
Data Management,Data Location/Residency,5,3,15,Medium,US-based but some offshore,Yes,Restrict to domestic processing,Legal,2024-07-01
Data Management,Data Backup Procedures,4,4,16,Low,Comprehensive backup program,No,Backup procedures adequate,IT Operations,
Data Management,Data Recovery Testing,3,2,6,High,No regular testing,Yes,Require quarterly recovery tests,IT Operations,2024-06-01
Data Management,Data Minimization,3,3,9,Medium,Some minimization practices,Yes,Enhance data minimization,Privacy Officer,2024-08-01
Data Management,Data Quality Controls,3,3,9,Medium,Basic quality controls,No,Adequate for current needs,Operations,
Operational Risk,Business Continuity Plan,4,3,12,Medium,Plan exists but not tested,Yes,Require annual BCP testing,Operations,2024-06-01
Operational Risk,Disaster Recovery Plan,4,3,12,Medium,DR plan documented,Yes,Test DR procedures,IT Operations,2024-07-01
Operational Risk,Service Level Agreements,4,4,16,Low,Comprehensive SLA in place,No,SLA meets requirements,Operations,
Operational Risk,Financial Stability,4,4,16,Low,Strong financial position,No,No concerns identified,Finance,
Operational Risk,Geographic Diversity,3,2,6,High,Single data center location,Yes,Require geographic redundancy,Operations,2024-08-01
Operational Risk,Vendor Dependencies,3,3,9,Medium,Multiple sub-vendors,Yes,Document sub-vendor risks,Procurement,2024-06-01
Operational Risk,Scalability,3,4,12,Low,Demonstrated scalability,No,Adequate scalability,Operations,
Operational Risk,Service Availability,4,4,16,Low,99.9% uptime SLA,No,Availability meets requirements,Operations,
Personnel Security,Background Checks,4,3,12,Medium,Basic background checks,Yes,Require enhanced screening,HR,2024-06-01
Personnel Security,Security Clearances,3,2,6,High,No clearances required/held,Yes,Assess clearance requirements,Security,2024-07-01
Personnel Security,Access Management,4,2,8,High,Manual access provisioning,Yes,Implement automated access mgmt,IT Security,2024-05-01
Personnel Security,Separation Procedures,4,3,12,Medium,Standard termination process,Yes,Enhance access removal,HR,2024-06-01
Personnel Security,Contractor Management,3,3,9,Medium,Basic contractor oversight,Yes,Enhance contractor screening,HR,2024-08-01
Personnel Security,Training and Certification,3,3,9,Medium,Role-based training,No,Training adequate,HR,
Physical Security,Facility Security,4,3,12,Medium,Badge access and cameras,Yes,Assess biometric requirements,Facilities,2024-07-01
Physical Security,Data Center Security,5,4,20,Low,Tier III data center,No,Security adequate,Facilities,
Physical Security,Environmental Controls,3,4,12,Low,Redundant HVAC and power,No,Environmental controls adequate,Facilities,
Physical Security,Visitor Management,3,3,9,Medium,Basic visitor procedures,Yes,Enhance visitor screening,Security,2024-08-01
Physical Security,Asset Management,3,2,6,High,Manual asset tracking,Yes,Implement automated tracking,Operations,2024-06-01
Technical Architecture,System Architecture,4,3,12,Medium,Adequate but aging,Yes,Plan architecture refresh,IT Architecture,2024-09-01
Technical Architecture,Integration Capabilities,4,4,16,Low,Strong API capabilities,No,Integration capabilities adequate,IT Architecture,
Technical Architecture,Performance Monitoring,3,3,9,Medium,Basic monitoring,Yes,Enhance performance monitoring,IT Operations,2024-08-01
Technical Architecture,Capacity Management,3,3,9,Medium,Adequate capacity planning,No,Current capacity adequate,IT Operations,
Technical Architecture,Change Management,3,2,6,High,Limited change control,Yes,Implement formal change mgmt,IT Operations,2024-06-01
Technical Architecture,Version Control,3,3,9,Medium,Basic version control,Yes,Enhance version management,Development,2024-07-01
Technical Architecture,Testing Procedures,4,2,8,High,Limited testing framework,Yes,Implement comprehensive testing,QA,2024-06-01
Communication,Notification Procedures,3,3,9,Medium,Email notifications,Yes,Add SMS and phone notifications,Communications,2024-07-01
Communication,Escalation Procedures,4,3,12,Medium,Basic escalation matrix,Yes,Document escalation timeframes,Operations,2024-06-01
Communication,Reporting Requirements,3,4,12,Low,Comprehensive reporting,No,Reporting meets needs,Operations,
Communication,Communication Channels,3,3,9,Medium,Multiple channels available,No,Communication adequate,Communications,
Legal and Contractual,Contract Terms,4,4,16,Low,Favorable contract terms,No,Contract terms acceptable,Legal,
Legal and Contractual,Liability and Insurance,4,3,12,Medium,Standard liability coverage,Yes,Assess additional coverage,Legal,2024-06-01
Legal and Contractual,Intellectual Property,3,4,12,Low,Clear IP ownership,No,IP terms acceptable,Legal,
Legal and Contractual,Termination Clauses,4,3,12,Medium,Standard termination terms,Yes,Negotiate data return terms,Legal,2024-07-01
Legal and Contractual,Dispute Resolution,3,3,9,Medium,Arbitration required,No,Dispute terms acceptable,Legal,
Legal and Contractual,Governing Law,3,4,12,Low,Favorable jurisdiction,No,Legal jurisdiction acceptable,Legal,
Vendor Management,Relationship Management,3,3,9,Medium,Quarterly business reviews,Yes,Increase meeting frequency,Procurement,2024-06-01
Vendor Management,Performance Metrics,4,3,12,Medium,Basic SLA monitoring,Yes,Enhance performance tracking,Operations,2024-07-01
Vendor Management,Cost Management,3,4,12,Low,Competitive pricing,No,Cost management adequate,Finance,
Vendor Management,Contract Management,3,2,6,High,Manual contract tracking,Yes,Implement contract management,Legal,2024-08-01
Vendor Management,Vendor Assessment,4,2,8,High,Annual assessment only,Yes,Implement continuous monitoring,Risk Management,2024-05-01
Vendor Management,Alternative Vendors,4,1,4,Critical,No alternative identified,Yes,Identify backup vendors,Procurement,2024-04-01
Summary,Total Weighted Score,N/A,N/A,547,N/A,Score out of possible 800,N/A,Overall risk assessment,Risk Management,
Summary,Overall Risk Rating,N/A,N/A,N/A,High,68% risk score requires action,N/A,Develop risk mitigation plan,Risk Management,2024-04-01
Summary,Recommendation,N/A,N/A,N/A,N/A,Approve with conditions,N/A,Implement risk controls,Risk Management,2024-06-01
Summary,Review Date,N/A,N/A,N/A,N/A,Annual review required,N/A,Schedule next assessment,Risk Management,2024-12-01
`;
      default:
        return `
Preview not available for this file type.
Please download the file to view its content.

File: ${downloadLink}
Type: ${fileType}
`;
    }
  };

  const handleView = (resource: Omit<DownloadResource, 'onView'>) => {
    setPreviewTitle(resource.title);
    setPreviewContent(getDocumentContent(resource.downloadLink));
    setShowPreviewModal(true);
  };

  const handleDownload = (title: string, fileType: string) => {
    // Create actual downloadable content
    let content = '';
    let filename = '';
    let mimeType = '';

    // Generate actual file content based on the resource
    switch (title) {
      case 'HIPAA Privacy Policy Template':
        content = generatePrivacyPolicy();
        filename = 'hipaa-privacy-policy-template.docx';
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'Breach Response Checklist':
        content = generateBreachChecklist();
        filename = 'breach-response-checklist.pdf';
        mimeType = 'application/pdf';
        break;
      case 'Business Associate Agreement Template':
        content = generateBAATemplate();
        filename = 'business-associate-agreement-template.docx';
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'Technology Dependency Mapping Template':
        content = generateDependencyTemplate();
        filename = 'technology-dependency-mapping-template.csv';
        mimeType = 'text/csv';
        break;
      default:
        content = generateGenericTemplate(title);
        filename = `${title.replace(/\s+/g, '-').toLowerCase()}.${fileType}`;
        mimeType = fileType === 'pdf' ? 'application/pdf' : 'text/plain';
    }

    // Create and trigger download
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Show success message
    if (typeof window !== 'undefined' && (window as any).showToast) {
      (window as any).showToast({
        type: 'success',
        title: 'Download Complete',
        message: `${title} has been downloaded successfully.`
      });
    }
  };
  
  const generatePrivacyPolicy = () => `
HIPAA PRIVACY POLICY TEMPLATE

HEALTHCARE ORGANIZATION PRIVACY POLICY

Effective Date: ${new Date().toLocaleDateString()}
Last Updated: ${new Date().toLocaleDateString()}

1. PURPOSE AND SCOPE
This Privacy Policy describes how [Organization Name] protects the privacy of your Protected Health Information (PHI) in accordance with HIPAA.

2. YOUR RIGHTS REGARDING YOUR PHI
- Right to Access: You have the right to inspect and obtain copies of your PHI
- Right to Amend: You may request amendments if information is incorrect
- Right to an Accounting: Request accounting of disclosures
- Right to Restrict Uses: Request restrictions on use/disclosure
- Right to Confidential Communications: Request specific communication methods
- Right to Complain: File complaints without retaliation

3. HOW WE USE AND DISCLOSE YOUR PHI
Treatment: Providing, coordinating, or managing your healthcare
Payment: Billing and collection activities, insurance claims
Healthcare Operations: Quality assessment, training, business planning

4. SAFEGUARDS
We maintain physical, electronic, and procedural safeguards including:
- Secure storage of physical records
- Password-protected electronic systems
- Employee training on privacy requirements
- Regular security assessments

Contact Information:
Privacy Officer: [Name]
Address: [Address]
Phone: [Phone]
Email: [Email]

Generated by MediSoluce Healthcare Compliance Platform
`;

  const generateBreachChecklist = () => `
HIPAA BREACH RESPONSE CHECKLIST

IMMEDIATE RESPONSE (0-24 Hours)

☐ Step 1: Discovery and Assessment
  Time of Discovery: _______________
  Person Who Discovered: _______________
  Nature of Incident: _______________

☐ Step 2: Initial Containment
  ☐ Secure the area/system where breach occurred
  ☐ Prevent further unauthorized access
  ☐ Document the scene
  ☐ Preserve evidence for investigation

☐ Step 3: Notification of Key Personnel
  ☐ Privacy Officer notified: _______________
  ☐ Security Officer notified: _______________
  ☐ CEO/Administrator notified: _______________
  ☐ Legal counsel contacted: _______________
  ☐ IT Department notified: _______________

INVESTIGATION PHASE (1-5 Days)

☐ Step 4: Detailed Investigation
  ☐ Interview involved personnel
  ☐ Review access logs and audit trails
  ☐ Determine scope of PHI involved
  ☐ Identify individuals whose PHI was breached
  ☐ Assess risk of harm to individuals

☐ Step 5: Risk Assessment
  ☐ Determine if reporting is required
  ☐ Assess potential harm to individuals
  ☐ Evaluate likelihood of compromise

NOTIFICATION REQUIREMENTS

☐ Individual Notification (within 60 days if required)
☐ HHS Notification (within 60 days if required)
☐ Media Notification (if 500+ individuals affected)

Key Contacts:
Privacy Officer: _______________
Legal Counsel: _______________
IT Security: _______________
HHS OCR: 1-800-368-1019

Generated by MediSoluce Healthcare Compliance Platform
`;

  const generateBAATemplate = () => `
BUSINESS ASSOCIATE AGREEMENT TEMPLATE

Between: [Covered Entity Name] ("Covered Entity")
And: [Business Associate Name] ("Business Associate")

Effective Date: ${new Date().toLocaleDateString()}

ARTICLE 1: DEFINITIONS
Terms used but not defined have meanings assigned in HIPAA Rules (45 CFR Parts 160 and 164).

ARTICLE 2: PERMITTED USES AND DISCLOSURES
Business Associate may only use or disclose PHI:
- To perform functions for Covered Entity as specified
- As required by law
- For proper management and administration
- To carry out legal responsibilities

ARTICLE 3: OBLIGATIONS OF BUSINESS ASSOCIATE
Business Associate agrees to:
- Use appropriate safeguards to prevent unauthorized use/disclosure
- Implement administrative, physical, and technical safeguards
- Use minimum necessary standard
- Report any breaches within 24 hours
- Provide access to PHI to individuals upon request
- Make amendments as directed by Covered Entity
- Return or destroy PHI upon termination

ARTICLE 4: SECURITY PROVISIONS
Administrative Safeguards:
- Assign security responsibility
- Conduct workforce training
- Implement access management
- Establish incident response procedures

Physical Safeguards:
- Secure facilities and workstations
- Implement device controls
- Proper disposal of PHI materials

Technical Safeguards:
- Access control systems
- Audit controls and logs
- Integrity controls
- Transmission security

SIGNATURES
Covered Entity: _________________________ Date: _________
Business Associate: _____________________ Date: _________

Generated by MediSoluce Healthcare Compliance Platform
`;

  const generateDependencyTemplate = () => `
System Name,Category,Vendor,Primary Function,Dependencies,Patient Care Impact,Downtime Tolerance,Recovery Priority,Risk Level,Backup Procedures,Contact Info
Electronic Health Records,EHR Core,Epic/Cerner/Meditech,Patient data management,"Network, Database, Authentication",Critical - All patient care,< 30 minutes,1 - Critical,High,Automated backup every 4 hours,IT Helpdesk: ext. 5555
SQL Server Database,Infrastructure,Microsoft,Data storage for EHR,"Storage Array, Network",Critical - Data loss risk,< 15 minutes,1 - Critical,High,Real-time replication + nightly backup,DBA: ext. 5556
Active Directory,Infrastructure,Microsoft,User authentication,"Domain Controllers, Network",High - Access control,< 1 hour,2 - High,Medium,Secondary domain controller,Security Team: ext. 5557
Core Network Switch,Infrastructure,Cisco,Network infrastructure,"Power, Internet Connection",Critical - All connectivity,< 15 minutes,1 - Critical,High,Redundant switches + UPS,Network Admin: ext. 5558
Laboratory Information System,Clinical,Cerner,Lab results management,"EHR Interface, Network",High - Lab results,< 1 hour,2 - High,Medium,Manual processes available,Lab IT: ext. 5561
PACS System,Clinical,GE Healthcare,Medical imaging storage,"Network, Storage, EHR Integration",High - Diagnostic imaging,< 2 hours,2 - High,Medium,Offsite image backup,Imaging IT: ext. 5560
Pharmacy System,Clinical,Epic Willow,Prescription management,"EHR Integration, Network",Critical - Medication safety,< 30 minutes,1 - Critical,High,Paper backup procedures,Pharmacy IT: ext. 5562
Patient Monitoring,Medical Devices,Philips,Vital signs monitoring,"Network, Central Station",Critical - ICU/CCU,< 15 minutes,1 - Critical,High,Standalone mode capability,Biomed: ext. 5563
Clinical Workstations,Client Devices,Dell,User interface access,"Network, Authentication, EHR",High - User access,< 1 hour,2 - High,Medium,Mobile devices backup,IT Support: ext. 5555
Mobile Devices,Mobile,Apple/Android,Portable access,"WiFi, Authentication, Apps",Medium - Mobility,< 4 hours,3 - Medium,Low,Desktop workstation backup,IT Support: ext. 5555
`;

  const generateGenericTemplate = (title: string) => `
${title.toUpperCase()}

Generated: ${new Date().toLocaleDateString()}

This is a template for: ${title}

Instructions:
1. Customize this template for your organization
2. Review with legal and compliance teams
3. Implement according to your policies
4. Review and update regularly

For additional guidance and customization:
Contact MediSoluce Support: support@medisoluce.com

Generated by MediSoluce Healthcare Compliance Platform
`;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Download className="h-16 w-16 text-primary-500 mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-4">
            {t('toolkit.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('toolkit.subtitle')}
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder={t('toolkit.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    selectedCategory === category
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => {
                    setSelectedCategory(selectedCategory === category ? null : category);
                  }}
                >
                  {category}
                </button>
              ))}
              
              {selectedCategory && (
                <button
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600"
                  onClick={() => setSelectedCategory(null)}
                >
                  {t('toolkit.clear_filter')}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DownloadCard
                  title={resource.title}
                  description={resource.description}
                  fileType={resource.fileType}
                  downloadLink={resource.downloadLink}
                  category={resource.category}
                  isPopular={resource.isPopular}
                  tags={resource.tags} // Pass tags property
                  onView={handleView}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 py-12 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('toolkit.no_resources')}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
              >
                {t('toolkit.clear_filters')}
              </Button>
            </div>
          )}
        </div>
        
        {/* Custom Resource Request */}
        <div className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              {t('toolkit.custom_resource')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('toolkit.custom_resource_desc')}
            </p>
            <Button onClick={() => window.location.href = '/contact'}>
              {t('toolkit.request_custom')}
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title={previewTitle}
        size="lg"
      >
        <ReactMarkdown className="prose dark:prose-invert max-w-none">
          {previewContent}
        </ReactMarkdown>
      </Modal>
    </div>
  );
};

export default ToolkitPage;