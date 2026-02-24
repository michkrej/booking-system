import { usePostHog } from "@posthog/react";
import { Button } from "@ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { useChangelog } from "@/hooks/useChangelog";

export const IntroductionPopover = () => {
  const posthog = usePostHog();
  const { changelog } = useChangelog();

  const handleClick = () => {
    posthog.capture("feedkback_click");
  };

  return (
    <Popover defaultOpen={changelog === null}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="group border-muted bg-card hover:bg-card rounded-full border border-solid text-lg shadow-sm hover:shadow-md md:mb-4 md:p-6 md:text-3xl hover:cursor-pointer"
        >
          <div className="group-hover:animate-wiggle origin-[70%_70%]">👋</div>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid gap-4">
          <h4 className="leading-none font-medium">Hej!</h4>
          <p className="text-muted-foreground text-sm">
            Jag heter Michelle och det är jag som utvecklar
            <i> bokningsplanering.com</i>.
          </p>
          <p className="text-muted-foreground text-sm">
            Bokningsplanering är ett hobbyprojekt som jag byggde när jag satt
            som mottagningsansvarig för LinTek 2022 och upptäckte att krockar
            mellan fadderiers bokningar letades manuellt i excelark.
          </p>
          <p className="text-muted-foreground text-sm">
            Jag arbetar löpande med att göra hemsidan bättre för er fadderister
            som använder den.{" "}
            <button
              className="underline hover:cursor-pointer"
              onClick={handleClick}
              tabIndex={-1}
            >
              Feedback
            </button>{" "}
            tas tacksamt emot!
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};
