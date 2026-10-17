$logFile = "D:\fsd project\.freebuff\server.log"
$logErrFile = "D:\fsd project\.freebuff\server.log.err"
$pidFile = "D:\fsd project\.freebuff\server.pid"

$p = Start-Process -FilePath "node.exe" -ArgumentList "start-dev.js" -WorkingDirectory "D:\fsd project\server" -RedirectStandardOutput $logFile -RedirectStandardError $logErrFile -WindowStyle Hidden -PassThru
$p.Id | Out-File -FilePath $pidFile -NoNewline
Write-Output $p.Id
