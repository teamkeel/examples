type Props = {
  clientId: string;
  antiCsrfToken: string;
};

export const LoginButton = ({ antiCsrfToken, clientId }: Props) => (
  <button
    onClick={() => {
      const redirectUri = `${window.location.protocol}//${window.location.host}/api/auth/callback/google`;
      const oauthParams = {
        client_id: clientId,
        response_type: "code",
        scope: "openid",
        redirect_uri: redirectUri,
        state: `security_token=${antiCsrfToken}`,
      };

      console.log({ redirectUri });
      const queryString = new URLSearchParams(oauthParams).toString();
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${queryString}`;

      window.location.href = googleAuthUrl;
    }}
  >
    Login
  </button>
);
