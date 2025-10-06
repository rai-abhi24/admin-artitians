"use client"

import { Header } from "@/components/header"
import { PasswordForm } from "@/components/password-form"
import { SiteSettingsForm } from "@/components/site-settings-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div className="flex flex-col">
      <Header title="Settings" description="Manage your admin panel settings" />
      <div className="flex-1 space-y-6 p-6">
        <Tabs defaultValue="site" className="space-y-6">
          <TabsList>
            <TabsTrigger className="cursor-pointer" value="site">Site Settings</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="password">Change Password</TabsTrigger>
          </TabsList>

          <TabsContent value="password">
            <PasswordForm />
          </TabsContent>

          <TabsContent value="site">
            <SiteSettingsForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
