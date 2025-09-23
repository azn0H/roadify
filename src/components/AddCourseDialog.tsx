import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCourses } from "@/hooks/use-courses";
import { PlusCircle } from "lucide-react";

interface AddCourseDialogProps {
  children?: React.ReactNode;
}

export function AddCourseDialog({ children }: AddCourseDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [durationHours, setDurationHours] = useState("");

  const { createCourse } = useCourses();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price || !durationHours) {
      return;
    }

    try {
      await createCourse.mutateAsync({
        name,
        description: description || undefined,
        price: parseFloat(price),
        duration_hours: parseInt(durationHours),
      });
      
      setOpen(false);
      setName("");
      setDescription("");
      setPrice("");
      setDurationHours("");
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm" variant="automotive">
            <PlusCircle className="h-4 w-4 mr-2" />
            Přidat kurz
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Přidat nový kurz</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Název kurzu</Label>
            <Input
              id="name"
              placeholder="Vložte název kurzu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Popisek</Label>
            <Textarea
              id="description"
              placeholder="Vložte popisek kurzu (Volitelné)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Cena (kč)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Délka (Hodiny)</Label>
            <Input
              id="duration"
              type="number"
              placeholder="Vložte délku v hodinách"
              value={durationHours}
              onChange={(e) => setDurationHours(e.target.value)}
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
              disabled={createCourse.isPending}
            >
              {createCourse.isPending ? "Vytvářím..." : "Vytvořit kurz"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}