import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { Reflector, ModulesContainer } from "@nestjs/core";
import { Cron } from "croner";
import { CRON_JOB_METADATA } from "src/common/decorators/cron.decorator";

@Injectable()
export class CronService implements OnModuleInit {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly modulesContainer: ModulesContainer,
  ) {}

  onModuleInit() {
    const modules = [...this.modulesContainer.values()];

    modules.forEach((module) => {
      const providers = [...module.providers.values()];

      providers.forEach((wrapper) => {
        const { instance, metatype } = wrapper;

        if (!instance || !metatype) {
          return;
        }

        const prototype = Object.getPrototypeOf(instance);
        const methods = Object.getOwnPropertyNames(prototype).filter(
          (method) => method !== "constructor" && typeof instance[method] === "function",
        );

        methods.forEach((method) => {
          const cronMetadata = this.reflector.get<any>(
            CRON_JOB_METADATA,
            prototype[method],
          ) as any;

          if (cronMetadata) {
            const { cronExpression, options } = cronMetadata;
            Cron(cronExpression, options, instance[method].bind(instance));
            this.logger.log(
              `Scheduled cron job: ${method} with expression ${cronExpression}`,
            );
          }
        });
      });
    });
  }
}
