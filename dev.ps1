$ScriptPath = $MyInvocation.MyCommand.Definition
$ScriptDirectory = Split-Path $ScriptPath

Remove-Job -Name RamFrontend -Force -ErrorAction SilentlyContinue
Remove-Job -Name RamBackend -Force -ErrorAction SilentlyContinue

try {
    Start-Job -Name RamFrontend -ScriptBlock {
        param ( $path )
        Set-Location -Path "$path\ram-front"
        yarn
        yarn dev
    } -ArgumentList $ScriptDirectory

    Start-Job -Name RamBackend -ScriptBlock {
        param ( $path )
        Set-Location -Path "$path\ram-back"
        yarn
        yarn start:dev
    } -ArgumentList $ScriptDirectory


    Start-Sleep -Seconds 3
    Receive-Job -Name RamFrontend
    Receive-Job -Name RamBackend -Wait
}
catch {
    throw $_
}
finally {
    Remove-Job -Name RamFrontend -Force -ErrorAction SilentlyContinue
    Remove-Job -Name RamBackend -Force -ErrorAction SilentlyContinue
}
