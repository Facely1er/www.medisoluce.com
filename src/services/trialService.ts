/**
 * Free Trial Management Service
 * Handles trial tracking, expiration, notifications, and automated conversion
 */

export interface TrialStatus {
  userId: string;
  productId: string;
  productName: string;
  tier: 'essential' | 'professional' | 'enterprise';
  startDate: string;
  endDate: string;
  daysRemaining: number;
  status: 'active' | 'expired' | 'converted' | 'cancelled';
  paymentMethodRequired: boolean;
  paymentMethodOnFile: boolean;
  autoConvert: boolean;
  notificationsSent: {
    threeDays: boolean;
    oneDay: boolean;
    expired: boolean;
  };
  tailoredOnboarding?: {
    role?: string;
    useCase?: string;
    preferences?: Record<string, any>;
    completedSteps?: string[];
  };
}

export interface TrialRequest {
  userId: string;
  email: string;
  productId: string;
  productName: string;
  tier: 'essential' | 'professional' | 'enterprise';
  trialDays?: number; // Default 14-30 days based on tier
  paymentMethodId?: string;
  tailoredData?: {
    role?: string;
    organizationType?: string;
    useCase?: string;
    preferences?: Record<string, any>;
  };
}

class TrialService {
  private readonly STORAGE_KEY = 'medisoluce-trials';
  private readonly DEFAULT_TRIAL_DAYS = {
    essential: 14,
    professional: 30,
    enterprise: 30
  };

  /**
   * Check if user is eligible for a free trial
   */
  isEligibleForTrial(userId: string, productId: string): boolean {
    const trials = this.getAllTrials();
    const existingTrial = trials.find(
      t => t.userId === userId && t.productId === productId
    );
    
    // One trial per user per product
    if (existingTrial) {
      return false;
    }
    
    return true;
  }

  /**
   * Start a new free trial with tailored onboarding
   */
  startTrial(request: TrialRequest): TrialStatus {
    if (!this.isEligibleForTrial(request.userId, request.productId)) {
      throw new Error('User is not eligible for a trial of this product');
    }

    const trialDays = request.trialDays || this.DEFAULT_TRIAL_DAYS[request.tier];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + trialDays);

    const trial: TrialStatus = {
      userId: request.userId,
      productId: request.productId,
      productName: request.productName,
      tier: request.tier,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      daysRemaining: trialDays,
      status: 'active',
      paymentMethodRequired: request.tier !== 'essential',
      paymentMethodOnFile: !!request.paymentMethodId,
      autoConvert: true,
      notificationsSent: {
        threeDays: false,
        oneDay: false,
        expired: false
      },
      tailoredOnboarding: {
        role: request.tailoredData?.role,
        useCase: request.tailoredData?.useCase,
        preferences: request.tailoredData?.preferences,
        completedSteps: []
      }
    };

    this.saveTrial(trial);
    this.scheduleNotifications(trial);
    this.initializeTailoredOnboarding(trial);

    return trial;
  }

  /**
   * Get active trial for user and product
   */
  getActiveTrial(userId: string, productId: string): TrialStatus | null {
    const trials = this.getAllTrials();
    return trials.find(
      t => t.userId === userId && 
           t.productId === productId && 
           t.status === 'active'
    ) || null;
  }

  /**
   * Get all trials for a user
   */
  getUserTrials(userId: string): TrialStatus[] {
    const trials = this.getAllTrials();
    return trials.filter(t => t.userId === userId);
  }

  /**
   * Check trial expiration and update status
   */
  checkTrialExpiration(): TrialStatus[] {
    const trials = this.getAllTrials();
    const now = new Date();
    const expiredTrials: TrialStatus[] = [];

    trials.forEach(trial => {
      if (trial.status === 'active') {
        const endDate = new Date(trial.endDate);
        const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        trial.daysRemaining = daysRemaining;

        if (daysRemaining <= 0) {
          trial.status = 'expired';
          if (!trial.notificationsSent.expired) {
            this.sendExpirationNotification(trial);
            trial.notificationsSent.expired = true;
          }
          expiredTrials.push(trial);
        } else {
          // Check for notification triggers
          this.checkNotificationTriggers(trial);
        }

        this.saveTrial(trial);
      }
    });

    return expiredTrials;
  }

  /**
   * Convert trial to paid subscription
   */
  convertTrialToPaid(userId: string, productId: string, subscriptionId?: string): TrialStatus {
    const trial = this.getActiveTrial(userId, productId);
    if (!trial) {
      throw new Error('No active trial found');
    }

    trial.status = 'converted';
    if (subscriptionId) {
      // Store subscription ID for reference
      localStorage.setItem(`subscription-${userId}-${productId}`, subscriptionId);
    }

    this.saveTrial(trial);
    return trial;
  }

  /**
   * Cancel trial before expiration
   */
  cancelTrial(userId: string, productId: string): TrialStatus {
    const trial = this.getActiveTrial(userId, productId);
    if (!trial) {
      throw new Error('No active trial found');
    }

    trial.status = 'cancelled';
    this.saveTrial(trial);
    return trial;
  }

  /**
   * Add payment method to trial
   */
  addPaymentMethod(userId: string, productId: string, paymentMethodId: string): TrialStatus {
    const trial = this.getActiveTrial(userId, productId);
    if (!trial) {
      throw new Error('No active trial found');
    }

    trial.paymentMethodOnFile = true;
    this.saveTrial(trial);
    return trial;
  }

  /**
   * Update tailored onboarding progress
   */
  updateOnboardingProgress(
    userId: string, 
    productId: string, 
    completedStep: string
  ): TrialStatus {
    const trial = this.getActiveTrial(userId, productId);
    if (!trial) {
      throw new Error('No active trial found');
    }

    if (!trial.tailoredOnboarding) {
      trial.tailoredOnboarding = { completedSteps: [] };
    }

    if (!trial.tailoredOnboarding.completedSteps?.includes(completedStep)) {
      trial.tailoredOnboarding.completedSteps?.push(completedStep);
      this.saveTrial(trial);
    }

    return trial;
  }

  /**
   * Get tailored onboarding recommendations based on user profile
   */
  getTailoredRecommendations(trial: TrialStatus): {
    steps: string[];
    priority: 'high' | 'medium' | 'low';
    description: string;
  }[] {
    const recommendations: {
      steps: string[];
      priority: 'high' | 'medium' | 'low';
      description: string;
    }[] = [];

    const role = trial.tailoredOnboarding?.role;
    const useCase = trial.tailoredOnboarding?.useCase;

    // Role-based recommendations
    if (role === 'compliance' || role === 'compliance-officer') {
      recommendations.push({
        steps: ['hipaa-assessment', 'policy-templates', 'training-tracking'],
        priority: 'high',
        description: 'Start with HIPAA assessment and compliance documentation'
      });
    }

    if (role === 'it' || role === 'ciso') {
      recommendations.push({
        steps: ['dependency-mapping', 'security-assessment', 'threat-analysis'],
        priority: 'high',
        description: 'Focus on technical security and system dependencies'
      });
    }

    if (role === 'operations' || role === 'operations-manager') {
      recommendations.push({
        steps: ['continuity-planning', 'impact-analysis', 'recovery-procedures'],
        priority: 'high',
        description: 'Prioritize business continuity and operational resilience'
      });
    }

    // Use case-based recommendations
    if (useCase === 'ransomware-protection') {
      recommendations.push({
        steps: ['ransomware-playbook', 'incident-response', 'backup-verification'],
        priority: 'high',
        description: 'Implement ransomware defense and response procedures'
      });
    }

    if (useCase === 'audit-readiness') {
      recommendations.push({
        steps: ['hipaa-assessment', 'documentation-review', 'gap-analysis'],
        priority: 'high',
        description: 'Prepare for upcoming compliance audits'
      });
    }

    // Default recommendations for all users
    recommendations.push({
      steps: ['dashboard-overview', 'feature-tour', 'first-assessment'],
      priority: 'medium',
      description: 'Get familiar with the platform basics'
    });

    return recommendations;
  }

  /**
   * Private helper methods
   */
  private getAllTrials(): TrialStatus[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveTrial(trial: TrialStatus): void {
    const trials = this.getAllTrials();
    const index = trials.findIndex(
      t => t.userId === trial.userId && t.productId === trial.productId
    );

    if (index >= 0) {
      trials[index] = trial;
    } else {
      trials.push(trial);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trials));
  }

  private scheduleNotifications(trial: TrialStatus): void {
    // Notifications are checked on each page load and via interval
    // This method sets up the initial notification schedule
    this.checkNotificationTriggers(trial);
  }

  private checkNotificationTriggers(trial: TrialStatus): void {
    const now = new Date();
    const endDate = new Date(trial.endDate);
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // 3 days before expiration
    if (daysRemaining <= 3 && daysRemaining > 1 && !trial.notificationsSent.threeDays) {
      this.sendThreeDayNotification(trial);
      trial.notificationsSent.threeDays = true;
      this.saveTrial(trial);
    }

    // 1 day before expiration
    if (daysRemaining <= 1 && daysRemaining > 0 && !trial.notificationsSent.oneDay) {
      this.sendOneDayNotification(trial);
      trial.notificationsSent.oneDay = true;
      this.saveTrial(trial);
    }
  }

  private sendThreeDayNotification(trial: TrialStatus): void {
    // In production, this would send an email
    // For now, we'll use browser notifications and localStorage
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Trial Ending Soon', {
        body: `Your ${trial.productName} trial expires in 3 days. Add a payment method to continue.`,
        icon: '/favicon.ico'
      });
    }

    // Store notification for display in UI
    const notifications = JSON.parse(localStorage.getItem('trial-notifications') || '[]');
    notifications.push({
      type: 'three-days',
      trialId: `${trial.userId}-${trial.productId}`,
      message: `Your ${trial.productName} trial expires in 3 days`,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('trial-notifications', JSON.stringify(notifications));
  }

  private sendOneDayNotification(trial: TrialStatus): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Trial Ending Tomorrow', {
        body: `Your ${trial.productName} trial expires tomorrow. Add a payment method now to avoid interruption.`,
        icon: '/favicon.ico'
      });
    }

    const notifications = JSON.parse(localStorage.getItem('trial-notifications') || '[]');
    notifications.push({
      type: 'one-day',
      trialId: `${trial.userId}-${trial.productId}`,
      message: `Your ${trial.productName} trial expires tomorrow`,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('trial-notifications', JSON.stringify(notifications));
  }

  private sendExpirationNotification(trial: TrialStatus): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Trial Expired', {
        body: `Your ${trial.productName} trial has expired. Upgrade to continue using the service.`,
        icon: '/favicon.ico'
      });
    }

    const notifications = JSON.parse(localStorage.getItem('trial-notifications') || '[]');
    notifications.push({
      type: 'expired',
      trialId: `${trial.userId}-${trial.productId}`,
      message: `Your ${trial.productName} trial has expired`,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('trial-notifications', JSON.stringify(notifications));
  }

  private initializeTailoredOnboarding(trial: TrialStatus): void {
    // Store onboarding data for personalized experience
    const onboardingKey = `onboarding-${trial.userId}-${trial.productId}`;
    localStorage.setItem(onboardingKey, JSON.stringify({
      started: new Date().toISOString(),
      recommendations: this.getTailoredRecommendations(trial),
      currentStep: 0
    }));
  }
}

// Export singleton instance
export const trialService = new TrialService();

// Auto-check trial expiration on service load and set up interval
if (typeof window !== 'undefined') {
  // Check immediately
  trialService.checkTrialExpiration();

  // Check every hour
  setInterval(() => {
    trialService.checkTrialExpiration();
  }, 60 * 60 * 1000);
}

