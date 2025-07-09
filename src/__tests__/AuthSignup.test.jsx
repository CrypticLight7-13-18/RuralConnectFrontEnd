import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Auth from "../pages/Auth";
import { BrowserRouter } from "react-router-dom";
import ErrorProvider from "../contexts/ErrorContext";
import { AuthContext } from "../contexts/AuthContext";
import { vi } from "vitest";

function setup() {
  const dummyAuth = {
    user: null,
    loading: false,
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
    checkAuthStatus: vi.fn(),
  };

  render(
    <ErrorProvider>
      <AuthContext.Provider value={dummyAuth}>
        <BrowserRouter>
          <Auth />
        </BrowserRouter>
      </AuthContext.Provider>
    </ErrorProvider>
  );
  // Switch to signup mode
  fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
}

describe("Auth signup form", () => {
  it("shows error when passwords do not match", async () => {
    setup();

    fireEvent.input(screen.getByPlaceholderText(/full name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.input(screen.getByPlaceholderText(/email address/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.input(screen.getAllByPlaceholderText(/password/i)[0], {
      target: { value: "password123" },
    });
    fireEvent.input(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: "differentPass" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /sign up/i, exact: true })
    );

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });
});
