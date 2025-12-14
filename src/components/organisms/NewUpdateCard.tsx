/* eslint-disable react/no-unescaped-entities */
import { useBoundStore } from "@state/store";
import { CURRENT_APP_VERSION } from "@state/userStoreSlice";
import { Button } from "@ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@ui/card";
import { siteConfig } from "@/config/site";

const addedLocations: {
  campus: "US" | "Valla" | "Valla/US";
  house: string;
  rooms: string[];
}[] = [
  /*   {
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
  }, */
  /* {
    campus: "Valla/US",
    house: "Utanför campus",
    rooms: ["Ballpoint"],
  },
  {
    campus: "Valla",
    house: "Övriga områden på campus",
    rooms: ["Skogen bakom A-huset", "Studenthälsan"],
  }, */
];

const Changelog = () => {
  return (
    <div className="grid grid-cols-1 gap-2">
      <span className="font-semibold">Features</span>
      <ul className="ml-4 list-disc">
        <li>
          Om du använder e-post och lösenord för att logga in, så kan du ändra
          lösenordet genom att klicka på knappen "Byt lösenord" i menyn uppe
          till höger.
        </li>
      </ul>
      <br />
      {/* <div>
        <span className="font-semibold text-red-500">Fixade buggar</span>
        <ul className="ml-4 list-disc text-red-500">
          <li>
            Gick inte att lägga till flera områden på en bokning eller ändra dem
            i efterhand
          </li>
        </ul>
      </div> */}
      {/* <div>
        <span className="font-semibold">Tillagda lokaler/platser</span>
        <ul className="ml-4 list-disc">
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
      </div> */}
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
