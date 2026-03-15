import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookingLayout from '../ui/BookingLayout';
import { I18nProvider } from '../i18n';

describe('booking flow stepper', () => {
  it('renders 4-step flow labels', () => {
    render(
      <MemoryRouter>
        <I18nProvider>
          <BookingLayout step={2} title="Test" subtitle="Sub">body</BookingLayout>
        </I18nProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Intention')).toBeInTheDocument();
    expect(screen.getByText('Service')).toBeInTheDocument();
    expect(screen.getByText('Date & Time')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });
});
