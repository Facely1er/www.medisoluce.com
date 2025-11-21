import React from 'react';
import { Shield, Lock, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import SEOHead from '../components/ui/SEOHead';

const PrivacyPage: React.FC = () => {
  return (
    <div className="py-12">
      <SEOHead 
        title="Privacy Policy - ERMITS"
        description="Master Privacy Policy for ERMITS LLC products and services"
        noindex={true}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 text-primary-500 mx-auto mb-4" />
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              MASTER PRIVACY POLICY
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Effective Date:</strong> November 19, 2025<br />
              <strong>Last Updated:</strong> October 31, 2025
            </p>
          </div>

          <Card className="p-8">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="mb-8">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  ERMITS LLC ("ERMITS," "we," "our," or "us") is committed to protecting
                  your privacy through a Privacy-First Architecture that ensures you
                  maintain control over your data. This Privacy Policy explains how we
                  collect, use, disclose, and safeguard information when you use our
                  Services across all ERMITS product lines.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                  By using our Services, you consent to the data practices described in
                  this policy. If you do not agree with this Privacy Policy, please do not
                  use our Services.
                </p>
              </div>

              <hr className="my-8 border-gray-300 dark:border-gray-700" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  1. Scope and Applicability
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      1.1 Services Covered
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                      This Privacy Policy applies to all ERMITS products and services, including:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                      <li><strong>ERMITS Advisory + STEEL™:</strong> Strategic cybersecurity assessments and advisory services</li>
                      <li><strong>SocialCaution:</strong> Personalized privacy platform with AI-powered persona detection</li>
                      <li><strong>TechnoSoluce™:</strong> SBOM Analyzer and software supply chain security</li>
                      <li><strong>CyberCertitude™:</strong> CMMC 2.0 compliance platforms and tools</li>
                      <li><strong>VendorSoluce™:</strong> Supply Chain Risk Management Platform</li>
                      <li><strong>CyberCorrect™:</strong> Privacy Portal and Privacy Platform</li>
                      <li><strong>CyberCaution™:</strong> RansomCheck, Security Toolkit, and RiskProfessional</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      1.2 Geographic Scope
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      This Privacy Policy applies to users worldwide and complies with GDPR (EU, UK, Switzerland), 
                      CCPA/CPRA (California), PIPEDA (Canada), LGPD (Brazil), and other applicable privacy and data protection laws.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Shield className="h-6 w-6 text-primary-500 mr-3" />
                  2. Privacy-First Architecture Overview
                </h2>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-4">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">Core Privacy Principles</h3>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                    ERMITS implements Privacy-First Architecture built on five fundamental principles:
                  </p>
                  <div className="space-y-3">
                    <div>
                      <strong className="text-blue-800 dark:text-blue-200">1. Client-Side Processing</strong>
                      <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                        All core computational functions are performed locally within your browser or self-managed environment whenever technically feasible.
                      </p>
                    </div>
                    <div>
                      <strong className="text-blue-800 dark:text-blue-200">2. Data Sovereignty Options</strong>
                      <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                        You choose where your data resides: local-only mode, self-managed cloud, ERMITS-managed cloud, hybrid deployment, or on-premises.
                      </p>
                    </div>
                    <div>
                      <strong className="text-blue-800 dark:text-blue-200">3. Zero-Knowledge Encryption</strong>
                      <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                        When using ERMITS-managed cloud features with encryption enabled, data is encrypted client-side using AES-256-GCM. Encryption keys are derived from your credentials and never transmitted to ERMITS.
                      </p>
                    </div>
                    <div>
                      <strong className="text-blue-800 dark:text-blue-200">4. Data Minimization</strong>
                      <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                        We collect only the minimum data necessary for service functionality. Raw SBOM files, assessment content, CUI, FCI, and proprietary business data are never collected.
                      </p>
                    </div>
                    <div>
                      <strong className="text-blue-800 dark:text-blue-200">5. Transparency and Control</strong>
                      <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                        You have complete control over your data: export all data at any time, delete permanently with one click, opt in or out of telemetry collection, and choose your deployment model.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  3. Information We Collect
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      3.1 Information You Provide Directly
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        <strong>Account Information (Optional):</strong> When you create an account or subscribe to paid features, we collect:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                        <li>Name: Your full name or preferred name</li>
                        <li>Email Address: For authentication, communications, and billing</li>
                        <li>Company Name and Job Title: Optional, for business context</li>
                        <li>Billing Information: Processed by Stripe, Inc. (our payment processor)</li>
                        <li>Password: Cryptographically hashed using bcrypt, never stored in plaintext</li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      3.2 Information We Do NOT Collect
                    </h3>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
                        ERMITS explicitly does NOT collect, access, store, or transmit:
                      </p>
                      <ul className="list-disc list-inside text-red-700 dark:text-red-300 text-sm space-y-1 ml-4">
                        <li>Security assessment responses or scores</li>
                        <li>SBOM files or contents</li>
                        <li>Vulnerability scan results or CVE findings</li>
                        <li>System Security Plans (SSPs) or POA&Ms</li>
                        <li>CUI (Controlled Unclassified Information)</li>
                        <li>FCI (Federal Contract Information)</li>
                        <li>PHI (Protected Health Information) under HIPAA</li>
                        <li>Trade secrets or proprietary information</li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      3.3 Automatically Collected Information
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                      <strong>Pseudonymized Telemetry (Optional - Opt-In Required):</strong> With your explicit consent, we collect anonymous, aggregated performance data:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                      <li>Feature usage statistics (which tools are used, how often)</li>
                      <li>Performance metrics (page load times, API response times)</li>
                      <li>Error reports (crash logs, exceptions) with PII automatically scrubbed</li>
                      <li>Browser and device information (browser type/version, OS, screen resolution)</li>
                    </ul>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2 text-sm">
                      <strong>Privacy Protections:</strong> User identifiers are cryptographically hashed (SHA-256) and cannot be reverse-engineered. Telemetry never includes file contents, assessment results, or user inputs.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  4. How We Use Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      4.1 Service Delivery and Operation
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      We use collected information to provide Services, process transactions, authenticate users, enable features, and provide customer support.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      4.2 Service Improvement and Analytics
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      We use pseudonymized, aggregate data to analyze usage patterns, identify issues, develop features, conduct research, and benchmark performance.
                    </p>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-2">
                      <p className="text-yellow-800 dark:text-yellow-200 font-semibold mb-1">We do NOT:</p>
                      <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-300 text-sm space-y-1 ml-4">
                        <li>Analyze your individual assessment results or SBOM data</li>
                        <li>Use your data to train AI models or machine learning systems</li>
                        <li>Profile users for behavioral targeting or marketing</li>
                        <li>Sell or monetize your data in any way</li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      4.3 Communication
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      We use your contact information for service announcements, security alerts, support responses, transactional emails, product updates (opt-in only), and marketing communications (with explicit consent, easy opt-out).
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  5. Information Sharing and Disclosure
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      5.1 Service Providers (Sub-Processors)
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                      We share limited data with trusted third-party service providers:
                    </p>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm border border-gray-300 dark:border-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                          <tr>
                            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Service Provider</th>
                            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Purpose</th>
                            <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Location</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700 dark:text-gray-300">
                          <tr>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Supabase, Inc.</td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Database and authentication</td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">United States / EU</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Stripe, Inc.</td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Payment processing</td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">United States</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Sentry</td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Error monitoring</td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">United States</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">PostHog, Inc.</td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Analytics (opt-in)</td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">United States / EU</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2 text-sm">
                      All sub-processors are contractually required to use data only for specified purposes, implement appropriate security measures, comply with applicable privacy laws, and delete data when no longer needed.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      5.2 Legal Requirements
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      We may disclose information if required by law or in response to court orders, government requests, legal process, or national security threats (where legally required). When legally permitted, we will notify affected users and challenge overly broad requests.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  6. Data Security Measures
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
                    <Shield className="h-8 w-8 text-primary-500 mb-2" />
                    <h3 className="font-semibold text-primary-800 dark:text-primary-200 mb-1">Encryption</h3>
                    <p className="text-primary-700 dark:text-primary-300 text-sm">
                      TLS 1.3 for data in transit, AES-256-GCM for data at rest, client-side encryption with user-controlled keys
                    </p>
                  </div>
                  <div className="bg-secondary-50 dark:bg-secondary-900/20 rounded-lg p-4">
                    <Lock className="h-8 w-8 text-secondary-500 mb-2" />
                    <h3 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-1">Access Controls</h3>
                    <p className="text-secondary-700 dark:text-secondary-300 text-sm">
                      Multi-factor authentication, role-based access control, row-level security, principle of least privilege
                    </p>
                  </div>
                  <div className="bg-success-50 dark:bg-success-900/20 rounded-lg p-4">
                    <CheckCircle className="h-8 w-8 text-success-500 mb-2" />
                    <h3 className="font-semibold text-success-800 dark:text-success-200 mb-1">Infrastructure</h3>
                    <p className="text-success-700 dark:text-success-300 text-sm">
                      Enterprise-grade hosting, DDoS protection, WAF, intrusion detection, regular security audits
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  7. Your Privacy Rights
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Universal Rights (All Users)
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                      <li><strong>Right to Access:</strong> Request a copy of all personal data we hold about you</li>
                      <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete personal data</li>
                      <li><strong>Right to Deletion:</strong> Request deletion of your personal data</li>
                      <li><strong>Right to Data Portability:</strong> Export your data in machine-readable formats</li>
                      <li><strong>Right to Restriction of Processing:</strong> Request limitation of processing in certain circumstances</li>
                      <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Additional Rights for EU/UK/Swiss Users (GDPR)
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Right to withdraw consent, right to lodge a complaint with your local data protection authority, 
                      right to data protection impact assessment information, and right to human review of automated decisions.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Additional Rights for California Residents (CCPA/CPRA)
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Right to know, right to delete, right to opt-out of sale (ERMITS does not sell personal information), 
                      right to correct, right to limit use of sensitive personal information, and right to non-discrimination.
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-blue-800 dark:text-blue-200 font-semibold mb-1">How to Exercise Your Rights:</p>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Submit requests via email to <a href="mailto:privacy@ermits.com" className="underline">privacy@ermits.com</a>, 
                      use the online form at <a href="http://www.ermits.com/privacy-request" className="underline" target="_blank" rel="noopener noreferrer">www.ermits.com/privacy-request</a>, 
                      or navigate to Account Settings → Privacy Rights in-app.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  8. Data Retention
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    We retain your data for as long as your account is active or as needed to provide Services. 
                    Account information is retained for the duration of account + 30 days after termination. 
                    User-generated content is user-controlled and can be deleted anytime; deleted 30 days after account termination (90 days for backups).
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Pseudonymized telemetry is retained indefinitely (anonymous, cannot be linked to individuals). 
                    Server logs (IP addresses) are retained for 90 days, then automatically deleted.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  9. International Data Transfers
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  ERMITS is based in the United States. For data transfers from the EEA, UK, or Switzerland to the United States, 
                  we use European Commission-approved Standard Contractual Clauses (SCCs) and additional safeguards including 
                  encryption, access controls, and regular security assessments. EU data residency options are available (Supabase EU region).
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  10. Children's Privacy
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  The Services are not intended for children under 18 years of age. We do not knowingly collect personal information 
                  from children under 18. If we learn that we have collected personal information from a child under 18 without verified 
                  parental consent, we will delete the information as quickly as possible.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  11. Contact Information
                </h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                    For questions, concerns, or notices regarding this Privacy Policy:
                  </p>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                    <li><strong>General Privacy Questions:</strong> <a href="mailto:privacy@ermits.com" className="text-primary-600 dark:text-primary-400 hover:underline">privacy@ermits.com</a></li>
                    <li><strong>Data Rights Requests:</strong> <a href="mailto:privacy@ermits.com" className="text-primary-600 dark:text-primary-400 hover:underline">privacy@ermits.com</a></li>
                    <li><strong>Data Protection Officer (EU/UK/Swiss):</strong> <a href="mailto:privacy@ermits.com" className="text-primary-600 dark:text-primary-400 hover:underline">privacy@ermits.com</a></li>
                    <li><strong>California Privacy Requests (CCPA/CPRA):</strong> <a href="mailto:privacy@ermits.com" className="text-primary-600 dark:text-primary-400 hover:underline">privacy@ermits.com</a></li>
                    <li><strong>HIPAA Privacy Officer (Healthcare):</strong> <a href="mailto:privacy@ermits.com" className="text-primary-600 dark:text-primary-400 hover:underline">privacy@ermits.com</a></li>
                    <li><strong>Website:</strong> <a href="http://www.ermits.com/privacy" className="text-primary-600 dark:text-primary-400 hover:underline" target="_blank" rel="noopener noreferrer">www.ermits.com/privacy</a></li>
                  </ul>
                </div>
              </section>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>Note:</strong> This is a summary of the Master Privacy Policy. 
                  The complete policy includes additional sections covering Product-Specific Privacy Considerations, 
                  Special Considerations (Federal Contractor Privacy, Healthcare Privacy, Financial Services Privacy), 
                  Updates to This Privacy Policy, and detailed information about each product line. 
                  For the complete policy, please contact <a href="mailto:privacy@ermits.com" className="underline">privacy@ermits.com</a>.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
