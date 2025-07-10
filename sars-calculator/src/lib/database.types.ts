export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          company_name: string | null
          subscription_tier: string
          subscription_status: string
          calculations_used: number
          monthly_limit: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          company_name?: string | null
          subscription_tier?: string
          subscription_status?: string
          calculations_used?: number
          monthly_limit?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          company_name?: string | null
          subscription_tier?: string
          subscription_status?: string
          calculations_used?: number
          monthly_limit?: number
          created_at?: string
          updated_at?: string
        }
      }
      calculations: {
        Row: {
          id: string
          user_id: string
          employee_name: string | null
          gross_salary: number
          net_salary: number
          paye_tax: number
          uif_contribution: number
          medical_aid: number
          pension_fund: number
          other_deductions: number
          overtime_pay: number
          allowances: number
          calculation_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          employee_name?: string | null
          gross_salary: number
          net_salary: number
          paye_tax: number
          uif_contribution: number
          medical_aid?: number
          pension_fund?: number
          other_deductions?: number
          overtime_pay?: number
          allowances?: number
          calculation_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          employee_name?: string | null
          gross_salary?: number
          net_salary?: number
          paye_tax?: number
          uif_contribution?: number
          medical_aid?: number
          pension_fund?: number
          other_deductions?: number
          overtime_pay?: number
          allowances?: number
          calculation_data?: Json | null
          created_at?: string
        }
      }
      sars_tax_tables: {
        Row: {
          id: string
          tax_year: string
          age_bracket: string
          threshold_amount: number
          tax_brackets: Json
          rebates: Json
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          tax_year: string
          age_bracket: string
          threshold_amount: number
          tax_brackets: Json
          rebates: Json
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          tax_year?: string
          age_bracket?: string
          threshold_amount?: number
          tax_brackets?: Json
          rebates?: Json
          is_active?: boolean
          created_at?: string
        }
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          price_monthly: number
          price_annual: number
          calculation_limit: number
          features: Json
          is_active: boolean
        }
        Insert: {
          id: string
          name: string
          price_monthly: number
          price_annual: number
          calculation_limit: number
          features: Json
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          price_monthly?: number
          price_annual?: number
          calculation_limit?: number
          features?: Json
          is_active?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 