import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CRAFTS, LEVELS, TOWNS, WORKSHOP_FORM_DEFAULTS, type Provider } from "@/data/sample";
import { workshopSchema, type WorkshopInput } from "@/lib/artisan-forms";
import { demoActions } from "@/lib/demo-store";
import { useArtisanPortal } from "@/lib/artisan-portal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ArtisanWorkshopForm({
  provider,
  onSaved,
  onCancel,
}: {
  provider: Provider;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const { drafts } = useArtisanPortal();
  const form = useForm<WorkshopInput>({
    resolver: zodResolver(workshopSchema),
    defaultValues: drafts.current.workshops[provider.id] ?? {
      ...WORKSHOP_FORM_DEFAULTS,
      title: provider.workshop,
      craft: provider.craft,
      town: provider.town,
      venue: provider.venue,
    },
  });
  useEffect(() => {
    drafts.current.workshops[provider.id] = form.getValues();
    const subscription = form.watch(() => {
      drafts.current.workshops[provider.id] = form.getValues();
    });
    return () => subscription.unsubscribe();
  }, [drafts, form, provider.id]);
  const [error, setError] = useState("");
  const submit = (values: WorkshopInput) => {
    try {
      demoActions.createWorkshop(provider.id, values);
      onSaved();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save this draft.");
    }
  };

  return (
    <Form {...form}>
      <form
        aria-label="Create workshop"
        noValidate
        onSubmit={form.handleSubmit(submit)}
        className="mt-5 space-y-5 rounded-2xl border bg-background p-4 sm:p-6"
      >
        <h3 className="text-lg font-bold">Create a workshop</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          {(
            [
              ["title", "Workshop title", "text"],
              ["venue", "Venue", "text"],
              ["venueNote", "Venue directions (optional)", "text"],
              ["date", "Session date", "date"],
              ["startTime", "Start time", "time"],
              ["endTime", "End time", "time"],
              ["capacity", "Seats", "number"],
              ["fee", "Fee (PHP)", "number"],
            ] as const
          ).map(([name, label, type]) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type={type}
                      className="h-11"
                      value={
                        typeof field.value === "number" && Number.isNaN(field.value)
                          ? ""
                          : field.value
                      }
                      onChange={(event) =>
                        field.onChange(
                          type === "number" ? event.target.valueAsNumber : event.target.value,
                        )
                      }
                      min={type === "number" ? (name === "capacity" ? 1 : 0) : undefined}
                      max={name === "capacity" ? 50 : undefined}
                      step={name === "fee" ? "0.01" : undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          {(
            [
              { name: "craft", label: "Craft", options: CRAFTS.map((c) => c.name) },
              { name: "town", label: "Town", options: TOWNS },
              { name: "level", label: "Skill level", options: LEVELS },
            ] as const
          ).map(({ name, label, options }) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger ref={field.ref} onBlur={field.onBlur} className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        {(
          [
            ["learn", "What learners will learn (one per line)"],
            ["providedMaterials", "Materials provided (one per line)"],
            ["bringMaterials", "Materials to bring (one per line, optional)"],
          ] as const
        ).map(([name, label]) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <p className="text-sm text-muted-foreground">
          Set the fee to 0 for a free workshop. Paid workshops use cash at the venue; there are no
          online payments.
        </p>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" variant="hero" disabled={form.formState.isSubmitting}>
            Save draft
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
