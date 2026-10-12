import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlertIcon } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import authService from '@/appwrite/auth'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { getErrorMessage } from '@/lib/utils'
import { login } from '@/store/authSlice'
import { useAppDispatch } from '@/store/store'
import AuthCard from './AuthCard'
import PasswordInput from './PasswordInput'

const loginSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
})

type LoginValues = z.infer<typeof loginSchema>

function Login() {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { control, handleSubmit, setError, formState } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: LoginValues) => {
    try {
      await authService.login(values)
      const userData = await authService.getCurrentUser()
      if (!userData) throw new Error('Could not load your account. Please try again.')
      //AuthLayout redirects away from this page as soon as the store updates
      dispatch(login(userData))
      toast.success(`Welcome back, ${userData.name.split(' ')[0]}!`)
    } catch (error) {
      setError('root', { message: getErrorMessage(error) })
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      description="Log in to write, edit and manage your posts."
      footer={
        <p>
          Don&rsquo;t have an account?{' '}
          <Link
            to="/signup"
            state={location.state}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          {formState.errors.root && (
            <Alert variant="destructive">
              <CircleAlertIcon />
              <AlertDescription>{formState.errors.root.message}</AlertDescription>
            </Alert>
          )}

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-password">Password</FieldLabel>
                <PasswordInput
                  {...field}
                  id="login-password"
                  autoComplete="current-password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Button type="submit" size="lg" disabled={formState.isSubmitting}>
            {formState.isSubmitting && <Spinner data-icon="inline-start" />}
            Log in
          </Button>
        </FieldGroup>
      </form>
    </AuthCard>
  )
}

export default Login
