// "use client";

// import { useEffect, useState } from "react";
// import { createClient } from "@/lib/supabase/client";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import type { Platform, PlatformConnection } from "@/types";
// import { getPlatformLabel } from "@/lib/utils";
// import { Youtube, Music2, Link2, Loader2, CheckCircle } from "lucide-react";
// import { toast } from "sonner";

// const platformConfig: {
//   id: Platform;
//   icon: typeof Youtube;
//   tokenLabel: string;
// }[] = [
//   { id: "youtube", icon: Youtube, tokenLabel: "YouTube OAuth Access Token" },
//   { id: "tiktok", icon: Music2, tokenLabel: "TikTok Access Token" },
// ];

// export function AccountConnections() {
//   const [connections, setConnections] = useState<PlatformConnection[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState<Platform | null>(null);
//   const [tokens, setTokens] = useState<Record<Platform, string>>({
//     youtube: "",
//     tiktok: "",
//   });
//   const supabase = createClient();

//   useEffect(() => {
//     async function load() {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();
//       if (!user) return;

//       const { data } = await supabase
//         .from("platform_connections")
//         .select("*")
//         .eq("user_id", user.id);

//       setConnections((data as PlatformConnection[]) ?? []);
//       setLoading(false);
//     }
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   function isConnected(platform: Platform) {
//     return connections.some((c) => c.platform === platform);
//   }

//   async function handleConnect(platform: Platform) {
//     const token = tokens[platform];
//     if (!token.trim()) {
//       toast.error("Please enter an access token");
//       return;
//     }

//     setSaving(platform);
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) return;

//     const { error } = await supabase.from("platform_connections").upsert(
//       {
//         user_id: user.id,
//         platform,
//         access_token: token,
//       },
//       { onConflict: "user_id,platform" }
//     );

//     if (error) {
//       toast.error(error.message);
//     } else {
//       toast.success(`${getPlatformLabel(platform)} connected`);
//       const { data } = await supabase
//         .from("platform_connections")
//         .select("*")
//         .eq("user_id", user.id);
//       setConnections((data as PlatformConnection[]) ?? []);
//       setTokens((t) => ({ ...t, [platform]: "" }));
//     }
//     setSaving(null);
//   }

//   async function handleDisconnect(platform: Platform) {
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     if (!user) return;

//     await supabase
//       .from("platform_connections")
//       .delete()
//       .eq("user_id", user.id)
//       .eq("platform", platform);

//     setConnections((c) => c.filter((x) => x.platform !== platform));
//     toast.success(`${getPlatformLabel(platform)} disconnected`);
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center py-12">
//         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//       </div>
//     );
//   }

//   return (
//     <div className="grid gap-6 md:grid-cols-2">
//       {platformConfig.map(({ id, icon: Icon, tokenLabel }) => {
//         const connected = isConnected(id);
//         return (
//           <Card key={id}>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <Icon className="h-6 w-6" />
//                   <div>
//                     <CardTitle>{getPlatformLabel(id)}</CardTitle>
//                     <CardDescription>
//                       {connected ? "Connected" : "Not connected"}
//                     </CardDescription>
//                   </div>
//                 </div>
//                 {connected && (
//                   <CheckCircle className="h-5 w-5 text-green-500" />
//                 )}
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {!connected ? (
//                 <>
//                   <div className="space-y-2">
//                     <Label htmlFor={`token-${id}`}>{tokenLabel}</Label>
//                     <Input
//                       id={`token-${id}`}
//                       type="password"
//                       value={tokens[id]}
//                       onChange={(e) =>
//                         setTokens((t) => ({ ...t, [id]: e.target.value }))
//                       }
//                       placeholder="Paste your access token"
//                     />
//                   </div>
//                   <Button
//                     onClick={() => handleConnect(id)}
//                     disabled={saving === id}
//                     className="w-full"
//                   >
//                     {saving === id ? (
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     ) : (
//                       <Link2 className="mr-2 h-4 w-4" />
//                     )}
//                     Connect
//                   </Button>
//                 </>
//               ) : (
//                 <Button
//                   variant="destructive"
//                   onClick={() => handleDisconnect(id)}
//                   className="w-full"
//                 >
//                   Disconnect
//                 </Button>
//               )}
//             </CardContent>
//           </Card>
//         );
//       })}
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Platform, PlatformConnection } from "@/types";
import { getPlatformLabel } from "@/lib/utils";
import { Youtube, Music2, Link2, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const platformConfig: {
  id: Platform;
  icon: typeof Youtube;
  tokenLabel: string;
  unavailable?: boolean;
}[] = [
  { id: "youtube", icon: Youtube, tokenLabel: "YouTube OAuth Access Token" },
  {
    id: "tiktok",
    icon: Music2,
    tokenLabel: "TikTok Access Token",
    unavailable: true,
  },
];

export function AccountConnections() {
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Platform | null>(null);
  const [tokens, setTokens] = useState<Record<Platform, string>>({
    youtube: "",
    tiktok: "",
  });

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("platform_connections")
        .select("*")
        .eq("user_id", user.id);

      setConnections((data as PlatformConnection[]) ?? []);
      setLoading(false);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function isConnected(platform: Platform) {
    return connections.some((c) => c.platform === platform);
  }

  async function handleConnect(platform: Platform) {
    if (platform === "tiktok") {
      toast.info("TikTok integration is currently unavailable. Coming soon.");
      return;
    }

    const token = tokens[platform];

    if (!token.trim()) {
      toast.error("Please enter an access token");
      return;
    }

    setSaving(platform);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(null);
      return;
    }

    const { error } = await supabase.from("platform_connections").upsert(
      {
        user_id: user.id,
        platform,
        access_token: token,
      },
      { onConflict: "user_id,platform" }
    );

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`${getPlatformLabel(platform)} connected`);

      const { data } = await supabase
        .from("platform_connections")
        .select("*")
        .eq("user_id", user.id);

      setConnections((data as PlatformConnection[]) ?? []);
      setTokens((t) => ({ ...t, [platform]: "" }));
    }

    setSaving(null);
  }

  async function handleDisconnect(platform: Platform) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("platform_connections")
      .delete()
      .eq("user_id", user.id)
      .eq("platform", platform);

    setConnections((c) => c.filter((x) => x.platform !== platform));
    toast.success(`${getPlatformLabel(platform)} disconnected`);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="grid gap-6 md:grid-cols-2">
        {platformConfig.map(({ id, icon: Icon, tokenLabel, unavailable }) => {
          const connected = isConnected(id);

          const card = (
            <Card
              key={id}
              className={
                unavailable
                  ? "cursor-not-allowed opacity-70 transition-opacity hover:opacity-80"
                  : undefined
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6" />
                    <div>
                      <CardTitle>{getPlatformLabel(id)}</CardTitle>
                      <CardDescription>
                        {unavailable
                          ? "Unavailable"
                          : connected
                            ? "Connected"
                            : "Not connected"}
                      </CardDescription>
                    </div>
                  </div>

                  {connected && !unavailable && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {unavailable ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor={`token-${id}`}>{tokenLabel}</Label>
                      <Input
                        id={`token-${id}`}
                        type="password"
                        disabled
                        placeholder="TikTok integration coming soon"
                      />
                    </div>

                    <Button disabled className="w-full">
                      <Link2 className="mr-2 h-4 w-4" />
                      Unavailable
                    </Button>
                  </>
                ) : !connected ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor={`token-${id}`}>{tokenLabel}</Label>
                      <Input
                        id={`token-${id}`}
                        type="password"
                        value={tokens[id]}
                        onChange={(e) =>
                          setTokens((t) => ({ ...t, [id]: e.target.value }))
                        }
                        placeholder="Paste your access token"
                      />
                    </div>

                    <Button
                      onClick={() => handleConnect(id)}
                      disabled={saving === id}
                      className="w-full"
                    >
                      {saving === id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Link2 className="mr-2 h-4 w-4" />
                      )}
                      Connect
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={() => handleDisconnect(id)}
                    className="w-full"
                  >
                    Disconnect
                  </Button>
                )}
              </CardContent>
            </Card>
          );

          if (!unavailable) {
            return card;
          }

          return (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <div>{card}</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>TikTok integration is currently unavailable. Coming soon.</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}