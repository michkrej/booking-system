import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";
import { MultiSelectComponent } from "@syncfusion/ej2-react-dropdowns";
import { CheckBoxComponent } from "@syncfusion/ej2-react-buttons";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/text-area";
import { MultiSelect } from "@/components/ui/multi-select";
import { v4 as uuidv4 } from "uuid";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContext, useEffect } from "react";
import { Section } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { sv } from "date-fns/locale";
import { useBookings, useUser } from "@/state";
import { plansService } from "@/services";
import { ScheduleContext } from "../booking.page";
import { committees } from "@/data/committees";
import { campusLocationsMap } from "@/data/locationsData";
import { on } from "events";

const formSchema = z.object({
  title: z.string().min(1, "Bokningen måste ha ett namn"),
  startDate: z.date().min(new Date(), "Startdatumet måste vara i framtiden"),
  endDate: z.date().min(new Date(), "Slutdatumet måste vara i framtiden"),
  description: z.string(),
  rooms: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .min(1, "Bokningen måste ha minst en rum"),
  food: z.boolean(),
  alcohol: z.boolean(),
  "bankset-k": z.coerce.number(),
  "bankset-hg": z.coerce.number(),
  "bankset-hoben": z.coerce.number(),
  grillar: z.coerce.number(),
  bardiskar: z.coerce.number(),
  scenes: z.coerce.number(),
  "ff-tents": z.coerce.number().min(0).max(4),
  "ff-elverk": z.coerce.number().min(0).max(1),
  "ff-trailer": z.coerce.number().min(0).max(1),
  "other-inventory": z.string(),
  link: z.string(),
});

type EditorTemplateProps = {
  data: any;
  open: boolean;
  onOpenChange: () => void;
  currentBuilding: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const EditorTemplate = ({
  data,
  open,
  onOpenChange,
  currentBuilding,
}: EditorTemplateProps) => {
  const { createBooking, bookings } = useBookings();
  const { rooms, building, chosenCampus } = useContext(ScheduleContext);
  const { user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Reset form values when `data` is available
  useEffect(() => {
    if (data) {
      form.reset({
        title: "",
        startDate: data.startDate || "",
        endDate: data.endDate || "",
        description: "",
        rooms: [
          {
            value: data.roomId,
            label: rooms.find((room) => room.id === data.roomId)
              ?.name as string,
          },
        ],
        food: false,
        alcohol: false,
        "bankset-k": 0,
        "bankset-hg": 0,
        "bankset-hoben": 0,
        grillar: 0,
        bardiskar: 0,
        scenes: 0,
        "ff-tents": 0,
        "ff-elverk": 0,
        "ff-trailer": 0,
        "other-inventory": "",
        link: "",
      });
    }
  }, [data, form.reset]); // Depend on `data` and `reset` to update values when `data` changes

  function onSubmit(values: z.infer<typeof formSchema>) {
    createBooking({
      id: uuidv4(),
      title: values.title,
      startDate: values.startDate,
      endDate: values.endDate,
      alcohol: values.alcohol,
      food: values.food,
      allDay: false,
      committeeId: user.committeeId,
      planId: "",
      locationId: campusLocationsMap[chosenCampus][building].id,
      roomId: values.rooms.map((room) => room.value),
      createdAt: new Date(),
      updatedAt: new Date(),
      grillar: values.grillar,
      bardiskar: values.bardiskar,
      "bankset-hg": values["bankset-hg"],
      "bankset-k": values["bankset-k"],
      trailer: values["ff-trailer"],
      tents: values["ff-tents"],
      scene: values.scenes,
      elverk: values["ff-elverk"],
      annat: values["other-inventory"],
    });
    onOpenChange();
    /* plansService.addPlanEvent('', values).then((res) => {
      console.log(res);
      createBooking(res); 
    }).catch((err) => {
      console.log(err);
    }); */
  }

  console.log(bookings);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-50px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lägg till bokning</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid grid-cols-2 gap-x-3 gap-y-2 overflow-y-auto overflow-x-hidden px-1 text-sm"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-full space-y-0">
                  <FormLabel>Akivitet</FormLabel>
                  <FormControl>
                    <Input
                      id="newPlanName"
                      type="text"
                      placeholder="Ange ett namn för planeringen"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="startDate"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Startdatum</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      {...field}
                      locale={sv}
                      weekStartsOn={1}
                      granularity="minute"
                      hourCycle={24}
                      yearRange={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="endDate"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel>Slutdatum</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      {...field}
                      locale={sv}
                      weekStartsOn={1}
                      granularity="minute"
                      hourCycle={24}
                      yearRange={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Label>Fadderi</Label>
              <Input disabled value={committees[user.committeeId].name} />
            </div>
            <div>
              <Label>Byggnad</Label>
              <Input disabled value={currentBuilding} />
            </div>
            <FormField
              name="rooms"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem className="col-span-full space-y-0">
                    <FormLabel>Rum</FormLabel>
                    <MultiSelect
                      {...field}
                      defaultOptions={rooms.map((room) => ({
                        value: room.id,
                        label: room.name,
                      }))}
                      placeholder="Välj rum"
                      emptyIndicator="Inga rum hittades"
                    />
                  </FormItem>
                );
              }}
            />
            <div className="col-span-full my-2 flex justify-center gap-x-4">
              <FormField
                name="food"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex h-5 items-center justify-center gap-x-2">
                    <FormControl>
                      <Input id="food" type="checkbox" />
                    </FormControl>
                    <FormLabel className="!mt-0">Mat?</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="alcohol"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="!m-0 flex h-5 items-center justify-center gap-x-2">
                    <FormControl>
                      <Input id="alcohol" type="checkbox" />
                    </FormControl>
                    <FormLabel className="!mt-0">Alkohol?</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-full grid grid-cols-3 gap-x-4">
              <FormField
                name="bankset-k"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Bänkset (Kårallen)</FormLabel>
                    <FormControl>
                      <Input id="bankset-k" type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="bankset-hg"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Bänkset (HG)</FormLabel>
                    <FormControl>
                      <Input id="bankset-hg" type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="bankset-hoben"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Bänkset (Hoben)</FormLabel>
                    <FormControl>
                      <Input
                        id="bankset-hoben"
                        type="number"
                        min={0}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-full grid grid-cols-3 gap-x-4 gap-y-2">
              <FormField
                name="grillar"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Grillar (Kårallen)</FormLabel>
                    <FormControl>
                      <Input id="grillar" type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="bardiskar"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Bardiskar (Kårallen)</FormLabel>
                    <FormControl>
                      <Input id="bardiskar" type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="scenes"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Scenpodier (Kårallen)</FormLabel>
                    <FormControl>
                      <Input id="scenes" type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="ff-tents"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Tält (FF)</FormLabel>
                    <FormControl>
                      <Input
                        id="ff-tents"
                        type="number"
                        min={0}
                        max={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="ff-elverk"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Elverk (FF)</FormLabel>
                    <FormControl>
                      <Input
                        id="ff-elverk"
                        type="number"
                        min={0}
                        max={1}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="ff-trailer"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Släp (FF)</FormLabel>
                    <FormControl>
                      <Input id="ff-trailer" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="other-inventory"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-full space-y-0">
                  <FormLabel>Övriga inventarier för bokningen</FormLabel>
                  <FormControl>
                    <Textarea id="other-inventory" rows={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="link"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-full space-y-0">
                  <FormLabel>
                    Google Maps länk till plats (t.ex. för hajk eller
                    stadsvandring)
                  </FormLabel>
                  <FormControl>
                    <Input id="link" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="col-span-full">
              <Button type="submit">Spara</Button>
              <DialogClose>
                <Button variant="outline" type="button">
                  Avbryt
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

  return props !== undefined ? (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      <div className="col-span-2">
        <label className="e-textlabel">Aktivitet</label>
        <input
          className="e-field e-subject e-input"
          type="search"
          name="Subject"
          id="subject"
        />
        {/* <input
            id="Summary"
            className="e-field e-input"
            type="number"
            name="Subject"
            min={0}
          /> */}
      </div>
      <div className="col-span-full">
        <label className="e-textlabel">Beskrivning</label>
        <textarea
          id="Summary"
          className="e-field e-input"
          name="Subject"
          rows={1}
        />
      </div>
      <div>
        <label className="e-textlabel">Start</label>
        <td colSpan={4}>
          <DateTimePickerComponent
            format="dd/MM/yy hh:mm a"
            id="EndTime"
            data-name="EndTime"
            value={new Date(props.startTime || props.StartTime)}
            className="e-field"
          ></DateTimePickerComponent>
        </td>
      </div>
      <div>
        <label className="e-textlabel">Slut</label>
        <td colSpan={4}>
          <DateTimePickerComponent
            format="dd/MM/yy hh:mm a"
            id="EndTime"
            data-name="EndTime"
            value={new Date(props.endTime || props.EndTime)}
            className="e-field"
          ></DateTimePickerComponent>
        </td>
      </div>
      <div>
        <label className="e-textlabel">Lokal</label>
        <MultiSelectComponent
          className="e-field"
          placeholder="Choose owner"
          data-name="OwnerId"
          dataSource={[]}
          fields={{}}
          value={""}
          enabled={false}
        />
      </div>
      <div>
        <label className="e-textlabel">Plats</label>
        <MultiSelectComponent
          className="e-field"
          placeholder="Choose owner"
          data-name="OwnerId"
          dataSource={[]}
          fields={{}}
          value={""}
          enabled={false}
        />
      </div>

      <div className="gap col-span-full grid grid-cols-4">
        <CheckBoxComponent label="Mat?" className="e-field" />
        <CheckBoxComponent label="Alkohol?" className="e-field" />
      </div>
      {/* ------------------------- Bänkset -------------------------- */}
      <div className="col-span-full flex items-center justify-center gap-x-2 font-bold">
        <Separator />
        <h3>Bänkset</h3>
        <Separator />
      </div>
      <div className="gap col-span-full grid grid-cols-3 gap-x-4 gap-y-2">
        <div className="">
          <label className="e-textlabel">HG</label>
          <input
            id="Summary"
            className="e-field e-input"
            type="number"
            name="Subject"
            min={0}
          />
        </div>
        <div className="">
          <label className="e-textlabel">Kårallen</label>
          <input
            id="Summary"
            className="e-field e-input"
            type="number"
            name="Subject"
            min={0}
          />
        </div>
        <div className="">
          <label className="e-textlabel">Hoben</label>
          <input
            id="Summary"
            className="e-field e-input"
            type="number"
            name="Subject"
            min={0}
          />
        </div>
      </div>
      {/* ------------------------- Bänkset -------------------------- */}
      <div className="col-span-full flex items-center justify-center gap-x-2 text-center font-bold">
        <Separator />
        <h3>Övrigt bokningsbart</h3>
        <Separator />
      </div>
      <div className="col-span-full grid grid-cols-3 place-items-center gap-x-4 gap-y-2">
        <div className="">
          <label className="e-textlabel">Grillar (Kårallen)</label>
          <input
            id="Summary"
            className="e-field e-input"
            type="number"
            name="Subject"
            min={0}
          />
        </div>
        <div className="">
          <label className="e-textlabel">Bardiskar (Kårallen)</label>
          <input
            id="Summary"
            className="e-field e-input"
            type="number"
            name="Subject"
            min={0}
          />
        </div>
        <div className="">
          <label className="e-textlabel">Scenpoder</label>
          <input
            id="Summary"
            className="e-field e-input"
            type="number"
            name="Subject"
            min={0}
          />
        </div>
        <div className="w-full">
          <label className="e-textlabel">Tält (FF)</label>
          <input
            id="Summary"
            className="e-field e-input"
            type="number"
            name="Subject"
            min={0}
            max={4}
          />
        </div>
        <CheckBoxComponent label="Elverk (FF)" className="e-field" />
        <CheckBoxComponent label="Släp (FF)" className="e-field" />
      </div>
      <div className="col-span-full">
        <label className="e-textlabel">Övriga inventarier för bokningen</label>
        <textarea
          id="Summary"
          className="e-field e-input"
          name="Subject"
          rows={1}
        />
      </div>
      <div className="col-span-full flex items-center justify-center gap-x-2 text-center font-bold">
        <Separator />
        <h3>Länk</h3>
        <Separator />
      </div>
      <div className="col-span-full">
        <label className="e-textlabel">
          Google Maps länk till plats (t.ex. för hajk eller stadsvandring)
        </label>
        <input
          id="Summary"
          className="e-field e-input"
          type="text"
          name="Subject"
        />
      </div>
    </div>
  ) : (
    <div></div>
  );
};
