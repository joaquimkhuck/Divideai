import { SignIn, SignUp } from "@clerk/react";
import { PhoneShell } from "@/components/phone-shell";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

// Clerk reads window.location.pathname directly, so path props must be the
// FULL browser path (including the artifact base path).
export function SignInPage() {
  return (
    <PhoneShell>
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <SignIn
          routing="path"
          path={`${basePath}/sign-in`}
          signUpUrl={`${basePath}/sign-up`}
        />
      </main>
    </PhoneShell>
  );
}

export function SignUpPage() {
  return (
    <PhoneShell>
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <SignUp
          routing="path"
          path={`${basePath}/sign-up`}
          signInUrl={`${basePath}/sign-in`}
        />
      </main>
    </PhoneShell>
  );
}
