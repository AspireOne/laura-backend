import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { Reflector, ModulesContainer } from "@nestjs/core";
import { Cron } from "croner";
import { CRON_JOB_METADATA } from "src/common/decorators/cron.decorator";
import { ErrorNotificationService } from "src/common/services/errorNotificationService";

@Injectable()
export class CronService implements OnModuleInit {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly modulesContainer: ModulesContainer,
    private readonly errNotifications: ErrorNotificationService,
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
            Cron(
              cronExpression,
              options,
              this.executeCronJob(instance, method, cronExpression),
            );
            this.logger.log(
              `Scheduled cron job: ${method} with expression ${cronExpression}`,
            );
          }
        });
      });
    });
  }

  private executeCronJob(instance: any, method: string, cronExpression: string) {
    return async (...args: any[]) => {
      try {
        await instance[method].apply(instance, args);
      } catch (error) {
        const title = `Error in cron job ${method} with expression ${cronExpression}:`;
        this.errNotifications.sendGenericErrorNotification({
          error,
          title,
          body: error.stack,
        });

        this.logger.error(title, error.stack);
      }
    };
  }
}
