import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Report } from '../../contexts/ReportContext';
import { useClients } from '../../contexts/ClientContext';

interface ReportFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: Partial<Report>) => void;
  report?: Report | null; // Report data for editing, null for adding
}

const ReportFormModal: React.FC<ReportFormModalProps> = ({ isOpen, onClose, onSubmit, report }) => {
  const { clients, loading: clientsLoading } = useClients();
  const [formData, setFormData] = useState<Partial<Report>>({
    title: '',
    client_id: '',
    status: 'draft',
  });

  useEffect(() => {
    if (report) {
      setFormData({
        title: report.title,
        client_id: report.client_id,
        status: report.status,
      });
    } else {
      setFormData({
        title: '',
        client_id: clients.length > 0 ? clients[0].id : '', // Default to first client if available
        status: 'draft',
      });
    }
  }, [report, isOpen, clients]); // Reset form when modal opens, report changes, or clients load

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose(); // Close modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <button onClick={onClose} className="absolute text-gray-400 top-4 right-4 hover:text-gray-600">
          <X size={20} />
        </button>
        <h2 className="mb-6 text-2xl font-bold text-gray-800">{report ? 'Edit Report' : 'Add New Report'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block mb-1 text-sm font-medium text-gray-700">Report Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="client_id" className="block mb-1 text-sm font-medium text-gray-700">Client</label>
            {clientsLoading ? (
              <p className="text-gray-500">Loading clients...</p>
            ) : (
              <select
                id="client_id"
                name="client_id"
                value={formData.client_id || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label htmlFor="status" className="block mb-1 text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status || 'draft'}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="draft">Draft</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 transition-colors duration-200 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white transition-colors duration-200 bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {report ? 'Save Changes' : 'Add Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportFormModal;
