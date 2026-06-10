Add-Type -AssemblyName System.Drawing
$imgPath = "c:/Users/mieh/True Years GmbH/TY - Dokumente/RAG True Years/05 IT/Prototyp Antigravity/TY Prototyp/public/images/pace_of_aging_dial2.png"

# Copy unedited version of the gauge to start clean
Copy-Item -Path "C:/Users/mieh/.gemini/antigravity/brain/7b8dbb51-3c97-4f63-88c8-e2ffb1f8905e/pace_dial_edited_1780947898489.png" -Destination $imgPath -Force

$img = [System.Drawing.Bitmap]::FromFile($imgPath)

$xStart = 345
$xEnd = 675
# Start much higher (directly under the ACTIVE label, which ends around Y=621)
$yStart = 625
$yEnd = 885

# Step 1: Smoothly erase the black box and any elements below by interpolating the dial background gradient
for ($y = $yStart; $y -lt $yEnd; $y++) {
    # Sample background color safely to the left and right of the area
    $colorLeft = $img.GetPixel(335, $y)
    $colorRight = $img.GetPixel(685, $y)
    
    $width = $xEnd - $xStart
    for ($x = $xStart; $x -lt $xEnd; $x++) {
        # Linear interpolation factor
        $t = ($x - $xStart) / $width
        
        $r = [Math]::Round($colorLeft.R * (1 - $t) + $colorRight.R * $t)
        $g = [Math]::Round($colorLeft.G * (1 - $t) + $colorRight.G * $t)
        $b = [Math]::Round($colorLeft.B * (1 - $t) + $colorRight.B * $t)
        
        $newColor = [System.Drawing.Color]::FromArgb($r, $g, $b)
        $img.SetPixel($x, $y, $newColor)
    }
}

# Save the polished image
$tempPath = "c:/Users/mieh/True Years GmbH/TY - Dokumente/RAG True Years/05 IT/Prototyp Antigravity/TY Prototyp/public/images/pace_of_aging_dial2_temp.png"
$img.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)

$img.Dispose()

Move-Item -Path $tempPath -Destination $imgPath -Force
Write-Output "Seamless gradient edit completed successfully."
