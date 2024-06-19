import { SetMetadata } from "@nestjs/common";

export const CRON_JOB_METADATA = "CRON_JOB_METADATA";

type Options = {};

export const CronJob = (cronExpression: string, options?: Options): MethodDecorator => {
  return (target, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    SetMetadata(CRON_JOB_METADATA, { cronExpression, options })(
      target,
      propertyKey,
      descriptor,
    );
  };
};
