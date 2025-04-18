import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { kårer } from "@data/committees";
import { getCommitteesForKår } from "@utils/helpers";
import { type Kår, type User } from "@utils/interfaces";
import { LoadingButton } from "@components/molecules/loadingButton";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import { Input } from "@ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { useSignup } from "@/hooks/useSignup";

const formSchemaEmail = z
  .object({
    username: z.string().min(1, "Du måste ange ett förnamn"),
    email: z.string().email("Felaktig e-postadress"),
    password: z.string().min(8, "Lösenordet måste vara minst 8 tecken långt"),
    passwordControl: z
      .string()
      .min(8, "Lösenordet måste vara minst 8 tecken långt"),
    kår: z.string().min(1, "Val av kår saknas"),
    fadderi: z.string().min(1, "Val av fadderi saknas"),
  })
  .refine((data) => data.password === data.passwordControl, {
    message: "Lösenorden matchar inte",
    path: ["passwordControl"],
  });

export const FormEmail = () => {
  const { signupWithEmailAndPassword, isPending } = useSignup();

  const form = useForm<z.infer<typeof formSchemaEmail>>({
    resolver: zodResolver(formSchemaEmail),
    defaultValues: {
      email: "",
      password: "",
      passwordControl: "",
      kår: "",
      fadderi: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchemaEmail>) {
    await signupWithEmailAndPassword({
      email: values.email,
      password: values.password,
      displayName: values.username,
      committeeId: values.fadderi as User["committeeId"],
    });
  }

  const kårIsOther = form.watch("kår") === "Övrigt";
  const kårIsEmpty = form.watch("kår") === "";

  useEffect(() => {
    if (kårIsOther) {
      form.setValue("fadderi", Object.values(kårer.Övrigt)[0]!.id);
    } else {
      form.setValue("fadderi", "");
    }
  }, [kårIsOther]);

  return (
    <Form {...form}>
      <form
        className="grid gap-4 md:col-span-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Email Field */}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>E-post</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormDescription>Tips: använd din fadderimejl</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lösenord</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Confirmation Field */}
        <FormField
          control={form.control}
          name="passwordControl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bekräfta lösenord</FormLabel>
              <FormControl>
                <Input
                  id="passwordControl"
                  type="password"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Kår Select Field */}
        <FormField
          control={form.control}
          name="kår"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kår</FormLabel>
              <Select
                onValueChange={(val) => {
                  field.onChange(val);
                  if (val === "Övrigt") {
                    form.setValue(
                      "fadderi",
                      kårer.Övrigt["a16c78ef-6f00-492c-926e-bf1bfe9fce32"].id,
                    );
                  } else {
                    form.setValue("fadderi", "");
                  }
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Kår" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(kårer).map((val) => {
                    return (
                      <SelectItem key={val} value={val}>
                        {val}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Fadderi Select Field */}
        <FormField
          control={form.control}
          name="fadderi"
          render={({ field }) => {
            const committees =
              getCommitteesForKår(form.getValues().kår as Kår) || {};
            return (
              <FormItem>
                <FormLabel>Fadderi</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={kårIsOther || kårIsEmpty}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={"Fadderi"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(committees)
                      .filter((c: { hidden?: boolean }) => c?.hidden !== true)
                      .map((assignee: { name: string; id: string }) => (
                        <SelectItem key={assignee.name} value={assignee.id}>
                          {assignee.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Submit Button */}
        <LoadingButton
          loading={isPending}
          type="submit"
          className="w-full md:col-span-2"
          onClick={() => onSubmit(form.getValues())}
        >
          Skapa ett konto
        </LoadingButton>
      </form>
    </Form>
  );
};
