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
  country_content: string;
  country_percent: number | null;
  no_plan_term: string;
  no_plan_percent: number | null;
  no_doctor: string;
  work_time: string;
}

export interface ApiResponse {
  data: ServiceData[];
  total: number;
}

export interface InitData {
  reg_date: string;
  cate_price6: number;
  cate_price5: number;
  cate_price4: number;
  cate_price3: number;
  cate_price2: number;
  cate_value6: number;
  cate_value5: number;
  cate_value4: number;
  cate_value3: number;
  cate_value2: number;
  eat_price: number;
  eat_value: number;
  nurse_price: number;
  nurse_value: number;
  rehearsal_price: number;
  rehearsal_value: number;
  pro_price1: number;
  pro_value1: number;
  pro_price2: number;
  pro_value2: number;
  pro_price3: number;
  pro_value3: number;
  transport_price1: number;
  transport_value1: number;
  transport_price2: number;
  transport_value2: number;
  staff_price12: number;
  staff_value12: number;
  country_level: number;
}