import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserWithId } from '../auth/user.interface'; 

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext):string => {
    //switchToHttp()=> http regarding jati ni operation, or properties we can get from this one. 
    const request = context.switchToHttp().getRequest<{user: UserWithId}>();
    return request.user._id;
  },
);
