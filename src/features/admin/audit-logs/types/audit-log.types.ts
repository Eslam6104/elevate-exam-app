export interface AuditLog {
  id: string;
  createdAt: string;
  actorUserId: string;
  actorUsername: string;
  actorEmail: string;
  actorRole: string;
  category: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  httpMethod: string;
  path: string;
}

export interface AuditLogResponse {
  status: boolean;
  code: number;
  payload: {
    data: AuditLog[];
    metadata: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
