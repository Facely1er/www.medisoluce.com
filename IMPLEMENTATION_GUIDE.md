# MediSoluce Design System Implementation Guide

## Quick Start

### 1. Import Components
```tsx
// Import individual components
import { Button, Card, Modal, FormField, ErrorBoundary } from '../components/ui';

// Or import everything
import * as UI from '../components/ui';
```

### 2. Basic Usage Examples

#### Button Component
```tsx
import { Button } from '../components/ui';

// Primary action button
<Button variant="primary" size="md">
  Start Assessment
</Button>

// Secondary button with icon
<Button variant="outline" icon={<Download className="h-4 w-4" />}>
  Download Report
</Button>

// Loading state
<Button loading disabled>
  Processing...
</Button>
```

#### Form with Validation
```tsx
import { FormField, Button } from '../components/ui';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});

  return (
    <form className="space-y-6">
      <FormField
        label="Organization Name"
        required
        error={errors.name}
        description="Enter your healthcare organization's legal name"
      >
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </FormField>

      <FormField
        label="Email Address"
        required
        error={errors.email}
        success={!errors.email && formData.email}
      >
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </FormField>

      <Button type="submit" className="w-full">
        Submit Assessment
      </Button>
    </form>
  );
};
```

#### Modal Implementation
```tsx
import { Modal, Button } from '../components/ui';

const AssessmentModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Assessment
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="HIPAA Compliance Assessment"
        size="lg"
      >
        <div className="space-y-4">
          <p>This assessment will help evaluate your organization's HIPAA compliance.</p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {/* Start assessment */}}>
              Begin Assessment
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
```

#### Loading States
```tsx
import { LoadingState, Skeleton, LoadingSpinner } from '../components/ui';

// Component with loading state
const AssessmentResults = ({ isLoading, data }) => {
  return (
    <LoadingState
      isLoading={isLoading}
      loadingText="Loading assessment results..."
      skeleton={true}
      skeletonLines={5}
    >
      <div className="space-y-4">
        {data.map(result => (
          <div key={result.id}>{result.title}</div>
        ))}
      </div>
    </LoadingState>
  );
};

// Standalone loading spinner
const LoadingPage = () => (
  <div className="flex items-center justify-center h-screen">
    <LoadingSpinner size="lg" text="Loading MediSoluce..." />
  </div>
);

// Skeleton loading
const SkeletonCard = () => (
  <Card className="p-6">
    <Skeleton lines={3} />
  </Card>
);
```

#### Error Boundary Implementation
```tsx
import { ErrorBoundary, withErrorBoundary } from '../components/ui';

// Wrap entire app
const App = () => (
  <ErrorBoundary>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
      </Routes>
    </Router>
  </ErrorBoundary>
);

// Wrap specific components
const ProtectedAssessment = withErrorBoundary(AssessmentComponent, {
  showDetails: !import.meta.env.PROD
});

// Using the hook
const AssessmentForm = () => {
  const { error, resetError, ErrorBoundary } = useErrorHandler();

  return (
    <ErrorBoundary>
      <form>
        {/* Form content */}
      </form>
    </ErrorBoundary>
  );
};
```

## Design Patterns

### 1. Card Layout Pattern
```tsx
import { Card, Button } from '../components/ui';

const FeatureCard = ({ title, description, action }) => (
  <Card hover animate className="h-full flex flex-col">
    <div className="p-6 flex-grow">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
    <div className="p-6 pt-0">
      <Button variant="outline" className="w-full">
        {action}
      </Button>
    </div>
  </Card>
);
```

### 2. Form Validation Pattern
```tsx
const useFormValidation = (initialValues) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (field, value) => {
    const newErrors = { ...errors };
    
    if (!value && field.required) {
      newErrors[field.name] = `${field.label} is required`;
    } else if (field.type === 'email' && !isValidEmail(value)) {
      newErrors[field.name] = 'Please enter a valid email address';
    } else {
      delete newErrors[field.name];
    }
    
    setErrors(newErrors);
  };

  const handleChange = (field, value) => {
    setValues({ ...values, [field.name]: value });
    validate(field, value);
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field.name]: true });
  };

  return { values, errors, touched, handleChange, handleBlur };
};
```

### 3. Responsive Grid Pattern
```tsx
const ResponsiveGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {children}
  </div>
);

// Usage
<ResponsiveGrid>
  <FeatureCard title="HIPAA Assessment" description="..." />
  <FeatureCard title="Dependency Mapping" description="..." />
  <FeatureCard title="Business Continuity" description="..." />
</ResponsiveGrid>
```

## Accessibility Guidelines

### 1. Keyboard Navigation
```tsx
// Ensure all interactive elements are keyboard accessible
<Button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
  aria-label="Start HIPAA assessment"
>
  Start Assessment
</Button>
```

### 2. Screen Reader Support
```tsx
// Use proper ARIA labels and descriptions
<FormField
  label="Organization Name"
  description="Enter the legal name of your healthcare organization"
>
  <input
    type="text"
    aria-describedby="org-name-description"
    aria-required="true"
  />
</FormField>
```

### 3. Focus Management
```tsx
// Manage focus in modals and dynamic content
const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const firstFocusable = modalRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (firstFocusable as HTMLElement)?.focus();
    }
  }, [isOpen]);

  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
};
```

## Performance Optimization

### 1. Component Memoization
```tsx
import { memo } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  // Expensive rendering logic
  return <div>{/* Complex UI */}</div>;
});
```

### 2. Lazy Loading
```tsx
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '../components/ui';

const AssessmentPage = lazy(() => import('./AssessmentPage'));

const App = () => (
  <Suspense fallback={<LoadingSpinner size="lg" />}>
    <AssessmentPage />
  </Suspense>
);
```

## Testing Guidelines

### 1. Component Testing
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/ui';

test('Button renders with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('Click me');
});

test('Button handles click events', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### 2. Accessibility Testing
```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('Button has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Migration Guide

### From Old Components
```tsx
// Old way
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

// New way
import { Button, Card } from '../components/ui';
```

### Updating Existing Forms
```tsx
// Before
<div className="form-group">
  <label>Name</label>
  <input type="text" />
  {error && <div className="error">{error}</div>}
</div>

// After
<FormField label="Name" error={error}>
  <input type="text" />
</FormField>
```

## Best Practices

1. **Always use semantic HTML** - Use proper heading hierarchy, form labels, and ARIA attributes
2. **Test with keyboard navigation** - Ensure all functionality is accessible via keyboard
3. **Validate color contrast** - Use tools to verify WCAG compliance
4. **Implement error boundaries** - Wrap components that might fail
5. **Use loading states** - Provide feedback during async operations
6. **Follow the design system** - Use consistent spacing, colors, and typography
7. **Test across devices** - Verify responsive behavior on different screen sizes
8. **Performance matters** - Use memoization and lazy loading appropriately

## Support

For questions or issues with the design system:
- **Documentation**: See DESIGN_SYSTEM.md
- **Issues**: Create a GitHub issue
- **Support**: support@medisoluce.com
