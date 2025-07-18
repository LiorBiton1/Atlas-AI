// jest.setup.ts
import '@testing-library/jest-dom'

// mock Next’s App‑Router hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    // add any other router methods your component uses
  }),
  usePathname: () => '/',                   // or whatever path you need
  useSearchParams: () => new URLSearchParams(), 
}));