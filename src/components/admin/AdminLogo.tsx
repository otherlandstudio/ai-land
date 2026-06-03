/**
 * AdminLogo — заміна вордмарку Payload в адмінці.
 */
export const AdminLogo = () => (
  <div
    style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: 700,
      fontSize: 22,
      letterSpacing: '-0.02em',
      color: 'var(--theme-text)',
    }}
  >
    AI Land
    <span style={{ opacity: 0.5, marginLeft: 8 }}>CMS</span>
  </div>
)
