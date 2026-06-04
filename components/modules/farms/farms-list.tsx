'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Pencil, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';

import { PageHeader, DataTable, StatusBadge, ConfirmationDialog } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Farm } from '@/lib/types';
import { mockFarms } from '@/lib/mock-data';
import { FARM_STATUS_COLORS } from '@/lib/constants';
import { toast } from '@/hooks/use-toast';
import { FarmApi } from '@/lib/api/farms';

const getHealthColor = (score: number) => {
  if (score > 70) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 40) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
};

export function FarmsList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [farmToDelete, setFarmToDelete] = useState<string | null>(null);

  const itemsPerPage = 10;

  const filteredFarms = useMemo(() => {
    return mockFarms.filter((farm) => {
      const matchesSearch = farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farm.county.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || farm.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredFarms.length / itemsPerPage);
  const paginatedFarms = filteredFarms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async () => {
    if (!farmToDelete) return;
    try {
      await FarmApi.delete(farmToDelete);
      toast({
        title: 'Success',
        description: 'Farm deleted successfully',
      });
      setDeleteDialogOpen(false);
      setFarmToDelete(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete farm',
      });
    }
  };

  const columns: ColumnDef<Farm>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'county',
      header: 'County',
    },
    {
      accessorKey: 'acres',
      header: 'Acres',
      cell: ({ row }) => `${row.original.acres.toLocaleString()}`,
    },
    {
      accessorKey: 'healthScore',
      header: 'Health Score',
      cell: ({ row }) => (
        <span className={`font-semibold ${getHealthColor(row.original.healthScore)}`}>
          {row.original.healthScore}%
        </span>
      ),
    },
    {
      accessorKey: 'lastAnalysis',
      header: 'Last Analysis',
      cell: ({ row }) => {
        if (!row.original.lastAnalysis) return 'Never';
        return new Date(row.original.lastAnalysis).toLocaleDateString();
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadge
          label={row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
          variant={FARM_STATUS_COLORS[row.original.status]}
        />
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/farms/${row.original.id}`)}
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/farms/${row.original.id}/edit`)}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFarmToDelete(row.original.id);
              setDeleteDialogOpen(true);
            }}
            title="Delete"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Farms"
        children={
          <Link href="/farms/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Farm
            </Button>
          </Link>
        }
      />

      <div className="flex gap-4 flex-col sm:flex-row">
        <Input
          placeholder="Search farms by name or county..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as any);
            setCurrentPage(1);
          }}
          className="px-3 py-2 rounded-md border border-input bg-background text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <DataTable columns={columns} data={paginatedFarms} />

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages || 1} ({filteredFarms.length} total)
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Farm"
        description="Are you sure you want to delete this farm? This action cannot be undone."
        onConfirm={handleDelete}
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
