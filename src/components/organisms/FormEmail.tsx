import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { kårer } from "@data/committees";
import { getCommitteesForKår } from "@utils/helpers";
import { LoadingButton } from "@components/molecules/loadingButton";
import { Input } from "@ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { useSignUp } from "@/hooks/useSignUp";
import { type User } from "@/interfaces/interfaces";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";

const formSchemaEmail = z
  .object({
    username: z.string().min(1, "Du måste ange ett förnamn"),
    email: z.string().email("Felaktig e-postadress"),
    password: z.string().min(8, "Lösenordet måste vara minst 8 tecken långt"),
    passwordControl: z
      .string()
      .min(8, "Lösenordet måste vara minst 8 tecken långt"),
    kår: z.enum(["LinTek", "Consensus", "StuFF", "Övrigt"]),
    fadderi: z.string().min(1, "Val av fadderi saknas"),
  })
  .refine((data) => data.password === data.passwordControl, {
    message: "Lösenorden matchar inte",
    path: ["passwordControl"],
  });

export const FormEmail = () => {
  const { signupWithEmailAndPassword, isPending } = useSignUp();

  const form = useForm<z.infer<typeof formSchemaEmail>>({
    resolver: zodResolver(formSchemaEmail),
    defaultValues: {
      email: "",
      password: "",
      passwordControl: "",
      kår: "Consensus",
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

  useEffect(() => {
    if (kårIsOther) {
      form.setValue("fadderi", Object.values(kårer.Övrigt)[0]!.id);
    } else {
      form.setValue("fadderi", "");
    }
  }, [kårIsOther]);

  return (
    <form
      className="grid gap-4 md:col-span-2"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {/* Email Field */}
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Field className="md:col-span-2" data-invalid={fieldState.invalid}>
            <FieldLabel>E-post</FieldLabel>

            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              autoComplete="email"
              {...field}
            />

            <FieldDescription>Tips: använd din fadderimejl</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Password Field */}
      <Controller
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Lösenord</FieldLabel>

            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...field}
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Password Confirmation Field */}
      <Controller
        control={form.control}
        name="passwordControl"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Bekräfta lösenord</FieldLabel>

            <Input
              id="passwordControl"
              type="password"
              autoComplete="new-password"
              {...field}
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Kår Select Field */}
      <Controller
        control={form.control}
        name="kår"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Kår</FieldLabel>
            <Select
              onValueChange={(val) => {
                field.onChange(val);
                if (val === "Övrigt") {
                  const otherCommittee = Object.keys(kårer.Övrigt)[0]!;
                  form.setValue("fadderi", otherCommittee);
                } else {
                  form.setValue("fadderi", "");
                }
              }}
              defaultValue={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Kår" />
              </SelectTrigger>

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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      {/* Fadderi Select Field */}
      <Controller
        control={form.control}
        name="fadderi"
        render={({ field, fieldState }) => {
          const committees = getCommitteesForKår(form.getValues().kår) || {};
          return (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Fadderi</FieldLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={kårIsOther}
              >
                <SelectTrigger>
                  <SelectValue placeholder={"Fadderi"} />
                </SelectTrigger>
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
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
  );
};
