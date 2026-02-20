import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Field, FieldError, FieldLabel } from "@ui/field";
import { Input } from "@ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { useEmailLogin } from "@/hooks/useEmailLogin";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "E-postadress saknas")
    .email("Felaktig e-postadress"),
  password: z.string().min(8, "Lösenord saknas"),
});

export const LoginForm = () => {
  const { loginWithEmail, isPending: emailLoginIsPending } = useEmailLogin();
  const { loginWithGoogle, isPending: googleLoginIsPending } = useGoogleLogin();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    void loginWithEmail(values.email, values.password);
  }
  return (
    <div className="mx-auto grid w-[300px] gap-6 md:w-[350px]">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Logga in</h1>
        <p className="text-muted-foreground text-balance">
          Ange din e-post och lösenord för att logga in
        </p>
      </div>
      <div className="grid gap-4">
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Email Field */}
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">E-post</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Password Field */}
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Lösenord</FieldLabel>
                  <span
                    onClick={() =>
                      navigate("/", { state: { mode: "forgotPassword" } })
                    }
                    className="ml-auto inline-block text-sm underline hover:cursor-pointer"
                    tabIndex={-1}
                  >
                    Glömt ditt lösenord?
                  </span>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <LoadingButton
            loading={emailLoginIsPending}
            className="w-full"
            type="submit"
          >
            Logga in
          </LoadingButton>
        </form>
        <LoadingButton
          variant="outline"
          className="w-full"
          onClick={loginWithGoogle}
          loading={googleLoginIsPending}
        >
          Logga in med Google
        </LoadingButton>
      </div>

      <div className="text-center text-sm">
        Har du inget konto?{" "}
        <span
          onClick={() => navigate("/", { state: { mode: "signup" } })}
          className="cursor-pointer underline"
        >
          Skapa konto
        </span>
      </div>
    </div>
  );
};
