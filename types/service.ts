export interface ServiceData {
  id: number;
  service_kind: string;
  service_id: string;
  service_name: string;
  short_content: string;
  category: string;
  member_num: string;
  unit: string;
  default_price: string;
  price: string;
  reduce_type: string;
  reduce_condition: string;
  reduce_percent: number | null;
  big_company: string;
  big_company_percent: number | null;
  small_company: string;
  small_company_percent: number | null;
  country_content: string;
  country_percent: number | null;
  no_plan_term: string;
  no_plan_percent: number | null;
  no_doctor: string;
  no_doctor_percent: number | null;
  work_time: string;
}

export interface SelectedService extends ServiceData {
  unitPrice: number;
  quantity: number;
}

export interface SelectedServicesState {
  [modalId: string]: SelectedService[];
  basic_remuneration: SelectedService[];
  addition: SelectedService[];
}

export interface ApiResponse {
  data: ServiceData[];
  total: number;
}

export interface InitData {
  reg_date: string;
  country_level: number;
  treatment_bonus: [number, number];
  selected_services: SelectedServicesState;
}