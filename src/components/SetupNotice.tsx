import { SettingsIcon } from 'lucide-react'
import Logo from '@/components/Logo'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { missingEnvVars } from '@/conf/conf'

// Shown instead of the app when the Appwrite env vars have not been filled in
function SetupNotice() {
  return (
    <div className="grid min-h-svh place-items-center p-4">
      <div className="flex w-full max-w-md flex-col gap-6">
        <Logo className="self-center" />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="size-4" />
              Finish setting up Appwrite
            </CardTitle>
            <CardDescription>
              Copy <code className="font-mono text-foreground">.env.sample</code> to{' '}
              <code className="font-mono text-foreground">.env</code>, fill in the values below
              and restart the dev server.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-1.5 rounded-lg bg-muted p-3 font-mono text-xs">
              {missingEnvVars.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SetupNotice
