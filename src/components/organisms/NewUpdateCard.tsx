import { useBoundStore } from "@/state/store";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { siteConfig } from "@/config/site";
import { Button } from "../ui/button";
import { CURRENT_APP_VERSION } from "@/state/userStoreSlice";
import { BaggageClaimIcon } from "lucide-react";

const Changelog = () => {
  return (
    <div>
      <span className="font-semibold">Features</span>
      <ul className="ml-4 list-disc">
        <li>Bokningar har ett nytt fält för beskrivning</li>
        <li>
          Inventarier kan nu ha ett eget start och slutddatum (eftersom t.ex.
          bänkset oftast måste bokas länge än själva lokalen/omårdet)
        </li>
        <li>Krockar hittas nu på både lokaler och inventarier</li>
        <li>
          Se inventarie-bokningar i kalender-vyn genom att klicka på{" "}
          <BaggageClaimIcon className="inline-block" /> i kalender-toolbaren
        </li>
        <li>
          För att hitta krockar mellan samtliga publika planeringar klicka på
          knappen "Hitta krockar" - om det finns krockar kommer knappen att
          ändras till "Se krockar"
        </li>
      </ul>
      <br />
      <span className="font-semibold">Lokaler som har lagt till</span>
      <ul className="ml-4 list-disc">
        <li>VAL1-lokalen har lagt still under "Övriga områden på campus"</li>
        <li>KEYH-lokalen har lagt till under "Key-huset"</li>
        <li>TEMCAS och TEM21 har lagt till under "TEMA-huset"</li>
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
        <Card className="col-span-full flex flex-row">
          <CardHeader className="w-full flex-row items-center gap-x-10">
            <CardTitle>👩‍💻 Bokningsplanering {CURRENT_APP_VERSION}</CardTitle>
            <CardDescription className="flex-1">
              <Changelog />
              <br />
              <i>
                Om något inte fungerar{" "}
                <a
                  className="font-semibold text-primary decoration-primary hover:underline"
                  href={siteConfig.links.feedback}
                  target="__blank"
                >
                  rapportera det
                </a>
              </i>
            </CardDescription>
            <Button
              variant="secondary"
              size="sm"
              onClick={closeVersionUpdateWarning}
            >
              Ok
            </Button>
          </CardHeader>
        </Card>
      ) : null}
    </>
  );
};
