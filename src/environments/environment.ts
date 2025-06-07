// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  supabaseUrl: 'https://zmzcihcuhtwwqlcnxacc.supabase.co', // Replace with your Supabase project URL
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptemNpaGN1aHR3d3FsY254YWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODg3MjksImV4cCI6MjA1OTk2NDcyOX0.HCldqf4DLda5b79mURv6lNjazKio9YL8Ev0Tg7cyRjk', // Replace with your Supabase anon key
  cognitoUserPoolId: 'ap-south-1_JqNl3nfb2',
  cognitoClientId: '4ugq51ktc5oorgicv6jde5va7h',
  region: 'ap-south-1',
  cognitoDomain: 'ap-south-1jqnl3nfb2.auth.ap-south-1.amazoncognito.com', // Please verify this domain in your AWS Cognito console
  redirectSignInUri: 'http://localhost:4200/my-space/',
  redirectSignOutUri: 'http://localhost:4200/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
