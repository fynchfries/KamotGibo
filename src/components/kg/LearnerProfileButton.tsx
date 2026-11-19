import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { CRAFTS, TOWNS } from "@/data/sample";
import {
  learnerProfileSchema,
  saveLearnerProfile,
  useLearnerProfile,
  type LearnerProfile,
} from "@/lib/learner-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function LearnerAvatar({
  profile,
  className,
}: {
  profile: LearnerProfile;
  className?: string;
}) {
  return (
    <Avatar className={className}>
      <AvatarImage src={profile.photo ?? undefined} alt="" className="object-cover" />
      <AvatarFallback className="bg-sea-soft font-bold text-sea">
        {profile.fullName.trim().charAt(0).toUpperCase() || "?"}
      </AvatarFallback>
    </Avatar>
  );
}

function ProfileForm({ profile, onClose }: { profile: LearnerProfile; onClose: () => void }) {
  const form = useForm<LearnerProfile>({
    resolver: zodResolver(learnerProfileSchema),
    defaultValues: profile,
  });
  const draft = form.watch();
  const reader = useRef<FileReader | null>(null);
  const [reading, setReading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [error, setError] = useState("");
  useEffect(() => () => reader.current?.abort(), []);

  function changePhoto(event: ChangeEvent<HTMLInputElement>) {
    reader.current?.abort();
    setReading(false);
    setPhotoError("");
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoError("Choose a JPEG, PNG or WebP image. Your current photo has not changed.");
      return;
    }
    if (file.size > 1_048_576) {
      setPhotoError("Choose a photo 1 MB or smaller. Your current photo has not changed.");
      return;
    }
    const next = new FileReader();
    reader.current = next;
    setReading(true);
    const failed = () => {
      setReading(false);
      setPhotoError("Could not read this photo. Please choose another image.");
    };
    next.onerror = failed;
    next.onload = () => {
      const photo = learnerProfileSchema.shape.photo.safeParse(next.result);
      if (!photo.success || photo.data === null) return failed();
      form.setValue("photo", photo.data, { shouldDirty: true, shouldValidate: true });
      setReading(false);
    };
    try {
      next.readAsDataURL(file);
    } catch {
      failed();
    }
  }

  function submit(values: LearnerProfile) {
    if (reading || photoError) return;
    try {
      saveLearnerProfile(values);
      onClose();
    } catch {
      setError(
        "Could not save your profile in this browser. Your changes are still here; allow site storage or free up space and try again.",
      );
    }
  }

  return (
    <Form {...form}>
      <form
        aria-label="Learner profile"
        noValidate
        onSubmit={form.handleSubmit(submit)}
        className="space-y-5"
      >
        <div className="space-y-2">
          <Label htmlFor="learner-profile-photo">Profile photo</Label>
          <div className="flex items-center gap-4">
            {draft.photo ? (
              <img
                src={draft.photo}
                alt="Profile photo preview"
                className="size-16 shrink-0 rounded-full object-cover"
              />
            ) : (
              <LearnerAvatar profile={draft} className="size-16 shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <Input
                id="learner-profile-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={changePhoto}
                aria-invalid={!!photoError}
                aria-describedby="learner-photo-hint learner-photo-error"
                className="h-11 text-xs file:text-xs"
              />
              {(draft.photo || photoError) && (
                <Button
                  type="button"
                  variant="link"
                  className="min-h-11 px-0"
                  onClick={() => {
                    reader.current?.abort();
                    setReading(false);
                    setPhotoError("");
                    form.setValue("photo", null, { shouldDirty: true, shouldValidate: true });
                  }}
                >
                  Remove photo
                </Button>
              )}
            </div>
          </div>
          <p id="learner-photo-hint" className="text-xs text-muted-foreground">
            JPEG, PNG or WebP · maximum 1 MB.
          </p>
          {photoError && (
            <p id="learner-photo-error" role="alert" className="text-sm text-destructive">
              {photoError}
            </p>
          )}
        </div>
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Full name <span aria-hidden="true">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} required maxLength={80} autoComplete="off" className="h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="municipality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Municipality</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger ref={field.ref} onBlur={field.onBlur} className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TOWNS.map((town) => (
                    <SelectItem key={town} value={town}>
                      {town}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short bio</FormLabel>
              <FormControl>
                <Textarea {...field} maxLength={300} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Craft interests</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {CRAFTS.map(({ name }, index) => (
              <Label
                key={name}
                htmlFor={`learner-interest-${index}`}
                className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3 text-sm"
              >
                <Checkbox
                  id={`learner-interest-${index}`}
                  checked={draft.interests.includes(name)}
                  onCheckedChange={(checked) => {
                    form.setValue(
                      "interests",
                      checked === true
                        ? [...draft.interests, name]
                        : draft.interests.filter((craft) => craft !== name),
                      { shouldDirty: true, shouldValidate: true },
                    );
                  }}
                />
                {name}
              </Label>
            ))}
          </div>
        </fieldset>
        <p className="text-xs text-muted-foreground">
          These details are not added to public badge pages.
        </p>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="hero"
            disabled={reading || !!photoError || form.formState.isSubmitting}
          >
            {reading ? "Reading photo…" : "Save changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function LearnerProfileButton() {
  const profile = useLearnerProfile();
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          aria-label="Edit learner profile"
          title="Edit profile"
          className="relative size-11 shrink-0 rounded-full border-2 border-sea/30 bg-sea-soft p-0 hover:border-sea hover:bg-sea-soft"
        >
          <LearnerAvatar profile={profile} className="size-full" />
          <span className="absolute -bottom-0.5 -right-0.5 grid size-5 place-items-center rounded-full border-2 border-card bg-sea text-sea-foreground">
            <Pencil aria-hidden="true" className="size-3" />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] w-[92vw] overflow-y-auto rounded-2xl sm:max-w-lg [&>button]:right-2 [&>button]:top-2 [&>button]:grid [&>button]:size-11 [&>button]:place-items-center">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Use fictional details only. Saved in this browser, without login or private-account
            protection.
          </DialogDescription>
        </DialogHeader>
        {open && <ProfileForm profile={profile} onClose={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  );
}
