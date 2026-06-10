Add-Type -AssemblyName System.Drawing
Set-Variable -Name Path -Value "c:\Users\mieh\True Years GmbH\TY - Dokumente\RAG True Years\05 IT\Prototyp Antigravity\TY Prototyp\public\images\pace_of_aging_orig.png"
Set-Variable -Name bmp -Value (New-Object System.Drawing.Bitmap (Get-Variable -Name Path -ValueOnly))

Write-Output "Scanning vertical line X=512 from Y=650 to Y=950:"
for (Set-Variable -Name y -Value 650; (Get-Variable -Name y -ValueOnly) -le 950; Set-Variable -Name y -Value ((Get-Variable -Name y -ValueOnly) + 10)) {
    Set-Variable -Name c -Value ((Get-Variable -Name bmp -ValueOnly).GetPixel(512, (Get-Variable -Name y -ValueOnly)))
    Write-Output ("Y={0}: R={1}, G={2}, B={3}" -f (Get-Variable -Name y -ValueOnly), (Get-Variable -Name c -ValueOnly).R, (Get-Variable -Name c -ValueOnly).G, (Get-Variable -Name c -ValueOnly).B)
}

(Get-Variable -Name bmp -ValueOnly).Dispose()
