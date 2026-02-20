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
import { siteConfig } from "@/config/site";

const Changelog = () => {
  return (
    <div className="ml-4">
      <ul className="list-disc">
        <li>
          Nytt gränsnitt för översikten ✨
          <ul className="list-disc ml-4">
            <li>
              I vyn &quot;översikt&quot; ser du dina krockar med andra fadderier
            </li>
            <li>
              I vyn &quot;krockar&quot; kan du samtliga krockar mellan fadderier
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export const NewUpdateCard = () => {
  const versionUpdateWarning = useBoundStore(
    (state) => state.versionUpdateWarningClosed,
  );
  const closeVersionUpdateWarning = useBoundStore(
    (state) => state.closeVersionUpdateWarning,
  );

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
              Det har släppts en ny version av appen! Här är en lista över vad
              som har ändrats.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Changelog />
          </CardContent>
          <CardFooter className="flex justify-between">
            <i>
              Om något inte fungerar{" "}
              <a
                className="text-primary decoration-primary font-semibold hover:underline"
                href={siteConfig.links.feedback}
                target="__blank"
              >
                rapportera det
              </a>
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
