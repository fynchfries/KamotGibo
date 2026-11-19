import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { APPLICATION_DEFAULTS, CRAFTS, TOWNS } from "@/data/sample";
import { applicationSchema, type ApplicationInput } from "@/lib/artisan-forms";
import { demoActions } from "@/lib/demo-store";
import { useArtisanPortal } from "@/lib/artisan-portal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export function ArtisanApplicationForm({ onSubmitted }: { onSubmitted: () => void }) {
  const { drafts } = useArtisanPortal();
  const form = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: drafts.current.application ?? APPLICATION_DEFAULTS,
  });
  useEffect(() => {
    const subscription = form.watch(() => {
      drafts.current.application = form.getValues();
    });
    return () => subscription.unsubscribe();
  }, [drafts, form]);
  const [error, setError] = useState("");
  const submit = (values: ApplicationInput) => {
    try {
      demoActions.submitApplication(values);
      form.reset();
      setError("");
      onSubmitted();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save this application.");
    }
  };

  return (
    <Form {...form}>
      <form
        aria-label="Artisan application"
        noValidate
        onSubmit={form.handleSubmit(submit)}
        className="mt-5 space-y-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {(
            [
              ["name", "Provider name"],
              ["venue", "Venue"],
              ["workshop", "First workshop"],
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
                    <Input {...field} className="h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          {(
            [
              {
                name: "kind",
                label: "Provider type",
                options: ["Artisan", "Cooperative", "Learning center"],
              },
              { name: "craft", label: "Craft", options: CRAFTS.map((c) => c.name) },
              { name: "town", label: "Town", options: TOWNS },
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
        <p className="text-sm text-muted-foreground">
          Use fictional details only. No ID documents or contact information are needed for this
          demo.
        </p>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" variant="hero" disabled={form.formState.isSubmitting}>
          Submit application
        </Button>
      </form>
    </Form>
  );
}
