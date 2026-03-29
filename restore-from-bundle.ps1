# Re-splits PROJECT_ALL_FILES.txt into this repo. Run from next-specduel/: .\restore-from-bundle.ps1
$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$bundle = Join-Path $root "PROJECT_ALL_FILES.txt"
if (-not (Test-Path $bundle)) { throw "Missing $bundle" }
$lines = [System.IO.File]::ReadAllLines($bundle)
$sep = "################################################################################"
$i = 0
$n = $lines.Length
while ($i -lt $n) {
  if ($lines[$i] -eq $sep -and $i + 2 -lt $n -and $lines[$i + 1] -match '^#\s*FILE:\s*(.+)$') {
    $rel = ($matches[1].Trim()) -replace '\\', '/'
    $i += 2
    if ($i -lt $n -and $lines[$i] -eq $sep) { $i++ }
    while ($i -lt $n -and [string]::IsNullOrWhiteSpace($lines[$i])) { $i++ }
    $body = New-Object System.Collections.Generic.List[string]
    while ($i -lt $n -and $lines[$i] -ne $sep) {
      [void]$body.Add($lines[$i])
      $i++
    }
    while ($body.Count -gt 0 -and [string]::IsNullOrWhiteSpace($body[$body.Count - 1])) {
      $body.RemoveAt($body.Count - 1)
    }
    $outPath = Join-Path $root ($rel -replace '/', [IO.Path]::DirectorySeparatorChar)
    $dir = Split-Path $outPath -Parent
    if ($dir -and -not (Test-Path $dir)) {
      New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    [System.IO.File]::WriteAllText($outPath, (($body -join "`n") + "`n"), [System.Text.UTF8Encoding]::new($false))
    Write-Host "Wrote $rel"
    continue
  }
  $i++
}
Write-Host "Done."
