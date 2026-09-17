import { SignIn } from "@clerk/react";
import { useLocation } from "wouter";
import { Button } from "@workspace/divide-ai-ds/components/ui/button";
import { PhoneShell } from "@/components/phone-shell";

export default function Entrar() {
  const [, setLocation] = useLocation();

  return (
    <PhoneShell className="px-6 pb-8 pt-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[26px] font-bold leading-none">Divide Aí</p>
          <p className="mt-2 text-sm text-muted-foreground">Sua conta e seus rolês</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setLocation("/")}>
          Agora não
        </Button>
      </div>

      <div className="mt-8 flex flex-1 justify-center">
        <SignIn
          routing="path"
          path={`${import.meta.env.BASE_URL}entrar`}
          fallbackRedirectUrl={import.meta.env.BASE_URL}
        />
      </div>
    </PhoneShell>
  );
}
