export interface CreateVehicleDialogComponent {
  open: () => void
}

export interface VehiclesTableComponent {
  loadData: () => Promise<void>
}
