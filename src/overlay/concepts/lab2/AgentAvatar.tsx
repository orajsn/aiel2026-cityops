/**
 * The AI agent's own picture (owner, 29 Oct: the hard-hat figure "is not the profile picture of the AI agent").
 * Not a person: a rounded teal head with a visor and two light eyes, an antenna, and a small neural network on its
 * chest, the same 2-3-2 net that stands for the language model. Used wherever the agent appears in Lab 2.
 */
export function AgentAvatar({ size = 96, label = 'AI Agent', live = false }: { size?: number; label?: string; live?: boolean }) {
  return (
    <svg data-figure="ai-agent" role="img" aria-label={label} width={size} height={size} viewBox="0 0 120 120" style={{ flex: 'none' }}>
      <circle cx="60" cy="60" r="58" fill="rgba(27,138,156,0.10)" stroke="rgba(27,138,156,0.85)" strokeWidth="3" />
      {/* antenna */}
      <path d="M60 14v12" stroke="#146f7f" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="12" r="5" fill="#1b8a9c">
        {live && <animate attributeName="opacity" values="1;0.35;1" dur="1.6s" repeatCount="indefinite" />}
      </circle>
      {/* head */}
      <rect x="30" y="26" width="60" height="44" rx="14" fill="#1b8a9c" />
      <rect x="78" y="26" width="12" height="44" rx="6" fill="#146f7f" />
      <rect x="22" y="40" width="8" height="16" rx="3" fill="#146f7f" />
      <rect x="90" y="40" width="8" height="16" rx="3" fill="#146f7f" />
      {/* visor and eyes */}
      <rect x="38" y="36" width="44" height="22" rx="11" fill="#e9f4f6" />
      <circle cx="50" cy="47" r="4.5" fill="#146f7f" />
      <circle cx="70" cy="47" r="4.5" fill="#146f7f" />
      {/* body with the small network */}
      <path d="M28 120c0-26 14-42 32-42s32 16 32 42z" fill="#4a5560" />
      <rect x="44" y="84" width="32" height="26" rx="6" fill="#e9f4f6" />
      <g stroke="#1b8a9c" strokeWidth="1.6">
        <path d="M50 91l10-3M50 91l10 6M50 103l10-6M50 103l10 6M60 88l10 3M60 97l10-6M60 97l10 6M60 109l10-6" />
      </g>
      {[[50, 91], [50, 103], [60, 88], [60, 97], [60, 109], [70, 91], [70, 103]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" fill="#1b8a9c" />
      ))}
    </svg>
  );
}
