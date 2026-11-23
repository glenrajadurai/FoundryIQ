import {
  User, ProductionLine, Parameter, SandTestRecord,
  IMRChartData, ProcessCapabilityData, RejectionRecord,
  ParetoResponse, CorrelationAnalysis, CustomerComplaint,
  QualityAlert, DashboardMetrics, LineCardInfo
} from '../types';

export const mockUser: User = {
  id: 1,
  username: 'admin',
  email: 'admin@foundry4.com',
  full_name: 'S. Natarajan (Plant Quality Head)',
  role: 'admin',
  is_active: true
};

export const mockLines: ProductionLine[] = [
  { id: 1, code: 'D1', name: 'Disamatic Line D1 (Automotive Engine Block)', description: 'High pressure vertical flaskless molding line', molding_type: 'Vertical Flaskless', capacity_tph: 55.0, is_active: true },
  { id: 2, code: 'D2', name: 'Disamatic Line D2 (Transmission Housings)', description: 'High pressure horizontal flaskless molding line', molding_type: 'Horizontal Flaskless', capacity_tph: 45.0, is_active: true },
  { id: 3, code: 'D3', name: 'Disamatic Line D3 (Hydraulic Pump & Valves)', description: 'Automatic green sand molding line', molding_type: 'Automatic Green Sand Matchplate', capacity_tph: 40.0, is_active: true },
  { id: 4, code: 'D4', name: 'Disamatic Line D4 (General Commercial Castings)', description: 'High volume flaskless vertical molding line', molding_type: 'High Volume Vertical', capacity_tph: 50.0, is_active: true },
];

export const mockParameters: Parameter[] = [
  { id: 1, code: 'MOISTURE', name: 'Moisture Content', category: 'PHYSICAL', unit: '%', frequency: 'HOURLY', applicable_lines: 'ALL', current_revision: 1, target_value: 3.40, lsl: 3.10, usl: 3.70, lcl_historical: 3.15, ucl_historical: 3.65, testing_method: 'Infrared Halogen', is_active: true },
  { id: 2, code: 'COMPACT', name: 'Compactability', category: 'PHYSICAL', unit: '%', frequency: 'HOURLY', applicable_lines: 'ALL', current_revision: 1, target_value: 42.0, lsl: 38.0, usl: 46.0, lcl_historical: 39.0, ucl_historical: 45.0, testing_method: 'Pneumatic Cylinder', is_active: true },
  { id: 3, code: 'GCS', name: 'Green Compression Strength', category: 'PHYSICAL', unit: 'N/cm²', frequency: 'HOURLY', applicable_lines: 'ALL', current_revision: 1, target_value: 16.5, lsl: 14.5, usl: 18.5, lcl_historical: 14.8, ucl_historical: 18.2, testing_method: 'Universal Sand Strength Machine', is_active: true },
  { id: 4, code: 'PERM', name: 'Permeability', category: 'PHYSICAL', unit: 'Perm No.', frequency: 'HOURLY', applicable_lines: 'ALL', current_revision: 1, target_value: 135.0, lsl: 115.0, usl: 160.0, lcl_historical: 118.0, ucl_historical: 155.0, testing_method: 'Electric Permmeter', is_active: true },
  { id: 5, code: 'SHEAR', name: 'Green Shear Strength', category: 'PHYSICAL', unit: 'N/cm²', frequency: 'HOURLY', applicable_lines: 'ALL', current_revision: 1, target_value: 4.2, lsl: 3.5, usl: 5.0, lcl_historical: 3.6, ucl_historical: 4.8, testing_method: 'Shear attachment', is_active: true },
  { id: 6, code: 'HARDNESS', name: 'Mold Hardness', category: 'PHYSICAL', unit: 'Hardness (B)', frequency: 'HOURLY', applicable_lines: 'ALL', current_revision: 1, target_value: 88.0, lsl: 84.0, usl: 94.0, lcl_historical: 85.0, ucl_historical: 93.0, testing_method: 'Dietert B Scaler', is_active: true },
  { id: 7, code: 'ACTIVE_CLAY', name: 'Active Bentonite Clay', category: 'CHEMICAL', unit: '%', frequency: 'SHIFT', applicable_lines: 'ALL', current_revision: 1, target_value: 7.20, lsl: 6.50, usl: 8.00, lcl_historical: 6.60, ucl_historical: 7.80, testing_method: 'Methylene Blue Titration', is_active: true },
  { id: 8, code: 'LOI', name: 'Loss on Ignition', category: 'CHEMICAL', unit: '%', frequency: 'SHIFT', applicable_lines: 'ALL', current_revision: 1, target_value: 3.80, lsl: 3.20, usl: 4.50, lcl_historical: 3.30, ucl_historical: 4.30, testing_method: 'Muffle Furnace at 950°C', is_active: true },
];

export const mockDashboardMetrics: DashboardMetrics = {
  total_tests_today: 32,
  total_tests_week: 224,
  conforming_percentage: 97.4,
  open_alerts: 2,
  total_rejected_qty: 48,
  total_inspected_qty: 2450,
  overall_rejection_rate: 1.96,
  active_complaints: 1
};

export const mockLineCards: LineCardInfo[] = [
  { line_code: 'D1', health: 'HEALTHY', latest_test_number: 'ST-D1-H14', latest_test_status: 'CONFORMING', latest_test_time: new Date().toISOString(), open_alerts: 0, rejection_rate: 1.62, molding_line: 'Disamatic D1 (Auto Blocks)' },
  { line_code: 'D2', health: 'CRITICAL', latest_test_number: 'ST-D2-H14', latest_test_status: 'OUT_OF_SPEC', latest_test_time: new Date().toISOString(), open_alerts: 2, rejection_rate: 4.25, molding_line: 'Disamatic D2 (Transmission)' },
  { line_code: 'D3', health: 'WARNING', latest_test_number: 'ST-D3-H14', latest_test_status: 'WARNING', latest_test_time: new Date().toISOString(), open_alerts: 0, rejection_rate: 2.30, molding_line: 'Disamatic D3 (Hydraulics)' },
  { line_code: 'D4', health: 'HEALTHY', latest_test_number: 'ST-D4-H14', latest_test_status: 'CONFORMING', latest_test_time: new Date().toISOString(), open_alerts: 0, rejection_rate: 1.45, molding_line: 'Disamatic D4 (Commercial)' },
];

export const mockRejectionTrends = [
  { date: '2026-11-10', D1: 1.8, D2: 2.1, D3: 1.9, D4: 1.5 },
  { date: '2026-11-11', D1: 1.6, D2: 2.4, D3: 2.0, D4: 1.4 },
  { date: '2026-11-12', D1: 1.7, D2: 3.8, D3: 2.1, D4: 1.6 },
  { date: '2026-11-13', D1: 1.5, D2: 5.6, D3: 2.2, D4: 1.5 },
  { date: '2026-11-14', D1: 1.6, D2: 6.2, D3: 2.0, D4: 1.4 },
  { date: '2026-11-15', D1: 1.8, D2: 4.9, D3: 2.1, D4: 1.5 },
  { date: '2026-11-16', D1: 1.7, D2: 3.2, D3: 2.3, D4: 1.6 },
  { date: '2026-11-17', D1: 1.6, D2: 2.5, D3: 2.4, D4: 1.5 },
  { date: '2026-11-18', D1: 1.5, D2: 2.2, D3: 3.9, D4: 1.4 },
  { date: '2026-11-19', D1: 1.6, D2: 2.1, D3: 4.8, D4: 1.5 },
  { date: '2026-11-20', D1: 1.7, D2: 2.0, D3: 4.2, D4: 1.6 },
  { date: '2026-11-21', D1: 1.5, D2: 2.3, D3: 2.8, D4: 1.5 },
  { date: '2026-11-22', D1: 1.6, D2: 2.4, D3: 2.2, D4: 1.4 },
  { date: '2026-11-23', D1: 1.6, D2: 2.5, D3: 2.1, D4: 1.4 },
];

export const mockAlerts: QualityAlert[] = [
  { id: 101, alert_code: 'ALT-101', line_code: 'D2', severity: 'CRITICAL', alert_type: 'SPEC_LIMIT_HIGH', parameter_name: 'Moisture Content', parameter_code: 'MOISTURE', description: 'Moisture 3.95% exceeds USL (3.70%) on Line D2. High risk of steam entrapment / porosity.', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'OPEN' },
  { id: 102, alert_code: 'ALT-102', line_code: 'D2', severity: 'WARNING', alert_type: 'NELSON_RULE_2', parameter_name: 'Moisture Content', parameter_code: 'MOISTURE', description: 'Nelson Rule 2 triggered: 9 consecutive points on one side of center line on Line D2.', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'OPEN' },
  { id: 103, alert_code: 'ALT-103', line_code: 'D3', severity: 'WARNING', alert_type: 'SPEC_LIMIT_LOW', parameter_name: 'Permeability', parameter_code: 'PERM', description: 'Permeability 112 below LSL (115) on Line D3. Check fines/dust extraction.', timestamp: new Date(Date.now() - 18000000).toISOString(), status: 'ACKNOWLEDGED', acknowledged_by_name: 'Anand Verma', resolution_notes: 'Increased new silica sand addition to muller by 12%.' },
];

export const mockParetoData: ParetoResponse = {
  line_code: 'ALL',
  total_rejected: 482,
  defects_count: 8,
  items: [
    { defect_id: 1, defect_code: 'POROSITY', defect_name: 'Gas Porosity / Pinholes', rejected_qty: 215, percentage: 44.6, cumulative_percentage: 44.6 },
    { defect_id: 2, defect_code: 'BLOWHOLE', defect_name: 'Blowholes', rejected_qty: 124, percentage: 25.7, cumulative_percentage: 70.3 },
    { defect_id: 3, defect_code: 'SAND_INCLUSION', defect_name: 'Sand Wash & Inclusions', rejected_qty: 62, percentage: 12.9, cumulative_percentage: 83.2 },
    { defect_id: 4, defect_code: 'SCABBING', defect_name: 'Expansion Scabs & Rat-tails', rejected_qty: 34, percentage: 7.1, cumulative_percentage: 90.2 },
    { defect_id: 5, defect_code: 'MISMATCH', defect_name: 'Mold Mismatch / Shift', rejected_qty: 21, percentage: 4.4, cumulative_percentage: 94.6 },
    { defect_id: 6, defect_code: 'COLD_SHUT', defect_name: 'Cold Shut / Misrun', rejected_qty: 14, percentage: 2.9, cumulative_percentage: 97.5 },
    { defect_id: 7, defect_code: 'SHRINKAGE', defect_name: 'Shrinkage Cavity', rejected_qty: 8, percentage: 1.7, cumulative_percentage: 99.2 },
    { defect_id: 8, defect_code: 'SURFACE_DEFECT', defect_name: 'Surface Roughness / Burn-in', rejected_qty: 4, percentage: 0.8, cumulative_percentage: 100.0 },
  ]
};

export const mockIMRData: IMRChartData = {
  chart_type: 'I-MR',
  parameter_code: 'MOISTURE',
  parameter_name: 'Moisture Content',
  unit: '%',
  line_code: 'D1',
  sample_size: 24,
  mean: 3.42,
  mean_mr: 0.12,
  sigma_within: 0.106,
  sigma_overall: 0.114,
  is_stable: false,
  violations_count: 3,
  lsl: 3.10,
  usl: 3.70,
  i_chart: {
    cl: 3.42,
    ucl: 3.74,
    lcl: 3.10,
    zone_1s_upper: 3.53,
    zone_2s_upper: 3.63,
    zone_1s_lower: 3.31,
    zone_2s_lower: 3.21
  },
  mr_chart: { cl: 0.12, ucl: 0.39, lcl: 0.0 },
  points: Array.from({ length: 24 }).map((_, i) => {
    const val = i === 18 ? 3.82 : i === 19 ? 3.88 : (3.32 + (i % 5) * 0.04);
    const isOut = val > 3.74 || val < 3.10;
    return {
      index: i + 1,
      timestamp: `H${String(i).padStart(2, '0')}:00`,
      value: Number(val.toFixed(2)),
      mr: i === 0 ? 0 : Number((Math.abs(val - 3.40)).toFixed(2)),
      cl: 3.42,
      ucl: 3.74,
      lcl: 3.10,
      lsl: 3.10,
      usl: 3.70,
      is_out_of_control: isOut,
      violations: isOut ? ['Nelson Rule 1 (Point > 3σ)'] : [],
      spec_status: isOut ? 'OUT_OF_SPEC' : 'IN_SPEC'
    };
  })
};

export const mockProcessCapability: ProcessCapabilityData = {
  parameter_code: 'MOISTURE',
  parameter_name: 'Moisture Content',
  unit: '%',
  can_calculate: true,
  mean: 3.42,
  target: 3.40,
  lsl: 3.10,
  usl: 3.70,
  sample_size: 240,
  sigma_within: 0.106,
  sigma_overall: 0.114,
  cp: 0.94,
  cpk: 0.88,
  pp: 0.88,
  ppk: 0.82,
  assessment: 'Inadequate (High Scrap Risk)',
  ppm_total: 4210,
  is_stable: false,
  warnings: ['Process is not statistically stable (Nelson rule triggers present)', 'Cpk < 1.33 does not meet automotive IATF 16949 capability benchmark']
};

export const mockSandTests: SandTestRecord[] = Array.from({ length: 15 }).map((_, i) => ({
  id: 1000 + i,
  test_number: `ST-D${(i % 4) + 1}-20261123-H${String(14 - i).padStart(2, '0')}`,
  line_code: `D${(i % 4) + 1}`,
  test_type: 'HOURLY_PHYSICAL',
  test_date: '2026-11-23',
  shift: (i % 3) + 1,
  test_hour: 14 - i,
  timestamp: new Date(Date.now() - i * 3600000).toISOString(),
  batch_number: `BAT-D${(i % 4) + 1}-20261123-S${(i % 3) + 1}`,
  status: i === 2 ? 'OUT_OF_SPEC' : (i === 5 ? 'WARNING' : 'CONFORMING'),
  notes: 'Regular hourly green sand sample check',
  operator_name: 'Ramesh Kumar',
  values: [
    { id: 10 + i, parameter_id: 1, parameter_code: 'MOISTURE', parameter_name: 'Moisture', measured_value: i === 2 ? 3.85 : 3.38, unit: '%', status: i === 2 ? 'OUT_OF_SPEC' : 'OK', is_corrected: false },
    { id: 20 + i, parameter_id: 2, parameter_code: 'COMPACT', parameter_name: 'Compactability', measured_value: 42.5, unit: '%', status: 'OK', is_corrected: false },
    { id: 30 + i, parameter_id: 3, parameter_code: 'GCS', parameter_name: 'Green Compression Strength', measured_value: 16.8, unit: 'N/cm²', status: 'OK', is_corrected: false },
    { id: 40 + i, parameter_id: 4, parameter_code: 'PERM', parameter_name: 'Permeability', measured_value: 138.0, unit: 'Perm No.', status: 'OK', is_corrected: false },
  ]
}));

export const mockRejections: RejectionRecord[] = Array.from({ length: 10 }).map((_, i) => ({
  id: 500 + i,
  rejection_number: `REJ-D${(i % 4) + 1}-20261123-0${i + 1}`,
  production_date: '2026-11-23',
  line_code: `D${(i % 4) + 1}`,
  shift: (i % 3) + 1,
  product_name: 'Cylinder Block V6',
  defect_code: i % 2 === 0 ? 'POROSITY' : 'BLOWHOLE',
  defect_name: i % 2 === 0 ? 'Gas Porosity / Pinholes' : 'Blowholes',
  rejected_qty: 12 + i * 3,
  inspected_qty: 500,
  rejection_rate: Number(((12 + i * 3) / 5).toFixed(2)),
  detection_stage: 'Shotblast Inspection',
  severity: i === 0 ? 'CRITICAL' : 'MAJOR',
  status: 'RECORDED',
  timestamp: new Date(Date.now() - i * 7200000).toISOString()
}));

export const mockComplaints: CustomerComplaint[] = [
  {
    id: 1,
    complaint_number: 'CMP-2026-081',
    customer_name: 'TurboMotors India Ltd',
    received_date: '2026-11-12',
    product_name: 'Cylinder Block V6',
    defect_name: 'Gas Porosity / Pinholes',
    batch_number: 'BAT-D1-RECENT',
    line_code: 'D1',
    affected_qty: 14,
    severity: 'HIGH',
    status: 'UNDER_INVESTIGATION',
    description: 'Sub-surface gas porosity unveiled during finish face-milling of engine deck surface. Caused cutter tool chatter and pressure test leakage.',
    d1_team: 'P. Sundaram (Quality Lead), A. Verma (Foundry Incharge), S. Ghosh (Tooling Eng)',
    d2_problem: 'Finish face-milling revealed spherical porosity clusters on top deck of Cylinder Block V6.',
    d3_containment: '100% sonic inspection applied to warehouse stock of 420 blocks. 14 suspect blocks quarantined.',
    d4_root_cause: 'Correlation analysis confirmed moisture excursion to 3.78% combined with delayed core venting.',
    d5_corrective_action: 'Calibrated automated sand muller water moisture sensor. Added extra vent relief plugs to core box.',
    d6_validation: 'Zero porosity observed across next 3 production batches (N=1,200 blocks leak tested OK).',
    d7_preventive_action: 'Integrated real-time automated SPC alert directly into muller PLC moisture bypass loop.',
    d8_closure: 'Pending signoff by TurboMotors SQA Lead.',
    responsible_person: 'Dr. Priya Sundaram',
    due_date: '2026-11-30'
  }
];

export const mockCorrelation: CorrelationAnalysis = {
  line_code: 'D2',
  parameter_code: 'MOISTURE',
  parameter_name: 'Moisture Content',
  defect_code: 'POROSITY',
  defect_name: 'Gas Porosity / Pinholes',
  parameter_unit: '%',
  lag_hours: 12,
  sample_size: 84,
  has_sufficient_data: true,
  pearson_r: 0.78,
  pearson_p_value: 0.0001,
  spearman_rho: 0.81,
  spearman_p_value: 0.0001,
  relationship_strength: 'STRONG',
  is_statistically_significant: true,
  group_comparison: {
    high_or_ooc_count: 14,
    normal_count: 70,
    mean_rejection_high_group: 5.8,
    mean_rejection_normal_group: 1.7,
    rejection_ratio: 3.42,
    group_p_value: 0.0001
  },
  insight: 'High positive correlation (r=0.78, p<0.001) observed between sand moisture content and downstream casting gas porosity at 12-hour process lag. When moisture exceeds USL (3.70%), porosity rejection risk increases by 3.4x.',
  scatter_points: Array.from({ length: 40 }).map((_, i) => {
    const x = 3.15 + (i * 0.018);
    const y = 1.0 + Math.pow(x - 3.1, 2) * 8.5 + ((i % 4) * 0.3);
    return {
      x_sand: Number(x.toFixed(2)),
      y_rejection: Number(y.toFixed(2)),
      is_out_of_spec: x > 3.70
    };
  })
};
