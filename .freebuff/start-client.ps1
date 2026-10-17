$logFile = "D:\fsd project\.freebuff\client.log"
$logErrFile = "D:\fsd project\.freebuff\client.log.err"
$pidFile = "D:\fsd project\.freebuff\client.pid"

$p = Start-Process -FilePath "npm.cmd" -ArgumentList "run","dev" -WorkingDirectory "D:\fsd project\client" -RedirectStandardOutput $logFile -RedirectStandardError $logErrFile -WindowStyle Hidden -PassThru
$p.Id | Out-File -FilePath $pidFile -NoNewline
Write-Output $p.Id
