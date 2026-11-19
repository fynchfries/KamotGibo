import { useId, useRef, useState, useSyncExternalStore } from "react";
import { Check, Copy, ExternalLink, LoaderCircle, Share2, X } from "lucide-react";
import type { Workshop } from "@/data/sample";
import { useIsMobile } from "@/hooks/use-mobile";
import { recordShareAction } from "@/lib/share-analytics";
import { getWorkshopShareData, isPublicShareOrigin } from "@/lib/workshop-sharing";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const subscribe = () => () => {};
const browserOrigin = () => window.location.origin;

export function WorkshopShare({
  workshop,
  origin,
  label = "Share",
  iconOnly = false,
  className,
}: {
  workshop: Workshop;
  origin?: string;
  label?: string;
  iconOnly?: boolean;
  className?: string;
}) {
  const currentOrigin = useSyncExternalStore(subscribe, browserOrigin, () => "");
  const data = getWorkshopShareData(workshop.id, origin || currentOrigin);
  const publicSite = !!data && isPublicShareOrigin(origin || currentOrigin);
  const mobile = useIsMobile();
  const titleId = useId();
  const linkId = useId();
  const link = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<"copy" | "native" | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  let nativeAvailable = false;
  try {
    nativeAvailable =
      publicSite &&
      !!data &&
      typeof window !== "undefined" &&
      window.isSecureContext &&
      typeof navigator.share === "function" &&
      (!navigator.canShare || navigator.canShare(data));
  } catch {
    nativeAvailable = false;
  }

  function changeOpen(next: boolean) {
    setOpen(next);
    if (next && !open) {
      setStatus("");
      setError("");
      recordShareAction(workshop.id, "share_opened");
    }
  }

  async function copyLink() {
    if (!data || busy) return;
    setBusy("copy");
    setStatus("");
    setError("");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(data.url);
      recordShareAction(workshop.id, "link_copied");
      setStatus("Workshop link copied");
    } catch {
      setError(
        "Could not copy automatically. Select the workshop link below and copy it manually.",
      );
      link.current?.focus();
      link.current?.select();
    } finally {
      setBusy(null);
    }
  }

  async function nativeShare() {
    if (!data || !nativeAvailable || busy) return;
    setBusy("native");
    setStatus("");
    setError("");
    try {
      await navigator.share(data);
      recordShareAction(workshop.id, "native_share_used");
      setOpen(false);
    } catch (cause) {
      if (!(cause instanceof DOMException && cause.name === "AbortError")) {
        setError("Device sharing is unavailable. Use Facebook or copy the link instead.");
      }
    } finally {
      setBusy(null);
    }
  }

  const trigger = (
    <Button
      type="button"
      variant="outline-sea"
      aria-label="Share workshop"
      disabled={!data}
      title={!data ? "Browser-only listing; public sharing is unavailable" : "Share workshop"}
      className={cn(iconOnly && "size-11 shrink-0 p-0", className)}
    >
      <Share2 aria-hidden="true" />
      {!iconOnly && label}
    </Button>
  );
  if (!data) return trigger;
  const facebook = new URL("https://www.facebook.com/sharer/sharer.php");
  facebook.searchParams.set("u", data.url);
  const content = (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{data.title}</p>
      <div className="space-y-1">
        {publicSite && !busy ? (
          <Button asChild variant="ghost" className="w-full justify-start">
            <a
              href={facebook.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => recordShareAction(workshop.id, "facebook_selected")}
            >
              <ExternalLink aria-hidden="true" /> Share to Facebook
            </a>
          </Button>
        ) : (
          <Button type="button" variant="ghost" className="w-full justify-start" disabled>
            <ExternalLink aria-hidden="true" /> Share to Facebook
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start"
          disabled={!nativeAvailable || !!busy}
          aria-busy={busy === "native"}
          onClick={nativeShare}
        >
          {busy === "native" ? (
            <LoaderCircle aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
          ) : (
            <Share2 aria-hidden="true" />
          )}
          Native device share
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-start"
          disabled={!!busy}
          aria-busy={busy === "copy"}
          onClick={copyLink}
        >
          {status ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{" "}
          {status ? "Copied" : "Copy link"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Messenger may be available in your device's share menu. Otherwise, copy the link.
      </p>
      {!publicSite && (
        <p className="rounded-lg bg-warning-soft p-3 text-xs text-warning">
          Development link — this address may only work on this device. Deploy the app publicly
          before promoting it on social media.
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor={linkId} className="text-xs">
          Workshop link
        </Label>
        <Input
          id={linkId}
          ref={link}
          value={data.url}
          readOnly
          onFocus={(event) => event.currentTarget.select()}
          className="h-11 min-w-0 text-sm"
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {status && (
        <p role="status" className="text-sm font-semibold text-sea">
          {status}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Demo action counts stay in this browser. They do not confirm social posts or bookings.
      </p>
    </div>
  );
  if (mobile)
    return (
      <Drawer open={open} onOpenChange={changeOpen} shouldScaleBackground={false} autoFocus>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="max-h-[90dvh] rounded-t-3xl">
          <DrawerHeader>
            <DrawerTitle>Share workshop</DrawerTitle>
            <DrawerDescription>Choose how to share this catalogue workshop.</DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-2">{content}</div>
          <DrawerFooter className="pb-[max(1rem,env(safe-area-inset-bottom))]">
            <DrawerClose asChild>
              <Button type="button" variant="outline">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  return (
    <Popover open={open} onOpenChange={changeOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        collisionPadding={8}
        aria-labelledby={titleId}
        className="max-h-[min(calc(100dvh-2rem),var(--radix-popover-content-available-height))] w-80 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl"
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <h2 id={titleId} className="text-lg font-semibold">
            Share workshop
          </h2>
          <Button
            type="button"
            variant="ghost"
            aria-label="Close share menu"
            className="size-11 shrink-0 p-0"
            onClick={() => setOpen(false)}
          >
            <X aria-hidden="true" />
          </Button>
        </div>
        {content}
      </PopoverContent>
    </Popover>
  );
}
