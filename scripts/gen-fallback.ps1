$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing
$out = Join-Path $PSScriptRoot "..\public\fallback-phone.png"
$bmp = New-Object System.Drawing.Bitmap 400, 480
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(248, 250, 252))
$b = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(226, 232, 240))
$g.FillEllipse($b, 120, 90, 160, 200)
$g.FillRectangle($b, 140, 250, 120, 150)
$p = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(148, 163, 184), 2)
$g.DrawRectangle($p, 32, 32, 336, 416)
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Host "Wrote $out"
