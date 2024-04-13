// jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authToken = request.headers.authorization;

    if (!authToken || !authToken.startsWith('Bearer ')) {
      return false; // If the request doesn't contain a valid JWT token, deny access
    }

    const token = authToken.split(' ')[1]; // Extract the token from the authorization header
    try {
      const decodedToken = this.jwtService.verify(token); // Verify the JWT token
      request.user = decodedToken; // Set the decoded user information on the request object
      return true; // If the token is valid, allow access
    } catch (error) {
      return false; // If the token is invalid, deny access
    }
  }
}
