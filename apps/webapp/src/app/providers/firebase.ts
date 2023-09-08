import { EnvironmentProviders, importProvidersFrom } from '@angular/core'
import { provideFirebaseApp, initializeApp } from '@angular/fire/app'
import { provideAuth, getAuth } from '@angular/fire/auth'
import { provideFirestore, getFirestore } from '@angular/fire/firestore'
import { environment } from '../../environments/environment'

export const firebaseProviders: EnvironmentProviders = importProvidersFrom([
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideFirestore(() => getFirestore()),
  provideAuth(() => getAuth()),
])
