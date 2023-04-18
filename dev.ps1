$ScriptPath = $MyInvocation.MyCommand.Definition
$ScriptDirectory = Split-Path $ScriptPath

Remove-Job -Name RamFrontend -Force -ErrorAction SilentlyContinue
Remove-Job -Name RamBackend -Force -ErrorAction SilentlyContinue

try {
    docker build -f ram-infra/Dockerfile -t ram:local --target local .
    if ($LASTEXITCODE -ne 0) {
        throw "Docker build failed"
    }

    docker container rm -f ram-local | Out-Null

    docker run -d `
        --name ram-local `
        -p 5432:5432 `
        -p 9000:9000 `
        -p 9001:9001 `
        --env PGPASSWORD=password `
        ram:local
    if ($LASTEXITCODE -ne 0) {
        throw "Docker run failed"
    }

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
