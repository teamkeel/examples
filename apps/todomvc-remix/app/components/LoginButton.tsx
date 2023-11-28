type Props = {
  clientId: string;
  antiCsrfToken: string;
};

export const LoginButton = ({ antiCsrfToken, clientId }: Props) => (
  <button
    onClick={() => {
      const oauthParams = {
        client_id: clientId,
        response_type: "code",
        scope: "openid",
        redirect_uri: "http://localhost:3000/api/auth/callback/google",
        state: `security_token=${antiCsrfToken}`,
      };

      const queryString = new URLSearchParams(oauthParams).toString();
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${queryString}`;

      window.location.href = googleAuthUrl;
    }}
  >
    Login
  </button>
);
