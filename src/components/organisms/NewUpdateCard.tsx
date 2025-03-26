/* eslint-disable react/no-unescaped-entities */
import { useBoundStore } from "@/state/store";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { siteConfig } from "@/config/site";
import { Button } from "../ui/button";
import { CURRENT_APP_VERSION } from "@/state/userStoreSlice";

const Changelog = () => {
  return (
    <div>
      {/* <span className="font-semibold">Features</span>
      <ul className="ml-4 list-disc">
        <li>Mottagningsansvariga kan låsa planeringar per kår.</li>
        <li>Bokningar har ett nytt fält för beskrivning</li>
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
      <br /> */}
      <span className="font-semibold">Lokaler som har lagt till</span>
      <ul className="ml-4 list-disc">
        <li>
          Lilla och stora Hoben tältet under campus Valla {">"} "Övriga områden
          på campus"
        </li>
        <li>KK - forumteatern under "Kårhus"</li>
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
                  className="text-primary decoration-primary font-semibold hover:underline"
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
