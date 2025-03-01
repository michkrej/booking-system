import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { siteConfig } from "@/config/site";

export const IntroductionPopover = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="group rounded-full border border-solid border-muted bg-card text-lg shadow hover:bg-card hover:shadow-md md:mb-4 md:p-6 md:text-3xl"
        >
          <div className="origin-[70%_70%] group-hover:animate-wiggle">👋</div>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid gap-4">
          <h4 className="font-medium leading-none">Hej!</h4>
          <p className="text-sm text-muted-foreground">
            Jag heter Michelle och det är jag som utvecklar
            <i> bokningsplanering.com</i>.
          </p>
          <p className="text-sm text-muted-foreground">
            Bokningsplanering är ett hobbyprojekt som jag byggde när jag satt
            som mottagningsansvarig för LinTek 2022 och upptäckte att krockar
            mellan fadderiers bokningar letades manuellt i excelark.
          </p>
          <p className="text-sm text-muted-foreground">
            Jag arbetar löpande med att göra hemsidan bättre för er fadderister
            som använder den.{" "}
            <a
              className="underline"
              href={siteConfig.links.feedback}
              target="__blank"
            >
              Feedback
            </a>{" "}
            tas tacksamt emot!
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};
