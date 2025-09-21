import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Copy, Plus, Trash2, Percent, Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';

interface SaleCode {
  id: string;
  code: string;
  discount_percentage: number;
  is_active: boolean;
  usage_limit: number | null;
  times_used: number;
  expires_at: string | null;
  created_at: string;
}

interface SaleCodeGeneratorProps {
  children?: React.ReactNode;
}

export function SaleCodeGenerator({ children }: SaleCodeGeneratorProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saleCodes, setSaleCodes] = useState<SaleCode[]>([]);
  const [formData, setFormData] = useState({
    discountPercentage: 10,
    usageLimit: '',
    expiresAt: ''
  });

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const fetchSaleCodes = async () => {
    const { data, error } = await supabase
      .from('sale_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sale codes:', error);
    } else {
      setSaleCodes(data || []);
    }
  };

  const handleCreateSaleCode = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const code = generateRandomCode();
      const { error } = await supabase
        .from('sale_codes')
        .insert({
          code,
          discount_percentage: formData.discountPercentage,
          usage_limit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
          expires_at: formData.expiresAt || null,
          created_by: user.id
        });

      if (error) throw error;

      toast({
        title: "Sale code created!",
        description: `Code ${code} created successfully`,
      });

      setFormData({
        discountPercentage: 10,
        usageLimit: '',
        expiresAt: ''
      });

      await fetchSaleCodes();
    } catch (error: any) {
      toast({
        title: "Error creating sale code",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDeactivateSaleCode = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sale_codes')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sale code deactivated",
      });

      await fetchSaleCodes();
    } catch (error: any) {
      toast({
        title: "Error deactivating sale code",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const copyCodeToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied!",
      description: `${code} copied to clipboard`,
    });
  };

  React.useEffect(() => {
    if (open) {
      fetchSaleCodes();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="automotive">
            <Plus className="h-4 w-4 mr-2" />
            Generate Sale Code
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Slevové kupóny</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Create New Sale Code */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vygenerovat nový kód</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="discount">Sleva v %</Label>
                <Input
                  id="discount"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    discountPercentage: parseInt(e.target.value) || 0
                  }))}
                />
              </div>
              
              <div>
                <Label htmlFor="usage">Limit použítí (Optimálně)</Label>
                <Input
                  id="usage"
                  type="number"
                  min="1"
                  placeholder="Unlimited if empty"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    usageLimit: e.target.value
                  }))}
                />
              </div>
              
              <div>
                <Label htmlFor="expires">Datum expirace (Optimálně)</Label>
                <Input
                  id="expires"
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    expiresAt: e.target.value
                  }))}
                />
              </div>
              
              <Button 
                onClick={handleCreateSaleCode} 
                disabled={loading}
                className="w-full"
                variant="automotive"
              >
                {loading ? 'Vytvářím...' : 'Vygenerovat kód'}
              </Button>
            </CardContent>
          </Card>

          {/* Existing Sale Codes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aktivní kódy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {saleCodes.filter(code => code.is_active).map((saleCode) => (
                  <div key={saleCode.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                          {saleCode.code}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyCodeToClipboard(saleCode.code)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeactivateSaleCode(saleCode.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Percent className="h-3 w-3" />
                        {saleCode.discount_percentage}% off
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {saleCode.times_used}/{saleCode.usage_limit || '∞'}
                      </div>
                      {saleCode.expires_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(saleCode.expires_at), 'MMM dd')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {saleCodes.filter(code => code.is_active).length === 0 && (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    Nejsou zde žádné aktivní kódy.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
