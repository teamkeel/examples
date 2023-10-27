// GENERATED DO NOT EDIT

type RequestHeaders = Record<string, string>;

export type RequestConfig = {
  baseUrl: string;
  headers?: RequestHeaders;
};

class Core {
	constructor(private config: RequestConfig) {}

	ctx = {
		token: "",
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
    setToken: (value: string): Core => {
      this.ctx.token = value;
      this.ctx.isAuthenticated = true;
      return this;
    },
    clearToken: (): Core => {
      this.ctx.token = "";
      this.ctx.isAuthenticated = false;
      return this;
    },
    rawRequest: async <T>(action: string, body: any): Promise<APIResult<T>> => {
      try {
        const result = await globalThis.fetch(
          stripTrailingSlash(this.config.baseUrl) + "/json/" + action,
          {
            method: "POST",
            cache: "no-cache",
            headers: {
              accept: "application/json",
              "content-type": "application/json",
              ...this.config.headers,
              ...(this.ctx.token
                ? {
                    Authorization: "Bearer " + this.ctx.token,
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

        let errorMessage = "unknown error";

        try {
          const errorData: {
            message: string;
          } = await result.json();
          errorMessage = errorData.message;
        } catch (error) {}

        const requestId = result.headers.get("X-Amzn-Requestid") || undefined;

        const errorCommon = {
          message: errorMessage,
          requestId,
        };

        switch (result.status) {
          case 400:
            return {
              error: {
                ...errorCommon,
                type: "bad_request",
              },
            };
          case 401:
            return {
              error: {
                ...errorCommon,
                type: "unauthorized",
              },
            };
          case 403:
            return {
              error: {
                ...errorCommon,
                type: "forbidden",
              },
            };
          case 404:
            return {
              error: {
                ...errorCommon,
                type: "not_found",
              },
            };
          case 500:
            return {
              error: {
                ...errorCommon,
                type: "internal_server_error",
              },
            };

          default:
            return {
              error: {
                ...errorCommon,
                type: "unknown",
              },
            };
        }
      } catch (error) {
        return {
          error: {
            type: "unknown",
            message: "unknown error",
            error,
          },
        };
      }
    },
  };
}

// Utils

const stripTrailingSlash = (str: string) => {
  if (!str) return str;
  return str.endsWith("/") ? str.slice(0, -1) : str;
};


const RFC3339 = /^(?:\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01]))?(?:[T\s](?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?(?:\.\d+)?(?:[Zz]|[+-](?:[01]\d|2[0-3]):?[0-5]\d)?)?$/;
function reviver(key: any, value: any) {
  // Convert any ISO8601/RFC3339 strings to dates
  if (typeof value === "string" && RFC3339.test(value)) {
	return new Date(value);
  }
  return value;
}



// Result type

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
  type: "bad_request";
  message: string;
  requestId?: string;
};

/* 401 */
type UnauthorizedError = {
  type: "unauthorized";
  message: string;
  requestId?: string;
};

/* 403 */
type ForbiddenError = {
  type: "forbidden";
  message: string;
  requestId?: string;
};

/* 404 */
type NotFoundError = {
  type: "not_found";
  message: string;
  requestId?: string;
};

/* 500 */
type InternalServerError = {
  type: "internal_server_error";
  message: string;
  requestId?: string;
};

/* Unhandled/unexpected errors */
type UnknownError = {
  type: "unknown";
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


// API

export class APIClient extends Core {
    constructor(config: RequestConfig) {
      super(config);
    }
    private actions = {
        me : (i?: MeInput) => {
            return this.client.rawRequest<User | null>("me", i);
        },
        listUsers : (i?: ListUsersInput) => {
            return this.client.rawRequest<{results: User[], pageInfo: any}>("listUsers", i);
        },
        deleteUser : (i: DeleteUserInput) => {
            return this.client.rawRequest<string>("deleteUser", i);
        },
        createUser : (i: CreateUserInput) => {
            return this.client.rawRequest<User>("createUser", i);
        },
        updateUser : (i: UpdateUserInput) => {
            return this.client.rawRequest<User>("updateUser", i);
        },
        getTeam : (i: GetTeamInput) => {
            return this.client.rawRequest<Team | null>("getTeam", i);
        },
        listTeams : (i?: ListTeamsInput) => {
            return this.client.rawRequest<{results: Team[], pageInfo: any}>("listTeams", i);
        },
        deleteTeam : (i: DeleteTeamInput) => {
            return this.client.rawRequest<string>("deleteTeam", i);
        },
        updateTeam : (i: UpdateTeamInput) => {
            return this.client.rawRequest<Team>("updateTeam", i);
        },
        createTeamMembership : (i: CreateTeamMembershipInput) => {
            return this.client.rawRequest<TeamMembership>("createTeamMembership", i);
        },
        getDocument : (i: GetDocumentInput) => {
            return this.client.rawRequest<Document | null>("getDocument", i);
        },
        listDocuments : (i: ListDocumentsInput) => {
            return this.client.rawRequest<{results: Document[], pageInfo: any}>("listDocuments", i);
        },
        deleteDocument : (i: DeleteDocumentInput) => {
            return this.client.rawRequest<string>("deleteDocument", i);
        },
        createDocument : (i: CreateDocumentInput) => {
            return this.client.rawRequest<Document>("createDocument", i);
        },
        updateDocument : (i: UpdateDocumentInput) => {
            return this.client.rawRequest<Document>("updateDocument", i);
        },
        getImage : (i: GetImageInput) => {
            return this.client.rawRequest<ProfileImage | null>("getImage", i);
        },
        listImages : (i?: ListImagesInput) => {
            return this.client.rawRequest<{results: ProfileImage[], pageInfo: any}>("listImages", i);
        },
        deleteImage : (i: DeleteImageInput) => {
            return this.client.rawRequest<string>("deleteImage", i);
        },
        uploadImageToCloudinary : (i: UploadImageInput) => {
            return this.client.rawRequest<UploadImageResponse>("uploadImageToCloudinary", i);
        },
        activeInvites : (i?: ActiveInvitesInput) => {
            return this.client.rawRequest<{results: Invitation[], pageInfo: any}>("activeInvites", i);
        },
        createInvite : (i: CreateInviteInput) => {
            return this.client.rawRequest<Invitation>("createInvite", i);
        },
        authenticate : (i: AuthenticateInput) => {
            return this.client.rawRequest<AuthenticateResponse>("authenticate", i).then((res) => {
              if (res.data && res.data.token) this.client.setToken(res.data.token);
              return res;
            });
        },
        requestPasswordReset : (i: RequestPasswordResetInput) => {
            return this.client.rawRequest<RequestPasswordResetResponse>("requestPasswordReset", i);
        },
        resetPassword : (i: ResetPasswordInput) => {
            return this.client.rawRequest<ResetPasswordResponse>("resetPassword", i);
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
            getImage: this.actions.getImage,
            listImages: this.actions.listImages,
            activeInvites: this.actions.activeInvites,
        },
        mutations: {
            deleteUser: this.actions.deleteUser,
            createUser: this.actions.createUser,
            updateUser: this.actions.updateUser,
            deleteTeam: this.actions.deleteTeam,
            updateTeam: this.actions.updateTeam,
            createTeamMembership: this.actions.createTeamMembership,
            deleteDocument: this.actions.deleteDocument,
            createDocument: this.actions.createDocument,
            updateDocument: this.actions.updateDocument,
            deleteImage: this.actions.deleteImage,
            uploadImageToCloudinary: this.actions.uploadImageToCloudinary,
            createInvite: this.actions.createInvite,
            authenticate: this.actions.authenticate,
            requestPasswordReset: this.actions.requestPasswordReset,
            resetPassword: this.actions.resetPassword,
        }
    };

}

// API Types

export interface UploadImageInput {
    base64Image: string;
    userId: string;
    teamId?: string | null;
}
export interface UploadImageResponse {
    path: string;
}
export interface MeInput {
}
export interface ListUsersWhere {
}
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
export interface ListTeamsWhere {
}
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
export interface GetImageInput {
    id: string;
}
export interface ListImagesWhere {
}
export interface ListImagesInput {
    where?: ListImagesWhere;
    first?: number;
    after?: string;
    last?: number;
    before?: string;
}
export interface DeleteImageInput {
    id: string;
}
export interface ActiveInvitesWhere {
}
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
export interface RequestPasswordResetResponse {
}
export interface ResetPasswordInput {
    token: string;
    password: string;
}
export interface ResetPasswordResponse {
}
export interface User {
    name: string
    email: string
    id: string
    createdAt: Date
    updatedAt: Date
    identityId: string
}
export interface Team {
    name: string
    description: string | null
    id: string
    createdAt: Date
    updatedAt: Date
    ownerId: string
}
export interface TeamMembership {
    id: string
    createdAt: Date
    updatedAt: Date
    userId: string
    teamId: string
}
export interface Document {
    title: string
    content: string
    id: string
    createdAt: Date
    updatedAt: Date
    userId: string
    teamId: string | null
}
export interface ProfileImage {
    path: string
    id: string
    createdAt: Date
    updatedAt: Date
    userId: string | null
    teamId: string | null
}
export interface Invitation {
    email: string
    expiry: Date
    id: string
    createdAt: Date
    updatedAt: Date
    teamId: string
}
export interface Identity {
    email: string | null
    emailVerified: boolean
    password: any | null
    externalId: string | null
    issuer: string | null
    id: string
    createdAt: Date
    updatedAt: Date
}
