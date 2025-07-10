import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface DashboardStats {
  calculationsThisMonth: number;
  totalCalculations: number;
  avgSalaryCalculated: number;
  lastCalculationDate: string | null;
  recentCalculations: {
    id: string;
    employee_name: string;
    gross_salary: number;
    net_salary: number;
    created_at: string;
    is_bulk_calculation?: boolean;
  }[];
}

export const useDashboardData = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard-data', user?.id],
    queryFn: async (): Promise<DashboardStats> => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get current month date range
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      // Fetch calculations for current month
      const { data: monthlyCalculations, error: monthlyError } = await supabase
        .from('calculations')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', currentMonthStart.toISOString())
        .lt('created_at', nextMonthStart.toISOString())
        .order('created_at', { ascending: false });

      if (monthlyError) throw monthlyError;

      // Fetch all calculations for totals and averages
      const { data: allCalculations, error: allError } = await supabase
        .from('calculations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (allError) throw allError;

      // Get recent calculations (last 5)
      const { data: recentCalculations, error: recentError } = await supabase
        .from('calculations')
        .select('id, employee_name, gross_salary, net_salary, created_at, is_bulk_calculation')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      // Calculate statistics
      const calculationsThisMonth = monthlyCalculations?.length || 0;
      const totalCalculations = allCalculations?.length || 0;
      
      // Calculate average salary for this month
      const avgSalaryCalculated = monthlyCalculations && monthlyCalculations.length > 0
        ? monthlyCalculations.reduce((sum, calc) => sum + (Number(calc.gross_salary) || 0), 0) / monthlyCalculations.length
        : 0;

      // Get last calculation date
      const lastCalculationDate = allCalculations && allCalculations.length > 0
        ? allCalculations[0].created_at
        : null;

      return {
        calculationsThisMonth,
        totalCalculations,
        avgSalaryCalculated,
        lastCalculationDate,
        recentCalculations: recentCalculations?.map(calc => ({
          id: calc.id,
          employee_name: calc.employee_name || '',
          gross_salary: Number(calc.gross_salary) || 0,
          net_salary: Number(calc.net_salary) || 0,
          created_at: calc.created_at,
          is_bulk_calculation: calc.is_bulk_calculation || false
        })) || []
      };
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}; 