import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Upload, FileText, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface RejectionNoticeProps {
  rejectionReason: string;
  userId: string;
}

export function RejectionNotice({ rejectionReason, userId }: RejectionNoticeProps) {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: 'Vyberte prosím soubory',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      // Upload each file
      for (const file of files) {
        const filePath = `${userId}/${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('student-documents')
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;
      }

      // Update approval status back to pending
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          approval_status: 'pending',
          rejection_reason: null,
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast({
        title: 'Dokumenty nahrány úspěšně!',
        description: 'Váš účet byl odeslán ke schválení.',
      });

      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setFiles([]);
    } catch (error: any) {
      toast({
        title: 'Chyba při nahrávání dokumentů',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          Účet nebyl schválen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>
            <strong>Důvod zamítnutí:</strong> {rejectionReason}
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Prosím nahrajte nové dokumenty pro opětovné schválení:
          </p>

          <div className="space-y-2">
            <Input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              disabled={uploading}
            />

            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Nahrávání...' : 'Nahrát nové dokumenty'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
