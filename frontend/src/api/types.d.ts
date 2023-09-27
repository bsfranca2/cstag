interface AccountDto {
  companyName: string
  companyCNPJ: string
  role: string
  headquarterCNPJ: string | null
  headquarterName: string | null
}

interface TokenDto {
  token: string
}

interface LoginCredentialsDto {
  cnpj: string
  password: string
}

interface TollPlazaPeriodDto extends PeriodDto {
  id: number
  status: string
}

interface PeriodDto {
  startOfPeriod: string
  endOfPeriod?: string
}

interface VehicleDto {
  licensePlate: string
  brand?: string
  description?: string
  model?: string
  year?: number
  axlesRegistries: AxlesRegistryDto[]
  clientRegistries: VehicleClientRegistryDto[]
}

interface AxlesRegistryDto {
  id: number
  total: number
  suspended: number
  startOfPeriod: string
  endOfPeriod: string
}

interface VehicleClientRegistryDto {
  id: number
  segment?: string
  client?: string
  group?: string
  subgroup?: string
  startOfPeriod: string
  endOfPeriod?: string
}

interface InvoiceDto {
  number: number
  issueDate: string
  operatorCompany: string
  progress: ProgressDto
}

interface ProgressDto {
  isDone: boolean
  percentage: number
}

interface TollTicketAnalysisFilterDto {
  q: string
  licensePlate?: string
  type?: string
  invoiceNumber?: number
  startOfPeriod?: string
  endOfPeriod?: string
  operatorCompany?: string
  tollTicketType?: string
}

interface CreditAndDebitAnalysisFilterDto {
  q: string
  licensePlate?: string
  type?: string
  startOfPeriod?: string
  endOfPeriod?: string
  trip?: string
}

interface SearchResultDto<T> {
  offset: number
  limit: number
  hits: number
  list: Array<T>
}

interface TollTicketAnalysisSearchDto {
  analysisId: number
  licensePlate: string
  type?: string
  highway: string
  fare: number
  paidAt: number
  category: number
  tollPlazaHighway?: string
  tollPlazaValue?: number
  axlesTotal?: number
  axlesSuspended?: number
  operatorCompany: string
  invoiceNumber: number
  shippingCompanyCNPJ: string
  tollTicketType: string
}

interface PaginateDto {
  perPage: number
  page: number
}

interface CreditAndDebitAnalysisDto {
  trip: string
  differenceOfValue: number
  totalOfCredit: number
  totalOfDebit: number
  divergence?: CreditAndDebitAnalysisDivergence
}

interface CreditAndDebitAnalysisDivergence {
  type: string
  status: string
}

interface MonthlyPaymentDto {
  licensePlate?: string
  category?: number
  january?: number
  february?: number
  march?: number
  april?: number
  may?: number
  june?: number
  july?: number
  august?: number
  september?: number
  october?: number
  november?: number
  december?: number
}

interface TollTicketAnalysisDto {
  id: number
  paidAt: string
  highway: string
  fare: number
  tag?: string
  licensePlate: string
  category: number
  operatorCompany: string
  tollPlazaDescription?: string
  tollPlazaCategory?: number
  tollPlazaAssociateCompany?: string
  tollPlazaStartOfPeriod?: string
  tollPlazaEndOfPeriod?: string
  tollPlazaEntryId?: number
  tollPlazaValue?: number
  vehicleLicensePlate?: string
  vehicleBrand?: string
  vehicleTotal?: number
  vehicleSuspended?: number
  vehicleStartOfPeriod?: string
  vehicleEndOfPeriod?: string
}
