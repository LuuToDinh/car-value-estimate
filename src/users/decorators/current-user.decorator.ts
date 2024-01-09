import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  // data: never:: this decorator never receive a param (never occur)
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.currentUser;

    return user;
  },
);
