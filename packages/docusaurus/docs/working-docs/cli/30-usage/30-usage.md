---
title: CLI Tool Usage
---

# Commands and Options:

To generate a Software Bill Of Materials (SBOM) for the ecosystems bellow use the command (Uses [syft](https://github.com/anchore/syft) and [grype](https://github.com/anchore/grype)):

Alpine (apk)
C (conan)
C++ (conan)
Dart (pubs)
Debian (dpkg)
Dotnet (deps.json)
Objective-C (cocoapods)
Elixir (mix)
Erlang (rebar3)
Go (go.mod, Go binaries)
Haskell (cabal, stack)
Java (jar, ear, war, par, sar, nar, native-image)
JavaScript (npm, yarn)
Jenkins Plugins (jpi, hpi)
Linux kernel archives (vmlinz)
Linux kernel modules (ko)
Nix (outputs in /nix/store)
PHP (composer)
Python (wheel, egg, poetry, requirements.txt)
Red Hat (rpm)
Ruby (gem)
Rust (cargo.lock)
Swift (cocoapods, swift-package-manager)

```sh
nqmvul -generateSbom <project_path> <project_name>
```
![cyber]