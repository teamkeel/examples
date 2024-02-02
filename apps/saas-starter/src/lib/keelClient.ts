// GENERATED DO NOT EDIT

type RequestHeaders = globalThis.Record<string, string>;

// Refresh the token 60 seconds before it expires
const EXPIRY_BUFFER_IN_MS = 60000;

export type RequestConfig = {
  baseUrl: string;
  headers?: RequestHeaders;
};

// Result types

export type APIResult<T> = Result<T, APIError>;

type Data<T> = {
  data: T;
  error?: never;
};

type Err<U> = {
  data?: never;
  error: U;
};

type Result<T, U> = NonNullable<Data<T> | Err<U>>;

// Error types

/* 400 */
type BadRequestError = {
  type: 'bad_request';
  message: string;
  requestId?: string;
};

/* 401 */
type UnauthorizedError = {
  type: 'unauthorized';
  message: string;
  requestId?: string;
};

/* 403 */
type ForbiddenError = {
  type: 'forbidden';
  message: string;
  requestId?: string;
};

/* 404 */
type NotFoundError = {
  type: 'not_found';
  message: string;
  requestId?: string;
};

/* 500 */
type InternalServerError = {
  type: 'internal_server_error';
  message: string;
  requestId?: string;
};

/* Unhandled/unexpected errors */
type UnknownError = {
  type: 'unknown';
  message: string;
  error?: unknown;
  requestId?: string;
};

export type APIError =
  | UnauthorizedError
  | ForbiddenError
  | NotFoundError
  | BadRequestError
  | InternalServerError
  | UnknownError;

// Auth

export interface TokenStore {
  set(token: string | null): void;
  get(): string | null;
}

export type Provider = {
  name: string;
  type: string;
  authorizeUrl: string;
};

export type AccessTokenSession = {
  token: string;
  expiresAt: Date;
};

export type TokenExchangeGrant = {
  grant: 'token_exchange';
  subjectToken: string;
};

export type AuthorizationCodeGrant = {
  grant: 'authorization_code';
  code: string;
};

export type RefreshGrant = {
  grant: 'refresh_token';
  refreshToken: string;
};

export type TokenGrant =
  | TokenExchangeGrant
  | AuthorizationCodeGrant
  | RefreshGrant;

export class TokenError extends Error {
  errorDescription: string;
  constructor(error: string, errorDescription: string) {
    super();
    this.message = error;
    this.errorDescription = errorDescription;
  }
}

export class Core {
  constructor(
    private config: RequestConfig,
    private refreshToken: TokenStore = new InMemoryTokenStore()
  ) {
    this.auth.refresh();
  }

  #session: AccessTokenSession | null = null;

  ctx = {
    /**
     * @deprecated This has been deprecated in favour of using the APIClient.auth which handles sessions implicitly
     */
    token: '',
    /**
     * @deprecated This has been deprecated in favour of APIClient.auth.isAuthenticated()
     */
    isAuthenticated: false,
  };

  client = {
    setHeaders: (headers: RequestHeaders): Core => {
      this.config.headers = headers;
      return this;
    },
    setHeader: (key: string, value: string): Core => {
      const { headers } = this.config;
      if (headers) {
        headers[key] = value;
      } else {
        this.config.headers = { [key]: value };
      }
      return this;
    },
    setBaseUrl: (value: string): Core => {
      this.config.baseUrl = value;
      return this;
    },
    /**
     * @deprecated This has been deprecated in favour of the APIClient.auth authenticate helper functions
     */
    setToken: (value: string): Core => {
      this.ctx.token = value;
      this.ctx.isAuthenticated = true;
      return this;
    },
    /**
     * @deprecated This has been deprecated in favour of APIClient.auth.logout()
     */
    clearToken: (): Core => {
      this.ctx.token = '';
      this.ctx.isAuthenticated = false;
      return this;
    },
    rawRequest: async <T>(action: string, body: any): Promise<APIResult<T>> => {
      // If necessary, refresh the expired session before calling the action
      await this.auth.isAuthenticated();

      const token = this.#session ? this.#session?.token : this.ctx.token;

      try {
        const result = await globalThis.fetch(
          stripTrailingSlash(this.config.baseUrl) + '/json/' + action,
          {
            method: 'POST',
            cache: 'no-cache',
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              ...this.config.headers,
              ...(token != '' && action != 'authenticate'
                ? {
                    Authorization: 'Bearer ' + token,
                  }
                : {}),
            },
            body: JSON.stringify(body),
          }
        );

        if (result.status >= 200 && result.status < 299) {
          const rawJson = await result.text();
          const data = JSON.parse(rawJson, reviver);

          return {
            data,
          };
        }

        let errorMessage = 'unknown error';

        try {
          const errorData: {
            message: string;
          } = await result.json();
          errorMessage = errorData.message;
        } catch (error) {}

        const requestId = result.headers.get('X-Amzn-Requestid') || undefined;

        const errorCommon = {
          message: errorMessage,
          requestId,
        };

        switch (result.status) {
          case 400:
            return {
              error: {
                ...errorCommon,
                type: 'bad_request',
              },
            };
          case 401:
            return {
              error: {
                ...errorCommon,
                type: 'unauthorized',
              },
            };
          case 403:
            return {
              error: {
                ...errorCommon,
                type: 'forbidden',
              },
            };
          case 404:
            return {
              error: {
                ...errorCommon,
                type: 'not_found',
              },
            };
          case 500:
            return {
              error: {
                ...errorCommon,
                type: 'internal_server_error',
              },
            };

          default:
            return {
              error: {
                ...errorCommon,
                type: 'unknown',
              },
            };
        }
      } catch (error) {
        return {
          error: {
            type: 'unknown',
            message: 'unknown error',
            error,
          },
        };
      }
    },
  };

  auth = {
    /**
     * Returns the list of supported authentication providers and their SSO login URLs.
     */
    providers: async (): Promise<Provider[]> => {
      let url = new URL(this.config.baseUrl);
      const result = await globalThis.fetch(url.origin + '/auth/providers', {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'content-type': 'application/json',
        },
      });

      if (result.ok) {
        const rawJson = await result.text();
        return JSON.parse(rawJson);
      } else {
        throw new Error(
          'unexpected status code response from /auth/providers: ' +
            result.status
        );
      }
    },

    /**
     * Returns true if the session has not expired. If expired, it will attempt to refresh the session from the authentication server.
     */
    isAuthenticated: async () => {
      // If there is no session, then we don't attempt to refresh since
      // the client was not authenticated in the first place.
      if (!this.#session) {
        return false;
      }

      // Consider a token expired EXPIRY_BUFFER_IN_MS earlier than its real expiry time
      const isExpired =
        Date.now() > this.#session!.expiresAt.getTime() - EXPIRY_BUFFER_IN_MS;

      if (isExpired) {
        return await this.auth.refresh();
      }

      return true;
    },

    /**
     * Authenticate with an ID token.
     */
    authenticateWithIdToken: async (idToken: string) => {
      const req: TokenExchangeGrant = {
        grant: 'token_exchange',
        subjectToken: idToken,
      };

      await this.auth.requestToken(req);
    },

    /**
     * Authenticate with Single Sign On using the auth code received from a successful SSO flow.
     */
    authenticateWithSingleSignOn: async (code: string) => {
      const req: AuthorizationCodeGrant = {
        grant: 'authorization_code',
        code: code,
      };

      await this.auth.requestToken(req);
    },

    /**
     * Forcefully refreshes the session with the authentication server and returns true if authenticated.
     */
    refresh: async () => {
      const refreshToken = this.refreshToken.get();

      if (!refreshToken) {
        return false;
      }

      const authorised = await this.auth.requestToken({
        grant: 'refresh_token',
        refreshToken: refreshToken,
      });

      if (!authorised) {
        this.refreshToken.set(null);
      }

      return authorised;
    },

    /**
     * Logs out the session on the client and also attempts to revoke the refresh token with the authentication server.
     */
    logout: async () => {
      const refreshToken = this.refreshToken.get();

      this.#session = null;
      this.refreshToken.set(null);

      if (refreshToken) {
        let url = new URL(this.config.baseUrl);
        await globalThis.fetch(url.origin + '/auth/revoke', {
          method: 'POST',
          cache: 'no-cache',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            token: refreshToken,
          }),
        });
      }
    },

    /**
     * Creates or refreshes a session with a token request at the authentication server.
     */
    requestToken: async (req: TokenGrant) => {
      let body;
      switch (req.grant) {
        case 'token_exchange':
          body = {
            subject_token: req.subjectToken,
          };
          break;
        case 'authorization_code':
          body = {
            code: req.code,
          };
          break;
        case 'refresh_token':
          body = {
            refresh_token: req.refreshToken,
          };
          break;
        default:
          throw new Error(
            "Unknown grant type. We currently support 'authorization_code', 'token_exchange', and 'refresh_token' grant types. Please use one of those. For more info, please refer to the docs at https://docs.keel.so/authentication/endpoints#parameters"
          );
      }

      let url = new URL(this.config.baseUrl);
      const result = await globalThis.fetch(url.origin + '/auth/token', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: req.grant,
          ...body,
        }),
      });

      if (result.ok) {
        const rawJson = await result.text();
        const data = JSON.parse(rawJson);

        const expiresAt = new Date(Date.now() + data.expires_in * 1000);
        this.refreshToken.set(data.refresh_token);
        this.#session = { token: data.access_token, expiresAt: expiresAt };

        return true;
      } else if (result.status == 401) {
        return false;
      } else {
        const resp = await result.json();
        throw new TokenError(resp.error, resp.error_description);
      }
    },
  };
}

const stripTrailingSlash = (str: string) => {
  if (!str) return str;
  return str.endsWith('/') ? str.slice(0, -1) : str;
};

const RFC3339 =
  /^(?:\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01]))?(?:[T\s](?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?(?:\.\d+)?(?:[Zz]|[+-](?:[01]\d|2[0-3]):?[0-5]\d)?)?$/;
function reviver(key: any, value: any) {
  // Convert any ISO8601/RFC3339 strings to dates
  if (value && typeof value === 'string' && RFC3339.test(value)) {
    return new Date(value);
  }
  return value;
}

class InMemoryTokenStore {
  private token: string | null = null;
  get = () => {
    return this.token;
  };
  set = (token: string) => {
    this.token = token;
  };
}

// API

export class APIClient extends Core {
  constructor(
    config: RequestConfig,
    refreshTokenStore: TokenStore = new InMemoryTokenStore()
  ) {
    super(config, refreshTokenStore);
  }

  private actions = {
    me: (i?: MeInput) => {
      return this.client.rawRequest<User | null>('me', i);
    },
    listUsers: (i?: ListUsersInput) => {
      return this.client.rawRequest<{ results: User[]; pageInfo: PageInfo }>(
        'listUsers',
        i
      );
    },
    deleteUser: (i: DeleteUserInput) => {
      return this.client.rawRequest<string>('deleteUser', i);
    },
    createUser: (i: CreateUserInput) => {
      return this.client.rawRequest<User>('createUser', i);
    },
    updateUser: (i: UpdateUserInput) => {
      return this.client.rawRequest<User>('updateUser', i);
    },
    getTeam: (i: GetTeamInput) => {
      return this.client.rawRequest<Team | null>('getTeam', i);
    },
    listTeams: (i?: ListTeamsInput) => {
      return this.client.rawRequest<{ results: Team[]; pageInfo: PageInfo }>(
        'listTeams',
        i
      );
    },
    deleteTeam: (i: DeleteTeamInput) => {
      return this.client.rawRequest<string>('deleteTeam', i);
    },
    updateTeam: (i: UpdateTeamInput) => {
      return this.client.rawRequest<Team>('updateTeam', i);
    },
    uploadTeamLogo: (i: UploadImageInput) => {
      return this.client.rawRequest<UploadImageResponse>('uploadTeamLogo', i);
    },
    createTeamMembership: (i: CreateTeamMembershipInput) => {
      return this.client.rawRequest<TeamMembership>('createTeamMembership', i);
    },
    getDocument: (i: GetDocumentInput) => {
      return this.client.rawRequest<Document | null>('getDocument', i);
    },
    listDocuments: (i: ListDocumentsInput) => {
      return this.client.rawRequest<{
        results: Document[];
        pageInfo: PageInfo;
      }>('listDocuments', i);
    },
    deleteDocument: (i: DeleteDocumentInput) => {
      return this.client.rawRequest<string>('deleteDocument', i);
    },
    createDocument: (i: CreateDocumentInput) => {
      return this.client.rawRequest<Document>('createDocument', i);
    },
    updateDocument: (i: UpdateDocumentInput) => {
      return this.client.rawRequest<Document>('updateDocument', i);
    },
    activeInvites: (i?: ActiveInvitesInput) => {
      return this.client.rawRequest<{
        results: Invitation[];
        pageInfo: PageInfo;
      }>('activeInvites', i);
    },
    createInvite: (i: CreateInviteInput) => {
      return this.client.rawRequest<Invitation>('createInvite', i);
    },
    authenticate: (i: AuthenticateInput) => {
      return this.client
        .rawRequest<AuthenticateResponse>('authenticate', i)
        .then((res) => {
          if (res.data && res.data.token) this.client.setToken(res.data.token);
          return res;
        });
    },
    requestPasswordReset: (i: RequestPasswordResetInput) => {
      return this.client.rawRequest<RequestPasswordResetResponse>(
        'requestPasswordReset',
        i
      );
    },
    resetPassword: (i: ResetPasswordInput) => {
      return this.client.rawRequest<ResetPasswordResponse>('resetPassword', i);
    },
  };

  api = {
    queries: {
      me: this.actions.me,
      listUsers: this.actions.listUsers,
      getTeam: this.actions.getTeam,
      listTeams: this.actions.listTeams,
      getDocument: this.actions.getDocument,
      listDocuments: this.actions.listDocuments,
      activeInvites: this.actions.activeInvites,
    },
    mutations: {
      deleteUser: this.actions.deleteUser,
      createUser: this.actions.createUser,
      updateUser: this.actions.updateUser,
      deleteTeam: this.actions.deleteTeam,
      updateTeam: this.actions.updateTeam,
      uploadTeamLogo: this.actions.uploadTeamLogo,
      createTeamMembership: this.actions.createTeamMembership,
      deleteDocument: this.actions.deleteDocument,
      createDocument: this.actions.createDocument,
      updateDocument: this.actions.updateDocument,
      createInvite: this.actions.createInvite,
      authenticate: this.actions.authenticate,
      requestPasswordReset: this.actions.requestPasswordReset,
      resetPassword: this.actions.resetPassword,
    },
  };
}

// API Types

export interface UploadImageInput {
  base64Image: string;
  teamId: string;
}
export interface UploadImageResponse {
  path: string;
}
export interface MeInput {}
export interface ListUsersWhere {}
export interface ListUsersInput {
  where?: ListUsersWhere;
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}
export interface DeleteUserInput {
  id: string;
}
export interface CreateUserInput {
  name: string;
  email: string;
}
export interface UpdateUserWhere {
  id: string;
}
export interface UpdateUserValues {
  name?: string;
  email?: string;
}
export interface UpdateUserInput {
  where: UpdateUserWhere;
  values?: UpdateUserValues;
}
export interface GetTeamInput {
  id: string;
}
export interface ListTeamsWhere {}
export interface ListTeamsInput {
  where?: ListTeamsWhere;
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}
export interface DeleteTeamInput {
  id: string;
}
export interface UpdateTeamWhere {
  id: string;
}
export interface UpdateTeamValues {
  name?: string;
  description?: string | null;
  logoUrl?: string | null;
}
export interface UpdateTeamInput {
  where: UpdateTeamWhere;
  values?: UpdateTeamValues;
}
export interface CreateTeamMembershipInput {
  team: CreateTeamMembershipTeamInput;
  user: CreateTeamMembershipUserInput;
}
export interface CreateTeamMembershipTeamInput {
  name: string;
  description: string | null;
}
export interface CreateTeamMembershipUserInput {
  id: string;
}
export interface GetDocumentInput {
  id: string;
}
export interface ListDocumentsTeamInput {
  id: IdQueryInput;
}
export interface IdQueryInput {
  equals?: string | null;
  oneOf?: string[];
  notEquals?: string | null;
}
export interface ListDocumentsWhere {
  team: ListDocumentsTeamInput;
}
export interface ListDocumentsInput {
  where: ListDocumentsWhere;
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}
export interface DeleteDocumentInput {
  id: string;
  userId?: string;
  teamId?: string;
}
export interface CreateDocumentInput {
  title: string;
  content: string;
  team?: CreateDocumentTeamInput | null;
  user: CreateDocumentUserInput;
}
export interface CreateDocumentTeamInput {
  id?: string;
}
export interface CreateDocumentUserInput {
  id: string;
}
export interface UpdateDocumentWhere {
  id: string;
}
export interface UpdateDocumentValues {
  title?: string;
  content?: string;
  team?: UpdateDocumentTeamInput | null;
  user?: UpdateDocumentUserInput;
}
export interface UpdateDocumentTeamInput {
  id?: string;
}
export interface UpdateDocumentUserInput {
  id?: string;
}
export interface UpdateDocumentInput {
  where: UpdateDocumentWhere;
  values?: UpdateDocumentValues;
}
export interface ActiveInvitesWhere {}
export interface ActiveInvitesInput {
  where?: ActiveInvitesWhere;
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}
export interface CreateInviteInput {
  email: string;
  team: CreateInviteTeamInput;
  expiry: Date;
}
export interface CreateInviteTeamInput {
  id: string;
}
export interface EmailPasswordInput {
  email: string;
  password: string;
}
export interface AuthenticateInput {
  createIfNotExists?: boolean;
  emailPassword: EmailPasswordInput;
}
export interface AuthenticateResponse {
  identityCreated: boolean;
  token: string;
}
export interface RequestPasswordResetInput {
  email: string;
  redirectUrl: string;
}
export interface RequestPasswordResetResponse {}
