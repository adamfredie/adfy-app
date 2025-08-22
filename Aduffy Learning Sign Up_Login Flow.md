## Sign Up and Login Flow

**Sign Up Flow**

1. Users are welcomed by splash screen before the welcome screen loads (component: splashscreen.tsx)  
2. Users land on welcome screen then clicks on Get Started to sign up (component used: welcomepages.tsx)  
3. Users sign up by filling their email and password on the sign up screen (component used: signup.tsx)  
4. Users see a green notification on top, confirming that a verification email has been sent to their provided email (component used: signup.tsx)  
5. Supabase backend sends a confirmation link to the email provided during sign up  
6. The user clicks on the confirmation link and is automatically redirected to onboarding, where the first screen asks the user to fill in their name (component used: onboarding.tsx). If auto redirection does not work, users should be provided with a link so they can click and go to onboarding.  
7. Once user fills all the mandatory fields in the onboarding step, they are redirected to the dashboard (dashboard.tsx)

**Login Flow**

1. Users are welcomed by splash screen before the welcome screen loads (component: splashscreen.tsx)  
2. Users land on welcome screen then clicks on I Already Have an Account  to sign up (component used: welcomepages.tsx)  
3. Users land on screen with options to Login with Google or Continue With Email.  
4. Users click on Continue with Email and sign in by filling their email and password (component used: login.tsx) OR Users may click on Continue with Google, and sign in using Google  
5. Users are authenticated and redirected to the dashboard (dashboard.tsx)  
6. After landing on the dashboard, users see data specific to their account

## Current Tech Stack

**Frontend:** React \+ Typescript, deployed on Vercel

**Backend:** PostgresSQL GoTrue for authentication, REST API \- deployed on Supabase

