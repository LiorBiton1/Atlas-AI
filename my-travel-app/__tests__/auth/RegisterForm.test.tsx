import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { RegisterForm } from '@/components/auth/RegisterForm';
import "@testing-library/jest-dom";

const renderRegisterForm = (props = {}) => {
    return render(
        <MantineProvider>
            <RegisterForm {...props} />
        </MantineProvider>
    );
};

describe("RegisterForm", () => {
    describe("Rendering Register Form", () => {
        beforeEach(() => {
            renderRegisterForm();
        });

        it("Render Create an Account", () => {
            expect(screen.getByRole("heading", { name: /Create an Account/i })).toBeInTheDocument();
        });
        it("Renders Sign up with Google button", () => {
            expect(screen.getByRole("button", { name: /Sign up with Google/i })).toBeInTheDocument();
        });
        it("Renders Full Name field", () => {
            expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
        });
        it("Renders Username field", () => {
            expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
        });
        it("Renders Email Address field", () => {
            expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
        });
        it("Renders Password field", () => {
            expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
        });
        it("Renders Register button", () => {
            expect(screen.getByRole("button", { name: /^Register$/i })).toBeInTheDocument();
        });
        it("Renders Login link", () => {
            expect(screen.getByText(/Already have an account\?/i)).toBeInTheDocument();
            expect(screen.getByText(/Login/i)).toBeInTheDocument();
        });
    });
});