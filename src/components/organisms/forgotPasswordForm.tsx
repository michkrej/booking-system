import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useResetPassword } from "@hooks/useResetPassword";
import { LoadingButton } from "@components/molecules/loadingButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { Input } from "@ui/input";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "E-postadress saknas")
    .email("Felaktig e-postadress"),
});

export const ForgotPasswordForm = () => {
  const { resetPassword, isPending } = useResetPassword();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await resetPassword(values.email);
      navigate("/");
    } finally {
      form.reset();
    }
  }

  return (
    <div className="mx-auto grid w-[300px] gap-6 md:w-[350px]">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Återställ lösenord</h1>
        <p className="text-muted-foreground text-balance">
          Ange din e-post för att återställa ditt lösenord
        </p>
      </div>
      <div className="grid gap-4">
        <Form {...form}>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-post</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton loading={isPending} className="w-full" type="submit">
              Skicka återställningslänk
            </LoadingButton>
          </form>
        </Form>
      </div>
      <div className="text-center text-sm">
        Klar?{" "}
        <span
          onClick={() => navigate("/", { state: { mode: undefined } })}
          className="cursor-pointer underline"
        >
          Logga in
        </span>
      </div>
    </div>
  );
};
