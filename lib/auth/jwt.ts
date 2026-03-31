import * as jose from "jose";

const ALG = "HS256";

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("JWT_SECRET must be set and at least 16 characters");
  }
  return new TextEncoder().encode(secret);
}

export type JwtPayload = {
  sub: string;
  email: string;
};

export async function signToken(payload: JwtPayload): Promise<string> {
  const key = getSecretKey();
  return new jose.SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: ALG })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  const key = getSecretKey();
  const { payload } = await jose.jwtVerify(token, key, {
    algorithms: [ALG],
  });
  const sub = payload.sub;
  const email = payload.email;
  if (typeof sub !== "string" || typeof email !== "string") {
    throw new Error("Invalid token payload");
  }
  return { sub, email };
}
