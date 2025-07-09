import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/api/users/login", async ({ request }) => {
    const { email, password } = await request.json();

    if (email === "user@example.com" && password === "password123") {
      return HttpResponse.json(
        { user: { _id: "1", email, role: "patient" } },
        { status: 200 }
      );
    }

    return HttpResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }),
];
