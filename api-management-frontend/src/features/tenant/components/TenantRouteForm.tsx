import { useState, type FormEvent } from 'react'
import type {
  HeaderRule,
  RouteInput,
  TenantRoute,
} from '../services/tenantService'

type TenantRouteFormProps = {
  route: TenantRoute | null
  organizationSlug: string
  isSaving: boolean
  errorMessage: string
  onCancel: () => void
  onSave: (input: RouteInput) => Promise<boolean>
}

type EditableHeaderRule = Omit<HeaderRule, 'id'>

const httpMethods = [
  'GET',
  'HEAD',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'OPTIONS',
  'TRACE',
]

function getInitialHeaderRules(route: TenantRoute | null): EditableHeaderRule[] {
  return route?.headerRules.map(({ direction, action, headerName, headerValue }) => ({
    direction,
    action,
    headerName,
    headerValue,
  })) ?? []
}

export function TenantRouteForm({
  route,
  organizationSlug,
  isSaving,
  errorMessage,
  onCancel,
  onSave,
}: TenantRouteFormProps) {
  const [routeId, setRouteId] = useState(route?.routeId ?? '')
  const [name, setName] = useState(route?.name ?? '')
  const [pathPattern, setPathPattern] = useState(
    route?.pathPattern ?? `/${organizationSlug}/`,
  )
  const [targetBaseUrl, setTargetBaseUrl] = useState(
    route?.targetBaseUrl ?? 'http://localhost:8080',
  )
  const [targetPathPrefix, setTargetPathPrefix] = useState(
    route?.targetPathPrefix ?? '/',
  )
  const [requestsPerMinute, setRequestsPerMinute] = useState(
    route?.requestsPerMinute?.toString() ?? '',
  )
  const [responseTimeoutMs, setResponseTimeoutMs] = useState(
    route?.responseTimeoutMs.toString() ?? '5000',
  )
  const [idempotencyEnabled, setIdempotencyEnabled] = useState(
    route?.idempotencyEnabled ?? false,
  )
  const [active, setActive] = useState(route?.active ?? false)
  const [allowedMethods, setAllowedMethods] = useState(
    route?.allowedMethods ?? ['GET'],
  )
  const [headerRules, setHeaderRules] = useState(getInitialHeaderRules(route))
  const [validationMessage, setValidationMessage] = useState('')

  function toggleMethod(method: string) {
    setAllowedMethods((currentMethods) =>
      currentMethods.includes(method)
        ? currentMethods.filter((currentMethod) => currentMethod !== method)
        : [...currentMethods, method],
    )
  }

  function updateHeaderRule(
    index: number,
    field: keyof EditableHeaderRule,
    value: string,
  ) {
    setHeaderRules((currentRules) =>
      currentRules.map((rule, ruleIndex) =>
        ruleIndex === index
          ? {
              ...rule,
              [field]: field === 'headerValue' && value === '' ? null : value,
            }
          : rule,
      ),
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setValidationMessage('')

    if (!routeId.trim() || !name.trim()) {
      setValidationMessage('Route ID and name are required.')
      return
    }

    if (allowedMethods.length === 0) {
      setValidationMessage('Select at least one HTTP method.')
      return
    }

    if (!pathPattern.trim().startsWith(`/${organizationSlug}/`)) {
      setValidationMessage(
        `Path pattern must start with /${organizationSlug}/.`,
      )
      return
    }

    if (!targetPathPrefix.trim().startsWith('/')) {
      setValidationMessage('Target path prefix must start with /.')
      return
    }

    let targetUrl: URL
    try {
      targetUrl = new URL(targetBaseUrl.trim())
    } catch {
      setValidationMessage('Enter a valid HTTP or HTTPS target URL.')
      return
    }

    if (targetUrl.protocol !== 'http:' && targetUrl.protocol !== 'https:') {
      setValidationMessage('Target base URL must use HTTP or HTTPS.')
      return
    }

    if (headerRules.some((rule) => !rule.headerName.trim())) {
      setValidationMessage('Header names are required for every header rule.')
      return
    }

    if (
      headerRules.some(
        (rule) => rule.action === 'ADD' && !rule.headerValue?.trim(),
      )
    ) {
      setValidationMessage('ADD header rules require a header value.')
      return
    }

    const requestLimit = requestsPerMinute ? Number(requestsPerMinute) : null
    const responseTimeout = Number(responseTimeoutMs)
    if (
      (requestLimit !== null &&
        (!Number.isInteger(requestLimit) || requestLimit < 1)) ||
      !Number.isInteger(responseTimeout) ||
      responseTimeout < 1
    ) {
      setValidationMessage(
        'Request limit and response timeout must be whole numbers greater than zero.',
      )
      return
    }

    const input: RouteInput = {
      routeId: routeId.trim(),
      name: name.trim(),
      pathPattern: pathPattern.trim(),
      targetBaseUrl: targetBaseUrl.trim(),
      targetPathPrefix: targetPathPrefix.trim(),
      requestsPerMinute: requestLimit,
      responseTimeoutMs: responseTimeout,
      idempotencyEnabled,
      active,
      allowedMethods,
      headerRules,
    }

    if (await onSave(input)) {
      onCancel()
    }
  }

  return (
    <div className="tenantRouteOverlay">
      <section
        aria-labelledby="routeFormTitle"
        aria-modal="true"
        className="tenantRouteDialog"
        role="dialog"
      >
        <div className="tenantRouteDialogHeader">
          <div>
            <p className="eyebrow">API configuration</p>
            <h2 id="routeFormTitle">{route ? 'Edit route' : 'Create route'}</h2>
          </div>
          <button
            aria-label="Close route form"
            className="dialogCloseButton"
            onClick={onCancel}
            type="button"
          >
            ×
          </button>
        </div>
        <form className="tenantRouteForm" onSubmit={handleSubmit}>
          <div className="tenantRouteFormGrid">
            <label className="tenantField" htmlFor="routeId">
              Route ID
              <input
                autoComplete="off"
                disabled={Boolean(route)}
                id="routeId"
                maxLength={100}
                onChange={(event) => setRouteId(event.target.value)}
                required
                value={routeId}
              />
            </label>
            <label className="tenantField" htmlFor="routeName">
              Name
              <input
                id="routeName"
                maxLength={200}
                onChange={(event) => setName(event.target.value)}
                required
                value={name}
              />
            </label>
            <label className="tenantField" htmlFor="pathPattern">
              Path pattern
              <input
                id="pathPattern"
                maxLength={500}
                onChange={(event) => setPathPattern(event.target.value)}
                placeholder={`/${organizationSlug}/orders/**`}
                required
                value={pathPattern}
              />
            </label>
            <label className="tenantField" htmlFor="targetBaseUrl">
              Target base URL
              <input
                id="targetBaseUrl"
                maxLength={1000}
                onChange={(event) => setTargetBaseUrl(event.target.value)}
                placeholder="https://service.example.com"
                required
                type="url"
                value={targetBaseUrl}
              />
            </label>
            <label className="tenantField" htmlFor="targetPathPrefix">
              Target path prefix
              <input
                id="targetPathPrefix"
                maxLength={500}
                onChange={(event) => setTargetPathPrefix(event.target.value)}
                required
                value={targetPathPrefix}
              />
            </label>
            <label className="tenantField" htmlFor="requestsPerMinute">
              Requests per minute
              <input
                id="requestsPerMinute"
                min={1}
                onChange={(event) => setRequestsPerMinute(event.target.value)}
                placeholder="No limit"
                step={1}
                type="number"
                value={requestsPerMinute}
              />
            </label>
            <label className="tenantField" htmlFor="responseTimeoutMs">
              Response timeout (ms)
              <input
                id="responseTimeoutMs"
                min={1}
                onChange={(event) => setResponseTimeoutMs(event.target.value)}
                required
                step={1}
                type="number"
                value={responseTimeoutMs}
              />
            </label>
          </div>

          <fieldset className="tenantRouteFieldset">
            <legend>Allowed methods</legend>
            <div className="methodOptions">
              {httpMethods.map((method) => (
                <label className="methodOption" key={method}>
                  <input
                    checked={allowedMethods.includes(method)}
                    onChange={() => toggleMethod(method)}
                    type="checkbox"
                  />
                  {method}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="routeOptions">
            <label className="routeOption">
              <input
                checked={idempotencyEnabled}
                onChange={(event) =>
                  setIdempotencyEnabled(event.target.checked)
                }
                type="checkbox"
              />
              Idempotency enabled
            </label>
            <label className="routeOption">
              <input
                checked={active}
                onChange={(event) => setActive(event.target.checked)}
                type="checkbox"
              />
              Route active
            </label>
          </div>

          <div className="headerRulesSection">
            <div className="headerRulesHeading">
              <div>
                <h3>Header rules</h3>
                <p>Optional request or response header changes.</p>
              </div>
              <button
                className="secondaryButton"
                onClick={() =>
                  setHeaderRules((rules) => [
                    ...rules,
                    {
                      direction: 'REQUEST',
                      action: 'ADD',
                      headerName: '',
                      headerValue: '',
                    },
                  ])
                }
                type="button"
              >
                Add rule
              </button>
            </div>
            {headerRules.map((rule, index) => (
              <div className="headerRuleRow" key={`headerRule-${index}`}>
                <label className="tenantField">
                  Direction
                  <select
                    onChange={(event) =>
                      updateHeaderRule(index, 'direction', event.target.value)
                    }
                    value={rule.direction}
                  >
                    <option value="REQUEST">Request</option>
                    <option value="RESPONSE">Response</option>
                  </select>
                </label>
                <label className="tenantField">
                  Action
                  <select
                    onChange={(event) =>
                      updateHeaderRule(index, 'action', event.target.value)
                    }
                    value={rule.action}
                  >
                    <option value="ADD">Add</option>
                    <option value="REMOVE">Remove</option>
                  </select>
                </label>
                <label className="tenantField">
                  Header name
                  <input
                    maxLength={200}
                    onChange={(event) =>
                      updateHeaderRule(index, 'headerName', event.target.value)
                    }
                    required
                    value={rule.headerName}
                  />
                </label>
                {rule.action === 'ADD' && (
                  <label className="tenantField">
                    Header value
                    <input
                      maxLength={2000}
                      onChange={(event) =>
                        updateHeaderRule(
                          index,
                          'headerValue',
                          event.target.value,
                        )
                      }
                      required
                      value={rule.headerValue ?? ''}
                    />
                  </label>
                )}
                <button
                  aria-label={`Remove header rule ${index + 1}`}
                  className="textButton dangerButton removeHeaderRule"
                  onClick={() =>
                    setHeaderRules((rules) =>
                      rules.filter((_, ruleIndex) => ruleIndex !== index),
                    )
                  }
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {(validationMessage || errorMessage) && (
            <p className="tenantNotice tenantError" role="alert">
              {validationMessage || errorMessage}
            </p>
          )}
          <div className="tenantRouteFormActions">
            <button
              className="secondaryButton"
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>
            <button className="primaryButton" disabled={isSaving} type="submit">
              {isSaving ? 'Saving…' : route ? 'Save changes' : 'Create route'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
