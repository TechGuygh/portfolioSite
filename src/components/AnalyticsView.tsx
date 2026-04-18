
import React from 'react';
import { Card } from './Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ProductPerformance } from '../types';
import { formatCurrency } from '../lib/utils';

export const AnalyticsView: React.FC<{ performance: ProductPerformance[] }> = ({ performance }) => {
  const topProducts = [...performance].sort((a, b) => b.total_revenue - a.total_revenue).slice(0, 5);
  const bottomProducts = [...performance].sort((a, b) => a.total_revenue - b.total_revenue).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="font-bold text-slate-800 mb-4">Top Performing Products</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="total_revenue" fill="#10b981">
                  {topProducts.map((_, index) => <Cell key={index} fill={index === 0 ? '#059669' : '#10b981'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="font-bold text-slate-800 mb-4">Least Performing Products</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bottomProducts}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="total_revenue" fill="#f43f5e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
