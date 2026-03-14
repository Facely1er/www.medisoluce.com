/**
 * Example: How to Integrate Free Trials into Pricing Pages
 * 
 * This example shows how to add trial functionality to your pricing pages
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import TrialActivationModal from '../components/trial/TrialActivationModal';
import TrialBanner from '../components/trial/TrialBanner';
import TrialOnboarding from '../components/trial/TrialOnboarding';
import { useTrial } from '../hooks/useTrial';
import { useToast } from '../components/ui/Toast';

// Example: HIPAA Pricing Page with Trial Integration
const HIPAAPricingPageWithTrial: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Get current user (in real app, get from auth context)
  const userId = 'user-123'; // Replace with actual user ID
  const userEmail = 'user@example.com'; // Replace with actual email
  
  // Get trial status for HIPAA product
  const { activeTrial, isEligible, startTrial: _startTrial } = useTrial(userId, 'hipaa');
  
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if onboarding should be shown
  useEffect(() => {
    if (activeTrial) {
      const onboardingShown = localStorage.getItem(`onboarding-shown-${activeTrial.productId}`);
      if (!onboardingShown) {
        // Show onboarding after a short delay
        setTimeout(() => setShowOnboarding(true), 1000);
      }
    }
  }, [activeTrial]);

  const handleStartTrial = () => {
    if (isEligible('hipaa')) {
      setShowTrialModal(true);
    } else {
      showToast({
        type: 'info',
        title: 'Trial Already Used',
        message: 'You have already used your free trial. Upgrade to continue.'
      });
      navigate('/pricing/hipaa?upgrade=true');
    }
  };

  const handleTrialStarted = (trialId: string) => {
    showToast({
      type: 'success',
      title: 'Trial Started!',
      message: 'Your free trial has begun. Enjoy full access!'
    });
    navigate('/dashboard');
  };

  const handleOnboardingComplete = () => {
    if (activeTrial) {
      localStorage.setItem(`onboarding-shown-${activeTrial.productId}`, 'true');
    }
    setShowOnboarding(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Trial Status Banner */}
      {activeTrial && (
        <TrialBanner
          trial={activeTrial}
          onDismiss={() => {
            localStorage.setItem(`trial-banner-dismissed-${activeTrial.productId}`, 'true');
          }}
        />
      )}

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Essential Tier */}
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-2">Essential</h3>
          <p className="text-3xl font-bold mb-4">$49/month</p>
          <Button onClick={() => navigate('/hipaa-check')}>
            Start Free Assessment
          </Button>
        </div>

        {/* Professional Tier */}
        <div className="border rounded-lg p-6 border-primary-500">
          <h3 className="text-xl font-bold mb-2">Professional</h3>
          <p className="text-3xl font-bold mb-4">$149/month</p>
          {activeTrial ? (
            <Button variant="outline" disabled>
              Trial Active
            </Button>
          ) : (
            <Button onClick={handleStartTrial}>
              Start Free Trial
            </Button>
          )}
        </div>

        {/* Enterprise Tier */}
        <div className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-2">Enterprise</h3>
          <p className="text-3xl font-bold mb-4">$499/month</p>
          <Button variant="outline" onClick={() => navigate('/contact')}>
            Contact Sales
          </Button>
        </div>
      </div>

      {/* Trial Activation Modal */}
      <TrialActivationModal
        isOpen={showTrialModal}
        onClose={() => setShowTrialModal(false)}
        productId="hipaa"
        productName="HIPAA Compliance"
        tier="professional"
        userId={userId}
        userEmail={userEmail}
        onTrialStarted={handleTrialStarted}
      />

      {/* Tailored Onboarding */}
      {showOnboarding && activeTrial && (
        <TrialOnboarding
          trial={activeTrial}
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingComplete}
        />
      )}
    </div>
  );
};

export default HIPAAPricingPageWithTrial;

