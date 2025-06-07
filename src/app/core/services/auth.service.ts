import { Injectable } from '@angular/core';
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  confirmSignUp,
  resendSignUpCode, // Corrected import
  signInWithRedirect, // Replaces federatedSignIn
  type AuthUser,
  type AuthSession,
  type SignUpInput,
  type SignUpOutput,
  type SignInInput,
  type ConfirmSignUpInput,
  type ResendSignUpCodeInput,
  type SignInWithRedirectInput // Replaces FederatedSignInInput
} from 'aws-amplify/auth';
// CognitoIdentityProvider is not directly imported like this in v6 for signInWithRedirect, provider is a string.
import { Hub } from 'aws-amplify/utils'; // HubPayload might not be needed or typed differently
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Define more specific AppUser if needed, extending AuthUser
export interface AppUser extends Partial<AuthUser> {
  email?: string; // Ensure email is explicitly part of your AppUser
  // Add other custom attributes you expect from user.attributes
}

// AppSession can be a direct alias or an extension if you add custom logic
export type AppSession = AuthSession;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _currentUser = new BehaviorSubject<AppUser | null>(null);
  private _currentSession = new BehaviorSubject<AppSession | null>(null);

  currentUser$: Observable<AppUser | null> = this._currentUser.asObservable();
  currentSession$: Observable<AppSession | null> = this._currentSession.asObservable();
  loggedIn$: Observable<boolean> = this.currentSession$.pipe(
    map(session => !!session && !!session.tokens?.idToken)
  );

  constructor() {
    this.checkCurrentUser();

    Hub.listen('auth', (data: { payload: { event: string; data?: any; message?: string } }) => {
      const { event, data: authData, message } = data.payload;
      console.log('Auth Hub event:', event, authData, message);

      switch (event) {
        case 'signedIn': // Event name for v6
        case 'autoSignIn': // Check if this event still exists or is handled by signedIn
          this.updateUserAndSessionFromHub(authData as AuthUser);
          break;
        case 'signedOut':
          this._currentUser.next(null);
          this._currentSession.next(null);
          break;
        case 'signInWithRedirect_failure': // Example failure event
        case 'signUp_failure': // Custom event or handle errors in promises
        case 'tokenRefresh_failure':
          console.error('Auth error event:', event, authData);
          this._currentUser.next(null);
          this._currentSession.next(null);
          break;
      }
    });
  }

  private async checkCurrentUser() {
    try {
      const user = await getCurrentUser();
      const session = await fetchAuthSession();
      this.updateUserAndSession(user, session);
    } catch (error) {
      console.log('No current user or session error:', error);
      this._currentUser.next(null);
      this._currentSession.next(null);
    }
  }

  private updateUserAndSession(user: AuthUser, session: AuthSession) {
    this._currentSession.next(session);
    const appUser: AppUser = {
      userId: user.userId,
      username: user.username,
      email: user.signInDetails?.loginId, // Or from attributes if configured
      // ... any other attributes you want to map
    };
    this._currentUser.next(appUser);
  }

  private async updateUserAndSessionFromHub(user: AuthUser) {
    // Called after Hub events like 'signedIn'
    try {
      const session = await fetchAuthSession();
      this.updateUserAndSession(user, session);
    } catch (error) {
        console.error("Error fetching session after Hub event:", error);
        this._currentUser.next(null); // Or just update user from Hub data if session fails
        this._currentSession.next(null);
    }
  }


  async signUp(credentials: { email: string; password: string }): Promise<{ user?: SignUpOutput; error?: any }> {
    const input: SignUpInput = {
      username: credentials.email,
      password: credentials.password,
      options: {
        userAttributes: {
          email: credentials.email,
        },
        // autoSignIn: true // if you want to auto sign in after confirmation
      },
    };
    try {
      const output = await signUp(input);
      return { user: output };
    } catch (error) {
      return { error };
    }
  }

  async confirmSignUp(username: string, confirmationCode: string): Promise<{ success: boolean; error?: any }> {
    const input: ConfirmSignUpInput = { username, confirmationCode };
    try {
      await confirmSignUp(input);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  async resendConfirmationCode(username: string): Promise<{ success: boolean; error?: any }> {
    const input: ResendSignUpCodeInput = { username };
    try {
      await resendSignUpCode(input);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  async signInWithPassword(credentials: { email: string; password: string }): Promise<{ user?: AppUser | null; session?: AppSession | null; error?: any }> {
    const input: SignInInput = { username: credentials.email, password: credentials.password };
    try {
      const { isSignedIn, nextStep } = await signIn(input);
      if (isSignedIn) {
        const user = await getCurrentUser();
        const session = await fetchAuthSession();
        this.updateUserAndSession(user, session); // Update BehaviorSubjects
        return { user: this._currentUser.value, session: this._currentSession.value };
      } else {
        // Handle other steps like MFA, confirm sign in, etc.
        console.log('SignIn next step:', nextStep);
        return { error: { message: 'Further steps required for sign in.', nextStep } };
      }
    } catch (error) {
      return { error };
    }
  }

  async signInWithGoogle(): Promise<void> {
    const input: SignInWithRedirectInput = {
      provider: 'Google', // Use string for Google provider
      // customState: 'any_custom_state_string' // Optional
    };
    try {
      await signInWithRedirect(input); // This will trigger a redirect
    } catch (error) {
      console.error('Error initiating Google sign in:', error);
      // Potentially update an error state BehaviorSubject
    }
  }

  async signOutGlobal(): Promise<void> { // signOut can be global or local
    try {
      await signOut({ global: true }); // Signs out from all devices
      // Hub listener should catch 'signedOut'
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
  
  // Simpler signOut (local)
  async signOut(): Promise<void> {
    try {
      await signOut();
      // Hub listener should catch 'signedOut'
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }


  async getSession(): Promise<AppSession | null> {
    try {
      return await fetchAuthSession();
    } catch {
      return null;
    }
  }

  async getUser(): Promise<AppUser | null> {
    try {
      const user = await getCurrentUser();
      return {
        userId: user.userId,
        username: user.username,
        email: user.signInDetails?.loginId, // Or from attributes
      };
    } catch {
      return null;
    }
  }

  async getAccessToken(): Promise<string | null> {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.idToken?.toString() ?? null;
    } catch {
      return null;
    }
  }
}
