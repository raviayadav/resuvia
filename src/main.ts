import { bootstrapApplication } from '@angular/platform-browser';
import { Amplify } from 'aws-amplify';
import { environment } from './environments/environment';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: environment.cognitoUserPoolId,
      userPoolClientId: environment.cognitoClientId,
      loginWith: { // This is for configuring the Cognito Hosted UI and federated providers
        oauth: {
          domain: environment.cognitoDomain,
          scopes: ['email', 'profile', 'openid'],
          redirectSignIn: [environment.redirectSignInUri],
          redirectSignOut: [environment.redirectSignOutUri],
          responseType: 'code' // 'token' or 'code' ('code' is recommended)
        }
      }
      // If you were also using Cognito Identity Pools (federated identities for AWS resources)
      // you would configure identityPoolId here.
      // identityPoolId: 'YOUR_IDENTITY_POOL_ID', // Example
    }
  }
  // You can add other categories like Storage, API, etc. here
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
