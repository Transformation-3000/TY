Add-Type -AssemblyName System.Drawing
 = "c:\Users\mieh\True Years GmbH\TY - Dokumente\RAG True Years\05 IT\Prototyp Antigravity\TY Prototyp\public\images\pace_of_aging_dial.png"
 = [System.Drawing.Bitmap]::FromFile()
 = [System.Drawing.Graphics]::FromImage()

.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
.TextRenderingHint = [System.Drawing.Text::TextRenderingHint]::AntiAliasGridFit

# Get the exact background color of the pill (near the left edge of the inner pill)
 = .GetPixel(410, 750)
 = New-Object System.Drawing.SolidBrush()

# Draw a rectangle to cover "84 µm/s" inside the pill
# Bounding box is X=[380, 644], Y=[700, 810]
# Inner area to cover is approx X=[400, 630], Y=[710, 795]
.FillRectangle(, 400, 710, 230, 85)

# Setup font and white brush
 = New-Object System.Drawing.Font("Arial", 46, [System.Drawing.FontStyle]::Bold)
 = [System.Drawing.Brushes]::White

# Center the text "-0,5" in the pill
# Pill center is around X=512, Y=755
# We can use MeasureString or manually align it
 = "-0,5"
 = .MeasureString(, )
 = 512 - (.Width / 2)
 = 752 - (.Height / 2)

.DrawString(, , , , )

# Save to a temp file and overwrite original
 = "c:\Users\mieh\True Years GmbH\TY - Dokumente\RAG True Years\05 IT\Prototyp Antigravity\TY Prototyp\public\images\pace_of_aging_dial_temp.png"
.Save(, [System.Drawing.Imaging.ImageFormat]::Png)

.Dispose()
.Dispose()

Move-Item -Path  -Destination  -Force
Write-Output "Image edited successfully."
