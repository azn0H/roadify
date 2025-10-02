import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useApprovals } from '@/hooks/use-approvals';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface AccountApprovalCardProps {
  student: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    phone_number: string | null;
    address: string | null;
    created_at: string;
  };
}

export function AccountApprovalCard({ student }: AccountApprovalCardProps) {
  const { approveAccount, rejectAccount, getStudentDocuments, getDocumentUrl } = useApprovals();
  const [rejectionReason, setRejectionReason] = useState('');
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const docs = await getStudentDocuments(student.id);
        setDocuments(docs);
      } catch (error) {
        console.error('Error loading documents:', error);
      }
    };
    loadDocuments();
  }, [student.id]);

  const handleApprove = () => {
    approveAccount.mutate(student.id);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      return;
    }
    rejectAccount.mutate({ userId: student.id, reason: rejectionReason });
    setRejectionReason('');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {student.first_name} {student.last_name}
          </CardTitle>
          <Badge variant="outline">Pending</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 text-sm">
          <div>
            <span className="font-medium">Email:</span> {student.email}
          </div>
          {student.phone_number && (
            <div>
              <span className="font-medium">Phone:</span> {student.phone_number}
            </div>
          )}
          {student.address && (
            <div>
              <span className="font-medium">Address:</span> {student.address}
            </div>
          )}
          <div>
            <span className="font-medium">Registered:</span>{' '}
            {format(new Date(student.created_at), 'PPP')}
          </div>
        </div>

        {documents.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Uploaded Documents:</h4>
            <div className="space-y-2">
              {documents.map((doc) => (
                <a
                  key={doc.name}
                  href={getDocumentUrl(student.id, doc.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded border hover:bg-accent transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span className="text-sm flex-1">{doc.name}</span>
                  <Download className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleApprove}
            disabled={approveAccount.isPending}
            className="flex-1"
            variant="default"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="flex-1"
                disabled={rejectAccount.isPending}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Do Not Approve
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reject Account</AlertDialogTitle>
                <AlertDialogDescription>
                  Please provide a reason for rejecting this account. This will be shared with the student.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px]"
              />
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setRejectionReason('')}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReject}
                  disabled={!rejectionReason.trim() || rejectAccount.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Reject Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
