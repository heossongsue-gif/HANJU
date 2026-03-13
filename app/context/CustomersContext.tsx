'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSupabaseClient } from '../../lib/supabaseClient';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  tour: string;
  memo: string | null;
}

interface CustomersContextType {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => Promise<void>;
  updateCustomer: (customer: Customer) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;
  getCustomerById: (id: number) => Customer | undefined;
}

const CustomersContext = createContext<CustomersContextType | undefined>(undefined);

export function CustomersProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const loadCustomers = async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Failed to load customers from Supabase', error);
        return;
      }

      const mapped =
        data?.map((row: any) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          phone: row.phone,
          tour: row.tour,
          memo: row.memo ?? null,
        })) ?? [];

      setCustomers(mapped);
    };

    loadCustomers();
  }, []);

  const addCustomer = async (newCustomer: Omit<Customer, 'id'>) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('customers')
      .insert({
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        tour: newCustomer.tour,
        memo: newCustomer.memo ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to add customer', error);
      return;
    }

    const created: Customer = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      tour: data.tour,
      memo: data.memo ?? null,
    };

    setCustomers((prev) => [...prev, created]);
  };

  const updateCustomer = async (updated: Customer) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('customers')
      .update({
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        tour: updated.tour,
        memo: updated.memo ?? null,
      })
      .eq('id', updated.id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update customer', error);
      return;
    }

    const saved: Customer = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      tour: data.tour,
      memo: data.memo ?? null,
    };

    setCustomers((prev) =>
      prev.map((c) => (c.id === saved.id ? saved : c)),
    );
  };

  const deleteCustomer = async (id: number) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('customers').delete().eq('id', id);

    if (error) {
      console.error('Failed to delete customer', error);
      return;
    }

    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  const getCustomerById = (id: number) => {
    return customers.find((c) => c.id === id);
  };

  return (
    <CustomersContext.Provider
      value={{ customers, addCustomer, updateCustomer, deleteCustomer, getCustomerById }}
    >
      {children}
    </CustomersContext.Provider>
  );
}

export function useCustomers() {
  const ctx = useContext(CustomersContext);
  if (ctx === undefined) {
    throw new Error('useCustomers must be used within a CustomersProvider');
  }
  return ctx;
}

