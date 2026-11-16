$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
if (-not (Test-Path -LiteralPath 'dist/index.html')) {
    throw 'Build first with npm run export:scripts and npm run build.'
}
node tools/serve-local.mjs
