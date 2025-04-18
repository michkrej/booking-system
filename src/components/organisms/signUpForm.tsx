import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { Button } from "@components/ui/button";
import { FormEmail } from "./FormEmail";
import { FormGoogle } from "./FormGoogle";

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
        <p className="text-muted-foreground text-balance">
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
