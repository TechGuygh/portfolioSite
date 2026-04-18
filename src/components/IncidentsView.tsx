
import React, { useState } from 'react';
import { Card } from './Card';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { AlertTriangle, Plus, CheckCircle, Clock } from 'lucide-react';
import { Incident } from '../types';
import toast from 'react-hot-toast';

export const IncidentsView: React.FC<{ incidents: Incident[] }> = ({ incidents }) => {
  const [description, setDescription] = useState('');

  const addIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'incidents'), {
        description,
        status: 'Open',
        createdAt: serverTimestamp()
      });
      setDescription('');
      toast.success('Incident logged');
    } catch (e) {
      toast.error('Failed to log incident');
    }
  };

  const updateStatus = async (id: string, status: 'Open' | 'In Progress' | 'Resolved') => {
    try {
      await updateDoc(doc(db, 'incidents', id), { status });
      toast.success('Status updated');
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="font-bold text-slate-800 mb-4">Log New Incident</h2>
        <form onSubmit={addIncident} className="flex gap-4">
          <input
            className="flex-1 p-2 border rounded-lg"
            placeholder="Describe the issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <button type="submit" className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <Plus size={18} /> Log
          </button>
        </form>
      </Card>
      <div className="grid gap-4">
        {incidents.map(i => (
          <Card key={i.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">{i.description}</p>
              <p className="text-xs text-slate-500">{new Date(i.createdAt).toLocaleString()}</p>
              <span className={cn("text-xs font-bold px-2 py-1 rounded", i.status === 'Open' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700')}>
                {i.status}
              </span>
            </div>
            <div className="flex gap-2">
              {i.status !== 'Resolved' && (
                <button onClick={() => updateStatus(i.id, 'Resolved')} className="text-emerald-600 p-2 hover:bg-emerald-50 rounded-lg">
                  <CheckCircle size={18} />
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
