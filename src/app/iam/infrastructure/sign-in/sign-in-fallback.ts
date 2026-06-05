import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { SignInCommand } from '../../domain/model/sign-in.command';
import { User } from '../../domain/model/user.entity';
import { IamRegisteredUsersStorage } from '../iam-registered-users.storage';

/**
 * Falls back to locally persisted / demo credentials when Beeceptor is unavailable.
 */
export function signInWithLocalFallback(
  command: SignInCommand,
  registeredUsers: IamRegisteredUsersStorage,
  error: unknown,
): Observable<User> {
  if (error instanceof HttpErrorResponse && error.status === 0) {
    const user = registeredUsers.authenticate(command.email, command.password);
    if (user) {
      return of(user);
    }
    return throwError(
      () => new Error('No se pudo conectar al servidor. Verifica tu red o usa una cuenta demo.'),
    );
  }

  const user = registeredUsers.authenticate(command.email, command.password);
  if (user) {
    return of(user);
  }

  if (error instanceof HttpErrorResponse) {
    if (error.status === 401 || error.status === 403) {
      return throwError(() => new Error('Correo o contraseña incorrectos.'));
    }
    if (error.status === 404) {
      return throwError(() => new Error('Servicio de inicio de sesión no disponible.'));
    }
  }

  if (error instanceof Error) {
    return throwError(() => error);
  }

  return throwError(() => new Error('No se pudo iniciar sesión. Intenta de nuevo.'));
}
