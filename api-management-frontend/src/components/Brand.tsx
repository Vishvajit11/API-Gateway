type BrandProps = {
  showServiceName?: boolean
}

export function Brand({ showServiceName = false }: BrandProps) {
  return (
    <div className="brand">
      <span className="brandMark" aria-hidden="true">
        A
      </span>
      {showServiceName && <span>API Management Service</span>}
    </div>
  )
}
