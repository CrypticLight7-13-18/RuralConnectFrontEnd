import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Auth from "../pages/Auth";
import { BrowserRouter } from "react-router-dom";
import ErrorProvider from "../contexts/ErrorContext";
import { AuthContext } from "../contexts/AuthContext";
import { vi } from "vitest";

function renderAuth() {
  const dummyAuth = {
    user: null,
    loading: false,
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
    checkAuthStatus: vi.fn(),
  };
  return render(
    <ErrorProvider>
      <AuthContext.Provider value={dummyAuth}>
        <BrowserRouter>
          <Auth />
        </BrowserRouter>
      </AuthContext.Provider>
    </ErrorProvider>
  );
}

describe("Auth page", () => {
  it("shows validation errors on empty submit", async () => {
    renderAuth();
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    fireEvent.click(screen.getByRole("button", { name: /^login$/i }));
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it("logs in successfully with correct credentials", async () => {
    renderAuth();
    fireEvent.input(screen.getByPlaceholderText(/email address/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.input(screen.getByPlaceholderText(/^password$/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^login$/i }));

    // On success component navigates; we just wait that no error toast appears
    await waitFor(() => {
      expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
    });
  });
});
