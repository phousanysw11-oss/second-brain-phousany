param([string]$Destination = (Get-Location).Path, [string]$Archive)
$ErrorActionPreference = 'Stop'
$expected = '4a58257b63ae4ac65b7e8e2eedd51a79edfc1f77556d00048b5a51e199fa09e7'
$url = 'https://raw.githubusercontent.com/phousanysw11-oss/second-brain-phousany/main/MY_SECOND_BRAIN.zip'
$scratch = Join-Path ([IO.Path]::GetTempPath()) ('second-brain-' + [Guid]::NewGuid().ToString('N'))
[IO.Directory]::CreateDirectory($scratch) | Out-Null
try {
    if (!$Archive) {
        $Archive = Join-Path $scratch 'MY_SECOND_BRAIN.zip'
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        $client = [Net.WebClient]::new()
        try { $client.DownloadFile($url, $Archive) } finally { $client.Dispose() }
    }
    $Archive = [IO.Path]::GetFullPath($Archive)
    $sha = [Security.Cryptography.SHA256]::Create()
    try { $actual = ([BitConverter]::ToString($sha.ComputeHash([IO.File]::ReadAllBytes($Archive)))).Replace('-','').ToLowerInvariant() } finally { $sha.Dispose() }
    if ($actual -ne $expected) {
        throw 'Package checksum mismatch. Nothing installed. Fetch INSTALL.md and the matching installer again.'
    }
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $zip = [IO.Compression.ZipFile]::OpenRead($Archive)
    try {
        $reader = [IO.StreamReader]::new($zip.GetEntry('install.ps1').Open())
        try { $code = $reader.ReadToEnd() } finally { $reader.Dispose() }
    } finally { $zip.Dispose() }
    # Exact archive bytes were checked before reading this reviewed local installer.
    & ([scriptblock]::Create($code)) -Archive $Archive -Destination ([IO.Path]::GetFullPath($Destination))
} finally {
    $resolvedScratch = [IO.Path]::GetFullPath($scratch)
    $tempRoot = [IO.Path]::GetFullPath([IO.Path]::GetTempPath()).TrimEnd('\','/') + [IO.Path]::DirectorySeparatorChar
    if ($resolvedScratch.StartsWith($tempRoot, [StringComparison]::OrdinalIgnoreCase) -and
        [IO.Path]::GetFileName($resolvedScratch) -match '^second-brain-[a-f0-9]{32}$') {
        Remove-Item -LiteralPath $resolvedScratch -Recurse -Force
    }
}
