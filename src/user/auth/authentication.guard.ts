import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard} from '@nestjs/passport';

@Injectable()
export class AuthenticationGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext) : Promise<any>{
    const classString = context.getClass().toString();
    let result = classString.toLowerCase().includes('appcontroller') || classString.toLowerCase().includes('logincontroller') ? true : super.canActivate(context);
    return result;
  }
}
