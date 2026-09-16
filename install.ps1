param([Parameter(Mandatory=$true)][string]$Archive, [Parameter(Mandatory=$true)][string]$Destination)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
function Hash-Bytes([byte[]]$Bytes) {
    $sha = [Security.Cryptography.SHA256]::Create()
    try { return ([BitConverter]::ToString($sha.ComputeHash($Bytes))).Replace('-','').ToLowerInvariant() } finally { $sha.Dispose() }
}
function Read-Entry($Entry) {
    $stream = $Entry.Open(); $memory = [IO.MemoryStream]::new()
    try { $stream.CopyTo($memory); return ,$memory.ToArray() } finally { $stream.Dispose(); $memory.Dispose() }
}
function Assert-Name([string]$Name) {
    if (!$Name -or $Name.Contains('\') -or $Name.Contains(':') -or $Name.StartsWith('/')) { throw "Unsafe archive path: $Name" }
    foreach ($part in $Name.TrimEnd('/').Split('/')) {
        if (!$part -or $part -in @('.','..') -or $part -match '[ .]$|[\x00-\x1f<>"|?*]' -or $part -match '^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\.|$)') { throw "Unsafe archive path: $Name" }
    }
}
function Assert-PlainPath([string]$Path) {
    $cursor = $Path
    while ($cursor) {
        if (Test-Path -LiteralPath $cursor) {
            $item = Get-Item -LiteralPath $cursor -Force
            if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { throw "Linked destination path: $cursor" }
        }
        $next = [IO.Path]::GetDirectoryName($cursor)
        if ($next -eq $cursor) { break }; $cursor = $next
    }
}
$zip = $null
try {
    $target = [IO.Path]::GetFullPath($Destination)
    Assert-PlainPath $target
    if ((Test-Path -LiteralPath $target) -and !(Test-Path -LiteralPath $target -PathType Container)) { throw 'Destination must be a folder' }
    $zip = [IO.Compression.ZipFile]::OpenRead([IO.Path]::GetFullPath($Archive))
    if ($zip.Entries.Count -gt 4000 -or ($zip.Entries | Measure-Object Length -Sum).Sum -gt 60000000) { throw 'Archive exceeds package limits' }
    $entries = @{}; $seen = @{}
    foreach ($entry in $zip.Entries) {
        $name = $entry.FullName.TrimEnd('/'); Assert-Name $entry.FullName
        if ($seen.ContainsKey($name)) { throw "Duplicate archive path: $name" }; $seen[$name] = $true
        if ((($entry.ExternalAttributes -shr 16) -band 61440) -eq 40960) { throw "Archive symlink: $name" }
        if (!$entry.FullName.EndsWith('/')) { $entries[$name] = $entry }
    }
    if (!$entries.ContainsKey('MANIFEST.json')) { throw 'Missing manifest' }
    $manifestBytes = Read-Entry $entries['MANIFEST.json']
    $manifest = [Text.Encoding]::UTF8.GetString($manifestBytes) | ConvertFrom-Json
    $properties = @($manifest.files.PSObject.Properties)
    if ($manifest.package -ne 'MY_SECOND_BRAIN' -or $properties.Count -ne $entries.Count-1) { throw 'Manifest does not match archive' }
    $data = @{}
    foreach ($property in $properties) {
        $name = $property.Name; Assert-Name $name
        if (!$entries.ContainsKey($name)) { throw "Missing manifest file: $name" }
        $bytes = Read-Entry $entries[$name]
        if ($bytes.Length -ne $property.Value.bytes -or (Hash-Bytes $bytes) -ne $property.Value.sha256) { throw "Integrity failure: $name" }
        $data[$name] = $bytes
    }
    $data['MANIFEST.json'] = $manifestBytes
    foreach ($name in $data.Keys) {
        $parent = [IO.Path]::GetDirectoryName($name.Replace('/',[IO.Path]::DirectorySeparatorChar))
        while ($parent) {
            if ($data.ContainsKey($parent.Replace('\','/'))) { throw "Archive file/directory collision: $name" }
            $parent = [IO.Path]::GetDirectoryName($parent)
        }
    }
    $receipt = Join-Path $target '.second-brain-install.json'; Assert-PlainPath $receipt
    if (Test-Path -LiteralPath $receipt) {
        $old = Get-Content -LiteralPath $receipt -Raw | ConvertFrom-Json
        if ($old.manifest_sha256 -ne (Hash-Bytes $manifestBytes)) { throw 'Different installed version. Use a new folder or reviewed migration.' }
        foreach ($name in $data.Keys) {
            $dest = Join-Path $target $name; Assert-PlainPath $dest
            if (!(Test-Path -LiteralPath $dest -PathType Leaf)) { throw "Existing installation needs repair: $name" }
        }
        @{status='already_installed';destination=$target;preserved_user_changes=$true} | ConvertTo-Json
        exit 0
    }
    $pending = @()
    foreach ($name in $data.Keys) {
        $dest = Join-Path $target $name; Assert-PlainPath $dest
        $parent = [IO.Path]::GetDirectoryName($dest)
        while ($parent) {
            if ((Test-Path -LiteralPath $parent) -and !(Test-Path -LiteralPath $parent -PathType Container)) { throw "Parent is not a directory: $parent" }
            $parent = [IO.Path]::GetDirectoryName($parent)
        }
        if (Test-Path -LiteralPath $dest) {
            if (!(Test-Path -LiteralPath $dest -PathType Leaf) -or (Hash-Bytes ([IO.File]::ReadAllBytes($dest))) -ne (Hash-Bytes $data[$name])) { throw "Existing file differs; no files changed: $name" }
        } else { $pending += $name }
    }
    foreach ($name in $pending) {
        $dest = Join-Path $target $name; Assert-PlainPath $dest
        [IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($dest)) | Out-Null
        $stream = [IO.File]::Open($dest,[IO.FileMode]::CreateNew,[IO.FileAccess]::Write)
        try { $stream.Write($data[$name],0,$data[$name].Length) } finally { $stream.Dispose() }
    }
    foreach ($name in $data.Keys) {
        if ((Hash-Bytes ([IO.File]::ReadAllBytes((Join-Path $target $name)))) -ne (Hash-Bytes $data[$name])) { throw "Read-back failed: $name" }
    }
    $result = @{package=$manifest.package;version=$manifest.version;manifest_sha256=(Hash-Bytes $manifestBytes);status='installed';files_verified=$data.Count;destination=$target}
    $receiptBytes = [Text.Encoding]::UTF8.GetBytes(($result | ConvertTo-Json))
    $stream = [IO.File]::Open($receipt,[IO.FileMode]::CreateNew,[IO.FileAccess]::Write)
    try { $stream.Write($receiptBytes,0,$receiptBytes.Length) } finally { $stream.Dispose() }
    $result | ConvertTo-Json
} catch { Write-Error ('INSTALL STOPPED: ' + $_.Exception.Message); exit 1 }
finally { if ($zip) { $zip.Dispose() } }
