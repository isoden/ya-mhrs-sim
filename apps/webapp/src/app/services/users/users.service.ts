import { Injectable, inject } from '@angular/core'
import { User as AuthUser } from '@angular/fire/auth'
import { getDoc, doc, collection, setDoc, Firestore } from '@angular/fire/firestore'
import { switchMap } from 'rxjs'
import { AuthService } from '../auth/auth.service'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

type User = {
  displayName: string
  photoURL: string
  createdAt: string
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  readonly #auth = inject(AuthService)
  readonly #firestore = inject(Firestore)

  readonly currentUser$ = this.#auth.user$.pipe(
    switchMap(async (user) => {
      if (!user) return null

      const userDoc = await getDoc(doc(collection(this.#firestore, 'users'), user.uid))
      return userDoc.data() as User
    }),
  )

  async signUp(user: AuthUser) {
    const userDoc = await getDoc(doc(collection(this.#firestore, 'users'), user.uid))

    if (userDoc.exists()) return

    await setDoc(userDoc.ref, {
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
  }
}
