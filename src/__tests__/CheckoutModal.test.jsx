import { render, screen, fireEvent } from "@testing-library/react";
import CheckoutModal from "../components/Store/CheckoutModal";
import ErrorProvider from "../contexts/ErrorContext";
import { BrowserRouter } from "react-router-dom";

const cart = [
  { id: 1, name: "Paracetamol", price: 10, qty: 2 },
  { id: 2, name: "Aspirin", price: 5, qty: 1 },
];

const noop = () => {};

describe("CheckoutModal", () => {
  it("displays order total correctly", () => {
    render(
      <ErrorProvider>
        <BrowserRouter>
          <CheckoutModal
            cart={cart}
            total={25}
            changeQty={noop}
            removeItem={noop}
            onClose={noop}
          />
        </BrowserRouter>
      </ErrorProvider>
    );
    expect(screen.getByText(/₹25\.00/)).toBeInTheDocument();
  });

  it("allows adding a new address", () => {
    render(
      <ErrorProvider>
        <BrowserRouter>
          <CheckoutModal
            cart={cart}
            total={25}
            changeQty={noop}
            removeItem={noop}
            onClose={noop}
          />
        </BrowserRouter>
      </ErrorProvider>
    );

    // click add new address
    fireEvent.click(screen.getByRole("button", { name: /add new address/i }));
    fireEvent.input(
      screen.getByPlaceholderText(/enter your complete address/i),
      {
        target: { value: "789 Oak St" },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: /save address/i }));

    // new address should be selected in dropdown
    expect(screen.getByDisplayValue(/789 oak st/i)).toBeInTheDocument();
  });
});
