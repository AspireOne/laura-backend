import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Inject } from "@nestjs/common";
import { Kysely, sql } from "kysely";
import { DB } from "kysely-codegen";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

const apiKeyCachePrefix = "guard-api-key:";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject("Database") private readonly db: Kysely<DB>,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const apiKey = request.headers["x-api-key"];

    if (isPublic) {
      return true;
    }

    if (!apiKey) {
      throw new UnauthorizedException("API key is missing");
    }

    const cached = await this.cache.get(`${apiKeyCachePrefix}${apiKey}`);
    if (cached) {
      return true;
    }

    const result = await this.db
      .selectFrom("api_keys")
      .select("key")
      .where("key", "=", apiKey)
      .execute();

    if (result.length === 0) {
      throw new UnauthorizedException("Invalid API key");
    }

    await this.cache.set(`${apiKeyCachePrefix}${apiKey}`, true);
    return true;
  }
}
