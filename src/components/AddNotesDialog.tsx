import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLessons } from "@/hooks/use-lessons";
import { useAuth } from "@/hooks/use-auth";

interface AddNotesDialogProps {
  lessonId: string;
  currentNotes?: string;
  children: React.ReactNode;
}

export function AddNotesDialog({ lessonId, currentNotes = "", children }: AddNotesDialogProps) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(currentNotes);
  const { updateLessonNotes, profile } = useLessons();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) return;

    try {
      await updateLessonNotes.mutateAsync({
        lessonId,
        notes,
        type: profile?.role === 'teacher' ? 'teacher' : 'student',
      });
      
      setOpen(false);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {profile?.role === 'teacher' ? 'Add Teacher Notes' : 'Add Student Notes'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter your notes about this lesson..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="automotive"
              disabled={updateLessonNotes.isPending}
            >
              {updateLessonNotes.isPending ? "Saving..." : "Save Notes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}