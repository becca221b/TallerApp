import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alert, AlertDescription, AlertTitle } from './alert';

describe('Alert', () => {
  it('renders alert with title and description', () => {
    render(
      <Alert>
        <AlertTitle>Test Title</AlertTitle>
        <AlertDescription>Test Description</AlertDescription>
      </Alert>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('applies default variant styles', () => {
    render(
      <Alert variant="default">
        <AlertDescription>Default alert</AlertDescription>
      </Alert>
    );
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-background');
  });

  it('applies destructive variant styles', () => {
    render(
      <Alert variant="destructive">
        <AlertDescription>Error alert</AlertDescription>
      </Alert>
    );
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('border-destructive/50');
  });

  it('renders description only', () => {
    render(
      <Alert>
        <AlertDescription>Simple message</AlertDescription>
      </Alert>
    );
    
    expect(screen.getByText('Simple message')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(
      <Alert className="custom-class">
        <AlertDescription>Custom alert</AlertDescription>
      </Alert>
    );
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('custom-class');
  });
});
