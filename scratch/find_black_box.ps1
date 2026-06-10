Add-Type -AssemblyName System.Drawing
Set-Variable -Name Path -Value "c:\Users\mieh\True Years GmbH\TY - Dokumente\RAG True Years\05 IT\Prototyp Antigravity\TY Prototyp\public\images\pace_of_aging_orig.png"
Set-Variable -Name bmp -Value (New-Object System.Drawing.Bitmap (Get-Variable -Name Path -ValueOnly))

Set-Variable -Name minX -Value 1024
Set-Variable -Name maxX -Value 0
Set-Variable -Name minY -Value 1024
Set-Variable -Name maxY -Value 0

# Scan the region X=[300, 720], Y=[680, 850] for dark pixels of the box
for (Set-Variable -Name x -Value 300; (Get-Variable -Name x -ValueOnly) -le 720; Set-Variable -Name x -Value ((Get-Variable -Name x -ValueOnly) + 1)) {
    for (Set-Variable -Name y -Value 680; (Get-Variable -Name y -ValueOnly) -le 850; Set-Variable -Name y -Value ((Get-Variable -Name y -ValueOnly) + 1)) {
        Set-Variable -Name c -Value ((Get-Variable -Name bmp -ValueOnly).GetPixel((Get-Variable -Name x -ValueOnly), (Get-Variable -Name y -ValueOnly)))
        # A pixel is considered black if R, G, and B are all < 40
        if (((Get-Variable -Name c -ValueOnly).R -lt 40) -and ((Get-Variable -Name c -ValueOnly).G -lt 40) -and ((Get-Variable -Name c -ValueOnly).B -lt 40)) {
            if ((Get-Variable -Name x -ValueOnly) -lt (Get-Variable -Name minX -ValueOnly)) { Set-Variable -Name minX -Value (Get-Variable -Name x -ValueOnly) }
            if ((Get-Variable -Name x -ValueOnly) -gt (Get-Variable -Name maxX -ValueOnly)) { Set-Variable -Name maxX -Value (Get-Variable -Name x -ValueOnly) }
            if ((Get-Variable -Name y -ValueOnly) -lt (Get-Variable -Name minY -ValueOnly)) { Set-Variable -Name minY -Value (Get-Variable -Name y -ValueOnly) }
            if ((Get-Variable -Name y -ValueOnly) -gt (Get-Variable -Name maxY -ValueOnly)) { Set-Variable -Name maxY -Value (Get-Variable -Name y -ValueOnly) }
        }
    }
}

Write-Output ("Detected Dark Box Bounding Box: X=[{0}, {1}], Y=[{2}, {3}]" -f (Get-Variable -Name minX -ValueOnly), (Get-Variable -Name maxX -ValueOnly), (Get-Variable -Name minY -ValueOnly), (Get-Variable -Name maxY -ValueOnly))

(Get-Variable -Name bmp -ValueOnly).Dispose()
