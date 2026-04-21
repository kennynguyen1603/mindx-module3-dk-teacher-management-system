// ==========================================
// USER
// ==========================================

export const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BANNED: 'banned',
} as const;

export const UserRole = {
  USER: 'user',
  ADMIN: 'admin',
  TEACHER: 'teacher',
} as const;

export const AuthProvider = {
  LOCAL: 'local',
  GOOGLE: 'google',
} as const;

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role: (typeof UserRole)[keyof typeof UserRole];
  status: (typeof UserStatus)[keyof typeof UserStatus];
  isEmailVerified: boolean;
  authProvider: (typeof AuthProvider)[keyof typeof AuthProvider];
  providers: (typeof AuthProvider)[keyof typeof AuthProvider][];
  createdAt: Date;
  updatedAt: Date;
}

/** Response type cho FE — không chứa password, googleId */
export type IUserResponse = Omit<IUser, 'password'>;

// ==========================================
// AUTH
// ==========================================

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ITokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthResponse {
  user: IUserResponse;
  tokens: ITokensResponse;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// ==========================================
// PAGINATION
// ==========================================

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IPaginatedResponse<T> {
  data: T[];
  meta: IPaginationMeta;
  message?: string;
}

// ==========================================
// API RESPONSE
// ==========================================

export interface IApiError {
  message: string;
  status: number;
  details?: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
}

export interface IApiSuccess<T = any> {
  message: string;
  status: number;
  data: T;
}

// ==========================================
// TEACHER
// ==========================================

export interface IDegree {
  type: string;
  school: string;
  major: string;
  year: number;
  isGraduated: boolean;
}

export interface ITeacher {
  _id: string;
  code: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  identity: string;
  isActive: boolean;
  positions: any[];
  degrees: IDegree[];
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTeacherRequest {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  identity: string;
  dob: Date;
  positions?: string[];
  degrees?: IDegree[];
  isActive?: boolean;
  startDate: Date;
  endDate?: Date;
}

export interface IUpdateTeacherRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  identity?: string;
  dob?: Date;
  positions?: string[];
  degrees?: IDegree[];
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface IPaginatedTeacherResponse {
  teachers: ITeacher[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// ==========================================
// TEACHER POSITION
// ==========================================

export interface ITeacherPosition {
  _id: string;
  name: string;
  code: string;
  des: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTeacherPositionRequest {
  name: string;
  code: string;
  des: string;
  isActive?: boolean;
}

export interface IUpdateTeacherPositionRequest {
  name?: string;
  code?: string;
  des?: string;
  isActive?: boolean;
}

export interface IPaginatedTeacherPositionResponse {
  positions: ITeacherPosition[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
