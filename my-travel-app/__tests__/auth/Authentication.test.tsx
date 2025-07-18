import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { Authentication } from '@/components/Authentication';

describe("Authentication Component", () => {
  beforeEach(() => {
    // Reset the Authentication components state before each test
      render(<MantineProvider><Authentication /></MantineProvider>);
  });

  it("Renders Sign In title", () => {
    expect(screen.getByRole("heading", { name: /welcome back!/i })).toBeInTheDocument();
  });
});