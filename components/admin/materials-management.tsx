'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Flame,
  MoreVertical,
  PencilLine,
  RotateCcw,
  Search,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import apiClient from '@/lib/api';
import { Material, MaterialStatus } from '@/types';

type MaterialFilter = 'all' | MaterialStatus;

const LOW_STOCK_THRESHOLD = 1500;
const CRITICAL_STOCK_THRESHOLD = 500;

function getMaterialStatus(stock: number): MaterialStatus {
  if (stock <= CRITICAL_STOCK_THRESHOLD) return 'critical';
  if (stock <= LOW_STOCK_THRESHOLD) return 'low';
  return 'healthy';
}

function getStatusLabel(status: MaterialStatus) {
  switch (status) {
    case 'critical':
      return 'Critical';
    case 'low':
      return 'Low Stock';
    default:
      return 'Healthy';
  }
}

function getStatusClasses(status: MaterialStatus) {
  switch (status) {
    case 'critical':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'low':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
}

function getBarClasses(status: MaterialStatus) {
  switch (status) {
    case 'critical':
      return 'bg-red-500';
    case 'low':
      return 'bg-amber-500';
    default:
      return 'bg-emerald-500';
  }
}

function MaterialStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  accent: string;
}) {
  return (
    <Card className="border-gray-200 bg-white shadow-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          </div>
          <div className={`rounded-2xl p-3 ${accent}`}>
            <Icon className="h-5 w-5 text-emerald-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MaterialsManagement() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<MaterialFilter>('all');

  useEffect(() => {
    void fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get('/materials');
      const payload = response.data?.data ?? response.data ?? [];
      setMaterials(Array.isArray(payload) ? payload : []);
    } catch (err: any) {
      console.error('Error fetching materials:', err);
      setError(err?.message || 'Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const enrichedMaterials = useMemo(
    () =>
      materials.map((material) => ({
        ...material,
        status: getMaterialStatus(Number(material.stock) || 0),
      })),
    [materials]
  );

  const totalMaterials = enrichedMaterials.length;
  const totalUnits = enrichedMaterials.reduce((sum, material) => sum + (Number(material.stock) || 0), 0);
  const lowStockCount = enrichedMaterials.filter((material) => material.status === 'low').length;
  const criticalCount = enrichedMaterials.filter((material) => material.status === 'critical').length;
  const mostStocked = [...enrichedMaterials].sort((a, b) => (Number(b.stock) || 0) - (Number(a.stock) || 0))[0];

  const filteredMaterials = useMemo(() => {
    const searchValue = query.trim().toLowerCase();

    return enrichedMaterials.filter((material) => {
      const matchesQuery =
        searchValue.length === 0 ||
        material.name.toLowerCase().includes(searchValue) ||
        material.unit.toLowerCase().includes(searchValue);

      const matchesFilter = filter === 'all' || material.status === filter;

      return matchesQuery && matchesFilter;
    });
  }, [enrichedMaterials, query, filter]);

  const maxStock = Math.max(...materials.map((material) => Number(material.stock) || 0), 1);

  const summaryCards = [
    {
      title: 'Total Materials',
      value: totalMaterials.toString(),
      subtitle: 'Raw materials tracked',
      icon: Boxes,
      accent: 'bg-emerald-50',
    },
    {
      title: 'Low Stock',
      value: lowStockCount.toString(),
      subtitle: 'Need restocking soon',
      icon: AlertTriangle,
      accent: 'bg-amber-50',
    },
    {
      title: 'Critical',
      value: criticalCount.toString(),
      subtitle: 'Require immediate action',
      icon: Flame,
      accent: 'bg-red-50',
    },
    {
      title: 'Total Units',
      value: totalUnits.toLocaleString('id-ID'),
      subtitle: 'Across all materials',
      icon: CheckCircle2,
      accent: 'bg-slate-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Material Inventory</h2>
          <p className="mt-1 text-gray-600">Monitor and manage raw material stock</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search material..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-72"
            />
          </div>

          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value as MaterialFilter)}
              className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-10 text-sm text-gray-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-52"
            >
              <option value="all">All materials</option>
              <option value="healthy">Healthy only</option>
              <option value="low">Low stock only</option>
              <option value="critical">Critical only</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <MaterialStatCard key={card.title} {...card} />
        ))}
      </div>

      <Card className="overflow-hidden border-gray-200 bg-white shadow-card">
        <CardHeader className="border-b border-gray-200 bg-gray-50/80 pb-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-xl text-gray-900">Inventory Table</CardTitle>
              <p className="mt-1 text-sm text-gray-500">
                Clean view for quick stock monitoring and restock decisions
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {loading ? 'Loading materials...' : `${filteredMaterials.length} materials shown`}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="px-6 py-14 text-center text-gray-600">Loading material inventory...</div>
          ) : filteredMaterials.length === 0 ? (
            <div className="px-6 py-14 text-center text-gray-600">
              No materials match the current search or filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Material
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Unit
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredMaterials.map((material) => {
                    const status = material.status;
                    const stock = Number(material.stock) || 0;
                    const progress = Math.max(4, Math.min(100, Math.round((stock / maxStock) * 100)));

                    return (
                      <tr key={material.id} className="transition-colors hover:bg-gray-50/80">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{material.name}</p>
                            <p className="text-xs text-gray-500">Raw material item</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{material.unit}</td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-end justify-between gap-3">
                              <div>
                                <p className="text-base font-semibold text-gray-900">{stock.toLocaleString('id-ID')}</p>
                                <p className="text-xs text-gray-500">Current available stock</p>
                              </div>
                              <p className="text-xs font-medium text-gray-500">{progress}% scale</p>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                              <div
                                className={`h-full rounded-full ${getBarClasses(status)} transition-all duration-300`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={`border px-3 py-1 text-xs font-medium ${getStatusClasses(status)}`}>
                            {getStatusLabel(status)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 border-gray-200 text-gray-700 hover:bg-gray-50"
                              onClick={() => console.log('Edit material', material.id)}
                            >
                              <PencilLine className="h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              className="gap-2 bg-emerald-700 text-white hover:bg-emerald-800"
                              onClick={() => console.log('Restock material', material.id)}
                            >
                              <RotateCcw className="h-4 w-4" />
                              Restock
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                              onClick={() => console.log('Open material menu', material.id)}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <Card className="border-gray-200 bg-white shadow-card">
          <CardHeader className="border-b border-gray-200 bg-gray-50/80">
            <CardTitle className="text-lg text-gray-900">Operational Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-6">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Emerald is used as the primary brand accent, while the layout stays neutral for easy scanning.
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
              Search and status filtering make it easier to spot stock issues quickly.
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white shadow-card">
          <CardHeader className="border-b border-gray-200 bg-gray-50/80">
            <CardTitle className="text-lg text-gray-900">Highest Stock</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {mostStocked ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Largest buffer in current inventory</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">{mostStocked.name}</p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Current stock</p>
                  <p className="mt-1 text-3xl font-bold text-emerald-700">
                    {Number(mostStocked.stock).toLocaleString('id-ID')}
                  </p>
                  <p className="text-sm text-gray-500">{mostStocked.unit} available</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No materials available yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}