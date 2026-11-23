export type UserRole = 'operator' | 'quality_engineer' | 'supervisor' | 'quality_manager' | 'admin';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at?: string;
}

export interface ProductionLine {
  id: number;
  code: 'D1' | 'D2' | 'D3' | 'D4';
  name: string;
  description?: string;
  molding_type: string;
  capacity_tph: number;
  is_active: boolean;
}

export interface Parameter {
  id: number;
  code: string;
  name: string;
  description?: string;
  category: 'PHYSICAL' | 'CHEMICAL';
  unit: string;
  frequency: 'HOURLY' | 'SHIFT' | 'DAILY';
  applicable_lines: string;
  target_value: number;
  lsl: number;
  usl: number;
  lcl_historical?: number;
  ucl_historical?: number;
  current_revision: number;
  testing_method?: string;
  data_validation_min?: number;
  data_validation_max?: number;
  is_active: boolean;
}

export interface SpecificationRevision {
  id: number;
  parameter_id: number;
  revision_number: number;
  effective_date: string;
  target_value: number;
  lsl: number;
  usl: number;
  change_reason: string;
  approved_by_id?: number;
}

export interface SandTestValue {
  id: number;
  parameter_id: number;
  parameter_name: string;
  parameter_code: string;
  measured_value: number;
  unit: string;
  status: 'OK' | 'WARNING' | 'OUT_OF_SPEC';
  is_corrected: boolean;
  original_value?: number;
  correction_reason?: string;
}

export interface SandTestRecord {
  id: number;
  test_number: string;
  line_code: string;
  test_type: 'HOURLY_PHYSICAL' | 'SHIFT_CHEMICAL';
  test_date: string;
  shift: number;
  test_hour: number;
  timestamp: string;
  batch_number?: string;
  status: 'CONFORMING' | 'WARNING' | 'OUT_OF_SPEC';
  notes?: string;
  operator_name?: string;
  values: SandTestValue[];
}

export interface SPCPoint {
  index: number;
  timestamp: string;
  value: number;
  mr?: number;
  cl: number;
  ucl: number;
  lcl: number;
  mr_cl?: number;
  mr_ucl?: number;
  mr_lcl?: number;
  lsl?: number;
  usl?: number;
  is_out_of_control: boolean;
  is_mr_out_of_control?: boolean;
  violations: string[];
  spec_status: string;
}

export interface IMRChartData {
  chart_type: string;
  parameter_name: string;
  parameter_code: string;
  unit: string;
  line_code: string;
  sample_size: number;
  mean: number;
  mean_mr: number;
  sigma_within: number;
  sigma_overall: number;
  target?: number;
  lsl?: number;
  usl?: number;
  i_chart: {
    cl: number;
    ucl: number;
    lcl: number;
    zone_1s_upper: number;
    zone_2s_upper: number;
    zone_1s_lower: number;
    zone_2s_lower: number;
  };
  mr_chart: {
    cl: number;
    ucl: number;
    lcl: number;
  };
  violations_count: number;
  is_stable: boolean;
  points: SPCPoint[];
}

export interface ProcessCapabilityData {
  can_calculate: boolean;
  reason?: string;
  sample_size?: number;
  parameter_name?: string;
  parameter_code?: string;
  unit?: string;
  line_code?: string;
  mean?: number;
  target?: number;
  lsl?: number;
  usl?: number;
  sigma_within?: number;
  sigma_overall?: number;
  cp?: number;
  cpk?: number;
  cpu?: number;
  cpl?: number;
  pp?: number;
  ppk?: number;
  ppu?: number;
  ppl?: number;
  ppm_total?: number;
  ppm_below_lsl?: number;
  ppm_above_usl?: number;
  assessment?: string;
  is_stable?: boolean;
  is_normal?: boolean;
  normality_p_value?: number;
  warnings?: string[];
  violations_count?: number;
}

export interface DefectCategory {
  id: number;
  code: string;
  name: string;
  description?: string;
  potential_sand_causes?: string;
}

export interface CastingProduct {
  id: number;
  part_number: string;
  part_name: string;
  customer_name: string;
  material_grade: string;
}

export interface RejectionRecord {
  id: number;
  rejection_number: string;
  production_date: string;
  line_code: string;
  shift: number;
  product_name: string;
  defect_name: string;
  defect_code: string;
  rejected_qty: number;
  inspected_qty: number;
  rejection_rate: number;
  detection_stage: string;
  severity: string;
  root_cause_candidate?: string;
  corrective_action?: string;
  responsible_person?: string;
  status: string;
}

export interface ParetoItem {
  defect_id: number;
  defect_name: string;
  defect_code: string;
  rejected_qty: number;
  percentage: number;
  cumulative_percentage: number;
}

export interface ParetoResponse {
  line_code: string;
  total_rejected: number;
  defects_count: number;
  items: ParetoItem[];
}

export interface CorrelationAnalysis {
  parameter_code: string;
  parameter_name: string;
  defect_code: string;
  defect_name: string;
  parameter_unit: string;
  line_code: string;
  lag_hours: number;
  sample_size: number;
  has_sufficient_data: boolean;
  pearson_r: number;
  pearson_p_value: number;
  spearman_rho: number;
  spearman_p_value: number;
  relationship_strength: string;
  is_statistically_significant: boolean;
  group_comparison: {
    high_or_ooc_count: number;
    normal_count: number;
    mean_rejection_high_group?: number;
    mean_rejection_normal_group?: number;
    rejection_ratio?: number;
    group_p_value?: number;
  };
  insight: string;
  usl?: number;
  lsl?: number;
  scatter_points: Array<{
    x_sand: number;
    y_rejection: number;
    is_out_of_spec: boolean;
  }>;
}

export interface CustomerComplaint {
  id: number;
  complaint_number: string;
  customer_name: string;
  received_date: string;
  product_name: string;
  defect_name: string;
  batch_number?: string;
  line_code: string;
  affected_qty: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  status: 'OPEN' | 'UNDER_INVESTIGATION' | 'CAPA_PENDING' | 'CLOSED';
  d1_team?: string;
  d2_problem?: string;
  d3_containment?: string;
  d4_root_cause?: string;
  d5_corrective_action?: string;
  d6_validation?: string;
  d7_preventive_action?: string;
  d8_closure?: string;
  responsible_person?: string;
  due_date?: string;
}

export interface QualityAlert {
  id: number;
  alert_code: string;
  line_code: string;
  parameter_name?: string;
  parameter_code?: string;
  alert_type: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  description: string;
  nelson_rule_triggered?: string;
  status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';
  timestamp: string;
  acknowledged_by_name?: string;
  resolved_by_name?: string;
  resolution_notes?: string;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  user_name: string;
  user_role: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  old_value?: string;
  new_value?: string;
  reason?: string;
  ip_address?: string;
}

export interface DashboardMetrics {
  total_tests_today: number;
  total_tests_week: number;
  conforming_percentage: number;
  open_alerts: number;
  total_rejected_qty: number;
  total_inspected_qty: number;
  overall_rejection_rate: number;
  active_complaints: number;
}

export interface LineCardInfo {
  line_code: 'D1' | 'D2' | 'D3' | 'D4';
  health: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  latest_test_number: string;
  latest_test_status: string;
  latest_test_time?: string;
  open_alerts: number;
  rejection_rate: number;
  molding_line: string;
}
