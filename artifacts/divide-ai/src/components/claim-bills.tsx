import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useClaimBills,
  getListBillsQueryKey,
  getGetStatsQueryKey,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

/**
 * When a user is signed in, migrate the anonymous session's bills into the
 * account. The server call is idempotent (only unclaimed bills of this
 * cookie move), so running it on every signed-in load is safe.
 */
export function ClaimBills() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const claim = useClaimBills();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const claimedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !userId) return;
    if (claimedFor.current === userId) return;
    claimedFor.current = userId;
    claim.mutate(undefined, {
      onSuccess: ({ migrated }) => {
        if (migrated > 0) {
          queryClient.invalidateQueries({ queryKey: getListBillsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
          toast({
            title:
              migrated === 1
                ? "Seu rolê foi guardado na conta"
                : `${migrated} rolês guardados na conta`,
          });
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, userId]);

  return null;
}
