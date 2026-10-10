$outDir = "C:\Users\kanat\Documents\1 PORTFOLIO GERMAN\SalesCRM\screenshots"
New-Item -ItemType Directory -Force $outDir | Out-Null

$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

$pages = @(
    @{ Name = "01_Executive_Dashboard.png"; Url = "http://localhost:5200/?tab=dashboard"; Width = 1550; Height = 1000 },
    @{ Name = "02_Deals_Kanban_Pipeline.png"; Url = "http://localhost:5200/?tab=deals"; Width = 1650; Height = 960 },
    @{ Name = "03_Client_Accounts_Directory.png"; Url = "http://localhost:5200/?tab=clients"; Width = 1550; Height = 960 },
    @{ Name = "04_Sales_Team_Performance.png"; Url = "http://localhost:5200/?tab=team"; Width = 1550; Height = 960 },
    @{ Name = "05_Sales_History_Ledger.png"; Url = "http://localhost:5200/?tab=history"; Width = 1550; Height = 960 },
    @{ Name = "06_Swagger_API_Documentation.png"; Url = "http://localhost:5200/swagger/index.html"; Width = 1550; Height = 960 }
)

foreach ($p in $pages) {
    $outFile = Join-Path $outDir $p.Name
    Write-Host "Capturing $($p.Name) from $($p.Url)..."
    $argStr = "--headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=4000 --window-size=$($p.Width),$($p.Height) --screenshot=""$outFile"" ""$($p.Url)"""
    Start-Process -FilePath $edge -ArgumentList $argStr -Wait
    Start-Sleep -Seconds 1
    if (Test-Path $outFile) {
        Write-Host "Saved $($p.Name) ($((Get-Item $outFile).Length) bytes)" -ForegroundColor Green
    } else {
        Write-Host "Failed to save $($p.Name)" -ForegroundColor Red
    }
}

Get-ChildItem $outDir | Select-Object Name, Length
