export const environment = {
  production: true,
  supabaseUrl: 'YOUR_SUPABASE_URL', // Replace with your Supabase project URL
  supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY', // Replace with your Supabase anon key
  cognitoUserPoolId: 'ap-south-1_JqNl3nfb2',
  cognitoClientId: '4ugq51ktc5oorgicv6jde5va7h',
  region: 'ap-south-1',
  cognitoDomain: 'ap-south-1jqnl3nfb2.auth.ap-south-1.amazoncognito.com', // Please verify this domain in your AWS Cognito console
  redirectSignInUri: 'https://resuvia.io/my-space/',
  redirectSignOutUri: 'https://resuvia.io/'
};
