import { useAuth, UserButton } from "@clerk/react";
import { useLocation } from "wouter";
import { Button } from "@workspace/divide-ai-ds/components/ui/button";

export function AccountButton({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return <ClerkAccountButton />;
}

function ClerkAccountButton() {
  const { isLoaded, isSignedIn } = useAuth();
  const [, setLocation] = useLocation();
  if (!isLoaded) return <div className="h-10 w-10 rounded-full bg-secondary" />;
  if (isSignedIn) {
    return (
      <div className="flex min-h-10 items-center">
        <UserButton appearance={{ elements: { avatarBox: "h-10 w-10" } }} />
      </div>
    );
  }

  return (
    <div className="flex min-h-10 items-center">
      <Button
        variant="secondary"
        size="sm"
        data-testid="button-sign-in"
        onClick={() => setLocation("/entrar")}
      >
        Entrar
      </Button>
    </div>
  );
}
