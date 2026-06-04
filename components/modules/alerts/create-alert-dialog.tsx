'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { METRIC_OPTIONS, OPERATOR_OPTIONS } from '@/lib/constants';
import { mockFarms } from '@/lib/mock-data';
import { AlertApi } from '@/lib/api';

const alertSchema = z.object({
  farmId: z.string().min(1, 'Farm is required'),
  metric: z.string().min(1, 'Metric is required'),
  operator: z.enum(['>', '<', '>=', '<=', '==']),
  threshold: z.number({ coerce: true }).min(0),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
});

type AlertFormValues = z.infer<typeof alertSchema>;

interface CreateAlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function CreateAlertDialog({ open, onOpenChange, children }: CreateAlertDialogProps) {
  const [isOpen, setIsOpen] = useState(open ?? false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertSchema),
    defaultValues: { farmId: '', metric: '', operator: '>', threshold: 0, severity: 'medium' },
  });

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const onSubmit = async (values: AlertFormValues) => {
    setIsSubmitting(true);
    try {
      const farm = mockFarms.find((f) => f.id === values.farmId);
      if (!farm) throw new Error('Farm not found');

      await AlertApi.createRule({
        farmId: values.farmId,
        farmName: farm.name,
        metric: values.metric,
        operator: values.operator,
        threshold: values.threshold,
        severity: values.severity,
        enabled: true,
      });

      toast({ title: 'Success', description: 'Alert rule created successfully' });
      form.reset();
      handleOpenChange(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create alert rule', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const ErrorMsg = ({ field }: { field: keyof AlertFormValues }) => (
    form.formState.errors[field] ? <p className="text-xs text-destructive">{form.formState.errors[field]?.message}</p> : null
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Alert Rule</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Farm</Label>
            <Select value={form.watch('farmId')} onValueChange={(v) => form.setValue('farmId', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a farm" />
              </SelectTrigger>
              <SelectContent>
                {mockFarms.map((farm) => (
                  <SelectItem key={farm.id} value={farm.id}>{farm.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ErrorMsg field="farmId" />
          </div>

          <div className="space-y-2">
            <Label>Metric</Label>
            <Select value={form.watch('metric')} onValueChange={(v) => form.setValue('metric', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                {METRIC_OPTIONS.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ErrorMsg field="metric" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Operator</Label>
              <Select value={form.watch('operator')} onValueChange={(v: any) => form.setValue('operator', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OPERATOR_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Threshold</Label>
              <Input type="number" {...form.register('threshold', { valueAsNumber: true })} placeholder="0" />
              <ErrorMsg field="threshold" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Severity</Label>
            <Select value={form.watch('severity')} onValueChange={(v: any) => form.setValue('severity', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['low', 'medium', 'high', 'critical'].map((s) => (
                  <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ErrorMsg field="severity" />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Creating...' : 'Create Rule'}
            </Button>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
