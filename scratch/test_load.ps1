Add-Type -AssemblyName System.Drawing
try {
    Set-Variable -Name resolvedPath -Value ((Resolve-Path "public/images/pace_of_aging_orig.png").Path)
    Write-Output ("Resolved Path: {0}" -f (Get-Variable -Name resolvedPath -ValueOnly))
    Set-Variable -Name bmp -Value (New-Object System.Drawing.Bitmap (Get-Variable -Name resolvedPath -ValueOnly))
    Write-Output ("Successfully loaded! Width: {0}, Height: {1}" -f (Get-Variable -Name bmp -ValueOnly).Width, (Get-Variable -Name bmp -ValueOnly).Height)
    (Get-Variable -Name bmp -ValueOnly).Dispose()
} catch {
    Write-Output ("Error occurred: {0}" -f $_.Exception.Message)
}
