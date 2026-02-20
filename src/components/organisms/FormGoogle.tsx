import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { kårer } from "@data/committees";
import { getCommitteesForKår } from "@utils/helpers";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { useSignUp } from "@/hooks/useSignUp";
import { type Kår, type User } from "@/interfaces/interfaces";
import { LoadingButton } from "../molecules/loadingButton";

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
                  disabled={kårIsOther}
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
        >
          Skapa ett konto
        </LoadingButton>
      </form>
    </Form>
  );
};
