Add-Type -AssemblyName System.Drawing
Set-Variable -Name Path -Value "c:\Users\mieh\True Years GmbH\TY - Dokumente\RAG True Years\05 IT\Prototyp Antigravity\TY Prototyp\public\images\pace_of_aging_orig.png"
Set-Variable -Name bmp -Value (New-Object System.Drawing.Bitmap (Get-Variable -Name Path -ValueOnly))

Write-Output "Grid colors (X, Y):"
for (Set-Variable -Name y -Value 700; (Get-Variable -Name y -ValueOnly) -le 820; Set-Variable -Name y -Value ((Get-Variable -Name y -ValueOnly) + 20)) {
    Set-Variable -Name line -Value ""
    for (Set-Variable -Name x -Value 380; (Get-Variable -Name x -ValueOnly) -le 660; Set-Variable -Name x -Value ((Get-Variable -Name x -ValueOnly) + 40)) {
        Set-Variable -Name c -Value ((Get-Variable -Name bmp -ValueOnly).GetPixel((Get-Variable -Name x -ValueOnly), (Get-Variable -Name y -ValueOnly)))
        Set-Variable -Name line -Value ((Get-Variable -Name line -ValueOnly) + (" ({0},{1}):{2},{3},{4}" -f (Get-Variable -Name x -ValueOnly), (Get-Variable -Name y -ValueOnly), (Get-Variable -Name c -ValueOnly).R, (Get-Variable -Name c -ValueOnly).G, (Get-Variable -Name c -ValueOnly).B))
    }
    Write-Output (Get-Variable -Name line -ValueOnly)
}

(Get-Variable -Name bmp -ValueOnly).Dispose()
