Add-Type -AssemblyName System.Drawing

Set-Variable -Name origPath -Value "c:\Users\mieh\True Years GmbH\TY - Dokumente\RAG True Years\05 IT\Prototyp Antigravity\TY Prototyp\public\images\pace_of_aging_orig.png"
Set-Variable -Name outputPath1 -Value "c:\Users\mieh\True Years GmbH\TY - Dokumente\RAG True Years\05 IT\Prototyp Antigravity\TY Prototyp\public\images\pace_of_aging_dial2.png"
Set-Variable -Name outputPath2 -Value "c:\Users\mieh\True Years GmbH\TY - Dokumente\RAG True Years\05 IT\Prototyp Antigravity\TY Prototyp\public\images\pace_of_aging.png"

Set-Variable -Name bmp -Value (New-Object System.Drawing.Bitmap (Get-Variable -Name origPath -ValueOnly))
Set-Variable -Name g -Value ([System.Drawing.Graphics]::FromImage((Get-Variable -Name bmp -ValueOnly)))

# Setup high quality drawing settings
(Get-Variable -Name g -ValueOnly).SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

# Rectangle to cover the black pill and the text below it
# Pill is around X=[400, 630], Y=[710, 795]
# Let's cover X=[380, 644] (width 264), Y=[705, 835] (height 130)
Set-Variable -Name rect -Value (New-Object System.Drawing.Rectangle 380, 705, 264, 130)

# Colors sampled from the dial face background
Set-Variable -Name color1 -Value ([System.Drawing.Color]::FromArgb(226, 229, 233))
Set-Variable -Name color2 -Value ([System.Drawing.Color]::FromArgb(235, 238, 241))
Set-Variable -Name mode -Value ([System.Drawing.Drawing2D.LinearGradientMode]::Vertical)

Set-Variable -Name brush -Value (New-Object System.Drawing.Drawing2D.LinearGradientBrush (Get-Variable -Name rect -ValueOnly), (Get-Variable -Name color1 -ValueOnly), (Get-Variable -Name color2 -ValueOnly), (Get-Variable -Name mode -ValueOnly))

# Fill the rectangle with the smooth gradient
(Get-Variable -Name g -ValueOnly).FillRectangle((Get-Variable -Name brush -ValueOnly), (Get-Variable -Name rect -ValueOnly))

# Save the patched image to both destination paths
(Get-Variable -Name bmp -ValueOnly).Save((Get-Variable -Name outputPath1 -ValueOnly), [System.Drawing.Imaging.ImageFormat]::Png)
(Get-Variable -Name bmp -ValueOnly).Save((Get-Variable -Name outputPath2 -ValueOnly), [System.Drawing.Imaging.ImageFormat]::Png)

# Clean up resources
(Get-Variable -Name brush -ValueOnly).Dispose()
(Get-Variable -Name g -ValueOnly).Dispose()
(Get-Variable -Name bmp -ValueOnly).Dispose()

Write-Output "Image patched and saved successfully!"
