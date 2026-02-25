export const DEPARTMENTS = [
  'IT', 'การตลาด', 'HR', 'การเงิน', 'บัญชี',
  'ปฏิบัติการ', 'ขาย', 'วิศวกรรม', 'กฎหมาย', 'จัดซื้อ', 'อื่นๆ'
]

export const POSITIONS: Record<string, string[]> = {
  'IT':         ['Developer', 'System Administrator', 'IT Manager', 'DevOps Engineer', 'QA Engineer', 'UX/UI Designer'],
  'การตลาด':   ['Marketing Manager', 'Marketing Officer', 'Content Creator', 'Digital Marketing Specialist'],
  'HR':         ['HR Manager', 'HR Officer', 'Recruiter', 'Training & Development Officer'],
  'การเงิน':   ['Finance Manager', 'Finance Officer', 'Financial Analyst'],
  'บัญชี':     ['Chief Accountant', 'Accountant', 'Accounts Payable', 'Accounts Receivable'],
  'ปฏิบัติการ': ['Operations Manager', 'Operations Officer', 'Logistics Officer'],
  'ขาย':       ['Sales Manager', 'Sales Representative', 'Account Executive'],
  'วิศวกรรม':  ['Engineering Manager', 'Engineer', 'Technician'],
  'กฎหมาย':   ['Legal Counsel', 'Legal Officer'],
  'จัดซื้อ':   ['Procurement Manager', 'Procurement Officer'],
  'อื่นๆ':     []
}

export const GENDERS = [
  { value: 'male',   label: 'ชาย' },
  { value: 'female', label: 'หญิง' },
  { value: 'other',  label: 'ไม่ระบุ' }
]

export const useEmployeeOptions = () => {
  const selectedDept = ref('')
  const positions = computed(() => POSITIONS[selectedDept.value] || [])
  return { departments: DEPARTMENTS, positions, selectedDept, genders: GENDERS }
}
