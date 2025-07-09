import { expect } from "vitest";
import { server } from "./test-utils/msw/server";
import * as matchers from "@testing-library/jest-dom/matchers";

// Extend Vitest's expect with Testing Library matchers
expect.extend(matchers);

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
