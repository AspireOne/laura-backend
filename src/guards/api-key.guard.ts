import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Inject } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { DB } from '../common/db.types';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('Database') private readonly db: Kysely<DB>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    const result = await this.db
      .selectFrom('api_keys')
      .select('key')
      .where('key', '=', apiKey)
      .execute();

    if (result.length === 0) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
