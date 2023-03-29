Remove-Job -Name RamFrontend -Force -ErrorAction SilentlyContinue
Remove-Job -Name RamBackend -Force -ErrorAction SilentlyContinue

try {
    docker build -f ram-infra/Dockerfile -t ram:local --target local .
    docker container rm -f ram-local
    docker run -d `
        --name ram-local `
        -p 5432:5432,9000:9000,9001:9001 `
        --env PGPASSWORD=password `
        ram:local

    Start-Job -Name RamFrontend -ScriptBlock {
        Set-Location ram-front
        yarn
        yarn dev
    }

    Start-Job -Name RamBackend -ScriptBlock {
        Set-Location ram-back
        yarn
        yarn start:dev
    }


    Start-Sleep -Seconds 3
    Receive-Job -Name RamFrontend
    Receive-Job -Name RamBackend -Wait
}
catch {

}
finally {
    Remove-Job -Name RamFrontend -Force -ErrorAction SilentlyContinue
    Remove-Job -Name RamBackend -Force -ErrorAction SilentlyContinue
}