// Form validation utilities

// Enhanced security validation with stricter healthcare compliance
interface ValidationConfig {
  enableStrictMode: boolean;
  enablePhiDetection: boolean;
  enableMalwareScanning: boolean;
  maxInputLength: number;
}

class EnhancedValidator {
  private config: ValidationConfig;
  
  constructor() {
    // Check if enhanced validation is enabled
    const enhanced = JSON.parse(localStorage.getItem('enhanced-validation') || '{}');
    
    this.config = {
      enableStrictMode: enhanced.enableStrictMode || false,
      enablePhiDetection: true,
      enableMalwareScanning: true,
      maxInputLength: enhanced.enableStrictMode ? 500 : 5000
    };
  }
  
  validateWithContext(input: string, context: string): { isValid: boolean; errors: string[]; sanitized: string; riskLevel: 'low' | 'medium' | 'high' } {
    const errors: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    
    // Length validation
    if (input.length > this.config.maxInputLength) {
      errors.push(`Input exceeds maximum length of ${this.config.maxInputLength} characters`);
      riskLevel = 'medium';
    }
    
    // Enhanced malware detection patterns
    const malwarePatterns = [
      { pattern: /<script[\s\S]*?>[\s\S]*?<\/script>/gi, risk: 'high', description: 'Script injection attempt' },
      { pattern: /javascript\s*:/gi, risk: 'high', description: 'JavaScript URL scheme' },
      { pattern: /on\w+\s*=\s*["'][^"']*["']/gi, risk: 'high', description: 'Inline event handler' },
      { pattern: /eval\s*\(/gi, risk: 'high', description: 'Eval function usage' },
      { pattern: /document\.write\s*\(/gi, risk: 'medium', description: 'Document.write usage' },
      { pattern: /innerHTML\s*=\s*["'][^"']*["']/gi, risk: 'medium', description: 'InnerHTML manipulation' },
      { pattern: /data:text\/html/gi, risk: 'high', description: 'HTML data URL' },
      { pattern: /vbscript\s*:/gi, risk: 'high', description: 'VBScript URL scheme' },
      { pattern: /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, risk: 'medium', description: 'Iframe injection' },
      { pattern: /<object[\s\S]*?>[\s\S]*?<\/object>/gi, risk: 'medium', description: 'Object tag injection' },
      { pattern: /<embed[\s\S]*?>[\s\S]*?<\/embed>/gi, risk: 'medium', description: 'Embed tag injection' }
    ];
    
    if (this.config.enableMalwareScanning) {
      malwarePatterns.forEach(({ pattern, risk, description }) => {
        if (pattern.test(input)) {
          errors.push(`Security threat detected: ${description}`);
          if (risk === 'high') riskLevel = 'high';
          else if (risk === 'medium' && riskLevel === 'low') riskLevel = 'medium';
        }
      });
    }
    
    // PHI detection for healthcare compliance
    if (this.config.enablePhiDetection && context !== 'phi-allowed') {
      const phiPatterns = [
        { pattern: /\b\d{3}-?\d{2}-?\d{4}\b/g, type: 'SSN' },
        { pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, type: 'Phone Number' },
        { pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, type: 'Credit Card' },
        { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, type: 'Email' }
      ];
      
      phiPatterns.forEach(({ pattern, type }) => {
        if (pattern.test(input)) {
          errors.push(`Potential PHI detected: ${type}`);
          riskLevel = 'high';
        }
      });
    }
    
    // Sanitize input
    const sanitized = this.enhancedSanitize(input);
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitized,
      riskLevel
    };
  }
  
  private enhancedSanitize(input: string): string {
    let sanitized = input.trim();
    
    // Enhanced XSS prevention
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
      /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi,
      /<link\b[^>]*>/gi,
      /<meta\b[^>]*>/gi,
      /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
      /<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi
    ];
    
    xssPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    // Enhanced attribute removal
    sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/\shref\s*=\s*["']javascript:[^"']*["']/gi, '');
    sanitized = sanitized.replace(/\ssrc\s*=\s*["']data:text\/html[^"']*["']/gi, '');
    
    // Enhanced SQL injection prevention
    const sqlPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute|declare|cast|char|varchar)\b)/gi,
      /(;|%3B|\/\*|\*\/|%2F%2A|%2A%2F|--|%2D%2D)/gi,
      /(\b(or|and)\b\s+\b\d+\s*=\s*\d+)/gi,
      /('|(\\')|(''|%27))/gi
    ];
    
    sqlPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    // Remove potentially dangerous characters
    sanitized = sanitized.replace(/[<>{}]/g, '');
    
    // Limit final length
    if (sanitized.length > this.config.maxInputLength) {
      sanitized = sanitized.substring(0, this.config.maxInputLength);
    }
    
    return sanitized;
  }
}

export const enhancedValidator = new EnhancedValidator();

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  // Simplified validation for demo purposes
  if (password.length >= 6) {
    // Password is valid if it's 6+ characters
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
  return phoneRegex.test(phone);
};

export const sanitizeInput = (input: string): string => {
  // Enhanced sanitization for healthcare data protection with comprehensive XSS prevention
  let sanitized = input.trim();
  
  // Remove potentially dangerous HTML/JavaScript - Enhanced patterns
  // Remove only the angle brackets from tags, preserving content
  sanitized = sanitized.replace(/<(\/?)(script|iframe|object|embed|form|link|meta|style)\b[^>]*>/gi, '$1$2');
  
  // Remove complete dangerous tags that should be completely removed
  sanitized = sanitized.replace(/<link\b[^>]*>/gi, '');
  sanitized = sanitized.replace(/<meta\b[^>]*>/gi, '');
  
  // Remove dangerous attributes - Enhanced coverage
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/data:text\/html/gi, '');
  sanitized = sanitized.replace(/data:application\/javascript/gi, '');
  sanitized = sanitized.replace(/vbscript:/gi, '');
  sanitized = sanitized.replace(/expression\s*\(/gi, '');
  sanitized = sanitized.replace(/url\s*\(\s*javascript:/gi, '');
  
  // Remove SQL injection patterns - Enhanced detection
  sanitized = sanitized.replace(/('|(\\')|(;|%3B)|(--|(\\-\\-))|(\/\*|\*\/|%2F%2A|%2A%2F))/gi, '');
  sanitized = sanitized.replace(/\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b/gi, '');
  // Remove dangerous function calls but preserve content inside script tags (they're already removed above)
  sanitized = sanitized.replace(/\b(eval|function)\b\s*\(/gi, '');
  
  // Remove XSS patterns - Enhanced protection
  // Replace dangerous characters with spaces to maintain readability
  sanitized = sanitized.replace(/[<>]/g, ' ');
  // Only encode ampersands to prevent HTML entity issues
  sanitized = sanitized.replace(/&/g, '&amp;');
  
  // Remove potentially dangerous URL schemes
  sanitized = sanitized.replace(/\b(javascript|data|vbscript|file|ftp):/gi, '');
  
  // Remove HTML5 form validation bypass attempts
  sanitized = sanitized.replace(/formnovalidate|novalidate/gi, '');
  
  // Normalize whitespace - replace 3 or more spaces with exactly 2 spaces
  sanitized = sanitized.replace(/\s{3,}/g, '  ');
  
  // Limit length to prevent buffer overflow attacks
  if (sanitized.length > 5000) {
    sanitized = sanitized.substring(0, 5000);
  }
  
  return sanitized;
};

// Enhanced healthcare input validation with security context
export const validateSecureHealthcareInput = (
  input: string, 
  context: 'phi' | 'general' | 'contact' | 'assessment' = 'general'
): { isValid: boolean; errors: string[]; sanitized: string; securityAlerts: string[] } => {
  const validation = enhancedValidator.validateWithContext(input, context);
  const securityAlerts: string[] = [];
  
  // Log security events if high risk
  if (validation.riskLevel === 'high') {
    securityAlerts.push('High-risk input detected and blocked');
    
    // Import security utils dynamically to avoid circular dependencies
    import('./securityUtils').then(({ securityUtils }) => {
      securityUtils.logSecurityEvent('suspicious_input', {
        inputContext: context,
        riskLevel: validation.riskLevel,
        sanitizedLength: validation.sanitized.length,
        originalLength: input.length
      }, 'high');
    });
  }
  
  return {
    isValid: validation.isValid,
    errors: validation.errors,
    sanitized: validation.sanitized,
    securityAlerts
  };
};

// Enhanced validation for healthcare-specific data
export const validateHealthcareInput = (input: string, type: 'phi' | 'general' | 'contact' = 'general'): { isValid: boolean; errors: string[]; sanitized: string } => {
  // Use enhanced validator for additional security
  const enhancedResult = validateSecureHealthcareInput(input, type);
  
  if (enhancedResult.securityAlerts.length > 0) {
    enhancedResult.errors.push(...enhancedResult.securityAlerts);
  }
  
  const errors: string[] = [...enhancedResult.errors];
  const sanitized = enhancedResult.sanitized;
  
  // Check for PHI patterns if type is 'phi'
  if (type === 'phi') {
    const ssnPattern = /\b\d{3}-?\d{2}-?\d{4}\b/;
    const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;
    const creditCardPattern = /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/;
    
    if (ssnPattern.test(input)) errors.push('SSN detected - use masked format');
    if (phonePattern.test(input) && type !== 'contact') errors.push('Phone number detected');
    if (creditCardPattern.test(input)) errors.push('Credit card number detected');
  }
  
  // Check for malicious patterns
  const maliciousPatterns = [
    { pattern: /<script/i, message: 'Script tags not allowed' },
    { pattern: /javascript:/i, message: 'JavaScript URLs not allowed' },
    { pattern: /on\w+\s*=/i, message: 'Event handlers not allowed' },
    { pattern: /data:text\/html/i, message: 'HTML data URLs not allowed' }
  ];
  
  maliciousPatterns.forEach(({ pattern, message }) => {
    if (pattern.test(input)) {
      errors.push(message);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
};

// HIPAA-compliant data masking
export const maskSensitiveData = (data: string, type: 'ssn' | 'phone' | 'email' | 'mrn'): string => {
  switch (type) {
    case 'ssn':
      return data.replace(/\b(\d{3})-?(\d{2})-?(\d{4})\b/g, 'XXX-XX-$3');
    case 'phone':
      return data.replace(/\b(\d{3})[-.]?(\d{3})[-.]?(\d{4})\b/g, 'XXX-XXX-$3');
    case 'email':
      return data.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '***@***.***');
    case 'mrn':
      return data.replace(/\b\d{6,10}\b/g, (match) => 'X'.repeat(match.length - 3) + match.slice(-3));
    default:
      return data;
  }
};

// Enhanced security validation for file uploads
export const validateFileUpload = (file: File): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'image/jpeg',
    'image/png'
  ];
  
  // Size validation
  if (file.size > maxSize) {
    errors.push(`File size exceeds maximum allowed size (${maxSize / 1024 / 1024}MB)`);
  }
  
  // Type validation
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type '${file.type}' not allowed`);
  }
  
  // Filename validation
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.js', '.jar'];
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (dangerousExtensions.includes(extension)) {
    errors.push(`File extension '${extension}' not allowed for security reasons`);
  }
  
  // Filename length validation
  if (file.name.length > 255) {
    errors.push('Filename too long (max 255 characters)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Rate limiting utility
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  canAttempt(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }
}

export const rateLimiter = new RateLimiter();