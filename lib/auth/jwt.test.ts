import { signToken, verifyToken } from "./jwt";

describe("jwt helpers", () => {
  it("round-trips sub and email", async () => {
    const token = await signToken({
      sub: "user_1",
      email: "u@example.com",
    });
    const payload = await verifyToken(token);
    expect(payload.sub).toBe("user_1");
    expect(payload.email).toBe("u@example.com");
  });

  it("rejects a tampered token", async () => {
    const token = await signToken({ sub: "a", email: "a@b.co" });
    const parts = token.split(".");
    const b64 = parts[1] ?? "";
    const json = JSON.parse(Buffer.from(b64, "base64url").toString()) as Record<
      string,
      unknown
    >;
    json.sub = "other";
    const forgedPayload = Buffer.from(JSON.stringify(json)).toString("base64url");
    const forged = [parts[0], forgedPayload, parts[2]].join(".");
    await expect(verifyToken(forged)).rejects.toThrow();
  });

  it("rejects garbage input", async () => {
    await expect(verifyToken("not-a-jwt")).rejects.toThrow();
  });
});
