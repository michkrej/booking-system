import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { kårer } from "@data/committees";
import { getCommitteesForKår } from "@utils/helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { useSignUp } from "@/hooks/useSignUp";
import { type Kår, type User } from "@/interfaces/interfaces";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { LoadingButton } from "../ui/loading-button";

const formSchemaGoogle = z.object({
  kår: z.enum(["LinTek", "Consensus", "StuFF", "Övrigt"]),
  fadderi: z.string().min(1, "Val av fadderi saknas"),
});

export const FormGoogle = () => {
  const { signupWithGoogle, isPending } = useSignUp();

  const form = useForm<z.infer<typeof formSchemaGoogle>>({
    resolver: zodResolver(formSchemaGoogle),
    defaultValues: {
      kår: "Consensus",
      fadderi: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchemaGoogle>) {
    await signupWithGoogle(values.fadderi as User["committeeId"]);
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
          const committees =
            getCommitteesForKår(form.getValues().kår as Kår) || {};
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
      >
        Skapa ett konto
      </LoadingButton>
    </form>
  );
};
