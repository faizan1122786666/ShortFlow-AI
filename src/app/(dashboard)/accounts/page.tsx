import { AccountConnections } from "@/components/account-connections";

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Connected Accounts</h1>
        <p className="text-muted-foreground">
          Connect your YouTube and TikTok accounts for publishing
        </p>
      </div>
      <AccountConnections />
    </div>
  );
}
