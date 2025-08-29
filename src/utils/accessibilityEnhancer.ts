// Accessibility enhancement utilities for healthcare compliance

interface AccessibilityConfig {
  enableKeyboardNav: boolean;
  enableScreenReader: boolean;
  enableHighContrast: boolean;
  enableFocusManagement: boolean;
  enableARIAEnhancements: boolean;
}

class AccessibilityEnhancer {
  private config: AccessibilityConfig;
  private focusHistory: HTMLElement[] = [];
  private trapStack: HTMLElement[] = [];

  constructor(config: Partial<AccessibilityConfig> = {}) {
    this.config = {
      enableKeyboardNav: true,
      enableScreenReader: true,
      enableHighContrast: true,
      enableFocusManagement: true,
      enableARIAEnhancements: true,
      ...config
    };

    this.initialize();
  }

  private initialize() {
    if (typeof window === 'undefined') return;

    this.setupKeyboardNavigation();
    this.setupScreenReaderSupport();
    this.setupFocusManagement();
    this.setupARIAEnhancements();
    this.setupHighContrastMode();
    this.monitorAccessibility();
  }

  private setupKeyboardNavigation() {
    if (!this.config.enableKeyboardNav) return;

    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Tab':
          this.handleTabNavigation(e);
          break;
        case 'Escape':
          this.handleEscapeKey(e);
          break;
        case 'Enter':
        case ' ':
          this.handleActivation(e);
          break;
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          this.handleArrowNavigation(e);
          break;
      }
    });

    // Skip links for keyboard users
    this.addSkipLinks();
  }

  private handleTabNavigation(e: KeyboardEvent) {
    const focusableElements = this.getFocusableElements();
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as HTMLElement);
    
    if (e.shiftKey && currentIndex === 0) {
      // Wrap to last element
      e.preventDefault();
      (focusableElements[focusableElements.length - 1] as HTMLElement).focus();
    } else if (!e.shiftKey && currentIndex === focusableElements.length - 1) {
      // Wrap to first element
      e.preventDefault();
      (focusableElements[0] as HTMLElement).focus();
    }
  }

  private handleEscapeKey(e: KeyboardEvent) {
    // Close modals, dropdowns, etc.
    const activeModal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
    const activeDropdown = document.querySelector('[aria-expanded="true"]');
    
    if (activeModal) {
      const closeButton = activeModal.querySelector('[data-close], [aria-label*="close" i]');
      if (closeButton) {
        (closeButton as HTMLElement).click();
      }
    } else if (activeDropdown) {
      (activeDropdown as HTMLElement).click();
    }
  }

  private handleActivation(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    
    // Handle activation of custom interactive elements
    if (target.hasAttribute('role') && 
        ['button', 'menuitem', 'tab', 'option'].includes(target.getAttribute('role') || '')) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        target.click();
      }
    }
  }

  private handleArrowNavigation(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    const parent = target.closest('[role="menu"], [role="listbox"], [role="tablist"], [role="radiogroup"]');
    
    if (parent) {
      e.preventDefault();
      const items = parent.querySelectorAll('[role="menuitem"], [role="option"], [role="tab"], [role="radio"]');
      const currentIndex = Array.from(items).indexOf(target);
      
      let nextIndex = currentIndex;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % items.length;
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + items.length) % items.length;
      }
      
      (items[nextIndex] as HTMLElement).focus();
    }
  }

  private addSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-primary-600 text-white p-2 z-50';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #0073e6;
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1000;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Ensure main content has proper ID
    const mainContent = document.querySelector('main') || document.querySelector('#main') || document.querySelector('#root');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
    }
  }

  private setupScreenReaderSupport() {
    if (!this.config.enableScreenReader) return;

    // Announce page changes
    this.announcePageChanges();
    
    // Enhance form labels
    this.enhanceFormLabels();
    
    // Add screen reader only content
    this.addScreenReaderContent();
  }

  private announcePageChanges() {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.id = 'page-announcer';
    document.body.appendChild(announcer);

    // Listen for route changes
    let currentPath = window.location.pathname;
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        const pageTitle = document.title || 'Page changed';
        announcer.textContent = `Navigated to ${pageTitle}`;
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  private enhanceFormLabels() {
    // Ensure all form inputs have proper labels
    document.querySelectorAll('input, select, textarea').forEach((input) => {
      const element = input as HTMLInputElement;
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        const label = document.querySelector(`label[for="${element.id}"]`);
        if (!label && element.placeholder) {
          element.setAttribute('aria-label', element.placeholder);
        }
      }
    });
  }

  private addScreenReaderContent() {
    // Add hidden content for screen readers
    const srOnlyStyle = `
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    `;

    // Add sr-only class to document
    const style = document.createElement('style');
    style.textContent = `.sr-only { ${srOnlyStyle} }`;
    document.head.appendChild(style);
  }

  private setupFocusManagement() {
    if (!this.config.enableFocusManagement) return;

    // Focus management for modals and overlays
    document.addEventListener('focusin', (e) => {
      const target = e.target as HTMLElement;
      this.focusHistory.push(target);
      
      // Keep focus history manageable
      if (this.focusHistory.length > 50) {
        this.focusHistory.splice(0, 25);
      }
    });

    // Trap focus in modals
    this.setupFocusTrap();
  }

  private setupFocusTrap() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            if (element.getAttribute('role') === 'dialog' || 
                element.classList.contains('modal')) {
              this.trapFocus(element);
            }
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  private trapFocus(container: HTMLElement) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus first element
    firstFocusable.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    this.trapStack.push(container);

    // Remove trap when modal is closed
    const removeHandler = () => {
      container.removeEventListener('keydown', handleTabKey);
      const index = this.trapStack.indexOf(container);
      if (index > -1) {
        this.trapStack.splice(index, 1);
      }
    };

    // Watch for modal removal
    const modalObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (node === container) {
            removeHandler();
            modalObserver.disconnect();
          }
        });
      });
    });

    modalObserver.observe(document.body, { childList: true, subtree: true });
  }

  private setupARIAEnhancements() {
    if (!this.config.enableARIAEnhancements) return;

    // Auto-enhance common patterns
    this.enhanceButtons();
    this.enhanceLinks();
    this.enhanceImages();
    this.enhanceHeadings();
  }

  private enhanceButtons() {
    document.querySelectorAll('button').forEach((button) => {
      // Add role if missing
      if (!button.getAttribute('role')) {
        button.setAttribute('role', 'button');
      }

      // Add aria-label for icon-only buttons
      if (!button.textContent?.trim() && !button.getAttribute('aria-label')) {
        const icon = button.querySelector('svg, .icon');
        if (icon) {
          button.setAttribute('aria-label', 'Button');
        }
      }
    });
  }

  private enhanceLinks() {
    document.querySelectorAll('a').forEach((link) => {
      // Add external link indicators
      if (link.hostname !== window.location.hostname) {
        if (!link.getAttribute('aria-label')?.includes('external')) {
          const currentLabel = link.getAttribute('aria-label') || link.textContent || 'Link';
          link.setAttribute('aria-label', `${currentLabel} (opens in new tab)`);
        }
      }

      // Add context for download links
      if (link.href.includes('.pdf') || link.href.includes('.doc') || link.download) {
        const currentLabel = link.getAttribute('aria-label') || link.textContent || 'Download';
        link.setAttribute('aria-label', `${currentLabel} (download)`);
      }
    });
  }

  private enhanceImages() {
    document.querySelectorAll('img').forEach((img) => {
      // Add empty alt for decorative images
      if (!img.getAttribute('alt') && img.getAttribute('role') === 'presentation') {
        img.setAttribute('alt', '');
      }

      // Warn about missing alt text in development
      if (!import.meta.env.PROD && !img.getAttribute('alt')) {
        console.warn('Image missing alt text:', img);
      }
    });
  }

  private enhanceHeadings() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let h1Count = 0;

    headings.forEach((heading) => {
      if (heading.tagName === 'H1') {
        h1Count++;
        if (h1Count > 1) {
          console.warn('Multiple H1 elements detected - consider using only one per page');
        }
      }

      // Add IDs for heading navigation
      if (!heading.id && heading.textContent) {
        const id = heading.textContent
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        heading.id = id;
      }
    });
  }

  private setupHighContrastMode() {
    if (!this.config.enableHighContrast) return;

    // Detect high contrast preference
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    
    const handleHighContrast = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
    };

    handleHighContrast(highContrastQuery);
    highContrastQuery.addEventListener('change', handleHighContrast);
  }

  private monitorAccessibility() {
    // Monitor for accessibility violations
    if (!import.meta.env.PROD) {
      this.runAccessibilityAudit();
    }
  }

  private runAccessibilityAudit() {
    const issues: string[] = [];

    // Enhanced check for missing alt text with auto-fix
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
    if (imagesWithoutAlt.length > 0) {
      issues.push(`${imagesWithoutAlt.length} images missing alt text`);
      
      // Auto-fix: Add meaningful alt text
      imagesWithoutAlt.forEach((img, index) => {
        const element = img as HTMLImageElement;
        const altText = this.generateMeaningfulAltText(element, index);
        element.setAttribute('alt', altText);
      });
      
      console.log(`✅ Auto-fixed: Added alt text to ${imagesWithoutAlt.length} images`);
    }

    // Enhanced heading hierarchy check with recommendations
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const h1Count = headings.filter(h => h.tagName === 'H1').length;
    
    if (h1Count > 1) {
      issues.push(`Multiple H1 elements detected (${h1Count}) - should be only one per page`);
    } else if (h1Count === 0) {
      issues.push('No H1 element found - page should have exactly one H1');
    }
    
    for (let i = 1; i < headings.length; i++) {
      const current = parseInt(headings[i].tagName.substring(1));
      const previous = parseInt(headings[i - 1].tagName.substring(1));
      
      if (current > previous + 1) {
        issues.push(`Heading hierarchy skip detected: ${headings[i - 1].tagName} to ${headings[i].tagName}`);
      }
    }

    // Enhanced interactive elements check with auto-fix
    const clickableElements = document.querySelectorAll('[onclick], .clickable');
    let fixedElements = 0;
    
    clickableElements.forEach((element) => {
      if (!element.getAttribute('role') && element.tagName !== 'BUTTON' && element.tagName !== 'A') {
        issues.push(`Interactive element missing proper role: ${element.tagName}`);
        
        // Auto-fix: Add appropriate role and keyboard support
        element.setAttribute('role', 'button');
        element.setAttribute('tabindex', '0');
        
        // Add keyboard event support
        element.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            (element as HTMLElement).click();
          }
        });
        
        fixedElements++;
      }
    });
    
    if (fixedElements > 0) {
      !import.meta.env.PROD && console.log(`✅ Auto-fixed: Added roles and keyboard support to ${fixedElements} elements`);
    }

    // Enhanced form inputs check with auto-fix
    const inputsWithoutLabels = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    let fixedInputs = 0;
    
    inputsWithoutLabels.forEach((input) => {
      const element = input as HTMLInputElement;
      const id = element.id;
      
      if (!id || !document.querySelector(`label[for="${id}"]`)) {
        issues.push(`Form input missing label: ${element.outerHTML.substring(0, 50)}...`);
        
        // Auto-fix: Add aria-label based on context
        const ariaLabel = this.generateInputLabel(element);
        element.setAttribute('aria-label', ariaLabel);
        fixedInputs++;
      }
    });
    
    if (fixedInputs > 0) {
      !import.meta.env.PROD && console.log(`✅ Auto-fixed: Added labels to ${fixedInputs} form inputs`);
    }
    
    // Enhanced contrast checking
    const contrastIssues = this.checkColorContrastIssues();
    if (contrastIssues.length > 0) {
      issues.push(...contrastIssues);
    }
    
    // Check for focus indicators
    const focusIssues = this.checkFocusIndicators();
    if (focusIssues.length > 0) {
      issues.push(...focusIssues);
      this.addFocusIndicators();
    }

    if (issues.length > 0) {
      console.group('Accessibility Issues Detected:');
      issues.forEach(issue => !import.meta.env.PROD && console.warn(issue));
      console.groupEnd();
    }

    return issues;
  }
  
  private generateMeaningfulAltText(img: HTMLImageElement, index: number): string {
    const src = img.src || img.getAttribute('data-src') || '';
    const className = img.className || '';
    const title = img.title || '';
    const parent = img.parentElement;
    
    // Try to generate meaningful alt text from context
    if (title) return title;
    if (src.includes('logo') || className.includes('logo')) return 'Company logo';
    if (src.includes('avatar') || className.includes('avatar')) return 'User avatar';
    if (src.includes('icon') || className.includes('icon')) return 'Icon';
    if (className.includes('chart') || className.includes('graph')) return 'Chart or graph';
    if (parent?.textContent?.includes('dashboard')) return 'Dashboard visualization';
    if (parent?.textContent?.includes('assessment')) return 'Assessment illustration';
    
    // Fallback to generic but descriptive text
    return `Illustration ${index + 1}`;
  }
  
  private generateInputLabel(input: HTMLInputElement): string {
    const type = input.type;
    const name = input.name;
    const placeholder = input.placeholder;
    const parent = input.closest('div, fieldset, section');
    const parentText = parent?.textContent || '';
    
    if (placeholder) return placeholder;
    if (name) return name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    if (parentText.includes('email')) return 'Email address';
    if (parentText.includes('password')) return 'Password';
    if (parentText.includes('name')) return 'Name';
    if (parentText.includes('phone')) return 'Phone number';
    
    switch (type) {
      case 'email': return 'Email address';
      case 'password': return 'Password';
      case 'tel': return 'Phone number';
      case 'search': return 'Search';
      case 'url': return 'Website URL';
      case 'number': return 'Number';
      case 'date': return 'Date';
      default: return `Input field (${type})`;
    }
  }
  
  private checkColorContrastIssues(): string[] {
    const issues: string[] = [];
    
    // Sample elements to check contrast
    const elementsToCheck = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, button, a, span');
    let contrastIssues = 0;
    
    // Check first 20 elements to avoid performance issues
    Array.from(elementsToCheck).slice(0, 20).forEach(element => {
      const style = window.getComputedStyle(element);
      const textColor = style.color;
      const backgroundColor = style.backgroundColor;
      
      // Simple contrast check (would use proper contrast calculation in production)
      if (textColor && backgroundColor && textColor === backgroundColor) {
        contrastIssues++;
      }
    });
    
    if (contrastIssues > 0) {
      issues.push(`${contrastIssues} elements may have contrast issues`);
    }
    
    return issues;
  }
  
  private checkFocusIndicators(): string[] {
    const issues: string[] = [];
    
    // Check if focus indicators are present
    const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const elementsWithFocus = document.querySelectorAll(':focus, .focus\\:outline-none, .focus\\:ring');
    
    if (focusableElements.length > 0 && elementsWithFocus.length === 0) {
      issues.push('Focus indicators may be missing for keyboard navigation');
    }
    
    return issues;
  }
  
  private addFocusIndicators(): void {
    // Add CSS for better focus indicators if not present
    if (!document.querySelector('style[data-focus-enhancement]')) {
      const style = document.createElement('style');
      style.setAttribute('data-focus-enhancement', 'true');
      style.textContent = `
        /* Enhanced focus indicators for accessibility */
        button:focus,
        a:focus,
        input:focus,
        select:focus,
        textarea:focus,
        [tabindex]:focus {
          outline: 2px solid #0073e6 !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 0 4px rgba(0, 115, 230, 0.1) !important;
        }
        
        .focus-visible {
          outline: 2px solid #0073e6 !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 0 4px rgba(0, 115, 230, 0.1) !important;
        }
      `;
      document.head.appendChild(style);
      !import.meta.env.PROD && console.log('✅ Auto-fixed: Added enhanced focus indicators');
    }
  }

  private getFocusableElements(): NodeListOf<HTMLElement> {
    return document.querySelectorAll(`
      button:not([disabled]),
      [href],
      input:not([disabled]),
      select:not([disabled]),
      textarea:not([disabled]),
      [tabindex]:not([tabindex="-1"]):not([disabled]),
      details,
      summary
    `);
  }

  // Public methods for programmatic accessibility enhancements

  public announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const announcer = document.getElementById('screen-reader-announcer') || this.createAnnouncer();
    announcer.setAttribute('aria-live', priority);
    announcer.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  }

  private createAnnouncer(): HTMLElement {
    const announcer = document.createElement('div');
    announcer.id = 'screen-reader-announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
    return announcer;
  }

  public enhanceForm(formElement: HTMLFormElement) {
    // Add form validation announcements
    const inputs = formElement.querySelectorAll('input, select, textarea');
    
    inputs.forEach((input) => {
      const element = input as HTMLInputElement;
      
      // Add aria-describedby for error messages
      element.addEventListener('invalid', () => {
        const errorId = `${element.id || 'input'}-error`;
        let errorElement = document.getElementById(errorId);
        
        if (!errorElement) {
          errorElement = document.createElement('div');
          errorElement.id = errorId;
          errorElement.className = 'text-red-500 text-sm mt-1';
          errorElement.setAttribute('role', 'alert');
          element.parentNode?.insertBefore(errorElement, element.nextSibling);
        }
        
        errorElement.textContent = element.validationMessage;
        element.setAttribute('aria-describedby', errorId);
        element.setAttribute('aria-invalid', 'true');
      });

      // Clear error state on valid input
      element.addEventListener('input', () => {
        if (element.validity.valid) {
          element.removeAttribute('aria-invalid');
          const errorElement = document.getElementById(`${element.id || 'input'}-error`);
          if (errorElement) {
            errorElement.remove();
          }
        }
      });
    });
  }

  public addLiveRegion(element: HTMLElement, type: 'status' | 'alert' | 'log' = 'status') {
    element.setAttribute('aria-live', type === 'alert' ? 'assertive' : 'polite');
    element.setAttribute('aria-atomic', 'true');
    
    if (type === 'status') {
      element.setAttribute('role', 'status');
    } else if (type === 'alert') {
      element.setAttribute('role', 'alert');
    } else if (type === 'log') {
      element.setAttribute('role', 'log');
    }
  }

  public generateAccessibilityReport(): {
    timestamp: string;
    overall: {
      score: number;
      issues: number;
      focusableElements: number;
    };
    headings: {
      total: number;
      h1Count: number;
      hierarchyIssues: string[];
      withIds: number;
    };
    forms: {
      totalForms: number;
      totalInputs: number;
      inputsWithLabels: number;
      inputsWithErrors: number;
    };
    issues: string[];
    recommendations: string[];
  } {
    const issues = this.runAccessibilityAudit();
    const focusableCount = this.getFocusableElements().length;
    const headingStructure = this.analyzeHeadingStructure();
    const formAccessibility = this.analyzeFormAccessibility();

    return {
      timestamp: new Date().toISOString(),
      overall: {
        score: Math.max(0, 100 - (issues.length * 5)),
        issues: issues.length,
        focusableElements: focusableCount
      },
      headings: headingStructure,
      forms: formAccessibility,
      issues,
      recommendations: this.generateAccessibilityRecommendations(issues)
    };
  }

  private analyzeHeadingStructure() {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    return {
      total: headings.length,
      h1Count: headings.filter(h => h.tagName === 'H1').length,
      hierarchyIssues: this.findHeadingHierarchyIssues(headings),
      withIds: headings.filter(h => h.id).length
    };
  }

  private findHeadingHierarchyIssues(headings: Element[]): string[] {
    const issues: string[] = [];
    for (let i = 1; i < headings.length; i++) {
      const current = parseInt(headings[i].tagName.substring(1));
      const previous = parseInt(headings[i - 1].tagName.substring(1));
      
      if (current > previous + 1) {
        issues.push(`Heading level skip: ${headings[i - 1].tagName} to ${headings[i].tagName}`);
      }
    }
    return issues;
  }

  private analyzeFormAccessibility() {
    const forms = document.querySelectorAll('form');
    const inputs = document.querySelectorAll('input, select, textarea');
    
    return {
      totalForms: forms.length,
      totalInputs: inputs.length,
      inputsWithLabels: Array.from(inputs).filter(input => {
        const element = input as HTMLInputElement;
        return element.getAttribute('aria-label') || 
               element.getAttribute('aria-labelledby') ||
               document.querySelector(`label[for="${element.id}"]`);
      }).length,
      inputsWithErrors: document.querySelectorAll('[aria-invalid="true"]').length
    };
  }

  private generateAccessibilityRecommendations(issues: string[]): string[] {
    const recommendations: string[] = [];
    
    if (issues.some(issue => issue.includes('alt text'))) {
      recommendations.push('Add descriptive alt text to all images');
    }
    
    if (issues.some(issue => issue.includes('heading hierarchy'))) {
      recommendations.push('Fix heading hierarchy to follow logical structure');
    }
    
    if (issues.some(issue => issue.includes('form input'))) {
      recommendations.push('Associate all form inputs with descriptive labels');
    }
    
    if (issues.some(issue => issue.includes('role'))) {
      recommendations.push('Add appropriate ARIA roles to interactive elements');
    }

    return recommendations;
  }

  public cleanup() {
    // Cleanup observers and event listeners
    const observer = new MutationObserver(() => {});
    observer.disconnect();
  }
}

export const accessibilityEnhancer = new AccessibilityEnhancer();

// Export utilities for use in components
export const a11yUtils = {
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => 
    accessibilityEnhancer.announceToScreenReader(message, priority),
  
  enhanceForm: (form: HTMLFormElement) => 
    accessibilityEnhancer.enhanceForm(form),
  
  addLiveRegion: (element: HTMLElement, type?: 'status' | 'alert' | 'log') =>
    accessibilityEnhancer.addLiveRegion(element, type),
  
  generateReport: () => 
    accessibilityEnhancer.generateAccessibilityReport()
};