import { usePostHog } from "posthog-js/react";
import { Button } from "@ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { useChangelog } from "@/hooks/useChangelog";
import { CURRENT_APP_VERSION } from "@/utils/constants";

const Changelog = () => {
  return (
    <div className="ml-4">
      <ul className="list-disc">
        <li>
          Klickar du på &quot;Karta TF&quot; i headern kommer du faktiskt till
          en karta av TF
        </li>
      </ul>
    </div>
  );
};

export const ChangelogCard = () => {
  const { changelog, markChangelogAsRead } = useChangelog();
  const posthog = usePostHog();

  const showChangelog = changelog !== CURRENT_APP_VERSION;
  if (!showChangelog) return null;

  return (
    <Card className="col-span-full flex">
      <CardHeader className="w-full flex-row items-center gap-x-10">
        <CardTitle>
          👩‍💻 Bokningsplanering v{CURRENT_APP_VERSION} - Nyheter
        </CardTitle>
        <CardDescription className="flex-1">
          Det har släppts en ny version av hemsidan! Här är en lista över vad
          som har ändrats.
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
        <Button variant="secondary" size="sm" onClick={markChangelogAsRead}>
          Ok
        </Button>
      </CardFooter>
    </Card>
  );
};
