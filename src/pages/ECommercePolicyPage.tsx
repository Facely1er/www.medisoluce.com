import React from 'react';
import { CreditCard, RefreshCw, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import SEOHead from '../components/ui/SEOHead';

const ECommercePolicyPage: React.FC = () => {
  return (
    <div className="py-12">
      <SEOHead 
        title="E-Commerce Policies - ERMITS"
        description="Subscription, Payment Terms, and Refund & Cancellation Policy for ERMITS LLC"
        noindex={true}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <CreditCard className="h-16 w-16 text-primary-500 mx-auto mb-4" />
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              E-Commerce Policies
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Version:</strong> 1.0<br />
              <strong>Last Updated:</strong> November 19, 2025<br />
              <strong>Effective Date:</strong> November 19, 2025
            </p>
          </div>

          <Card className="p-8">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="mb-8">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  These E-Commerce Policies supplement the ERMITS LLC Master Terms of Service and govern all paid subscriptions, 
                  purchases, and financial transactions related to ERMITS Services.
                </p>
              </div>

              <hr className="my-8 border-gray-300 dark:border-gray-700" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  1. Subscription & Payment Terms
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  <strong>Effective Date:</strong> November 19, 2025 | <strong>Last Updated:</strong> November 19, 2025
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      1.1 Subscription Plans and Pricing
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Freemium Tiers (No Payment Required):</h4>
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                          <li>Limited feature access</li>
                          <li>Usage quotas and restrictions</li>
                          <li>Community support only</li>
                          <li>No service level commitments</li>
                          <li>Subject to modification or termination at any time</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Free Trial Plans:</h4>
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                          <li>Full feature access for trial period (typically 14-30 days)</li>
                          <li>Requires payment method on file</li>
                          <li>Automatically converts to paid subscription unless cancelled</li>
                          <li>One free trial per user/organization per product</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Paid Subscription Tiers:</h4>
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                          <li><strong>Standard/Professional Plans:</strong> Core features, standard usage quotas, email support (24-hour response), monthly or annual billing</li>
                          <li><strong>Enterprise Plans:</strong> Advanced features, higher usage quotas, priority support (4-hour response), custom billing arrangements, dedicated account management</li>
                          <li><strong>Federal/Government Plans:</strong> CMMC-compliant features, FedRAMP-aligned infrastructure options, government-specific support, custom pricing</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      1.2 Billing and Payment
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Payment Methods:</h4>
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                          <li>Credit cards (Visa, Mastercard, American Express, Discover)</li>
                          <li>Debit cards with credit card logo</li>
                          <li>ACH bank transfers (Enterprise customers only)</li>
                          <li>Wire transfers (Enterprise customers, annual plans only)</li>
                          <li>Purchase orders (Enterprise/Government customers with approved credit)</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                          All credit/debit card payments processed by Stripe, Inc. ERMITS does not store complete payment card information.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Billing Cycles:</h4>
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                          <li><strong>Monthly Subscriptions:</strong> Billed on the same day each month</li>
                          <li><strong>Annual Subscriptions:</strong> Billed once per year on subscription anniversary date (typically 15-20% savings)</li>
                          <li><strong>Custom Billing (Enterprise):</strong> Negotiated billing terms, quarterly or semi-annual billing available</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Automatic Renewal:</h4>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          Subscriptions automatically renew at the end of each billing cycle. Email notifications sent 7 days before renewal (monthly) or 30 days before renewal (annual). 
                          Cancel anytime before renewal date to prevent automatic renewal.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      1.3 Product-Specific Pricing
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                        <strong>Note:</strong> Exact pricing subject to change. See individual product websites for current pricing.
                      </p>
                      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                        <p><strong>ERMITS Advisory + STEEL™:</strong> Digital Products ($29-$499 one-time), Advisory Services ($25K-$125K custom pricing)</p>
                        <p><strong>TechnoSoluce™ SBOM Analyzer:</strong> Starter $5,000/year, Professional $12,000/year, Enterprise $25,000/year</p>
                        <p><strong>CyberCertitude™:</strong> CMMC Level 1 Free, Level 2 $179.99-$359.99/month, One-time purchases $399-$699</p>
                        <p><strong>VendorSoluce™:</strong> Starter $39/month, Professional $129/month, Enterprise $399/month</p>
                        <p><strong>CyberCorrect™:</strong> Starter $49/month, Professional $99/month, One-time purchases $99-$299</p>
                        <p><strong>CyberCaution™:</strong> One-time purchases $49-$149, Enterprise custom pricing</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      1.4 Taxes and Fees
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Sales tax charged based on billing address (United States). VAT charged for EU customers based on location. 
                      Applicable taxes charged per local requirements. No additional fees for standard credit/debit card payments. 
                      Wire transfer fees may apply (typically $25-50 per transfer, paid by customer).
                    </p>
                  </div>
                </div>
              </section>

              <hr className="my-8 border-gray-300 dark:border-gray-700" />

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  2. Refund & Cancellation Policy
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  <strong>Effective Date:</strong> November 19, 2025 | <strong>Last Updated:</strong> November 19, 2025
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      2.1 No Money-Back Guarantee
                    </h3>
                    <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-6 w-6 text-warning-600 dark:text-warning-400 mt-1 mr-3 flex-shrink-0" />
                        <div>
                          <p className="text-warning-800 dark:text-warning-200 font-semibold mb-2">
                            General Policy
                          </p>
                          <p className="text-warning-700 dark:text-warning-300 text-sm">
                            ERMITS does <strong>not</strong> offer a standard 30-day money-back guarantee or similar blanket refund policy. 
                            All sales are final except as specifically provided in this policy. Free trials available for most products 
                            allow service evaluation without payment.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      2.2 Cancellation Process
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">How to Cancel:</h4>
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                          <li><strong>Self-Service:</strong> Log in → Account Settings → Billing → Subscription → Cancel Subscription</li>
                          <li><strong>Email:</strong> Send cancellation request to <a href="mailto:contact@ermits.com" className="text-primary-600 dark:text-primary-400 hover:underline">contact@ermits.com</a></li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Cancellation Effective Date:</h4>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          Cancellation takes effect at end of current billing period. Access continues through paid period. 
                          No charges after cancellation effective date. No partial refunds for remaining time in billing period.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      2.3 Refund Eligibility
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Digital Products (One-Time Purchases):</h4>
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                          <li><strong>Eligible:</strong> Refund available within 7 days of purchase if technical failure prevents access, product incomplete or materially different from description, or billing error</li>
                          <li><strong>Not Eligible:</strong> After 7 days, after downloading or accessing file, change of mind, or buyer's remorse</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Advisory Services:</h4>
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                          <li><strong>STEEL Strategic Assessments:</strong> Milestone-based billing with satisfaction checkpoints. Pro-rated refund if ERMITS fails to deliver contracted scope or material breach of Statement of Work</li>
                          <li><strong>On-Demand Advisory:</strong> Hourly or project-based billing. Refund for unperformed work only</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Subscription Products:</h4>
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 ml-4">
                          <li>No pro-rated refunds for monthly subscriptions</li>
                          <li>Annual subscriptions: No pro-rated refunds (see Section 2.5)</li>
                          <li>Refunds only for technical service failures</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      2.4 Non-Refundable Items
                    </h3>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
                        The following are never refundable:
                      </p>
                      <ul className="list-disc list-inside text-red-700 dark:text-red-300 text-sm space-y-1 ml-4">
                        <li>Partial period usage (unused portion of subscriptions after cancellation)</li>
                        <li>Add-on services (professional services rendered, custom development work, training sessions delivered)</li>
                        <li>Third-party costs (payment processing fees, bank transfer fees, currency conversion fees)</li>
                        <li>Promotional and discounted purchases</li>
                        <li>Beta products</li>
                        <li>Overage fees incurred</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      2.5 Annual Subscription Cancellations
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      <strong>Standard Policy:</strong> No prorated refunds for annual subscriptions. Cancellation takes effect at end of annual period. 
                      Access continues through paid annual period. Renewal prevented for next year.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
                      <strong>Exception:</strong> Prorated refund may be granted for significant service failures meeting criteria in Section 2.3.1.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      2.6 Data Retention After Cancellation
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      <strong>Paid Accounts:</strong> 30-day grace period for data export. Read-only access to data during grace period.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
                      <strong>Free Trials:</strong> 7-day grace period for data export.
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-2">
                      After grace period, all user data permanently deleted from production systems. Deletion cannot be reversed. 
                      Backups deleted within 90 days.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      2.7 Refund Processing
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Refunds are processed to original payment method. Credit/debit card refunds appear in 5-10 business days. 
                      Approved refunds initiated within 2 business days. Confirmation email sent when refund processed.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      2.8 Chargebacks and Payment Disputes
                    </h3>
                    <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-4">
                      <p className="text-warning-800 dark:text-warning-200 font-semibold mb-2">
                        Before Filing Chargeback:
                      </p>
                      <p className="text-warning-700 dark:text-warning-300 text-sm mb-2">
                        ERMITS strongly encourages contacting us before initiating a chargeback. Most issues resolved quickly and amicably.
                      </p>
                      <p className="text-warning-800 dark:text-warning-200 font-semibold mb-2 mt-3">
                        Consequences of Chargebacks:
                      </p>
                      <ul className="list-disc list-inside text-warning-700 dark:text-warning-300 text-sm space-y-1 ml-4">
                        <li>Immediate account suspension pending resolution</li>
                        <li>$25 chargeback fee charged (in addition to disputed amount)</li>
                        <li>Account permanently banned from ERMITS services if chargeback not reversed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Contact Information
                </h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                    For questions about these E-Commerce Policies:
                  </p>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                    <li><strong>Billing Questions:</strong> <a href="mailto:contact@ermits.com" className="text-primary-600 dark:text-primary-400 hover:underline">contact@ermits.com</a></li>
                    <li><strong>Payment Issues:</strong> <a href="mailto:contact@ermits.com" className="text-primary-600 dark:text-primary-400 hover:underline">contact@ermits.com</a></li>
                    <li><strong>Cancellation Requests:</strong> <a href="mailto:contact@ermits.com" className="text-primary-600 dark:text-primary-400 hover:underline">contact@ermits.com</a></li>
                    <li><strong>Refund Requests:</strong> <a href="mailto:contact@ermits.com" className="text-primary-600 dark:text-primary-400 hover:underline">contact@ermits.com</a></li>
                    <li><strong>Enterprise Sales:</strong> <a href="mailto:sales@ermits.com" className="text-primary-600 dark:text-primary-400 hover:underline">sales@ermits.com</a></li>
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-3">
                    <strong>Response Times:</strong> Standard inquiries within 24 hours, payment issues within 4 hours, enterprise inquiries within 1 business day.
                  </p>
                </div>
              </section>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>Note:</strong> This is a summary of the E-Commerce Policies. 
                  The complete policies include additional sections covering Upgrades/Downgrades, Free Trials, Freemium Accounts, 
                  Enterprise Agreements, Payment Failures, Promotional Offers, Purchase Orders, Currency and International Payments, 
                  Subscription Management, Beta Product Billing, and Special Circumstances. 
                  For the complete policies, please contact <a href="mailto:contact@ermits.com" className="underline">contact@ermits.com</a>.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ECommercePolicyPage;

