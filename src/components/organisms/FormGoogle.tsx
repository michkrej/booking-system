import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { kårer } from "@/data/committees";
import { getCommitteesForKår } from "@/utils/helpers";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type Kår, type User } from "@/utils/interfaces";
import { LoadingButton } from "../molecules/loadingButton";
import { useSignUp } from "@/hooks/useSignUp";

const formSchemaGoogle = z.object({
  kår: z.string().min(1, "Val av kår saknas"),
  fadderi: z.string().min(1, "Val av fadderi saknas"),
});

export const FormGoogle = () => {
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
                    {Object.values(committees).map(
                      (assignee: { name: string; id: string }) => (
                        <SelectItem key={assignee.name} value={assignee.id}>
                          {assignee.name}
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
