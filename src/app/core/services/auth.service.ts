import { Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
  AuthChangeEvent,
  Session,
  User,
} from '@supabase/supabase-js';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { environment } from '../../../environments/environment'; // Adjust path if needed

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient;
  private _currentUser = new BehaviorSubject<User | null>(null);
  private _currentSession = new BehaviorSubject<Session | null>(null);

  // Expose observables for components to subscribe to
  currentUser$: Observable<User | null> = this._currentUser.asObservable();
  currentSession$: Observable<Session | null> = this._currentSession.asObservable();
  loggedIn$: Observable<boolean> = this.currentSession$.pipe(map(session => !!session));

  constructor() {
    // Check if placeholder URL is still present
    if (environment.supabaseUrl === 'YOUR_SUPABASE_URL' || !environment.supabaseUrl) {
      console.warn(
        'Supabase URL is not configured. Please update environment.ts or environment.prod.ts. Authentication features will be disabled.'
      );
      // Avoid initializing Supabase client if not configured
      // You might want to assign a dummy client or handle this case explicitly elsewhere
      this.supabase = null as any; // Assign null or a mock/dummy client
      return; // Stop further initialization in constructor
    }

    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

    // --- Initialize only if Supabase client was created ---

    // Immediately try to get the current session and user
    this.supabase.auth.getSession().then(({ data }) => {
      this._currentSession.next(data.session);
      this._currentUser.next(data.session?.user ?? null);
    });

    // Listen to auth changes
    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth State Change:', event, session); // For debugging
      this._currentSession.next(session);
      this._currentUser.next(session?.user ?? null);
    });
  }

  // --- Core Auth Methods ---

  async signUp(credentials: { email: string; password: string }): Promise<{ user: User | null; error: any }> {
    const { data, error } = await this.supabase.auth.signUp(credentials);
    return { user: data.user, error };
  }

  async signInWithPassword(credentials: { email: string; password: string }): Promise<{ user: User | null; session: Session | null; error: any }> {
    const { data, error } = await this.supabase.auth.signInWithPassword(credentials);
    return { user: data?.user ?? null, session: data?.session ?? null, error };
  }

  async signOut(): Promise<{ error: any }> {
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }

  // --- Session/User Accessors ---

  async getSession(): Promise<Session | null> {
    const { data } = await this.supabase.auth.getSession();
    return data.session;
  }

  async getUser(): Promise<User | null> {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }

  // Helper to get the current access token for HTTP interceptor
  async getAccessToken(): Promise<string | null> {
    const session = await this.getSession();
    return session?.access_token ?? null;
  }
}
