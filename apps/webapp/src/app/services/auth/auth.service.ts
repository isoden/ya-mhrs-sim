import { Injectable, inject } from '@angular/core'
import {
  Auth,
  GoogleAuthProvider,
  User,
  UserCredential,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  user,
} from '@angular/fire/auth'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #auth = inject(Auth)

  readonly user$ = user(this.#auth)
  readonly authStateChanged$ = new Observable<User | null>((subscriber) =>
    onAuthStateChanged(this.#auth, (user) => subscriber.next(user)),
  )

  signIn(): Promise<UserCredential> {
    return signInWithPopup(this.#auth, new GoogleAuthProvider())
  }

  signOut(): Promise<void> {
    return signOut(this.#auth)
  }
}
