import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { PencilIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@ui/button";
import { Calendar } from "@ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";

export function DatePicker({
  date,
  setDate,
}: {
  date: Date;
  setDate: (date: Date) => void;
}) {
  return (
    <Popover>
      <div className="flex items-center gap-2">
        <span className="font-bold">{format(date, "P", { locale: sv })}</span>
        <PopoverTrigger asChild>
          <Button variant={"secondary"} size={"icon"} className="h-7 w-7">
            <PencilIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          autoFocus
          required
          lang="sv"
          timeZone="Europe/Stockholm"
          locale={sv}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  );
}
