// @ts-check

// @ts-ignore - #get-token is defined in "imports" in package.json
import { getToken } from "#get-token";

/**
 * @param {import(".").Options} options
 * @returns {Promise<import(".").Result>}
 */
export default async function githubAppJwt({
  id,
  privateKey,
  now = Math.floor(Date.now() / 1000),
}) {
  // When creating a JSON Web Token, it sets the "issued at time" (iat) to 30s
  // in the past as we have seen people running situations where the GitHub API
  // claimed the iat would be in future. It turned out the clocks on the
  // different machine were not in sync.
  const nowWithSafetyMargin = now - 30;
  const expiration = nowWithSafetyMargin + 60 * 10; // JWT expiration time (10 minute maximum)

  const payload = {
    iat: nowWithSafetyMargin, // Issued at time
    exp: expiration,
    iss: id,
  };

  const token = await getToken({
    privateKey,
    payload,
  });

  return {
    appId: id,
    expiration,
    token,
  };
}
