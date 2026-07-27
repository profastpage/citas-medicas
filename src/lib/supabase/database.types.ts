// ============================================================
// Tipos de Supabase para CitasPro
// ============================================================
//
// Estos tipos reflejan el schema de Prisma pero con convención
// snake_case (Postgres nativo). Cuando se aplique el SQL de
// supabase/schema.sql, las tablas y columnas se crearán en
// snake_case y estas tipificaciones serán válidas.
//
// Para regenerar automáticamente con `supabase gen types`:
//   supabase gen types --lang=typescript --project-id <ref> > src/lib/supabase/database.types.ts
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      User: {
        Row: {
          id: string;
          supabase_uid: string;
          email: string;
          password_hash: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          role: string;
          plan: string;
          mp_preapproval_id: string | null;
          mp_status: string | null;
          current_period_end: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          supabase_uid: string;
          email: string;
          password_hash?: string;
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: string;
          plan?: string;
          mp_preapproval_id?: string | null;
          mp_status?: string | null;
          current_period_end?: string | null;
          is_active?: boolean;
        };
        Update: Partial<Database['public']['Tables']['User']['Insert']>;
      };
      Clinic: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          slug: string;
          ruc: string | null;
          address: string | null;
          phone: string | null;
          email: string | null;
          logo_url: string | null;
          currency: string;
          theme_color: string;
          branding_text: string;
          is_white_label: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          slug: string;
          ruc?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          logo_url?: string | null;
          currency?: string;
          theme_color?: string;
          branding_text?: string;
          is_white_label?: boolean;
        };
        Update: Partial<Database['public']['Tables']['Clinic']['Insert']>;
      };
      ClinicMember: {
        Row: {
          id: string;
          user_id: string;
          clinic_id: string;
          role: string;
          invited_at: string;
          accepted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          clinic_id: string;
          role: string;
          invited_at?: string;
          accepted_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['ClinicMember']['Insert']>;
      };
      Specialty: {
        Row: {
          id: string;
          clinic_id: string;
          name: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          name: string;
          description?: string | null;
          is_active?: boolean;
        };
        Update: Partial<Database['public']['Tables']['Specialty']['Insert']>;
      };
      Service: {
        Row: {
          id: string;
          clinic_id: string;
          name: string;
          description: string | null;
          price: number;
          duration_min: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          name: string;
          description?: string | null;
          price: number;
          duration_min?: number;
          is_active?: boolean;
        };
        Update: Partial<Database['public']['Tables']['Service']['Insert']>;
      };
      Doctor: {
        Row: {
          id: string;
          clinic_id: string;
          user_id: string | null;
          specialty_id: string;
          full_name: string;
          document_id: string | null;
          colegiatura: string | null;
          phone: string | null;
          email: string | null;
          bio: string | null;
          consultation_price: number | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          user_id?: string | null;
          specialty_id: string;
          full_name: string;
          document_id?: string | null;
          colegiatura?: string | null;
          phone?: string | null;
          email?: string | null;
          bio?: string | null;
          consultation_price?: number | null;
          is_active?: boolean;
        };
        Update: Partial<Database['public']['Tables']['Doctor']['Insert']>;
      };
      DoctorSchedule: {
        Row: {
          id: string;
          clinic_id: string;
          doctor_id: string;
          day_of_week: string;
          specific_date: string | null;
          start_time: string;
          end_time: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          doctor_id: string;
          day_of_week: string;
          specific_date?: string | null;
          start_time: string;
          end_time: string;
          is_active?: boolean;
        };
        Update: Partial<Database['public']['Tables']['DoctorSchedule']['Insert']>;
      };
      Patient: {
        Row: {
          id: string;
          clinic_id: string;
          first_name: string;
          last_name: string;
          full_name: string;
          document_type: string | null;
          document_id: string | null;
          birth_date: string | null;
          sex: string | null;
          phone: string | null;
          email: string | null;
          address: string | null;
          blood_type: string | null;
          allergies: string | null;
          chronic_conditions: string | null;
          medical_history: string | null;
          emergency_contact: string | null;
          emergency_phone: string | null;
          medical_record_number: string | null;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['Patient']['Row']> & {
          clinic_id: string;
          first_name: string;
          last_name: string;
          full_name: string;
        };
        Update: Partial<Database['public']['Tables']['Patient']['Insert']>;
      };
      Appointment: {
        Row: {
          id: string;
          clinic_id: string;
          patient_id: string;
          doctor_id: string;
          service_id: string | null;
          appointment_date: string;
          duration_min: number;
          reason: string | null;
          status: string;
          notes: string | null;
          weight: number | null;
          height: number | null;
          temperature: number | null;
          blood_pressure: string | null;
          heart_rate: string | null;
          respiratory_rate: string | null;
          oxygen_saturation: string | null;
          illness_duration: string | null;
          current_illness: string | null;
          background: string | null;
          physical_exam: string | null;
          auxiliary_exams: string | null;
          diagnosis: string | null;
          treatment: string | null;
          prescription: string | null;
          rest_days: number;
          rest_end_date: string | null;
          follow_up_date: string | null;
          interconsult_specialty_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['Appointment']['Row']> & {
          clinic_id: string;
          patient_id: string;
          doctor_id: string;
          appointment_date: string;
        };
        Update: Partial<Database['public']['Tables']['Appointment']['Insert']>;
      };
      Interconsult: {
        Row: {
          id: string;
          appointment_id: string;
          specialty_id: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          appointment_id: string;
          specialty_id: string;
          notes?: string | null;
        };
        Update: Partial<Database['public']['Tables']['Interconsult']['Insert']>;
      };
      Payment: {
        Row: {
          id: string;
          clinic_id: string;
          appointment_id: string;
          amount: number;
          method: string;
          reference: string | null;
          notes: string | null;
          payment_date: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          appointment_id: string;
          amount: number;
          method: string;
          reference?: string | null;
          notes?: string | null;
        };
        Update: Partial<Database['public']['Tables']['Payment']['Insert']>;
      };
      CashSession: {
        Row: {
          id: string;
          clinic_id: string;
          opened_by_user_id: string;
          opening_amount: number;
          closing_amount: number | null;
          opened_at: string;
          closed_at: string | null;
          status: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          opened_by_user_id: string;
          opening_amount?: number;
          closing_amount?: number | null;
          opened_at?: string;
          closed_at?: string | null;
          status?: string;
          notes?: string | null;
        };
        Update: Partial<Database['public']['Tables']['CashSession']['Insert']>;
      };
      CashExpense: {
        Row: {
          id: string;
          cash_session_id: string;
          description: string;
          amount: number;
          expense_date: string;
        };
        Insert: {
          id?: string;
          cash_session_id: string;
          description: string;
          amount: number;
          expense_date?: string;
        };
        Update: Partial<Database['public']['Tables']['CashExpense']['Insert']>;
      };
      Medication: {
        Row: {
          id: string;
          clinic_id: string;
          commercial_name: string;
          generic_name: string | null;
          presentation: string | null;
          stock: number;
          min_stock: number;
          unit_price: number | null;
          expiry_date: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          commercial_name: string;
          generic_name?: string | null;
          presentation?: string | null;
          stock?: number;
          min_stock?: number;
          unit_price?: number | null;
          expiry_date?: string | null;
          is_active?: boolean;
        };
        Update: Partial<Database['public']['Tables']['Medication']['Insert']>;
      };
      PatientFile: {
        Row: {
          id: string;
          clinic_id: string;
          patient_id: string;
          file_name: string;
          file_url: string;
          file_type: string | null;
          file_size: number | null;
          description: string | null;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          clinic_id: string;
          patient_id: string;
          file_name: string;
          file_url: string;
          file_type?: string | null;
          file_size?: number | null;
          description?: string | null;
        };
        Update: Partial<Database['public']['Tables']['PatientFile']['Insert']>;
      };
      AuditLog: {
        Row: {
          id: string;
          clinic_id: string | null;
          user_id: string | null;
          action: string;
          entity: string | null;
          entity_id: string | null;
          description: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          clinic_id?: string | null;
          user_id?: string | null;
          action: string;
          entity?: string | null;
          entity_id?: string | null;
          description?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Update: Partial<Database['public']['Tables']['AuditLog']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
