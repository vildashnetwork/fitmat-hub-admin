

import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadImageToCloudinary, createEvent, updateEvent } from "@/utils/api";
import { BackendEvent, Odds, Score } from "@/types";
import { toast } from "sonner";
import { X, UploadCloud } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: BackendEvent | null;
  onSave: (result: any) => void;
};

const prettyFileName = (n?: string, max = 24) => {
  if (!n) return "";
  return n.length > max ? `${n.slice(0, max - 6)}...${n.slice(-6)}` : n;
};

function NumberInput({ value, onChange, placeholder }: { value: number; onChange: (v: number) => void; placeholder?: string }) {
  return (
    <Input
      value={Number.isFinite(value) ? String(value) : ""}
      onChange={(e) => {
        const nv = e.target.value === "" ? 0 : Number(e.target.value);
        onChange(Number.isNaN(nv) ? 0 : nv);
      }}
      placeholder={placeholder}
      inputMode="numeric"
    />
  );
}

/** Image card (drag/drop + preview + remove + progress) */
const ImageCard: React.FC<{
  label: string;
  file: File | null;
  preview?: string | null;
  onPick: (f: File | null) => void;
  uploading?: boolean;
  progress?: number;
  size?: "md" | "lg";
}> = ({ label, file, preview, onPick, uploading = false, progress = 0, size = "lg" }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [drag, setDrag] = useState(false);

  useEffect(() => {
    return () => {
      // nothing here, parent handles URL revocation
    };
  }, []);

  const openPicker = () => inputRef.current?.click();

  return (
    <div
      className={`rounded-lg border p-3 ${drag ? "border-primary/60 bg-primary/5" : "bg-black/80"} w-full`}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files?.[0] ?? null;
        onPick(f ?? null);
      }}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPick(e.target.files?.[0] ?? null)} />
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-muted-foreground">{file ? prettyFileName(file.name) : "optional"}</div>
      </div>

      <div className={`rounded-md overflow-hidden border-dashed border mb-2 ${size === "lg" ? "h-44" : "h-28"} flex items-center justify-center`}>
        {preview ? (
          <div className="relative w-full h-full">
            <img src={preview} alt={label} className="object-cover w-full h-full" />
            <button
              type="button"
              onClick={() => onPick(null)}
              title="Remove"
              className="absolute top-2 right-2 rounded-full bg-black/40 p-1 text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button type="button" onClick={openPicker} className="flex flex-col items-center justify-center gap-2 w-full h-full">
            <UploadCloud className="w-7 h-7 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">Drop or click to upload</div>
          </button>
        )}
      </div>

      {uploading && (
        <div>
          <div className="h-2 w-full rounded bg-gray-200 overflow-hidden">
            <div style={{ width: `${progress}%`, background: "linear-gradient(90deg,#06b6d4,#7c3aed)" }} className="h-full transition-all" />
          </div>
          <div className="text-xs text-muted-foreground mt-1">{progress}%</div>
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-muted-foreground">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : ""}</div>
        <div>
          <Button size="sm" variant="ghost" onClick={openPicker}>
            {file ? "Change" : "Upload"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export const EventDialog: React.FC<Props> = ({ open, onOpenChange, event, onSave }) => {
  // fields
  const [tournament, setTournament] = useState("");
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [startAt, setStartAt] = useState("");
  const [status, setStatus] = useState<"upcoming" | "live" | "finished">("upcoming");

  // odds & score as objects
  const [odds, setOdds] = useState<Odds>({ home: 0, draw: 0, away: 0 });
  const [score, setScore] = useState<Score>({ home: 0, away: 0 });

  // file states
  const [oneFile, setOneFile] = useState<File | null>(null);
  const [twoFile, setTwoFile] = useState<File | null>(null);
  const [bgFile, setBgFile] = useState<File | null>(null);

  // preview URLs (object URLs or existing URLs)
  const [onePreview, setOnePreview] = useState<string | null>(null);
  const [twoPreview, setTwoPreview] = useState<string | null>(null);
  const [bgPreview, setBgPreview] = useState<string | null>(null);

  // uploaded urls (existing event values or from cloudinary)
  const [oneUrl, setOneUrl] = useState<string | null>(null);
  const [twoUrl, setTwoUrl] = useState<string | null>(null);
  const [bgUrl, setBgUrl] = useState<string | null>(null);

  // upload progress states
  const [uploading, setUploading] = useState(false);
  const [pOne, setPOne] = useState(0);
  const [pTwo, setPTwo] = useState(0);
  const [pBg, setPBg] = useState(0);

  // cleanup object URLs when previews change/unmount
  useEffect(() => {
    return () => {
      if (onePreview && onePreview.startsWith("blob:")) URL.revokeObjectURL(onePreview);
      if (twoPreview && twoPreview.startsWith("blob:")) URL.revokeObjectURL(twoPreview);
      if (bgPreview && bgPreview.startsWith("blob:")) URL.revokeObjectURL(bgPreview);
    };
  }, [onePreview, twoPreview, bgPreview]);

  // when event opens or changes, populate fields
  useEffect(() => {
    if (event) {
      setTournament(event.tournament ?? "");
      setHomeTeam(event.homeTeam ?? "");
      setAwayTeam(event.awayTeam ?? "");
      setStartAt(event.startAt ?? event.startingTime?.toString() ?? "");
      setStatus((event.status as any) ?? "upcoming");
      setOdds(event.odds ?? { home: 0, draw: 0, away: 0 });
      setScore(event.score ?? { home: 0, away: 0 });

      setOneUrl(event.one ?? null);
      setTwoUrl(event.two ?? null);
      setBgUrl(event.bg ?? null);

      // clear selected local files/previews
      if (onePreview && onePreview.startsWith("blob:")) URL.revokeObjectURL(onePreview);
      if (twoPreview && twoPreview.startsWith("blob:")) URL.revokeObjectURL(twoPreview);
      if (bgPreview && bgPreview.startsWith("blob:")) URL.revokeObjectURL(bgPreview);
      setOneFile(null); setTwoFile(null); setBgFile(null);
      setOnePreview(null); setTwoPreview(null); setBgPreview(null);
    } else {
      // reset
      setTournament("");
      setHomeTeam("");
      setAwayTeam("");
      setStartAt("");
      setStatus("upcoming");
      setOdds({ home: 0, draw: 0, away: 0 });
      setScore({ home: 0, away: 0 });
      setOneFile(null); setTwoFile(null); setBgFile(null);
      setOnePreview(null); setTwoPreview(null); setBgPreview(null);
      setOneUrl(null); setTwoUrl(null); setBgUrl(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, open]);

  // helpers to set file + preview (revoke previous preview if blob)
  const pickOne = (f: File | null) => {
    if (onePreview && onePreview.startsWith("blob:")) URL.revokeObjectURL(onePreview);
    setOneFile(f);
    setOnePreview(f ? URL.createObjectURL(f) : null);
    if (!f) setOneUrl(null); // if user removed file, clear uploaded url (they can keep existing by not changing)
  };
  const pickTwo = (f: File | null) => {
    if (twoPreview && twoPreview.startsWith("blob:")) URL.revokeObjectURL(twoPreview);
    setTwoFile(f);
    setTwoPreview(f ? URL.createObjectURL(f) : null);
    if (!f) setTwoUrl(null);
  };
  const pickBg = (f: File | null) => {
    if (bgPreview && bgPreview.startsWith("blob:")) URL.revokeObjectURL(bgPreview);
    setBgFile(f);
    setBgPreview(f ? URL.createObjectURL(f) : null);
    if (!f) setBgUrl(null);
  };

  // Submit handler: upload selected files (if any), then send payload
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    setUploading(true);
    try {
      // upload if new files selected
      let uploadedOne = oneUrl;
      let uploadedTwo = twoUrl;
      let uploadedBg = bgUrl;

      if (oneFile) {
        uploadedOne = await uploadImageToCloudinary(oneFile, (p) => setPOne(p));
        setOneUrl(uploadedOne);
      }
      if (twoFile) {
        uploadedTwo = await uploadImageToCloudinary(twoFile, (p) => setPTwo(p));
        setTwoUrl(uploadedTwo);
      }
      if (bgFile) {
        uploadedBg = await uploadImageToCloudinary(bgFile, (p) => setPBg(p));
        setBgUrl(uploadedBg);
      }

      // Build payload matching your backend schema
      const payload: Partial<BackendEvent> = {
        tournament,
        homeTeam,
        awayTeam,
        startAt,
        status,
        odds,
        score,
        one: uploadedOne ?? undefined,
        two: uploadedTwo ?? undefined,
        bg: uploadedBg ?? undefined,
      };

      let result;
      if (event && (event._id || (event as any).id)) {
        const id = event._id ?? (event as any).id;
        result = await updateEvent(id, payload);
      } else {
        result = await createEvent(payload);
      }

      toast.success(event ? "Event updated" : "Event created");
      onSave(result?.event ?? result);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save event");
    } finally {
      setUploading(false);
      setPOne(0); setPTwo(0); setPBg(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full p-0">
        <DialogHeader className="p-6">
          <DialogTitle className="text-lg font-semibold">{event ? "Edit Event" : "Create Event"}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[80vh] overflow-auto p-6">
          <form onSubmit={(e) => handleSubmit(e)} className="grid gap-6 md:grid-cols-3">
            {/* Images column */}
            <div className="md:col-span-1 flex flex-col gap-4">
              <ImageCard label="Home Team" file={oneFile} preview={onePreview ?? oneUrl ?? null} onPick={pickOne} uploading={uploading && pOne > 0} progress={pOne} />
              <ImageCard label="Away Team" file={twoFile} preview={twoPreview ?? twoUrl ?? null} onPick={pickTwo} uploading={uploading && pTwo > 0} progress={pTwo} />
              <ImageCard label="Background" file={bgFile} preview={bgPreview ?? bgUrl ?? null} onPick={pickBg} uploading={uploading && pBg > 0} progress={pBg} size="md" />
            </div>

            {/* Fields column */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Tournament / Name</label>
                  <Input value={tournament} onChange={(e) => setTournament(e.target.value)} required />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Start At</label>
                  <Input value={startAt} onChange={(e) => setStartAt(e.target.value)} placeholder="YYYY-MM-DDTHH:mm:ssZ" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Home Team</label>
                  <Input value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)} required />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Away Team</label>
                  <Input value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)} required />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full p-2 rounded border">
                    <option value="upcoming">upcoming</option>
                    <option value="live">live</option>
                    <option value="finished">finished</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Odds (home / draw / away)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <NumberInput value={odds?.home ?? 0} onChange={(v) => setOdds({ ...(odds ?? {}), home: v })} placeholder="Home" />
                    <NumberInput value={odds?.draw ?? 0} onChange={(v) => setOdds({ ...(odds ?? {}), draw: v })} placeholder="Draw" />
                    <NumberInput value={odds?.away ?? 0} onChange={(v) => setOdds({ ...(odds ?? {}), away: v })} placeholder="Away" />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Score (home / away)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <NumberInput value={score?.home ?? 0} onChange={(v) => setScore({ ...(score ?? {}), home: v })} placeholder="Home" />
                    <NumberInput value={score?.away ?? 0} onChange={(v) => setScore({ ...(score ?? {}), away: v })} placeholder="Away" />
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Tip: Upload clear team logos (PNG/JPG). Background image is optional but improves event card appearance.
              </div>
            </div>

            {/* Footer spans all columns */}
            <div className="md:col-span-3 flex items-center justify-between gap-4 mt-2">
              <div className="text-sm text-muted-foreground">{event ? "Editing an existing event" : "Create a new event — images optional"}</div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={uploading}>Cancel</Button>
                <Button type="submit" disabled={uploading}>{uploading ? "Saving..." : event ? "Update Event" : "Create Event"}</Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialog;
