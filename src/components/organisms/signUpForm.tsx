import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { kårer } from "@/data/committees";
import { getCommitteesForKår, sortAlphabetically } from "@/utils/helpers";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSignUp } from "@/hooks";
import { type Kår, type User } from "@/utils/interfaces";
import { LoadingButton } from "../molecules/loadingButton";

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

const formSchemaGoogle = z.object({
  kår: z.string().min(1, "Val av kår saknas"),
  fadderi: z.string().min(1, "Val av fadderi saknas"),
});

const ACCOUNT_TYPE = {
  email: "email",
  google: "google",
} as const;

export const SignUpForm = () => {
  const navigate = useNavigate();

  const [createAccountWith, setCreateAccountWith] = useState<
    keyof typeof ACCOUNT_TYPE
  >(ACCOUNT_TYPE.google);

  const accountType =
    createAccountWith === ACCOUNT_TYPE.google ? "Google" : "e-post";

  const switchTo =
    createAccountWith === ACCOUNT_TYPE.email ? "Google" : "e-post";

  return (
    <div className="mx-auto grid w-[300px] gap-6 md:w-[450px]">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Skapa konto</h1>
        <p className="text-balance text-muted-foreground">
          Fyll i din information för att skapa ett konto
        </p>
      </div>

      <div className="grid gap-4">
        <Button
          variant="secondary"
          className="w-full md:col-span-2"
          onClick={() =>
            setCreateAccountWith((prev) => {
              return prev === ACCOUNT_TYPE.email
                ? ACCOUNT_TYPE.google
                : ACCOUNT_TYPE.email;
            })
          }
        >
          {`Du skapar konto med ${accountType}, byt till ${switchTo}`}
        </Button>
        {createAccountWith === "email" ? <FormEmail /> : <FormGoogle />}
      </div>
      <div className="text-center text-sm">
        Hade du redan ett konto?{" "}
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

const FormEmail = () => {
  const { signupWithEmailAndPassword, isPending } = useSignUp();

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
                    {sortAlphabetically(Object.values(committees)).map(
                      (assignee: { text: string; id: string }) => (
                        <SelectItem key={assignee.text} value={assignee.id}>
                          {assignee.text}
                        </SelectItem>
                      ),
                    )}
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
        >
          Skapa ett konto
        </LoadingButton>
      </form>
    </Form>
  );
};

const FormGoogle = () => {
  const { signUpWithGoogle, isPending } = useSignUp();

  const form = useForm<z.infer<typeof formSchemaGoogle>>({
    resolver: zodResolver(formSchemaGoogle),
    defaultValues: {
      kår: "",
      fadderi: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchemaGoogle>) {
    await signUpWithGoogle(values.fadderi as User["committeeId"]);
  }

  const kårIsOther = form.watch("kår") === "Övrigt";
  const kårIsEmpty = form.watch("kår") === "";

  return (
    <Form {...form}>
      <form
        className="grid gap-4 md:col-span-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
                    {sortAlphabetically(Object.values(committees)).map(
                      (assignee: { text: string; id: string }) => (
                        <SelectItem key={assignee.text} value={assignee.id}>
                          {assignee.text}
                        </SelectItem>
                      ),
                    )}
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
        >
          Skapa ett konto
        </LoadingButton>
      </form>
    </Form>
  );
};
