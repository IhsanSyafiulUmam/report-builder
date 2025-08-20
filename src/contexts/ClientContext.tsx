import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { formatDistanceToNow } from 'date-fns';

// Interface for the client data used within the application
export interface Client {
  id: string;
  name: string;
  email: string;
  status: string;
  reportsCount: number;
  lastActivity: string;
}

// Interface for the raw data from the RPC call
interface ClientFromRPC {
    id: string;
    name: string;
    email: string;
    status: string;
    last_activity: string;
    created_at: string;
    reports_count: number;
}

interface ClientContextType {
  clients: Client[];
  addClient: (client: { name: string; email: string; status: string; }) => Promise<void>;
  updateClient: (id: string, updates: Partial<Omit<Client, 'id' | 'reportsCount' | 'lastActivity'>>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  fetchClients: () => Promise<void>;
  loading: boolean;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClients = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
};

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('get_clients_with_report_counts');

    if (error) {
      console.error('Error fetching clients:', error);
    } else if (data) {
      const formattedData = data.map((client: ClientFromRPC) => ({
        id: client.id,
        name: client.name,
        email: client.email,
        status: client.status,
        reportsCount: client.reports_count,
        lastActivity: client.last_activity ? formatDistanceToNow(new Date(client.last_activity), { addSuffix: true }) : 'No activity',
      }));
      setClients(formattedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const addClient = async (client: { name: string; email: string; status: string; }) => {
    const { error } = await supabase
      .from('clients')
      .insert(client);

    if (error) {
      console.error('Error adding client:', error);
      throw error;
    }
    await fetchClients(); // Refetch all clients to get the updated list
  };

  const updateClient = async (id: string, updates: Partial<Omit<Client, 'id' | 'reportsCount' | 'lastActivity'>>) => {
    const { error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating client:', error);
      throw error;
    }
    await fetchClients(); // Refetch all clients
  };

  const deleteClient = async (id: string) => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
    setClients(clients.filter(client => client.id !== id)); // Optimistic update
  };

  return (
    <ClientContext.Provider value={{
      clients,
      addClient,
      updateClient,
      deleteClient,
      fetchClients,
      loading
    }}>
      {children}
    </ClientContext.Provider>
  );
};
