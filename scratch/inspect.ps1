Add-Type -AssemblyName System.Drawing
$imagePath = "c:\Users\mieh\True Years GmbH\TY - Dokumente\RAG True Years\05 IT\Prototyp Antigravity\TY Prototyp\public\images\pace_of_aging_orig.png"
$bmp = New-Object System.Drawing.Bitmap($imagePath)

Write-Output ("Image size: {0} x {1}" -f $bmp.Width, $bmp.Height)

Write-Output "--- Colors on the left (X=330) ---"
for ($y = 700; $y -le 820; $y += 10) {
    $c = $bmp.GetPixel(330, $y)
    Write-Output ("Y={0}: R={1}, G={2}, B={3}" -f $y, $c.R, $c.G, $c.B)
}

Write-Output "--- Colors on the right (X=690) ---"
for ($y = 700; $y -le 820; $y += 10) {
    $c = $bmp.GetPixel(690, $y)
    Write-Output ("Y={0}: R={1}, G={2}, B={3}" -f $y, $c.R, $c.G, $c.B)
}

$bmp.Dispose()
