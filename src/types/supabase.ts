export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type TableTypes<Row, Insert, Update> = {
  Row: Row
  Insert: Insert
  Update: Update
}

export type Database = {
  public: {
    Tables: {
      products: TableTypes<
        {
          id: string
          name: string
          description: string | null
          created_at: string | null
          updated_at: string | null
        },
        {
          id?: string
          name: string
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        },
        {
          id?: string
          name?: string
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      >
      budgets: TableTypes<
        {
          id: string
          name: string
          type: string
          period: string
          start_date: string
          end_date: string
          amount: number
          progress: number | null
          status: string | null
          description: string | null
          method: string
          created_at: string | null
          updated_at: string | null
        },
        {
          id?: string
          name: string
          type: string
          period: string
          start_date: string
          end_date: string
          amount: number
          progress?: number | null
          status?: string | null
          description?: string | null
          method: string
          created_at?: string | null
          updated_at?: string | null
        },
        {
          id?: string
          name?: string
          type?: string
          period?: string
          start_date?: string
          end_date?: string
          amount?: number
          progress?: number | null
          status?: string | null
          description?: string | null
          method?: string
          created_at?: string | null
          updated_at?: string | null
        }
      >
      costs: TableTypes<
        {
          id: string
          product_id: string
          cost_type: string
          cost_category: string
          amount: number
          date: string
          description: string | null
          created_at: string | null
          updated_at: string | null
        },
        {
          id?: string
          product_id: string
          cost_type: string
          cost_category: string
          amount: number
          date: string
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        },
        {
          id?: string
          product_id?: string
          cost_type?: string
          cost_category?: string
          amount?: number
          date?: string
          description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      >
      standard_costs: TableTypes<
        {
          id: string
          product_id: string
          category: string
          standard_cost: number
          unit: string
          last_updated: string
          created_at: string | null
          updated_at: string | null
        },
        {
          id?: string
          product_id: string
          category: string
          standard_cost: number
          unit: string
          last_updated: string
          created_at?: string | null
          updated_at?: string | null
        },
        {
          id?: string
          product_id?: string
          category?: string
          standard_cost?: number
          unit?: string
          last_updated?: string
          created_at?: string | null
          updated_at?: string | null
        }
      >
      accounting_entries: TableTypes<
        {
          id: string
          date: string
          account_number: string
          account_name: string
          description: string
          debit: number
          credit: number
          type: string
          analytical_axis: string
          created_at: string | null
          updated_at: string | null
        },
        {
          id?: string
          date: string
          account_number: string
          account_name: string
          description: string
          debit?: number
          credit?: number
          type: string
          analytical_axis: string
          created_at?: string | null
          updated_at?: string | null
        },
        {
          id?: string
          date?: string
          account_number?: string
          account_name?: string
          description?: string
          debit?: number
          credit?: number
          type?: string
          analytical_axis?: string
          created_at?: string | null
          updated_at?: string | null
        }
      >
      users: TableTypes<
        {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          created_at: string | null
          updated_at: string | null
        },
        {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        },
        {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      >
      analyses: TableTypes<
        {
          id: string
          title: string
          description: string | null
          type: string
          created_at: string | null
          updated_at: string | null
          user_id: string | null
          data: Json | null
          status: string | null
          is_public: boolean | null
        },
        {
          id?: string
          title: string
          description?: string | null
          type: string
          created_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          data?: Json | null
          status?: string | null
          is_public?: boolean | null
        },
        {
          id?: string
          title?: string
          description?: string | null
          type?: string
          created_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          data?: Json | null
          status?: string | null
          is_public?: boolean | null
        }
      >
      analyses_tags: TableTypes<
        {
          analysis_id: string
          tag: string
        },
        {
          analysis_id: string
          tag: string
        },
        {
          analysis_id?: string
          tag?: string
        }
      >
      scenarios: TableTypes<
        {
          id: string
          title: string
          description: string
          type: string
          complexity: string
          fields: Json
          created_at: string | null
          updated_at: string | null
        },
        {
          id?: string
          title: string
          description: string
          type: string
          complexity: string
          fields: Json
          created_at?: string | null
          updated_at?: string | null
        },
        {
          id?: string
          title?: string
          description?: string
          type?: string
          complexity?: string
          fields?: Json
          created_at?: string | null
          updated_at?: string | null
        }
      >
      scenario_results: TableTypes<
        {
          id: string
          scenario_id: string
          user_id: string | null
          input_data: Json
          result_data: Json
          created_at: string | null
        },
        {
          id?: string
          scenario_id: string
          user_id?: string | null
          input_data: Json
          result_data: Json
          created_at?: string | null
        },
        {
          id?: string
          scenario_id?: string
          user_id?: string | null
          input_data?: Json
          result_data?: Json
          created_at?: string | null
        }
      >
    }
  }
}
