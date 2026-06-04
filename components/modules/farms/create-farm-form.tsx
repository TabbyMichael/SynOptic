'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { FarmApi } from '@/lib/api/farms';
import { Plus } from 'lucide-react';

const farmSchema = z.object({
  name: z.string().min(2, 'Farm name must be at least 2 characters'),
  county: z.string().min(2, 'County must be at least 2 characters'),
  latitude: z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
  longitude: z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180'),
  acres: z.number().positive('Acres must be a positive number'),
});

type FarmFormData = z.infer<typeof farmSchema>;

interface CreateFarmFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateFarmForm({ open, onOpenChange }: CreateFarmFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FarmFormData>({
    resolver: zodResolver(farmSchema),
  });

  const onSubmit = async (data: FarmFormData) => {
    try {
      await FarmApi.create({
        name: data.name,
        county: data.county,
        latitude: data.latitude,
        longitude: data.longitude,
        acres: data.acres,
      });
      toast({
        title: 'Success',
        description: 'Farm created successfully',
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create farm',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Farm
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Farm</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Farm Name</Label>
            <Input
              id="name"
              placeholder="Green Valley Ranch"
              {...register('name')}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="county">County</Label>
            <Input
              id="county"
              placeholder="Nakuru"
              {...register('county')}
            />
            {errors.county && <p className="text-sm text-red-500">{errors.county.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="0.0001"
                placeholder="-0.3031"
                {...register('latitude', { valueAsNumber: true })}
              />
              {errors.latitude && <p className="text-sm text-red-500">{errors.latitude.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="0.0001"
                placeholder="36.0800"
                {...register('longitude', { valueAsNumber: true })}
              />
              {errors.longitude && <p className="text-sm text-red-500">{errors.longitude.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="acres">Acres</Label>
            <Input
              id="acres"
              type="number"
              step="0.01"
              placeholder="450"
              {...register('acres', { valueAsNumber: true })}
            />
            {errors.acres && <p className="text-sm text-red-500">{errors.acres.message}</p>}
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Farm'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
