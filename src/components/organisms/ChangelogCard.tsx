import { usePostHog } from "posthog-js/react";
import { useBoundStore } from "@state/store";
import { CURRENT_APP_VERSION } from "@state/userStoreSlice";
import { Button } from "@ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";

const Changelog = () => {
  return (
    <div className="ml-4">
      <ul className="list-disc">
        <li>
          Nytt gränsnitt för översikten ✨
          <ul className="list-disc ml-4">
            <li>
              I vyn &quot;översikt&quot; ser du dina krockar med andra
              fadderier.
            </li>
            <li>
              I vyn &quot;krockar&quot; kan du samtliga krockar mellan
              fadderier.
            </li>
          </ul>
        </li>
        <li>
          När du flyttar en områdesbokning med tillhörande inventariebokningar
          kommer tiden för inventariebokningen att flyttas relativt till själva
          bokningen av området.
        </li>
      </ul>
    </div>
  );
};

export const ChangelogCard = () => {
  const versionUpdateWarning = useBoundStore(
    (state) => state.versionUpdateWarningClosed,
  );
  const closeVersionUpdateWarning = useBoundStore(
    (state) => state.closeVersionUpdateWarning,
  );

  const posthog = usePostHog();

  const versionUpdateWarningClosed =
    versionUpdateWarning === CURRENT_APP_VERSION;

  return (
    <>
      {!versionUpdateWarningClosed ? (
        <Card className="col-span-full flex">
          <CardHeader className="w-full flex-row items-center gap-x-10">
            <CardTitle>
              👩‍💻 Bokningsplanering v{CURRENT_APP_VERSION} - Nyheter
            </CardTitle>
            <CardDescription className="flex-1">
              Det har släppts en ny version av hemsidan! Här är en lista över
              vad som har ändrats.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Changelog />
          </CardContent>
          <CardFooter className="flex justify-between">
            <i>
              Om något inte fungerar{" "}
              <button
                className="text-primary decoration-primary font-semibold hover:underline"
                onClick={() => posthog.capture("feedback_click")}
              >
                rapportera det
              </button>
            </i>
            <Button
              variant="secondary"
              size="sm"
              onClick={closeVersionUpdateWarning}
            >
              Ok
            </Button>
          </CardFooter>
        </Card>
      ) : null}
    </>
  );
};
