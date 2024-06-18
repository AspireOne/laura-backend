import { Provider } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { constants } from "src/helpers/constants";
import { env } from "src/helpers/env";

export const GOOGLE_OAUTH_PROVIDER_KEY = "GoogleOAuth";

export const GoogleOAuthProvider: Provider = {
  provide: GOOGLE_OAUTH_PROVIDER_KEY,
  useFactory: () => {
    const CREDENTIALS = env.GOOGLE_API_CREDENTIALS;
    const { client_secret, client_id, redirect_uris } = CREDENTIALS.web;

    const redirectUrl = getValidRedirectUriOrThrow(redirect_uris);
    return new OAuth2Client(client_id, client_secret, redirectUrl);
  },
};

function getValidRedirectUriOrThrow(redirect_uris: string[]): string {
  if (!redirect_uris || !Array.isArray(redirect_uris)) {
    throw new Error("redirect_uris is not an array");
  }

  const isValidRedirectUri = redirect_uris.some((uri) =>
    uri.includes(constants.googleOauthCallbackUrl),
  );

  if (!isValidRedirectUri) {
    console.log("redirect_uris", redirect_uris);
    console.log("target redirect uri", constants.googleOauthCallbackUrl);
    throw new Error(
      "redirect_uris does not contain the callback url (you should probably add it in Google Cloud as a redirect URL)",
    );
  }

  return constants.googleOauthCallbackUrl;
}
