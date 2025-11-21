import React from 'react';
import { AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import SEOHead from '../components/ui/SEOHead';

const TermsPage: React.FC = () => {
  return (
    <div className="py-12">
      <SEOHead 
        title="Terms of Service - ERMITS"
        description="Master Terms of Service for ERMITS LLC products and services"
        noindex={true}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              MASTER TERMS OF SERVICE
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
                  By accessing or using any ERMITS LLC ("ERMITS," "we," "our," or "us")
                  products, platforms, or services (collectively, the "Services"), you
                  ("User," "you," or "your") agree to be bound by these Master Terms of
                  Service ("Terms"). If you do not agree to these Terms, do not use our
                  Services.
                </p>
              </div>

              <hr className="my-8 border-gray-300 dark:border-gray-700" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  1. Scope and Applicability
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  These Terms govern your use of all ERMITS products, including but not
                  limited to:
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      TechnoSoluce™ Brand Products:
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                      <li>SBOM Analyzer - Software supply chain security and vulnerability analysis</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      CyberCertitude™ Brand Products:
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                      <li>CMMC 2.0 Level 1 Implementation Suite</li>
                      <li>CMMC 2.0 Level 2 Compliance Platform</li>
                      <li>Original Toolkit (localStorage-based compliance management)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      VendorSoluce™ Brand Products:
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                      <li>Supply Chain Risk Management Platform</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      CyberCorrect™ Brand Products:
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                      <li>Privacy Portal (Workplace privacy compliance)</li>
                      <li>Privacy Platform (Multi-regulation privacy compliance automation)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      CyberCaution™ Brand Products:
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                      <li>RansomCheck (Ransomware readiness assessment)</li>
                      <li>Security Toolkit (Comprehensive cybersecurity assessment platform)</li>
                      <li>RiskProfessional (CISA-aligned security assessments)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      ERMITS Advisory + STEEL™ Brand Products and Services:
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                      <li>STEEL™ Assessment Platform (Strategic Threat & Enterprise Evaluation Layer)</li>
                      <li>STEEL™ Premium Assessment ($29 digital product)</li>
                      <li>vCISO Starter Kit ($299 digital product)</li>
                      <li>Executive Dashboard Template ($79 digital product)</li>
                      <li>Compliance Toolkit (digital product)</li>
                      <li>Incident Response Toolkit (digital product)</li>
                      <li>Vendor Risk Toolkit (digital product)</li>
                      <li>Premium Toolkits (subscription-based digital products)</li>
                      <li>STEEL Strategic Assessment Services ($25,000-$125,000 custom pricing)</li>
                      <li>On-Demand Advisory Services (custom pricing)</li>
                      <li>Compliance Advisory Services (custom pricing)</li>
                      <li>Virtual CISO (vCISO) Services (custom pricing)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      SocialCaution Brand Products:
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                      <li>Personalized Privacy Platform with AI-powered persona detection</li>
                      <li>Privacy Exposure Index for online services</li>
                      <li>Service Catalog with risk profiles</li>
                      <li>Adaptive privacy resources and tools</li>
                      <li>Digital footprint analysis</li>
                    </ul>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                  Product-specific terms may apply as set forth in Product-Specific Addendums.
                </p>
              </section>

              <hr className="my-8 border-gray-300 dark:border-gray-700" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  2. Definitions
                </h2>
                <div className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong>"Privacy-First Architecture"</strong> means ERMITS' system design
                    philosophy ensuring that user data is processed locally whenever
                    possible, with optional encrypted cloud synchronization, pseudonymized
                    telemetry, and zero-knowledge data handling principles.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong>"User Data"</strong> means any information, content, files, or materials
                    that you upload, submit, generate, or process through the Services.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong>"Controlled Unclassified Information" or "CUI"</strong> means information
                    that requires safeguarding or dissemination controls pursuant to federal
                    law, regulations, or government-wide policies.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong>"Federal Contract Information" or "FCI"</strong> means information not
                    intended for public release that is provided by or generated for the
                    U.S. Government under a contract.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong>"Beta Products"</strong> means Services explicitly marked as "Beta,"
                    "Preview," "Early Access," or similar designations indicating
                    pre-release or testing status.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong>"Advisory Services"</strong> means professional consulting, strategic
                    guidance, assessments, and expert recommendations provided by ERMITS
                    personnel or contractors, including but not limited to STEEL Strategic
                    Assessments, vCISO services, compliance advisory, and on-demand
                    consulting. Advisory Services are distinct from self-service Digital
                    Products.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong>"Digital Products"</strong> means self-service downloadable or web-based
                    tools, templates, assessments, and resources available for immediate
                    purchase and use without professional consulting, including but not
                    limited to STEEL Premium Assessment, vCISO Starter Kit, Executive
                    Dashboard Template, and Premium Toolkits.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong>"STEEL™ Framework"</strong> means ERMITS' proprietary Strategic Threat &
                    Enterprise Evaluation Layer methodology for assessing organizational
                    cybersecurity and risk posture across Political, Economic, Social,
                    Technological, Environmental, and Legal (PESTEL) factors.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong>"Privacy Persona"</strong> means the AI-determined privacy profile
                    classification assigned by SocialCaution based on user assessment
                    responses, used to personalize privacy recommendations and resources.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong>"Privacy Exposure Index"</strong> means SocialCaution's quantified
                    privacy risk score (0-100) for online services based on publicly
                    available data, privacy policies, and service characteristics.
                  </p>
                </div>
              </section>

              <hr className="my-8 border-gray-300 dark:border-gray-700" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  3. Eligibility and Account Requirements
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Age Requirement:
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      You must be at least 18 years of age to use the Services. By using the Services, you represent and warrant that you meet this age requirement.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Authority:
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      If you are using the Services on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Account Security:
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                      You are responsible for:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                      <li>Maintaining the confidentiality of your account credentials</li>
                      <li>All activities that occur under your account</li>
                      <li>Notifying ERMITS immediately of any unauthorized access or security breach</li>
                      <li>Using strong, unique passwords and enabling multi-factor authentication where available</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Accurate Information:
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      You agree to provide accurate, current, and complete information during registration and to update such information to maintain its accuracy.
                    </p>
                  </div>
                </div>
              </section>

              <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-6 my-8">
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 text-warning-600 dark:text-warning-400 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-warning-800 dark:text-warning-200 font-medium mb-2">
                      Important Legal Notice
                    </h3>
                    <p className="text-warning-700 dark:text-warning-300 text-sm">
                      This is a summary of key terms. Please review the complete Terms of Service document for all terms and conditions. The information and tools provided by ERMITS are for informational purposes only and do not constitute legal advice. Users should consult with qualified legal and compliance professionals for specific regulatory guidance.
                    </p>
                  </div>
                </div>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  4. Privacy-First Architecture and Data Handling
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  ERMITS implements a Privacy-First Architecture across all products,
                  built on the following principles:
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      4.1 Client-Side Processing
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      All core computational functions (assessments, SBOM analysis, risk
                      scoring, compliance evaluations, privacy persona detection) are
                      performed locally within your browser or self-managed environment
                      whenever technically feasible.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      4.2 Data Sovereignty Options
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                      You have multiple deployment and storage options:
                    </p>
                    <div className="ml-4 space-y-2">
                      <div>
                        <strong className="text-gray-900 dark:text-white">Local Storage Options:</strong>
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                          <li>Browser-based local storage (IndexedDB, localStorage)</li>
                          <li>Desktop application with local file storage</li>
                          <li>On-premises deployment (Enterprise customers)</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-gray-900 dark:text-white">Cloud Storage Options:</strong>
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                          <li>Self-managed cloud infrastructure (you control the environment)</li>
                          <li>ERMITS-managed cloud (Supabase or alternative providers)</li>
                          <li>Hybrid deployment (local processing with optional encrypted sync)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      4.3 Data Residency
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      For cloud-managed options, data residency is determined by your selected deployment region, applicable compliance requirements, and service infrastructure location (disclosed per product).
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      4.4 Zero-Knowledge Principles
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                      When using ERMITS-managed cloud services with encryption enabled:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                      <li>Data is encrypted client-side using AES-256-GCM via WebCrypto</li>
                      <li>Encryption keys are derived from your credentials and never transmitted to ERMITS</li>
                      <li>ERMITS administrators cannot decrypt your data</li>
                      <li>You are solely responsible for maintaining access to your encryption keys</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      4.5 Data Minimization
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                      ERMITS collects only the minimum data necessary for service functionality:
                    </p>
                    <div className="ml-4 space-y-2">
                      <div>
                        <strong className="text-gray-900 dark:text-white">Never Collected:</strong>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          Raw SBOM files, assessment content, CUI, FCI, proprietary business data, or detailed vulnerability findings remain under your exclusive control
                        </p>
                      </div>
                      <div>
                        <strong className="text-gray-900 dark:text-white">Optionally Collected:</strong>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          Account information (name, email, company) for authentication and billing
                        </p>
                      </div>
                      <div>
                        <strong className="text-gray-900 dark:text-white">Pseudonymized Telemetry:</strong>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          Anonymous performance metrics using irreversible cryptographic hashing (opt-in or opt-out based on product)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  5. License Grant and Restrictions
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      5.1 License to Use Services
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Subject to your compliance with these Terms, ERMITS grants you a
                      limited, non-exclusive, non-transferable, revocable license to access
                      and use the Services for your internal business or personal purposes.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      5.2 License Restrictions
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                      You may not:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                      <li>Modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information, software, products, or services obtained from the Services</li>
                      <li>Reverse engineer, decompile, disassemble, or attempt to discover source code or underlying algorithms (except to the extent such restriction is prohibited by applicable law)</li>
                      <li>Remove, obscure, or alter any proprietary rights notices</li>
                      <li>Use the Services to develop competing products or services</li>
                      <li>Access the Services through automated means (bots, scrapers) without prior written authorization</li>
                      <li>Attempt to circumvent security measures or gain unauthorized access</li>
                      <li>Use the Services in any way that violates applicable laws or regulations</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  6. User Data Ownership and Responsibilities
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      6.1 User Data Ownership
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      You retain all ownership rights in your User Data. ERMITS does not claim
                      any ownership or intellectual property rights in your User Data.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      6.2 User Data License to ERMITS
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      You grant ERMITS a limited license to your User Data solely to the
                      extent necessary to provide the Services to you, perform technical operations (backup, recovery, security monitoring), and comply with legal obligations.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      6.3 User Data Responsibilities
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                      You are solely responsible for:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                      <li>The accuracy, quality, and legality of your User Data</li>
                      <li>The means by which you acquired User Data</li>
                      <li>Compliance with all applicable laws regarding User Data processing</li>
                      <li>Maintaining appropriate security controls for your User Data</li>
                      <li>Backup and disaster recovery of locally-stored data</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  7. Intellectual Property Rights
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  All intellectual property rights in the Services, including but not
                  limited to software, algorithms, user interfaces, documentation,
                  trademarks, and branding, are owned by ERMITS LLC or its licensors. No
                  ownership rights are transferred to you under these Terms.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                  TechnoSoluce™, CyberCertitude™, VendorSoluce™, CyberCorrect™,
                  CyberCaution™, ERMITS Advisory™, STEEL™, SocialCaution™, and all
                  associated logos and branding are trademarks of ERMITS LLC. You may not
                  use these trademarks without ERMITS' prior written consent.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  8. Payment Terms
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Pricing for Services is set forth on the ERMITS website or in your
                  subscription agreement. All fees are in U.S. Dollars unless otherwise specified.
                  Fees are non-refundable except as expressly provided in the Refund &
                  Cancellation Policy. Detailed payment terms are set forth in the Subscription & Payment Terms (E-Commerce Policies).
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  9. Warranties and Disclaimers
                </h2>
                <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-6">
                  <p className="text-warning-700 dark:text-warning-300 text-sm mb-4">
                    EXCEPT AS EXPRESSLY PROVIDED, THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" 
                    WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                  </p>
                  <ul className="list-disc list-inside text-warning-700 dark:text-warning-300 text-sm space-y-1 ml-4">
                    <li>No warranty that Services will meet your specific requirements</li>
                    <li>No guarantee of continuous, error-free operation</li>
                    <li>No guarantee that Services are completely secure or error-free</li>
                    <li>No warranty regarding accuracy, completeness, or reliability of outputs</li>
                    <li>No guarantee that use of Services will result in regulatory compliance or certification</li>
                  </ul>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                  ERMITS products and services are tools to assist with security and
                  compliance efforts but do not guarantee compliance with any regulatory framework,
                  do not constitute legal, compliance, or professional consulting advice
                  (except where Advisory Services explicitly provide such advice), and
                  require users to interpret results in the context of their specific obligations.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  10. Limitation of Liability
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL
                  ERMITS LLC, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR
                  LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, 
                  OR PUNITIVE DAMAGES, LOSS OF PROFITS, REVENUE, DATA, USE, GOODWILL, OR 
                  OTHER INTANGIBLE LOSSES.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                  ERMITS' TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THESE
                  TERMS OR USE OF THE SERVICES SHALL NOT EXCEED THE GREATER OF $100 USD, OR
                  THE TOTAL AMOUNT PAID BY YOU TO ERMITS IN THE 12 MONTHS PRECEDING THE CLAIM.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  11. Governing Law and Dispute Resolution
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  These Terms are governed by and construed in accordance with the laws of
                  the District of Columbia, United States, without regard to conflict of
                  law principles. Any dispute, controversy, or claim arising out of or relating to these
                  Terms shall be resolved by binding arbitration administered by the American Arbitration Association (AAA)
                  under its Commercial Arbitration Rules, conducted in Washington, D.C.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  12. Contact Information
                </h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                    For questions, concerns, or notices regarding these Terms:
                  </p>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-1">
                    <li><strong>ERMITS LLC</strong></li>
                    <li><strong>Email:</strong> <a href="mailto:contact@ermits.com" className="text-primary-600 dark:text-primary-400 hover:underline">contact@ermits.com</a></li>
                    <li><strong>Website:</strong> <a href="https://www.ermits.com" className="text-primary-600 dark:text-primary-400 hover:underline" target="_blank" rel="noopener noreferrer">www.ermits.com</a></li>
                    <li className="mt-2"><strong>For technical support inquiries:</strong> <a href="mailto:contact@ermits.com" className="text-primary-600 dark:text-primary-400 hover:underline">contact@ermits.com</a></li>
                    <li><strong>For privacy inquiries:</strong> <a href="mailto:privacy@ermits.com" className="text-primary-600 dark:text-primary-400 hover:underline">privacy@ermits.com</a></li>
                    <li><strong>For compliance and legal inquiries:</strong> <a href="mailto:legal@ermits.com" className="text-primary-600 dark:text-primary-400 hover:underline">legal@ermits.com</a></li>
                    <li><strong>For advisory services inquiries:</strong> <a href="mailto:advisory@ermits.com" className="text-primary-600 dark:text-primary-400 hover:underline">advisory@ermits.com</a></li>
                  </ul>
                </div>
              </section>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>Note:</strong> This is a summary of the Master Terms of Service. 
                  The complete terms include additional sections covering Beta Products, Federal Contractor Terms, 
                  Acceptable Use, Term and Termination, Indemnification, Force Majeure, Service Level Commitments, 
                  Modifications to Services and Terms, and General Provisions. For the complete terms, please 
                  contact <a href="mailto:legal@ermits.com" className="underline">legal@ermits.com</a>.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
