Add-Type -AssemblyName System.Drawing

Set-Variable -Name imagePath -Value "c:\Users\mieh\True Years GmbH\TY - Dokumente\RAG True Years\05 IT\Prototyp Antigravity\TY Prototyp\public\images\pace_of_aging_orig.png"

Set-Variable -Name bmp -Value (New-Object System.Drawing.Bitmap (Get-Variable -Name imagePath -ValueOnly))

Write-Output ("Image size: {0} x {1}" -f ((Get-Variable -Name bmp -ValueOnly).Width), ((Get-Variable -Name bmp -ValueOnly).Height))

Write-Output "--- Colors on the left (X=330) ---"
for (Set-Variable -Name y -Value 700; (Get-Variable -Name y -ValueOnly) -le 820; Set-Variable -Name y -Value ((Get-Variable -Name y -ValueOnly) + 10)) {
    Set-Variable -Name c -Value ((Get-Variable -Name bmp -ValueOnly).GetPixel(330, (Get-Variable -Name y -ValueOnly)))
    Write-Output ("Y={0}: R={1}, G={2}, B={3}" -f (Get-Variable -Name y -ValueOnly), (Get-Variable -Name c -ValueOnly).R, (Get-Variable -Name c -ValueOnly).G, (Get-Variable -Name c -ValueOnly).B)
}

Write-Output "--- Colors on the right (X=690) ---"
for (Set-Variable -Name y -Value 700; (Get-Variable -Name y -ValueOnly) -le 820; Set-Variable -Name y -Value ((Get-Variable -Name y -ValueOnly) + 10)) {
    Set-Variable -Name c -Value ((Get-Variable -Name bmp -ValueOnly).GetPixel(690, (Get-Variable -Name y -ValueOnly)))
    Write-Output ("Y={0}: R={1}, G={2}, B={3}" -f (Get-Variable -Name y -ValueOnly), (Get-Variable -Name c -ValueOnly).R, (Get-Variable -Name c -ValueOnly).G, (Get-Variable -Name c -ValueOnly).B)
}

(Get-Variable -Name bmp -ValueOnly).Dispose()
