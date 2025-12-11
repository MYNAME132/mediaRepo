import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class MediaContextService {
    constructor(@Inject(REQUEST) private readonly request: Request) { }

    getOrganizationId(): string {
        const orgId = this.request.headers['x-organization'];
        if (!orgId || Array.isArray(orgId)) {
            throw new Error('Organization ID header is required');
        }
        return orgId;
    }
}