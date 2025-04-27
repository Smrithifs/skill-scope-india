export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          application_date: string | null
          cover_letter: string | null
          created_at: string | null
          id: string
          internship_id: string
          recruiter_id: string | null
          resume_url: string | null
          status: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          application_date?: string | null
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          internship_id: string
          recruiter_id?: string | null
          resume_url?: string | null
          status?: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          application_date?: string | null
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          internship_id?: string
          recruiter_id?: string | null
          resume_url?: string | null
          status?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_internship_id_fkey"
            columns: ["internship_id"]
            isOneToOne: false
            referencedRelation: "internships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "recruiters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      internships: {
        Row: {
          applications_count: number | null
          category: string
          company: string
          company_logo: string | null
          created_at: string | null
          deadline: string
          description: string
          duration_months: number
          external_id: string | null
          external_url: string | null
          id: string
          is_remote: boolean | null
          location: Json
          posted_date: string | null
          recruiter_id: string | null
          requirements: string[] | null
          responsibilities: string[] | null
          skills: string[] | null
          slots: number | null
          stipend: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          applications_count?: number | null
          category: string
          company: string
          company_logo?: string | null
          created_at?: string | null
          deadline: string
          description: string
          duration_months: number
          external_id?: string | null
          external_url?: string | null
          id?: string
          is_remote?: boolean | null
          location: Json
          posted_date?: string | null
          recruiter_id?: string | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          skills?: string[] | null
          slots?: number | null
          stipend?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          applications_count?: number | null
          category?: string
          company?: string
          company_logo?: string | null
          created_at?: string | null
          deadline?: string
          description?: string
          duration_months?: number
          external_id?: string | null
          external_url?: string | null
          id?: string
          is_remote?: boolean | null
          location?: Json
          posted_date?: string | null
          recruiter_id?: string | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          skills?: string[] | null
          slots?: number | null
          stipend?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "internships_recruiter_id_fkey"
            columns: ["recruiter_id"]
            isOneToOne: false
            referencedRelation: "recruiters"
            referencedColumns: ["id"]
          },
        ]
      }
      recruiters: {
        Row: {
          company: string
          company_logo: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          position: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company: string
          company_logo?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          phone?: string | null
          position: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company?: string
          company_logo?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          position?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      students: {
        Row: {
          college: string | null
          created_at: string | null
          degree: string | null
          email: string
          full_name: string
          graduation_year: number | null
          id: string
          phone: string | null
          resume_url: string | null
          skills: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          college?: string | null
          created_at?: string | null
          degree?: string | null
          email: string
          full_name: string
          graduation_year?: number | null
          id?: string
          phone?: string | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          college?: string | null
          created_at?: string | null
          degree?: string | null
          email?: string
          full_name?: string
          graduation_year?: number | null
          id?: string
          phone?: string | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
