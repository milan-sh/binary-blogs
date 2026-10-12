import { zodResolver } from '@hookform/resolvers/zod'
import { CircleAlertIcon } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import authService from '@/appwrite/auth'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { getErrorMessage } from '@/lib/utils'
import { login } from '@/store/authSlice'
import { useAppDispatch } from '@/store/store'
import AuthCard from './AuthCard'
import PasswordInput from './PasswordInput'

const signupSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.').max(128, 'That name is too long.'),
  email: z.email('Enter a valid email address.'),
  //Appwrite rejects passwords shorter than 8 characters
  password: z.string().min(8, 'Use at least 8 characters.').max(256, 'That password is too long.'),
})

type SignupValues = z.infer<typeof signupSchema>

function Signup() {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { control, handleSubmit, setError, formState } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  const onSubmit = async (values: SignupValues) => {
    try {
      await authService.createAccount(values)
      const userData = await authService.getCurrentUser()
      if (!userData) throw new Error('Your account was created, but logging in failed. Try logging in.')
      dispatch(login(userData))
      toast.success('Account created. Welcome to Binary Blogs!')
    } catch (error) {
      setError('root', { message: getErrorMessage(error) })
    }
  }

  return (
    <AuthCard
      title="Create an account"
      description="Join Binary Blogs and start publishing in minutes."
      footer={
        <p>
          Already have an account?{' '}
          <Link
            to="/login"
            state={location.state}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Log in
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
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="signup-name">Name</FieldLabel>
                <Input
                  {...field}
                  id="signup-name"
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="signup-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="signup-email"
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
                <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                <PasswordInput
                  {...field}
                  id="signup-password"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : (
                  <FieldDescription>At least 8 characters.</FieldDescription>
                )}
              </Field>
            )}
          />

          <Button type="submit" size="lg" disabled={formState.isSubmitting}>
            {formState.isSubmitting && <Spinner data-icon="inline-start" />}
            Create account
          </Button>
        </FieldGroup>
      </form>
    </AuthCard>
  )
}

export default Signup
