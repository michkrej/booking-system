/* eslint-disable react/no-unescaped-entities */
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
      <ul className="list-disc ml-4">
        <li>
          Klickar du på "Karta TF" i headern kommer du faktiskt till en karta av
          TF
        </li>
        <li>
          När man anger start och slutdatum för en inventariebokning kallas
          startiden "Hämta" och slutdatumet "Lämna" istället för "Hämta" och
          "Hämta". Oops.
        </li>
      </ul>

      <h5 className="font-semibold mt-4 text-base ">
        Jag jobbar på följande förbättringar:
      </h5>
      <ul className="list-disc ml-4">
        <li>
          Krockar ska kunna markeras som hanterade även fast krocken tekniskt
          sett kvarstår.
        </li>
        <li>Kunna sortera listan med krockar på fadderi och typ.</li>
        <li>
          Kunna välja om man vill dela sin mejladress med andra som använder
          plattformen så man kan kontakta varande gällande krockar direkt.
        </li>
        <li>
          När man skapar en bokning ska det <b>inte</b> gå att välja fler
          inventarier än vad som finns tillgängliga i systemet. Så om MA har
          registrerat att det finns 50 bänkset ska man inte kunna välja 55.
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
            rapportera det.
          </button>
          <span>
            {" "}
            Det går också att nå mig på{" "}
            <span className="text-primary">michkrej@gmail.com</span>.
          </span>
        </i>
        <Button variant="secondary" size="sm" onClick={markChangelogAsRead}>
          Ok
        </Button>
      </CardFooter>
    </Card>
  );
};
