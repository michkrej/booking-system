/* eslint-disable react/no-unescaped-entities */
import { useBoundStore } from "@/state/store";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { siteConfig } from "@/config/site";
import { Button } from "../ui/button";
import { CURRENT_APP_VERSION } from "@/state/userStoreSlice";

const addedLocations: {
  campus: "US" | "Valla";
  house: string;
  rooms: string[];
}[] = [
  {
    campus: "US",
    house: "Clinicum",
    rooms: ["Metodrum 1", "Metodrum 2", "Övrigt rum"],
  },
  {
    campus: "Valla",
    house: "B-huset",
    rooms: ["Humanoidlabbet", "Systemet"],
  },
  {
    campus: "Valla",
    house: "C-huset",
    rooms: ["Utanför C4"],
  },
  {
    campus: "Valla",
    house: "Fysikhuset",
    rooms: ["Ingång 55", "Ingång 57"],
  },
  {
    campus: "Valla",
    house: "A-huset",
    rooms: ["Ledsna Flickan", "Alfheim"],
  },
  {
    campus: "Valla",
    house: "Studenthuset",
    rooms: ["Byttan"],
  },
];

const Changelog = () => {
  return (
    <div className="grid grid-cols-2 gap-2">
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
      <div>
        <span className="font-semibold text-red-500">Fixade buggar</span>
        <ul className="ml-4 list-disc text-red-500">
          {/* <li>
          Lilla och stora Hoben tältet under campus Valla {">"} "Övriga områden
          på campus"
        </li>
        <li>KK - forumteatern under "Kårhus"</li> */}
          {/* <li>VilleValla under "Utanför campus"</li> */}
          <li>
            Gick inte att lägga till flera områden på en bokning eller ändra dem
            i efterhand
          </li>
        </ul>
      </div>
      <div>
        <span className="font-semibold">Tillagda lokaler/platser</span>
        <ul className="ml-4 list-disc">
          {/* <li>
          Lilla och stora Hoben tältet under campus Valla {">"} "Övriga områden
          på campus"
        </li>
        <li>KK - forumteatern under "Kårhus"</li> */}
          {/*  <li>VilleValla under "Utanför campus"</li> */}
          {addedLocations.map((location) => (
            <li key={`${location.campus}-${location.house}`}>
              {location.campus} - {location.house}
              <ul className="ml-4 list-disc">
                {location.rooms.map((room) => (
                  <li key={room}>{room}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
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
