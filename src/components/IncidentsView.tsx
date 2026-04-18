
import React, { useState } from 'react';
import { Card } from './Card';
import { cn } from '../lib/utils';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { AlertTriangle, Plus, CheckCircle, Clock, X, Trash2 } from 'lucide-react';
import { Incident, User } from '../types';
import toast from 'react-hot-toast';

export const IncidentsView: React.FC<{ incidents: Incident[]; incidentTypes: { id: string; name: string }[]; currentUser: User | null }> = ({ incidents, incidentTypes, currentUser }) => {
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [newTypeName, setNewTypeName] = useState('');

  const isAdmin = currentUser?.role === 'Admin';

  const addIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) {
      toast.error('Please select an incident type');
      return;
    }
    try {
      await addDoc(collection(db, 'incidents'), {
        description,
        type_name: selectedType,
        status: 'Open',
        createdAt: serverTimestamp()
      });
      setDescription('');
      setSelectedType('');
      toast.success('Incident logged');
    } catch (e) {
      toast.error('Failed to log incident');
    }
  };

  const addIncidentType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'incident_types'), { name: newTypeName });
      setNewTypeName('');
      toast.success('Incident type added');
    } catch (e) {
      toast.error('Failed to add incident type');
    }
  };

  const deleteIncidentType = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'incident_types', id));
      toast.success('Incident type deleted');
    } catch (e) {
      toast.error('Failed to delete incident type');
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
          <select
            className="p-2 border rounded-lg"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            {incidentTypes.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
          </select>
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

      {isAdmin && (
        <Card className="p-6">
          <h2 className="font-bold text-slate-800 mb-4">Manage Incident Types</h2>
          <form onSubmit={addIncidentType} className="flex gap-4 mb-4">
            <input
              className="flex-1 p-2 border rounded-lg"
              placeholder="New incident type name..."
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              required
            />
            <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium">Add Type</button>
          </form>
          <div className="flex flex-wrap gap-2">
            {incidentTypes.map(t => (
              <span key={t.id} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full flex items-center gap-2">
                {t.name}
                <button onClick={() => deleteIncidentType(t.id)}><X size={14} /></button>
              </span>
            ))}
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {incidents.map(i => (
          <Card key={i.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">{i.type_name}</p>
              <p className="text-sm text-slate-700">{i.description}</p>
              <p className="text-xs text-slate-500">{i.createdAt ? new Date(i.createdAt).toLocaleString() : 'N/A'}</p>
              <span className={cn("text-xs font-bold px-2 py-1 rounded inline-block mt-2", i.status === 'Open' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700')}>
                {i.status}
              </span>
            </div>
            <div className="flex gap-2">
              {i.status !== 'Resolved' && (
                <button onClick={() => updateStatus(i.id, 'Resolved')} className="text-emerald-600 p-2 hover:bg-emerald-50 rounded-lg" title="Resolve">
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
