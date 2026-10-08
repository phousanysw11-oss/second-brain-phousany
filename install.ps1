param([Parameter(Mandatory=$true)][string]$Archive, [Parameter(Mandatory=$true)][string]$Destination)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$utf8 = [Text.UTF8Encoding]::new($false)
function Join-LocalPath([string]$Path,[string]$ChildPath) { return [IO.Path]::Combine($Path,$ChildPath.Replace('/',[IO.Path]::DirectorySeparatorChar)) }
function Test-LocalPath([string]$LiteralPath,[string]$PathType) {
    if ($PathType -eq 'Leaf') { return [IO.File]::Exists($LiteralPath) }
    if ($PathType -eq 'Container') { return [IO.Directory]::Exists($LiteralPath) }
    return ([IO.File]::Exists($LiteralPath) -or [IO.Directory]::Exists($LiteralPath))
}
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
    if ($Name.Split('/')[0] -in @('.git','.second-brain-install.json','.second-brain-upgrades')) { throw "Reserved installer path: $Name" }
}
function Assert-PlainPath([string]$Path) {
    $cursor = $Path
    while ($cursor) {
        if (Test-LocalPath -LiteralPath $cursor) {
            $attributes = [IO.File]::GetAttributes($cursor)
            if ($attributes -band [IO.FileAttributes]::ReparsePoint) { throw "Linked destination path: $cursor" }
            if ($cursor -ne $Path -and !($attributes -band [IO.FileAttributes]::Directory)) { throw "Parent is not a directory: $cursor" }
        }
        $next = [IO.Path]::GetDirectoryName($cursor)
        if ($next -eq $cursor) { break }; $cursor = $next
    }
}
function To-Map($Object) {
    $map = @{}
    if ($null -ne $Object) { foreach ($p in $Object.PSObject.Properties) { $map[$p.Name] = $p.Value } }
    return $map
}
function Get-RoleName([byte[]]$Bytes) {
    $match = [regex]::Match($utf8.GetString($Bytes), '(?m)^\s*name\s*=\s*["'']([^"'']+)["'']')
    if ($match.Success) { return $match.Groups[1].Value.ToLowerInvariant() }
    return ''
}
function Is-UserFile([string]$Name) {
    return ($Name -in @('aios-intake.md','connections.md','references/voice.md','app/config.json','apps/3d-brain/brain.config.json') -or $Name -match '^(context|data|work|notes|inbox|projects|brainstorms|decisions|audits|archives)/|^llm-wiki/(raw|wiki)/|^apps/3d-brain/data/')
}
function Get-Section([byte[]]$Bytes) {
    $text = $utf8.GetString($Bytes).TrimStart([char]0xfeff)
    $start = '<!-- CEO_TEAM_START -->'; $end = '<!-- CEO_TEAM_END -->'
    if (!$text.Contains($start) -and !$text.Contains($end)) { return $null }
    if ([regex]::Matches($text,[regex]::Escape($start)).Count -ne 1 -or [regex]::Matches($text,[regex]::Escape($end)).Count -ne 1 -or $text.IndexOf($start) -gt $text.IndexOf($end)) { throw 'Ambiguous CEO managed section' }
    return $text.Substring($text.IndexOf($start),$text.IndexOf($end)+$end.Length-$text.IndexOf($start))
}
function Write-Atomic([string]$Path, [byte[]]$Bytes) {
    Assert-PlainPath $Path
    [IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($Path)) | Out-Null
    $temporary = Join-LocalPath ([IO.Path]::GetDirectoryName($Path)) ('.second-brain-write-' + [Guid]::NewGuid().ToString('N'))
    try {
        [IO.File]::WriteAllBytes($temporary,$Bytes)
        if ([IO.File]::Exists($Path)) { [IO.File]::Replace($temporary,$Path,[NullString]::Value) } else { [IO.File]::Move($temporary,$Path) }
    } catch { throw ("Cannot write '$Path': " + $_.Exception.Message) } finally { if ([IO.File]::Exists($temporary)) { [IO.File]::Delete($temporary) } }
    if ((Hash-Bytes ([IO.File]::ReadAllBytes($Path))) -ne (Hash-Bytes $Bytes)) { throw "Read-back failed: $Path" }
}
$zip = $null
try {
    $target = [IO.Path]::GetFullPath($Destination)
    if ($env:OS -eq 'Windows_NT' -and !$target.StartsWith('\\?\')) {
        if ($target.StartsWith('\\')) { $target = '\\?\UNC\' + $target.Substring(2) } else { $target = '\\?\' + $target }
    }
    Assert-PlainPath $target
    if ((Test-LocalPath -LiteralPath $target) -and !(Test-LocalPath -LiteralPath $target -PathType Container)) { throw 'Destination must be a folder' }
    $zip = [IO.Compression.ZipFile]::OpenRead([IO.Path]::GetFullPath($Archive))
    if ($zip.Entries.Count -gt 6000 -or ($zip.Entries | Measure-Object Length -Sum).Sum -gt 100000000) { throw 'Archive exceeds package limits' }
    $entries = @{}; $seen = @{}
    foreach ($entry in $zip.Entries) {
        $name = $entry.FullName.TrimEnd('/'); Assert-Name $entry.FullName
        if ($seen.ContainsKey($name)) { throw "Duplicate archive path: $name" }; $seen[$name] = $true
        if ((($entry.ExternalAttributes -shr 16) -band 61440) -eq 40960) { throw "Archive symlink: $name" }
        if (!$entry.FullName.EndsWith('/')) { $entries[$name] = $entry }
    }
    if (!$entries.ContainsKey('MANIFEST.json')) { throw 'Missing manifest' }
    $manifestBytes = Read-Entry $entries['MANIFEST.json']; $manifestSha = Hash-Bytes $manifestBytes
    $manifest = $utf8.GetString($manifestBytes) | ConvertFrom-Json
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
    $receipt = Join-LocalPath $target '.second-brain-install.json'; Assert-PlainPath $receipt
    $old = $null; $baseline = @{}; $sections = @{}
    if (Test-LocalPath -LiteralPath $receipt) {
        $old = [IO.File]::ReadAllText($receipt) | ConvertFrom-Json
        if ($old.package -ne 'MY_SECOND_BRAIN') { throw 'Unrecognized installation receipt' }
        $baseline = To-Map $old.baseline; $sections = To-Map $old.managed_sections
        if (!$baseline.Count) {
            $priorPath = Join-LocalPath $target 'MANIFEST.json'; Assert-PlainPath $priorPath
            $priorBytes = [IO.File]::ReadAllBytes($priorPath)
            if ((Hash-Bytes $priorBytes) -ne $old.manifest_sha256) { throw 'Installed manifest changed; preserve folder and review migration' }
            $prior = $utf8.GetString($priorBytes) | ConvertFrom-Json
            if ($prior.package -ne 'MY_SECOND_BRAIN') { throw 'Unrecognized installed manifest' }
            foreach ($p in $prior.files.PSObject.Properties) { $baseline[$p.Name] = $p.Value.sha256 }
            $baseline['MANIFEST.json'] = Hash-Bytes $priorBytes
        }
    }
    foreach ($name in $baseline.Keys) { Assert-Name $name; if ($baseline[$name] -cnotmatch '^[a-f0-9]{64}$') { throw "Invalid baseline hash: $name" } }
    $nextBaseline = $baseline.Clone(); $nextSections = $sections.Clone()
    $pending = @{}; $incoming = @{}; $preserved = @(); $conflicts = @(); $merged = @()
    $recovery = Join-LocalPath $target ('.second-brain-upgrades/' + $manifestSha.Substring(0,16)); Assert-PlainPath $recovery
    $customRoleNames = @{}; $roleDirectory = Join-LocalPath $target '.codex/agents'; Assert-PlainPath $roleDirectory
    if ([IO.Directory]::Exists($roleDirectory)) {
        foreach ($role in [IO.Directory]::GetFiles($roleDirectory,'*.toml')) {
            Assert-PlainPath $role; $relative = '.codex/agents/' + [IO.Path]::GetFileName($role)
            if (!$data.ContainsKey($relative)) {
                $declared = Get-RoleName ([IO.File]::ReadAllBytes($role))
                if ($declared) { $customRoleNames[$declared] = $relative }
            }
        }
    }
    foreach ($name in ($data.Keys | Sort-Object)) {
        if ($name -like '.codex/agents/*.toml' -and $customRoleNames.ContainsKey((Get-RoleName $data[$name]))) { $incoming[$name] = $data[$name]; $conflicts += $name; continue }
        $dest = Join-LocalPath $target $name; Assert-PlainPath $dest
        if ((Test-LocalPath -LiteralPath $dest) -and !(Test-LocalPath -LiteralPath $dest -PathType Leaf)) { throw "Destination is not a file: $name" }
        $exists = [IO.File]::Exists($dest); $bytes = $data[$name]; $sha = Hash-Bytes $bytes
        $current = $null; $currentSha = $null
        if ($exists) { $current = [IO.File]::ReadAllBytes($dest); $currentSha = Hash-Bytes $current }
        if (!$exists) { $pending[$name] = $bytes; $nextBaseline[$name] = $sha }
        elseif ($currentSha -eq $sha) { $nextBaseline[$name] = $sha }
        elseif (Is-UserFile $name) { $preserved += $name; if (!$nextBaseline.ContainsKey($name)) { $nextBaseline[$name] = $sha } }
        elseif ($baseline[$name] -eq $currentSha) { $pending[$name] = $bytes; $nextBaseline[$name] = $sha }
        else {
            $newSection = $null; $oldSection = $null
            if ($name -in @('AGENTS.md','CLAUDE.md')) { $newSection = Get-Section $bytes }
            if ($newSection) { $oldSection = Get-Section $current }
            if ($newSection -and (!$oldSection -or (Hash-Bytes ($utf8.GetBytes($oldSection))) -eq $sections[$name])) {
                $text = $utf8.GetString($current).TrimStart([char]0xfeff)
                if (!$oldSection) { $combined = $text.TrimEnd() + "`n`n" + $newSection + "`n" } else { $combined = $text.Replace($oldSection,$newSection) }
                $combinedBytes = $utf8.GetBytes($combined)
                if ((Hash-Bytes $combinedBytes) -ne $currentSha) { $pending[$name] = $combinedBytes; $merged += $name }
                $nextSections[$name] = Hash-Bytes ($utf8.GetBytes($newSection)); $preserved += $name; $incoming[$name] = $bytes
            } elseif ($newSection -and $oldSection -ceq $newSection) {
                $preserved += $name; $nextSections[$name] = Hash-Bytes ($utf8.GetBytes($newSection))
            } else { $incoming[$name] = $bytes; $conflicts += $name }
        }
        if ($name -in @('AGENTS.md','CLAUDE.md') -and $name -notin $conflicts -and $name -notin $merged -and (!$exists -or $currentSha -eq $sha -or $pending.ContainsKey($name))) {
            $block = Get-Section $bytes; if ($block) { $nextSections[$name] = Hash-Bytes ($utf8.GetBytes($block)) }
        }
    }
    foreach ($name in $baseline.Keys) { if (!$data.ContainsKey($name) -and !(Is-UserFile $name) -and (Test-LocalPath -LiteralPath (Join-LocalPath $target $name))) { $conflicts += "obsolete: $name" } }
    $reportPath = Join-LocalPath $recovery 'report.json'; Assert-PlainPath $reportPath
    if ([IO.Directory]::Exists($reportPath)) { throw 'Recovery report path is not a file' }
    foreach ($name in (@($pending.Keys) + @($incoming.Keys) + @('.second-brain-install.json'))) {
        foreach ($kind in @('backup','incoming')) {
            $p = Join-LocalPath $recovery "$kind/$name"; Assert-PlainPath $p
            if ((Test-LocalPath -LiteralPath $p) -and !(Test-LocalPath -LiteralPath $p -PathType Leaf)) { throw "Recovery path is not a file: $p" }
        }
    }
    foreach ($name in $pending.Keys) {
        $dest = Join-LocalPath $target $name; $backup = Join-LocalPath $recovery "backup/$name"
        if ([IO.File]::Exists($dest) -and ![IO.File]::Exists($backup)) { Write-Atomic $backup ([IO.File]::ReadAllBytes($dest)) }
    }
    if ($old -and ($pending.Count -or $incoming.Count)) {
        $backup = Join-LocalPath $recovery 'backup/.second-brain-install.json'
        if (![IO.File]::Exists($backup)) { Write-Atomic $backup ([IO.File]::ReadAllBytes($receipt)) }
    }
    foreach ($name in $incoming.Keys) { Write-Atomic (Join-LocalPath $recovery "incoming/$name") $incoming[$name] }
    if ($old -and $pending.Count) {
        $transition = To-Map $old; $transition['baseline'] = $baseline; $transition['status'] = 'upgrading'
        Write-Atomic $receipt ($utf8.GetBytes(($transition | ConvertTo-Json -Depth 12) + "`n"))
    }
    foreach ($name in $pending.Keys) { Write-Atomic (Join-LocalPath $target $name) $pending[$name] }
    $status = 'already_installed'
    if ($conflicts.Count) { $status = 'needs_review' } elseif (!$old) { $status = 'installed' } elseif ($old.manifest_sha256 -ne $manifestSha) { $status = 'upgraded' } elseif ($pending.Count) { $status = 'repaired' }
    $result = @{package=$manifest.package;version=$manifest.version;manifest_sha256=$manifestSha;status=$status;files_verified=$data.Count;files_written=$pending.Count;preserved=@($preserved);managed_guides_merged=@($merged);conflicts=@($conflicts);baseline=$nextBaseline;managed_sections=$nextSections}
    if ($pending.Count -or $incoming.Count -or $old.status -ne $status -or $old.manifest_sha256 -ne $manifestSha) { Write-Atomic $receipt ($utf8.GetBytes(($result | ConvertTo-Json -Depth 12) + "`n")) }
    $result.Remove('baseline'); $result['destination'] = $target; $result['recovery'] = $recovery
    if ($incoming.Count -or $conflicts.Count -or $merged.Count) { Write-Atomic (Join-LocalPath $recovery 'report.json') ($utf8.GetBytes(($result | ConvertTo-Json -Depth 12) + "`n")) }
    $result | ConvertTo-Json -Depth 12
    if ($status -eq 'needs_review') { exit 2 }
} catch { Write-Error ('INSTALL STOPPED: ' + $_.Exception.Message); exit 1 }
finally { if ($zip) { $zip.Dispose() } }
